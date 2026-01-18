import { useState, useEffect, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import LogoHeader from "@/components/LogoHeader";
import { toast } from "sonner";
import type { ConceptPayload } from "@/types/concept";

const StoryboardEditor = lazy(() => import("@/components/StoryboardEditor"));

interface StoryboardAudioAnalysis {
  lyrics: string;
  tempo: number;
  key: string;
  instruments: string[];
  genre: string;
  mood: string;
  themes: string[];
  duration?: number;
  beatMap?: number[];
  beat_map?: number[];
  energyProfile?: Array<{ time: number; energy: number }>;
  energy_profile?: Array<{ time: number; energy: number }>;
  concept?: ConceptPayload;
  [key: string]: unknown;
}

interface ConceptImage {
  url?: string;
  attributes?: Record<string, unknown>;
  [key: string]: unknown;
}

type StoredConceptImage = ConceptImage | string;

interface StoredScene {
  id?: string;
  title?: string;
  overview?: string;
  start_time?: number;
  end_time?: number;
  has_character?: boolean;
  characters?: string[];
  visual_prompt?: string;
  prompt?: string;
  keyframe_image?: string;
}

interface StoredShot {
  id?: string;
  scene_id?: string;
  scene_index?: number;
  shot_index?: number;
  title?: string;
  description?: string;
  start_time?: number;
  end_time?: number;
  image_prompt?: string;
  video_prompt?: string;
  has_character?: boolean;
  characters?: string[];
  camera_direction?: string;
  shot_type?: string;
  keyframe_image?: string;
  generated_image?: string;
  generated_video?: string;
  cost?: number;
}

interface StoredStoryboard {
  scenes?: StoredScene[];
  shots?: StoredShot[];
}

interface Project {
  id: string;
  name: string;
  audio_file_name: string | null;
  audio_analysis: StoryboardAudioAnalysis | null;
  concept_notes: string | null;
  concept_images: StoredConceptImage[] | null;
  storyboard: StoredStoryboard | null;
}

const StoryboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      if (!id || !user) return;

      try {
        // Load project data
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (projectError) {
          console.error('Error loading project:', projectError);
          toast.error('Failed to load project');
          return;
        }

        if (!projectData.audio_file_name) {
          toast.error('No audio file found for this project');
          return;
        }

        // Load audio file
        const { data: audioData, error: audioError } = await supabase.storage
          .from('audio-original')
          .download(`${projectData.id}/${projectData.audio_file_name}`);

        if (audioError) {
          console.error('Error loading audio file:', audioError);
          toast.error('Failed to load audio file');
          return;
        }

        // Convert blob to File object
        const audioFileObject = new File([audioData], projectData.audio_file_name, { 
          type: audioData.type || 'audio/mpeg' 
        });

        let storyboardData: StoredStoryboard | null = null;

        if (projectData.storyboard) {
          if (typeof projectData.storyboard === 'string') {
            try {
              storyboardData = JSON.parse(projectData.storyboard) as StoredStoryboard;
            } catch (error) {
              console.error("Failed to parse stored storyboard JSON:", error);
            }
          } else if (typeof projectData.storyboard === 'object') {
            storyboardData = projectData.storyboard as StoredStoryboard;
          }
        }

        setProject({
          id: projectData.id,
          name: projectData.name,
          audio_file_name: projectData.audio_file_name,
          audio_analysis: projectData.audio_analysis as StoryboardAudioAnalysis | null,
          concept_notes: projectData.concept_notes,
          concept_images: projectData.concept_images as StoredConceptImage[] | null,
          storyboard: storyboardData,
        });
        setAudioFile(audioFileObject);
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1c1c1f' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project || !audioFile) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1c1c1f' }}>
        <div className="text-center">
          <p className="text-muted-foreground">Project not found or no audio file available.</p>
        </div>
      </div>
    );
  }

  if (!project.audio_analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1c1c1f' }}>
        <div className="text-center">
          <p className="text-muted-foreground">Audio analysis not available for this project.</p>
        </div>
      </div>
    );
  }

  // Handle both old array format and new Record<string, string> format for concept_images
  const { conceptAssessments, characterMentionMap } = (() => {
    if (!project.concept_images) {
      return { conceptAssessments: [], characterMentionMap: {} };
    }

    // New format: Record<string, string> mapping mentions to URLs
    if (typeof project.concept_images === 'object' && !Array.isArray(project.concept_images)) {
      const mentionMap = project.concept_images as Record<string, string>;
      const assessments = Object.entries(mentionMap).map(([mention, imageUrl], index) => ({
        reference: mention,
        imageUrl,
        fileName: mention.replace(/^@/, ''),
        attributes: {
          quality: 'high' as const,
          faceClarity: 0.8,
          bodyVisibility: 0.7,
        },
      }));
      return { conceptAssessments: assessments, characterMentionMap: mentionMap };
    }

    // Old format: array of ConceptImage objects
    if (Array.isArray(project.concept_images)) {
      const assessments = project.concept_images.map((image, index) => {
        const data: ConceptImage = typeof image === 'string' ? { url: image } : image;
        const attributes = (data.attributes && typeof data.attributes === 'object')
          ? data.attributes
          : {};

        return {
          reference: `character_${index + 1}`,
          imageUrl: data.url ?? '',
          fileName: `Character ${index + 1}`,
          attributes: {
            quality: 'high' as const,
            faceClarity: 0.8,
            bodyVisibility: 0.7,
            ...attributes,
          },
        };
      });
      return { conceptAssessments: assessments, characterMentionMap: {} };
    }

    return { conceptAssessments: [], characterMentionMap: {} };
  })();

  const parsedConcept = (() => {
    if (project.concept_notes) {
      try {
        const rawConcept = JSON.parse(project.concept_notes);
        return typeof rawConcept === 'object' && rawConcept !== null
          ? (rawConcept as ConceptPayload)
          : undefined;
      } catch (error) {
        console.error('Failed to parse concept_notes:', error);
      }
    }

    return project.audio_analysis?.concept;
  })();

  const initialStoryboard = (() => {
    if (!project.storyboard) {
      return undefined;
    }

    const scenes = Array.isArray(project.storyboard.scenes) ? project.storyboard.scenes : [];
    const shots = Array.isArray(project.storyboard.shots) ? project.storyboard.shots : [];

    if (scenes.length === 0 && shots.length === 0) {
      return undefined;
    }

    return {
      scenes,
      shots,
    };
  })();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
      <LogoHeader
        showBackButton
        onBack={() => window.history.back()}
      />
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading storyboard tools...</p>
          </div>
        </div>}>
        <StoryboardEditor
          projectId={project.id}
          audioFile={audioFile}
          audioAnalysis={project.audio_analysis}
          characters={conceptAssessments.length > 0 ? {
            characters: characterMentionMap,
            assessments: conceptAssessments,
          } : undefined}
          concept={parsedConcept}
          initialStoryboard={initialStoryboard}
          onBack={() => window.history.back()}
          onComplete={(shots) => {
            console.log('Storyboard completed with shots:', shots);
            toast.success('Storyboard saved successfully!');
            // Navigate back to dashboard or timeline
            window.history.back();
          }}
        />
      </Suspense>
    </div>
  );
};

export default StoryboardPage;
