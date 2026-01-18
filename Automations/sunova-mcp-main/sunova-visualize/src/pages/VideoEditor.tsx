import { useEffect, useMemo, useState } from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import VideoEditor from '@/components/VideoEditor';
import LogoHeader from '@/components/LogoHeader';
import type { Database } from '@/integrations/supabase/types';
import type { ConceptData } from '@/types/concept';

type ProjectRow = Database['public']['Tables']['projects']['Row'];

interface CharacterImageData {
  url: string;
  name: string;
  attributes: Record<string, unknown>;
}

const parseConceptNotes = (
  conceptNotes: ProjectRow['concept_notes'],
  audioAnalysis: ProjectRow['audio_analysis']
): ConceptData | null => {
  if (conceptNotes) {
    try {
      const parsed = JSON.parse(conceptNotes) as unknown;
      if (parsed && typeof parsed === 'object') {
        return parsed as ConceptData;
      }
    } catch (error) {
      console.warn('Failed to parse concept_notes as JSON, falling back to audio analysis concept if available.', error);
    }
  }

  if (audioAnalysis && typeof audioAnalysis === 'object' && 'concept' in audioAnalysis) {
    const conceptValue = (audioAnalysis as Record<string, unknown>).concept;
    if (conceptValue && typeof conceptValue === 'object') {
      return conceptValue as ConceptData;
    }
  }

  return null;
};

const extractCharacterImages = (conceptImages: ProjectRow['concept_images']): CharacterImageData[] => {
  if (!conceptImages) {
    return [];
  }

  const normalize = (entry: unknown, index: number): CharacterImageData | null => {
    if (!entry || typeof entry !== 'object') return null;
    const candidate = entry as Record<string, unknown>;
    const urlCandidate = candidate.url ?? candidate.imageUrl ?? candidate.path;
    if (typeof urlCandidate !== 'string' || urlCandidate.length === 0) return null;
    return {
      url: urlCandidate,
      name: typeof candidate.name === 'string'
        ? candidate.name
        : typeof candidate.fileName === 'string'
          ? candidate.fileName
          : typeof candidate.reference === 'string'
            ? candidate.reference
            : `Character ${index + 1}`,
      attributes: (candidate.attributes as Record<string, unknown> | undefined)
        || (candidate.metadata as Record<string, unknown> | undefined)
        || {},
    };
  };

  if (Array.isArray(conceptImages)) {
    return conceptImages
      .map((entry, index) => normalize(entry, index))
      .filter((entry): entry is CharacterImageData => Boolean(entry));
  }

  if (typeof conceptImages === 'object' && conceptImages !== null) {
    const assessmentsSource = (conceptImages as Record<string, unknown>).assessments;
    const assessments = Array.isArray(assessmentsSource)
      ? assessmentsSource
      : [];
    return assessments
      .map((entry, index) => normalize(entry, index))
      .filter((entry): entry is CharacterImageData => Boolean(entry));
  }

  return [];
};

const getAudioDurationFromFile = async (file: File): Promise<number | null> => {
  if (typeof window === 'undefined') {
    return null;
  }

  return new Promise<number | null>((resolve, reject) => {
    const audioElement = document.createElement('audio');
    audioElement.preload = 'metadata';
    const cleanup = () => {
      if (audioElement.src) {
        URL.revokeObjectURL(audioElement.src);
      }
    };
    audioElement.onloadedmetadata = () => {
      const duration = Number.isFinite(audioElement.duration)
        ? Math.round(audioElement.duration)
        : null;
      cleanup();
      resolve(duration);
    };
    audioElement.onerror = (event) => {
      console.error('Failed to load audio metadata', event);
      cleanup();
      reject(new Error('Failed to load audio metadata'));
    };
    audioElement.src = URL.createObjectURL(file);
  }).catch((error) => {
    console.error('Unable to determine audio duration from file', error);
    return null;
  });
};

const VideoEditorPage: React.FC = () => {
  const location = useLocation();
  const { id: paramId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const locationState = location.state as { projectId?: string } | null;
  const projectId = useMemo(() => {
    return (
      locationState?.projectId ||
      paramId ||
      searchParams.get('projectId') ||
      null
    );
  }, [locationState?.projectId, paramId, searchParams]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ProjectRow | null>(null);
  const [concept, setConcept] = useState<ConceptData | null>(null);
  const [characterImages, setCharacterImages] = useState<CharacterImageData[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadProject = async () => {
      if (!user) {
        return;
      }

      if (!projectId) {
        setError('No project specified.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('user_id', user.id)
          .single<ProjectRow>();

        if (projectError || !projectData) {
          throw projectError || new Error('Project not found');
        }

        if (!projectData.audio_file_name) {
          throw new Error('No audio file found for this project');
        }

        const { data: audioData, error: audioError } = await supabase.storage
          .from('audio-original')
          .download(`${projectData.id}/${projectData.audio_file_name}`);

        if (audioError || !audioData) {
          throw audioError || new Error('Failed to download audio file');
        }

        const audioFileObject = new File([audioData], projectData.audio_file_name, {
          type: audioData.type || 'audio/mpeg',
        });

        const resolvedConcept = parseConceptNotes(projectData.concept_notes, projectData.audio_analysis);
        if (!resolvedConcept) {
          throw new Error('Concept data is not available for this project.');
        }

        const resolvedCharacterImages = extractCharacterImages(projectData.concept_images);

        let resolvedAudioDuration = projectData.audio_duration;
        if (!resolvedAudioDuration && projectData.audio_analysis && typeof projectData.audio_analysis === 'object') {
          const durationFromAnalysis = (projectData.audio_analysis as Record<string, unknown>).duration;
          if (typeof durationFromAnalysis === 'number') {
            resolvedAudioDuration = durationFromAnalysis;
          }
        }

        if (!resolvedAudioDuration) {
          const computedDuration = await getAudioDurationFromFile(audioFileObject);
          if (computedDuration) {
            resolvedAudioDuration = computedDuration;
          }
        }

        if (!resolvedAudioDuration) {
          throw new Error('Unable to determine audio duration for this project.');
        }

        if (!isMounted) {
          return;
        }

        setProject(projectData);
        setConcept(resolvedConcept);
        setCharacterImages(resolvedCharacterImages);
        setAudioFile(audioFileObject);
        setAudioDuration(Math.round(resolvedAudioDuration));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load project data';
        console.error('Error loading project for video editor:', err);
        if (isMounted) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      isMounted = false;
    };
  }, [projectId, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1c1c1f' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading project…</p>
        </div>
      </div>
    );
  }

  if (error || !project || !audioFile || !concept || !audioDuration) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1c1c1f' }}>
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            {error || 'Project data is incomplete. Please ensure the concept, storyboard, and audio are available.'}
          </p>
          <button
            type="button"
            className="text-primary underline"
            onClick={() => window.history.back()}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
      <LogoHeader
        showBackButton
        onBack={() => window.history.back()}
      />
      <div className="container mx-auto p-8">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Video Editor</h1>
          <p className="text-muted-foreground">
            The video editor component needs to be integrated with the storyboard scenes.
          </p>
          <p className="text-sm text-muted-foreground">
            Project: {project.name}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoEditorPage;
