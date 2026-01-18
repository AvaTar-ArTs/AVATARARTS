import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  Home,
  Loader2,
  Pause,
  Play,
  Save,
  Sparkle,
  Target,
  User,
  Video,
  Wand2,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { buildSegmindGenerationPayload } from '@/utils/shotDuration';
import { CharacterOption, serializeStoryboard } from '@/utils/storyboard';
import { exportTimelineToVideo } from '@/utils/timelineExport';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatCredits, getGenerationCost } from '@/utils/credits';
import { GenerationProgressOverlay } from '@/components/GenerationProgressOverlay';
import { waitForGenerationTaskCompletion } from '@/utils/segmindTasks';

interface StoryScene {
  id: string;
  title: string;
  overview: string;
  startTime: number;
  endTime: number;
  hasCharacter: boolean;
  characters: string[];
  prompt: string;
  keyframeImage?: string;
  accentColor: string;
}

export interface GeneratedShot {
  id: string;
  sceneId: string;
  sceneIndex: number;
  title: string;
  description: string;
  start_time: number;
  end_time: number;
  image_prompt: string;
  video_prompt: string;
  has_character: boolean;
  characters: string[];
  camera_direction?: string;
  shot_type?: string;
  keyframe_image?: string;
  generated_image?: string;
  generated_video?: string;
  cost?: number;
}

interface GenerationStatus {
  [shotId: string]: {
    status: 'idle' | 'generating' | 'completed' | 'error';
    progress: number;
  };
}

interface VideoEditorProps {
  projectId: string;
  audioFile: File;
  audioDuration: number;
  scenes: StoryScene[];
  initialShots: GeneratedShot[];
  characterOptions: CharacterOption[];
  loadingSceneIds?: Set<string>;
  onBack: () => void;
  onComplete: (shots: GeneratedShot[]) => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({
  projectId,
  audioFile,
  audioDuration,
  scenes,
  initialShots,
  characterOptions,
  loadingSceneIds = new Set(),
  onBack,
  onComplete,
}) => {
  const navigate = useNavigate();
  const [shots, setShots] = useState<GeneratedShot[]>(initialShots);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(initialShots[0]?.id ?? null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [autoSaveState, setAutoSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [showGenerationOverlay, setShowGenerationOverlay] = useState(false);
  const {
    profile,
    isAdmin,
    isLoading: profileLoading,
    error: profileError,
    refetch: refreshProfile,
  } = useUserProfile();
  const audioRef = useRef<HTMLAudioElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setShots(initialShots);
    setSelectedShotId(initialShots[0]?.id ?? null);
  }, [initialShots]);

  useEffect(() => {
    if (profileError) {
      console.error('Failed to load user profile', profileError);
      toast.error('Unable to load credit balance. Please refresh the page.');
    }
  }, [profileError]);

  const ensureCredits = useCallback((requiredCredits: number) => {
    if (isAdmin) {
      return true;
    }

    if (profileLoading) {
      toast.info('Checking credits. Please try again in a moment.');
      return false;
    }

    const balance = profile?.credit_balance ?? 0;
    if (balance < requiredCredits) {
      toast.error(
        `Not enough credits. You need ${formatCredits(requiredCredits)} but only have ${formatCredits(balance)}.`
      );
      return false;
    }

    return true;
  }, [isAdmin, profileLoading, profile?.credit_balance]);

  useEffect(() => {
    if (!audioRef.current) return;
    const url = URL.createObjectURL(audioFile);
    audioRef.current.src = url;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioFile]);

  // Update shots when new shots are generated from parent
  useEffect(() => {
    setShots(initialShots);
  }, [initialShots]);

  // Check for pending generation tasks on mount
  useEffect(() => {
    const checkPendingTasks = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-pending-tasks', {
          body: { project_id: projectId },
        });

        if (error) {
          console.error('Failed to check pending tasks:', error);
          return;
        }

        if (data?.results && data.results.length > 0) {
          console.log(`Checked ${data.results.length} pending tasks`);
          
          let updatedShots = false;
          setShots(prev => {
            let updated = [...prev];
            for (const result of data.results) {
              if (result.status === 'completed' && result.media_url) {
                const isVideo = result.generation_type === 'video';
                const shotIndex = updated.findIndex(s => s.id === result.shot_id);
                if (shotIndex !== -1) {
                  updated[shotIndex] = {
                    ...updated[shotIndex],
                    [isVideo ? 'generated_video' : 'generated_image']: result.media_url,
                  };
                  updatedShots = true;
                  toast.success(`Completed pending ${isVideo ? 'video' : 'image'} generation for shot ${shotIndex + 1}`);
                }
              } else if (result.status === 'failed') {
                toast.error(`Generation failed for shot: ${result.error || 'Unknown error'}`);
              }
            }
            return updatedShots ? updated : prev;
          });
        }
      } catch (error) {
        console.error('Error checking pending tasks:', error);
      }
    };

    checkPendingTasks();
  }, [projectId]);

  const selectedShot = useMemo(() => shots.find((shot) => shot.id === selectedShotId) ?? null, [shots, selectedShotId]);

  const saveShots = useCallback(async (shotsToSave: GeneratedShot[]) => {
    setIsSaving(true);
    try {
      const storyboardPayload = serializeStoryboard(
        scenes.map((scene) => ({
          id: scene.id,
          title: scene.title,
          overview: scene.overview,
          start_time: scene.startTime,
          end_time: scene.endTime,
          has_character: scene.hasCharacter,
          characters: scene.characters,
          prompt: scene.prompt,
          keyframe_image: scene.keyframeImage,
        })),
        shotsToSave.map((shot) => ({
          id: shot.id,
          scene_id: shot.sceneId,
          scene_index: shot.sceneIndex,
          title: shot.title,
          description: shot.description,
          start_time: shot.start_time,
          end_time: shot.end_time,
          image_prompt: shot.image_prompt,
          video_prompt: shot.video_prompt,
          has_character: shot.has_character,
          characters: shot.characters,
          camera_direction: shot.camera_direction,
          shot_type: shot.shot_type,
          keyframe_image: shot.keyframe_image,
          generated_image: shot.generated_image,
          generated_video: shot.generated_video,
          cost: shot.cost,
        })),
      );

      const { error } = await supabase
        .from('projects')
        .update({
          storyboard: storyboardPayload,
          status: 'ready_for_generation',
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      setAutoSaveState('saved');
    } catch (error) {
      console.error('Failed to save shots', error);
      setAutoSaveState('error');
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [projectId, scenes]);

  const scheduleSave = useCallback((nextShots: GeneratedShot[]) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setAutoSaveState('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      saveShots(nextShots).catch((error) => {
        console.error('Auto-save failed', error);
        setAutoSaveState('error');
      });
    }, 800);
  }, [saveShots]);

  const updateShot = useCallback((shotId: string, updater: (shot: GeneratedShot) => GeneratedShot) => {
    setShots((prev) => {
      const next = prev.map((shot) => (shot.id === shotId ? updater(shot) : shot));
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const handlePromptChange = useCallback((field: 'image_prompt' | 'video_prompt', value: string) => {
    if (!selectedShot) return;
    updateShot(selectedShot.id, (shot) => ({ ...shot, [field]: value }));
  }, [selectedShot, updateShot]);

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const seekToShot = useCallback((shot: GeneratedShot) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = shot.start_time;
    setCurrentTime(shot.start_time);
  }, []);

  const handleShotSelect = useCallback((shot: GeneratedShot) => {
    setSelectedShotId(shot.id);
    seekToShot(shot);
  }, [seekToShot]);

  const getCharacterImageForShot = useCallback((shot: GeneratedShot) => {
    const mention = shot.characters[0];
    if (!mention) return '';
    return characterOptions.find((option) => option.mention === mention)?.imageUrl ?? '';
  }, [characterOptions]);

  const handleGenerateShot = useCallback(async (shot: GeneratedShot): Promise<boolean> => {
    const requiredCredits = getGenerationCost('video');
    if (!ensureCredits(requiredCredits)) {
      return false;
    }

    setGenerationStatus((prev) => ({
      ...prev,
      [shot.id]: { status: 'generating', progress: 0 },
    }));

    // Show the progress overlay
    setShowGenerationOverlay(true);

    try {
      // Find scene index - check if this is the first shot in the scene
      const sceneShots = shots.filter(s => s.sceneId === shot.sceneId).sort((a, b) => a.start_time - b.start_time);
      const sceneIndex = sceneShots.findIndex(s => s.id === shot.id);
      
      const { data, error } = await supabase.functions.invoke('segmind-generation', {
        body: buildSegmindGenerationPayload(
          {
            id: shot.id,
            mode: 'shot_video',
            sceneId: shot.sceneId,
            sceneIndex,
            duration: Math.max(shot.end_time - shot.start_time, 0),
            videoPrompt: shot.video_prompt,
            imagePrompt: shot.image_prompt,
            audioUrl: '',
            characterImage: getCharacterImageForShot(shot),
            keyframeImage: shot.keyframe_image,
          },
          {
            projectId,
            resolution: 'FHD',
            generationType: 'video',
          },
        ),
      });

      if (error) {
        throw new Error(error.message);
      }

      let videoUrl = data?.video_url ?? null;
      let imageUrl = data?.image_url ?? null;

      if (!videoUrl && data?.status === 'processing') {
        toast.info(`${shot.title} generation started...`);

        const task = await waitForGenerationTaskCompletion({
          supabase,
          taskId: data.task_id,
          shotId: shot.id,
          pollIntervalMs: 3000,
          maxAttempts: 120,
        });

        videoUrl = task.result_url ?? null;
      }

      if (!videoUrl) {
        throw new Error('Segmind response incomplete');
      }

      updateShot(shot.id, (current) => ({
        ...current,
        generated_video: videoUrl!,
        generated_image: imageUrl ?? current.generated_image ?? current.keyframe_image,
        cost: data?.cost ?? current.cost,
      }));

      if (!isAdmin) {
        await refreshProfile();
      }

      setGenerationStatus((prev) => ({
        ...prev,
        [shot.id]: { status: 'completed', progress: 100 },
      }));

      toast.success(`${shot.title} generated successfully`);
      return true;
    } catch (error) {
      console.error('Shot generation failed', error);
      const message = error instanceof Error ? error.message : 'Failed to generate shot';
      setGenerationStatus((prev) => ({
        ...prev,
        [shot.id]: { status: 'error', progress: 0 },
      }));
      toast.error(message);
      return false;
    }
  }, [ensureCredits, getCharacterImageForShot, isAdmin, projectId, refreshProfile, updateShot, shots]);

  const handleRegenerateImage = useCallback(async () => {
    if (!selectedShot) return;

    const scene = scenes.find(s => s.id === selectedShot.sceneId);
    const isRegeneratingShot = !!selectedShot.generated_image;
    // If not regenerating a shot-specific image, we're regenerating the scene image for all shots
    const isRegeneratingSceneKeyframe = !isRegeneratingShot;
    const prompt = isRegeneratingShot 
      ? selectedShot.image_prompt 
      : (scene?.prompt || selectedShot.image_prompt);

    const requiredCredits = getGenerationCost('keyframe');
    if (!ensureCredits(requiredCredits)) {
      return;
    }

    setIsRegeneratingImage(true);
    setGenerationStatus((prev) => ({
      ...prev,
      [selectedShot.id]: { status: 'generating', progress: 0 },
    }));

    try {
      const characterImage = getCharacterImageForShot(selectedShot);
      const characterImages = characterImage ? [characterImage] : [];

      const { data, error } = await supabase.functions.invoke('segmind-generation', {
        body: buildSegmindGenerationPayload(
          {
            id: selectedShot.id,
            mode: 'scene_image',
            prompt,
            characterImages,
          },
          {
            projectId,
            resolution: 'FHD',
            generationType: 'keyframe',
          },
        ),
      });

      if (error) {
        throw new Error(error.message);
      }

      let imageUrl = data?.image_url ?? null;

      if (!imageUrl && data?.status === 'processing') {
        toast.info('Image regeneration started...');

        const task = await waitForGenerationTaskCompletion({
          supabase,
          taskId: data.task_id,
          shotId: selectedShot.id,
          pollIntervalMs: 2000,
          maxAttempts: 90,
        });

        imageUrl = task.result_url ?? null;
      }

      if (!imageUrl) {
        throw new Error('No image URL in response');
      }

      // If regenerating scene keyframe, update ALL shots in the scene
      if (isRegeneratingSceneKeyframe) {
        const sceneShots = shots.filter(shot => shot.sceneId === selectedShot.sceneId);
        setShots(prev => prev.map(shot => {
          if (shot.sceneId === selectedShot.sceneId) {
            return {
              ...shot,
              keyframe_image: imageUrl!,
              cost: (shot.cost || 0) + (data?.cost || 0) / Math.max(sceneShots.length, 1),
            };
          }
          return shot;
        }));
      } else {
        // Update the appropriate image field for this shot only
        updateShot(selectedShot.id, (current) => ({
          ...current,
          [isRegeneratingShot ? 'generated_image' : 'keyframe_image']: imageUrl!,
          cost: (current.cost || 0) + (data?.cost || 0),
        }));
      }

      if (!isAdmin) {
        await refreshProfile();
      }

      setGenerationStatus((prev) => ({
        ...prev,
        [selectedShot.id]: { status: 'completed', progress: 100 },
      }));

      toast.success(`Image regenerated successfully`);
    } catch (error) {
      console.error('Image regeneration failed', error);
      const message = error instanceof Error ? error.message : 'Failed to regenerate image';
      setGenerationStatus((prev) => ({
        ...prev,
        [selectedShot.id]: { status: 'error', progress: 0 },
      }));
      toast.error(message);
    } finally {
      setIsRegeneratingImage(false);
    }
  }, [selectedShot, scenes, ensureCredits, getCharacterImageForShot, projectId, updateShot, isAdmin, refreshProfile, shots]);

  const handleGenerateAllShots = useCallback(async () => {
    setIsGeneratingAll(true);
    
    // Get all shots that don't have generated videos yet
    const shotsToGenerate = shots.filter(shot => !shot.generated_video);
    
    if (shotsToGenerate.length === 0) {
      toast.info('All shots already have videos generated');
      setIsGeneratingAll(false);
      return;
    }

    // Check credits for all shots at once
    const totalCredits = getGenerationCost('video') * shotsToGenerate.length;
    if (!ensureCredits(totalCredits)) {
      setIsGeneratingAll(false);
      return;
    }

    // Show the progress overlay
    setShowGenerationOverlay(true);

    // Mark all shots as generating
    const newStatus: GenerationStatus = {};
    for (const shot of shotsToGenerate) {
      newStatus[shot.id] = { status: 'generating', progress: 0 };
    }
    setGenerationStatus(prev => ({ ...prev, ...newStatus }));

    toast.info(`Starting generation for ${shotsToGenerate.length} shots...`);

    // Send all generation requests in parallel
    const generationPromises = shotsToGenerate.map(async (shot) => {
      try {
        // Find scene index - check if this is the first shot in the scene
        const sceneShots = shots.filter(s => s.sceneId === shot.sceneId).sort((a, b) => a.start_time - b.start_time);
        const sceneIndex = sceneShots.findIndex(s => s.id === shot.id);
        
        const { data, error } = await supabase.functions.invoke('segmind-generation', {
          body: buildSegmindGenerationPayload(
            {
              id: shot.id,
              mode: 'shot_video',
              sceneId: shot.sceneId,
              sceneIndex,
              duration: Math.max(shot.end_time - shot.start_time, 0),
              videoPrompt: shot.video_prompt,
              imagePrompt: shot.image_prompt,
              audioUrl: '',
              characterImage: getCharacterImageForShot(shot),
              keyframeImage: shot.keyframe_image,
            },
            {
              projectId,
              resolution: 'FHD',
              generationType: 'video',
            },
          ),
        });

        if (error) {
          throw new Error(error.message);
        }

        return { shot, data, success: true };
      } catch (error) {
        console.error(`Failed to start generation for ${shot.id}:`, error);
        return { shot, error, success: false };
      }
    });

    // Wait for all requests to be sent (not for completion, just for task creation)
    const results = await Promise.allSettled(generationPromises);

    // Track shots that need polling
    const pendingShotIds = new Set<string>();
    
    results.forEach((result, index) => {
      const shot = shotsToGenerate[index];
      if (result.status === 'fulfilled') {
        const { success, data, error } = result.value;
        if (success && data) {
          // If we got immediate results (unlikely for video)
          if (data.video_url && data.image_url) {
            updateShot(shot.id, (current) => ({
              ...current,
              generated_video: data.video_url,
              generated_image: data.image_url,
              cost: data.cost,
            }));
            setGenerationStatus(prev => ({
              ...prev,
              [shot.id]: { status: 'completed', progress: 100 },
            }));
          } else {
            // Task created, needs polling
            pendingShotIds.add(shot.id);
          }
        } else {
          // Failed to start
          setGenerationStatus(prev => ({
            ...prev,
            [shot.id]: { status: 'error', progress: 0 },
          }));
          toast.error(`Failed to start generation for shot: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    });

    if (!isAdmin) {
      await refreshProfile();
    }

    // Set up polling for pending shots
    if (pendingShotIds.size > 0) {
      toast.info(`${pendingShotIds.size} shots are generating. Checking progress every minute...`);
      
      const pollInterval = setInterval(async () => {
        try {
          const { data: pollData, error: pollError } = await supabase.functions.invoke('check-pending-tasks', {
            body: { project_id: projectId },
          });

          if (pollError) {
            console.error('Polling error:', pollError);
            return;
          }

          if (pollData?.results) {
            for (const result of pollData.results) {
              if (pendingShotIds.has(result.shot_id)) {
                if (result.status === 'completed' && result.media_url) {
                  // Update shot with completed generation
                  const isVideo = result.generation_type === 'video';
                  updateShot(result.shot_id, (current) => ({
                    ...current,
                    [isVideo ? 'generated_video' : 'generated_image']: result.media_url,
                  }));

                  setGenerationStatus(prev => ({
                    ...prev,
                    [result.shot_id]: { status: 'completed', progress: 100 },
                  }));

                  pendingShotIds.delete(result.shot_id);
                  
                  const remainingCount = pendingShotIds.size;
                  if (remainingCount === 0) {
                    toast.success('All shots generated successfully!');
                    clearInterval(pollInterval);
                    setIsGeneratingAll(false);
                  } else {
                    toast.success(`Shot completed! ${remainingCount} remaining...`);
                  }
                } else if (result.status === 'failed') {
                  setGenerationStatus(prev => ({
                    ...prev,
                    [result.shot_id]: { status: 'error', progress: 0 },
                  }));
                  pendingShotIds.delete(result.shot_id);
                  toast.error(`Shot generation failed: ${result.error || 'Unknown error'}`);
                  
                  if (pendingShotIds.size === 0) {
                    clearInterval(pollInterval);
                    setIsGeneratingAll(false);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error during polling:', error);
        }
      }, 60000); // Poll every 60 seconds

      // Clean up interval if component unmounts
      return () => {
        clearInterval(pollInterval);
        setIsGeneratingAll(false);
      };
    } else {
      setIsGeneratingAll(false);
    }
  }, [shots, ensureCredits, getCharacterImageForShot, projectId, updateShot, isAdmin, refreshProfile]);

  const handleFinalize = useCallback(async () => {
    await saveShots(shots);
    onComplete(shots);
    toast.success('Timeline saved and ready for export');
  }, [onComplete, saveShots, shots]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalCost = shots.reduce((sum, shot) => sum + (shot.cost ?? 0), 0);
  const allShotsGenerated = shots.every((shot) => Boolean(shot.generated_video));

  useEffect(() => () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  }, []);

  const handleExportTimeline = useCallback(async () => {
    if (!allShotsGenerated) {
      toast.error('Generate all shots before exporting the timeline.');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    try {
      const { blob, fileName } = await exportTimelineToVideo({
        shots,
        audioFile,
        onProgress: setExportProgress,
        fileName: `${projectId}-timeline.mp4`,
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Timeline exported successfully');
    } catch (error) {
      console.error('Timeline export failed', error);
      const message = error instanceof Error ? error.message : 'Failed to export timeline';
      toast.error(message);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  }, [allShotsGenerated, audioFile, projectId, shots]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1c1c1f' }}>
      <div className="border-b p-4 flex items-center justify-between" style={{ backgroundColor: '#1c1c1f', borderBottomColor: '#6a6a71' }}>
        <div className="flex items-center gap-4">
          <Button 
            className="gradient-button relative overflow-hidden group rounded-[35px] hover:opacity-60 transition-opacity duration-300"
            style={{
              background: `
                radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                #d0583c`
            }}
            onClick={onBack}
          >
            <span className="relative z-10 flex items-center justify-center text-sm text-white">
              <ArrowLeft className="h-4 w-4" />
            </span>
          </Button>
          <Button 
            className="gradient-button relative overflow-hidden group rounded-[35px] hover:opacity-60 transition-opacity duration-300"
            style={{
              background: `
                radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                #d0583c`
            }}
            onClick={() => navigate('/dashboard')}
          >
            <span className="relative z-10 flex items-center justify-center text-sm text-white">
              <Home className="h-4 w-4" />
            </span>
          </Button>
          <h1 className="text-xl font-bold">Timeline Video Editor</h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{shots.length} shots • {formatTime(audioDuration)}</span>
          {totalCost > 0 && <span>Total cost: ${totalCost.toFixed(2)}</span>}
          {autoSaveState === 'saving' && (
            <span className="flex items-center text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 mr-2 animate-spin" />Saving...
            </span>
          )}
          {autoSaveState === 'saved' && <span className="text-xs text-muted-foreground">All changes saved</span>}
          {autoSaveState === 'error' && <span className="text-xs text-destructive">Auto-save failed</span>}
          <Button
            className="gradient-button relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white text-xs rounded-full h-9 px-3"
            disabled={isGeneratingAll}
            onClick={handleGenerateAllShots}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
              background: `
                radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                #d0583c`
            }} />
            <span className="relative z-10 flex items-center justify-center">
              {isGeneratingAll ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
              Generate All Shots
            </span>
          </Button>
          <Button
            className="gradient-button relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white text-xs rounded-full h-9 px-3"
            onClick={handleExportTimeline}
            disabled={isExporting || !allShotsGenerated}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" style={{
              background: `
                radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                #d0583c`
            }} />
            <span className="relative z-10 flex items-center justify-center">
              {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Video className="h-4 w-4 mr-2" />}
              {isExporting ? `Exporting ${exportProgress}%` : 'Export MP4'}
            </span>
          </Button>
          <Button
            className="gradient-button relative overflow-hidden group rounded-[35px] hover:opacity-60 transition-opacity duration-300"
            style={{
              background: `
                radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                #d0583c`
            }}
            onClick={handleFinalize}
            disabled={isSaving}
          >
            <span className="relative z-10 flex items-center justify-center text-sm text-white">
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Timeline
            </span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-73px)]">
        <div className="flex h-1/2 border-b" style={{ borderBottomColor: '#6a6a71' }}>
          <div className="w-1/2 border-r p-6 overflow-auto video-editor-scroll" style={{ backgroundColor: '#1c1c1f', borderRightColor: '#6a6a71' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Shot Details</h2>
              {selectedShot?.has_character && (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <User className="h-3 w-3" /> Character
                </Badge>
              )}
            </div>

            {selectedShot ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedShot.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Scene {selectedShot.sceneIndex + 1} • {formatTime(selectedShot.start_time)} - {formatTime(selectedShot.end_time)} ({Math.round(selectedShot.end_time - selectedShot.start_time)}s)
                  </p>
                  {selectedShot.camera_direction && (
                    <p className="text-xs text-muted-foreground">Camera: {selectedShot.camera_direction}</p>
                  )}
                  {selectedShot.shot_type && (
                    <p className="text-xs text-muted-foreground">Shot type: {selectedShot.shot_type}</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Image Prompt</Label>
                  <Textarea
                    value={selectedShot.image_prompt}
                    onChange={(event) => handlePromptChange('image_prompt', event.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">Video Prompt</Label>
                  <Textarea
                    value={selectedShot.video_prompt}
                    onChange={(event) => handlePromptChange('video_prompt', event.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => selectedShot && handleGenerateShot(selectedShot)}
                    disabled={generationStatus[selectedShot.id]?.status === 'generating'}
                  >
                    {generationStatus[selectedShot.id]?.status === 'generating' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkle className="h-4 w-4 mr-2" />
                    )}
                    Generate Shot
                  </Button>
                  {selectedShot.generated_video && (
                    <Badge variant="secondary" className="text-xs">Generated</Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a shot from the timeline to edit prompts.
              </div>
            )}
          </div>

          <div className="w-1/2 p-6 overflow-auto video-editor-scroll" style={{ backgroundColor: '#1c1c1f' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Shot Preview</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateImage}
                disabled={!selectedShot || isRegeneratingImage}
              >
                {isRegeneratingImage ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkle className="h-4 w-4 mr-2" />
                )}
                Regenerate Image
              </Button>
            </div>
            {selectedShot ? (
              <Card style={{ backgroundColor: '#1c1c1f', outline: '1px solid #6a6a71' }}>
                <CardContent className="p-0" style={{ backgroundColor: '#1c1c1f' }}>
                  <div className="aspect-video bg-muted flex items-center justify-center relative">
                    {selectedShot.generated_image ? (
                      <img src={selectedShot.generated_image} alt={selectedShot.title} className="w-full h-full object-cover" />
                    ) : selectedShot.keyframe_image ? (
                      <img src={selectedShot.keyframe_image} alt={selectedShot.title} className="w-full h-full object-cover opacity-80" />
                    ) : (
                      <div className="flex flex-col items-center text-muted-foreground">
                        <Video className="h-12 w-12 mb-2" />
                        <span className="text-xs">No media yet</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3 text-sm text-muted-foreground">
                    <p>{selectedShot.description}</p>
                    {selectedShot.generated_video && (
                      <Button variant="outline" size="sm" onClick={() => window.open(selectedShot.generated_video!, '_blank')}>
                        <Video className="h-4 w-4 mr-2" /> View Generated Clip
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a shot to preview media.
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto video-editor-scroll" style={{ backgroundColor: '#1c1c1f' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={togglePlayback}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <span className="text-sm text-muted-foreground">{formatTime(currentTime)}</span>
            </div>
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Target className="h-3 w-3" /> Timeline Overview
            </Badge>
          </div>

          <div className="space-y-3">
            {shots.map((shot) => {
              const scene = scenes.find((item) => item.id === shot.sceneId);
              return (
                <Card
                  key={shot.id}
                  className="cursor-pointer transition-colors"
                  onClick={() => handleShotSelect(shot)}
                  style={selectedShotId === shot.id ? { 
                    backgroundColor: '#2a2a2d', 
                    outline: '2px solid #c4577e' 
                  } : { 
                    backgroundColor: '#1c1c1f', 
                    outline: '1px solid #6a6a71' 
                  }}
                >
                <CardContent className="p-4" style={selectedShotId === shot.id ? { 
                  backgroundColor: '#2a2a2d' 
                } : { 
                  backgroundColor: '#1c1c1f' 
                }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-12 rounded-full"
                          style={{ backgroundColor: scene?.accentColor ?? 'hsl(var(--accent))' }}
                        />
                        <div>
                          <h3 className="font-medium">{shot.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            {formatTime(shot.start_time)} - {formatTime(shot.end_time)} ({Math.round(shot.end_time - shot.start_time)}s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {shot.has_character && <Badge variant="outline">Character</Badge>}
                        {generationStatus[shot.id]?.status === 'generating' && <Loader2 className="h-4 w-4 animate-spin" />}
                        {shot.generated_video && <Badge variant="secondary">Rendered</Badge>}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{shot.description}</p>
                  </CardContent>
                </Card>
              );
            })}
            
            {/* Loading placeholders for scenes being processed */}
            {Array.from(loadingSceneIds).map((sceneId) => {
              const scene = scenes.find((s) => s.id === sceneId);
              if (!scene) return null;
              
              return (
                <Card key={`loading-${sceneId}`} className="border border-dashed border-muted-foreground/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-12 rounded-full opacity-50"
                          style={{ backgroundColor: scene.accentColor }}
                        />
                        <div>
                          <h3 className="font-medium text-muted-foreground">Processing: {scene.title}</h3>
                          <p className="text-xs text-muted-foreground">
                            Generating shots for this scene...
                          </p>
                        </div>
                      </div>
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground/70 mt-2 italic">
                      Shots will appear here when ready
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        className="hidden"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {showGenerationOverlay && (
        <GenerationProgressOverlay
          projectId={projectId}
          shots={shots.map(s => ({ id: s.id, title: s.title, sceneId: s.sceneId }))}
          onVideoComplete={(shotId, videoUrl) => {
            updateShot(shotId, (shot) => ({
              ...shot,
              generated_video: videoUrl,
            }));
            setGenerationStatus((prev) => ({
              ...prev,
              [shotId]: { status: 'completed', progress: 100 },
            }));
          }}
          onClose={() => setShowGenerationOverlay(false)}
        />
      )}
    </div>
  );
};

export default VideoEditor;
