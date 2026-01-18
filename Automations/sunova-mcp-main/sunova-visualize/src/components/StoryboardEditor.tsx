import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  ArrowLeft,
  Image as ImageIcon,
  ImagePlus,
  Loader2,
  Play,
  Pause,
  Plus,
  Save,
  Sparkle,
  Users,
  Wand2,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import VideoEditor, { GeneratedShot } from './VideoEditor';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ensureCharacterMention, buildCharacterOptions, serializeStoryboard, hasStoryboardConcept } from '@/utils/storyboard';
import { buildSegmindGenerationPayload } from '@/utils/shotDuration';
import { useUserProfile } from '@/hooks/useUserProfile';
import { formatCredits, getGenerationCost } from '@/utils/credits';
import { alignScenesToBeats, alignShotsToBeats } from '@/utils/beatTiming';
import { waitForGenerationTaskCompletion } from '@/utils/segmindTasks';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface AudioAnalysis {
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
}

interface CharacterAssessment {
  reference: string;
  imageUrl: string;
  fileName: string;
  attributes: {
    age?: string;
    gender?: string;
    style?: string;
    quality: 'high' | 'medium' | 'low';
    faceClarity: number;
    bodyVisibility: number;
  };
}

interface AssessedCharacters {
  characters: Record<string, string>;
  assessments: CharacterAssessment[];
}

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
  referenceImage?: string;
  status: 'idle' | 'generating' | 'ready' | 'error';
  accentColor: string;
}

interface SceneApiResponse {
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
  reference_image?: string;
}

interface ShotApiResponse {
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

interface StoryboardEditorProps {
  projectId: string;
  audioFile: File;
  audioAnalysis: AudioAnalysis;
  characters?: AssessedCharacters;
  concept?: unknown;
  initialStoryboard?: {
    scenes?: SceneApiResponse[];
    shots?: ShotApiResponse[];
  };
  onBack: () => void;
  onComplete: (shots: GeneratedShot[]) => void;
}

const ACCENT_COLORS = [
  'hsl(var(--accent))',
  'hsl(var(--accent-blue))',
  'hsl(var(--accent-yellow))',
  'hsl(var(--accent-pink))',
  'hsl(var(--accent-orange))',
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
];

const StoryboardEditor: React.FC<StoryboardEditorProps> = ({
  projectId,
  audioFile,
  audioAnalysis,
  characters,
  concept,
  initialStoryboard,
  onBack,
  onComplete,
}) => {
  const [stage, setStage] = useState<'storyboard' | 'timeline'>('storyboard');
  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [loadingScenes, setLoadingScenes] = useState(true);
  const [sceneError, setSceneError] = useState<string | null>(null);
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [isSceneDialogOpen, setIsSceneDialogOpen] = useState(false);
  const [sceneCharacters, setSceneCharacters] = useState<string>('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isSavingScenes, setIsSavingScenes] = useState(false);
  const [autoSaveState, setAutoSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const missingConceptWarnedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [shots, setShots] = useState<GeneratedShot[]>([]);
  const [isGeneratingShots, setIsGeneratingShots] = useState(false);
  const [loadingSceneIds, setLoadingSceneIds] = useState<Set<string>>(new Set());
  const [uploadingReferenceSceneId, setUploadingReferenceSceneId] = useState<string | null>(null);
  const [isGeneratingAllKeyframes, setIsGeneratingAllKeyframes] = useState(false);
  const [isCharacterUploadDialogOpen, setIsCharacterUploadDialogOpen] = useState(false);
  const [missingCharacters, setMissingCharacters] = useState<string[]>([]);
  const [isRegenerateConfirmOpen, setIsRegenerateConfirmOpen] = useState(false);
  const [characterImages, setCharacterImages] = useState<Record<string, string>>(() => {
    // Initialize from characters prop, preferring concept_images from the database
    return characters?.characters ?? {};
  });
  const [scenePromptHashes, setScenePromptHashes] = useState<Record<string, string>>({});
  const {
    profile,
    isAdmin,
    isLoading: profileLoading,
    error: profileError,
    refetch: refreshProfile,
  } = useUserProfile();

  const characterOptions = useMemo(() => {
    const options = buildCharacterOptions(characters);
    // Merge with locally uploaded character images
    return options.map(opt => ({
      ...opt,
      imageUrl: characterImages[opt.mention] ?? opt.imageUrl,
    }));
  }, [characters, characterImages]);
  const selectedScene = useMemo(
    () => (selectedSceneId ? scenes.find((scene) => scene.id === selectedSceneId) ?? null : null),
    [scenes, selectedSceneId]
  );

  const assignAccentColor = useCallback((index: number) => ACCENT_COLORS[index % ACCENT_COLORS.length], []);

  // Hash function for tracking scene prompt changes
  const hashPrompt = useCallback((prompt: string): string => {
    let hash = 0;
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }, []);

  useEffect(() => {
    if (profileError) {
      console.error('Failed to load user profile', profileError);
      toast.error('Unable to load credits. Please refresh the page.');
    }
  }, [profileError]);
  
  // Update character images when characters prop changes
  useEffect(() => {
    if (characters?.characters) {
      setCharacterImages(characters.characters);
    }
  }, [characters]);

  const ensureCredits = useCallback((requiredCredits: number) => {
    if (isAdmin) {
      return true;
    }

    if (profileLoading) {
      toast.info('Checking credits. Please try again shortly.');
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

  const saveScenes = useCallback(async (scenesToSave: StoryScene[], shotsOverride?: GeneratedShot[]) => {
    setIsSavingScenes(true);
    try {
      const effectiveShots = shotsOverride ?? shots;
      setAutoSaveState('saving');
      const storyboardPayload = serializeStoryboard(
        scenesToSave.map((scene) => ({
          id: scene.id,
          title: scene.title,
          overview: scene.overview,
          start_time: scene.startTime,
          end_time: scene.endTime,
          has_character: scene.hasCharacter,
          characters: scene.characters,
          prompt: scene.prompt,
          keyframe_image: scene.keyframeImage,
          reference_image: scene.referenceImage,
        })),
        effectiveShots.map((shot) => ({
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
        scenePromptHashes,
      );

      const nextStatus = effectiveShots.length > 0 ? 'ready_for_generation' : 'ready_for_timeline';

      const { error } = await supabase
        .from('projects')
        .update({
          storyboard: storyboardPayload,
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      setAutoSaveState('saved');
    } catch (error) {
      console.error('Scene save failed', error);
      setAutoSaveState('error');
      throw error;
    } finally {
      setIsSavingScenes(false);
    }
  }, [projectId, shots, scenePromptHashes]);

  const scheduleSceneSave = useCallback((nextScenes: StoryScene[]) => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    setAutoSaveState('saving');
    autoSaveTimerRef.current = setTimeout(() => {
      saveScenes(nextScenes).catch((error) => {
        console.error('Failed to auto-save scenes', error);
        setAutoSaveState('error');
      });
    }, 800);
  }, [saveScenes]);

  const fetchScenes = useCallback(async () => {
    if (!hasStoryboardConcept(concept)) {
      setScenes([]);
      setSceneError('Concept not ready yet. Finish the concept conversation before generating scenes.');
      if (!missingConceptWarnedRef.current) {
        toast.info('Finalize your storyboard concept to unlock automatic scene generation.');
        missingConceptWarnedRef.current = true;
      }
      setLoadingScenes(false);
      return;
    }

    missingConceptWarnedRef.current = false;
    setLoadingScenes(true);
    setSceneError(null);

    try {
      const { data, error } = await supabase.functions.invoke<{ scenes: SceneApiResponse[] }>('scene-breakdown', {
        body: {
          lyrics: audioAnalysis.lyrics,
          concept,
          analysis: audioAnalysis,
          characters: characterOptions.map((character) => ({
            mention: character.mention,
            name: character.name,
            description: character.description,
          })),
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      const sceneResponses: SceneApiResponse[] = data?.scenes ?? [];

      const generatedScenes = sceneResponses.map((scene, index) => ({
        id: scene.id ?? `scene-${index + 1}`,
        title: scene.title ?? `Scene ${index + 1}`,
        overview: scene.overview ?? '',
        startTime: scene.start_time ?? index * 10,
        endTime: scene.end_time ?? (index + 1) * 10,
        hasCharacter: Boolean(scene.has_character),
        characters: scene.characters ?? [],
        prompt: scene.visual_prompt ?? scene.overview ?? `Scene ${index + 1} visual`,
        keyframeImage: undefined,
        referenceImage: scene.reference_image,
        status: 'idle' as StoryScene['status'],
        accentColor: assignAccentColor(index),
      }));

      if (generatedScenes.length === 0) {
        throw new Error('No scenes were generated. Please refine the concept and try again.');
      }

      const beatMap = audioAnalysis.beatMap ?? audioAnalysis.beat_map ?? [];
      const alignedScenes = alignScenesToBeats(generatedScenes, beatMap, audioAnalysis.duration, audioAnalysis.tempo);

      setScenes(alignedScenes);
      
      // Save immediately after generation to ensure scenes are persisted
      try {
        await saveScenes(alignedScenes);
        setAutoSaveState('saved');
        toast.success('Scenes generated and saved');
      } catch (error) {
        console.error('Failed to save generated scenes', error);
        setAutoSaveState('error');
        toast.error('Scenes generated but failed to save');
      }
    } catch (error) {
      console.error('Failed to generate scenes', error);
      const message = error instanceof Error ? error.message : 'Failed to generate scenes';
      setSceneError(message);
      toast.error(message);
    } finally {
      setLoadingScenes(false);
    }
  }, [audioAnalysis, concept, characterOptions, assignAccentColor, scheduleSceneSave]);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    const storedScenes = initialStoryboard?.scenes ?? [];
    const storedShots = initialStoryboard?.shots ?? [];

    if (storedScenes.length > 0) {
      hasInitializedRef.current = true;
      const mappedScenes = storedScenes.map((scene, index) => ({
        id: scene.id ?? `scene-${index + 1}`,
        title: scene.title ?? `Scene ${index + 1}`,
        overview: scene.overview ?? '',
        startTime: scene.start_time ?? index * 10,
        endTime: scene.end_time ?? (index + 1) * 10,
        hasCharacter: scene.has_character ?? Boolean(scene.characters?.length),
        characters: Array.isArray(scene.characters) ? scene.characters : [],
        prompt: scene.visual_prompt ?? scene.prompt ?? scene.overview ?? `Scene ${index + 1} visual`,
        keyframeImage: scene.keyframe_image,
        referenceImage: scene.reference_image,
        status: (scene.keyframe_image ? 'ready' : 'idle') as 'idle' | 'generating' | 'ready' | 'error',
        accentColor: assignAccentColor(index),
      }));

      setScenes(mappedScenes);
      setLoadingScenes(false);
      setAutoSaveState('saved');

      // Load prompt hashes from storyboard
      const loadedHashes = (initialStoryboard as any)?.promptHashes;
      if (loadedHashes && typeof loadedHashes === 'object') {
        setScenePromptHashes(loadedHashes);
      } else {
        // Initialize hashes for existing scenes
        const newHashes: Record<string, string> = {};
        mappedScenes.forEach((scene) => {
          newHashes[scene.id] = hashPrompt(scene.prompt);
        });
        setScenePromptHashes(newHashes);
      }

      if (storedShots.length > 0) {
        const mappedShots: GeneratedShot[] = storedShots.map((shot, index) => {
          const fallbackSceneIndex = shot.scene_index ?? shot.shot_index ?? 0;
          const fallbackScene = mappedScenes[fallbackSceneIndex] ?? mappedScenes[0];

          return {
            id: shot.id ?? `shot-${index + 1}`,
            sceneId: shot.scene_id ?? fallbackScene?.id ?? `scene-${fallbackSceneIndex + 1}`,
            sceneIndex: fallbackSceneIndex,
            title: shot.title ?? `Shot ${index + 1}`,
            description: shot.description ?? '',
            start_time: shot.start_time ?? 0,
            end_time: shot.end_time ?? ((shot.start_time ?? 0) + 4),
            image_prompt: shot.image_prompt ?? shot.description ?? '',
            video_prompt: shot.video_prompt ?? shot.description ?? '',
            has_character: shot.has_character ?? Boolean(shot.characters?.length),
            characters: Array.isArray(shot.characters) ? shot.characters : [],
            camera_direction: shot.camera_direction,
            shot_type: shot.shot_type,
            keyframe_image: shot.keyframe_image ?? fallbackScene?.keyframeImage,
            generated_image: shot.generated_image,
            generated_video: shot.generated_video,
            cost: shot.cost,
          };
        });

        setShots(mappedShots);
        setStage('timeline');
      }

      return;
    }

    if (!hasStoryboardConcept(concept)) {
      return;
    }

    hasInitializedRef.current = true;
    fetchScenes();
  }, [assignAccentColor, fetchScenes, initialStoryboard, JSON.stringify(concept ?? {})]);

  useEffect(() => {
    if (!audioRef.current) return;
    const url = URL.createObjectURL(audioFile);
    audioRef.current.src = url;
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [audioFile]);

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

  const handleSceneClick = useCallback((scene: StoryScene) => {
    setSelectedSceneId(scene.id);
    setSceneCharacters('');
    setIsSceneDialogOpen(true);
  }, []);

  const updateScene = useCallback((sceneId: string, updater: (scene: StoryScene) => StoryScene) => {
    setScenes((prev) => {
      const oldScene = prev.find(s => s.id === sceneId);
      const next = prev.map((scene) => (scene.id === sceneId ? updater(scene) : scene));
      const newScene = next.find(s => s.id === sceneId);
      
      // If prompt changed, update hash
      if (oldScene && newScene && oldScene.prompt !== newScene.prompt) {
        setScenePromptHashes(prevHashes => ({
          ...prevHashes,
          [sceneId]: hashPrompt(newScene.prompt),
        }));
      }
      
      scheduleSceneSave(next);
      return next;
    });
  }, [scheduleSceneSave, hashPrompt]);

  const handleScenePromptChange = useCallback((value: string) => {
    if (!selectedSceneId) return;
    updateScene(selectedSceneId, (scene) => ({ ...scene, prompt: value }));
  }, [selectedSceneId, updateScene]);

  const handleAddCharacterToScene = useCallback((mention: string) => {
    if (!selectedSceneId) return;
    updateScene(selectedSceneId, (scene) => ({
      ...scene,
      characters: scene.characters.includes(mention)
        ? scene.characters
        : [...scene.characters, mention],
      prompt: ensureCharacterMention(scene.prompt, mention),
      hasCharacter: true,
    }));
  }, [selectedSceneId, updateScene]);

  const handleCharacterInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSceneCharacters(event.target.value);
  }, []);

  const handleCharacterSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sceneCharacters.trim()) return;
    handleAddCharacterToScene(sceneCharacters.trim().startsWith('@') ? sceneCharacters.trim() : `@${sceneCharacters.trim()}`);
    setSceneCharacters('');
  }, [sceneCharacters, handleAddCharacterToScene]);

  const handleCharacterImageUpload = useCallback(async (characterMention: string, file: File) => {
    setUploadingReferenceSceneId(characterMention);
    try {
      const extension = file.name.split('.').pop() || 'png';
      const sanitizedMention = characterMention.replace(/[@\/\\]/g, '_');
      const path = `${projectId}/characters/${sanitizedMention}-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('shot-media')
        .upload(path, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadError) {
        throw uploadError;
      }

    const { data } = supabase.storage.from('shot-media').getPublicUrl(path);
    const publicUrl = data.publicUrl;

    // Build updated character images object
    const updatedCharacterImages = {
      ...characterImages,
      [characterMention]: publicUrl,
    };

    // Update local state
    setCharacterImages(updatedCharacterImages);

    // Save to project's concept_images in database
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        concept_images: updatedCharacterImages,
        updated_at: new Date().toISOString(),
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Failed to save character image to project', updateError);
      toast.error('Image uploaded but failed to save to project');
    }

      toast.success(`Image uploaded for ${characterMention}`);
    } catch (error) {
      console.error('Character image upload failed', error);
      const message = error instanceof Error ? error.message : 'Failed to upload character image';
      toast.error(message);
    } finally {
      setUploadingReferenceSceneId(null);
    }
  }, [projectId, characterImages]);

  const handleReferenceImageUpload = useCallback(async (sceneId: string, file: File) => {
    setUploadingReferenceSceneId(sceneId);
    try {
      const scene = scenes.find((s) => s.id === sceneId);
      if (!scene) {
        throw new Error('Scene not found');
      }

      const extension = file.name.split('.').pop() || 'png';
      const path = `${projectId}/storyboard/${sceneId}/reference-${Date.now()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('shot-media')
        .upload(path, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('shot-media').getPublicUrl(path);
      const publicUrl = data.publicUrl;

      // Update scene with reference image
      updateScene(sceneId, (scene) => ({ ...scene, referenceImage: publicUrl }));

      toast.success('Reference image attached to scene');
    } catch (error) {
      console.error('Reference image upload failed', error);
      const message = error instanceof Error ? error.message : 'Failed to upload reference image';
      toast.error(message);
    } finally {
      setUploadingReferenceSceneId(null);
    }
  }, [projectId, updateScene, scenes]);

  const handleReferenceImageRemove = useCallback((sceneId: string) => {
    updateScene(sceneId, (scene) => ({ ...scene, referenceImage: undefined }));
    toast.info('Reference image removed');
  }, [updateScene]);

  const handleCharacterImageRemove = useCallback(async (characterMention: string) => {
    try {
      // Remove from local state
      setCharacterImages(prev => {
        const updated = { ...prev };
        delete updated[characterMention];
        return updated;
      });

      // Update project's concept_images
      const updatedCharacterImages = { ...characterImages };
      delete updatedCharacterImages[characterMention];

      const { error: updateError } = await supabase
        .from('projects')
        .update({
          concept_images: updatedCharacterImages,
          updated_at: new Date().toISOString(),
        })
        .eq('id', projectId);

      if (updateError) {
        console.error('Failed to remove character image from project', updateError);
      }

      toast.info(`Image removed for ${characterMention}`);
    } catch (error) {
      console.error('Character image removal failed', error);
      toast.error('Failed to remove character image');
    }
  }, [projectId, characterImages]);

  const handleKeyframeGeneration = useCallback(async (sceneId: string) => {
    const scene = scenes.find((item) => item.id === sceneId);
    if (!scene) return;

    const requiredCredits = getGenerationCost('keyframe');
    if (!ensureCredits(requiredCredits)) {
      return;
    }

    updateScene(sceneId, (current) => ({ ...current, status: 'generating' }));

    try {
      // Collect all character images for this scene
      const characterImages = scene.characters
        .map((characterMention) => {
          const option = characterOptions.find((opt) => opt.mention === characterMention);
          return option?.imageUrl ?? '';
        })
        .filter(Boolean);

      const { data, error } = await supabase.functions.invoke('segmind-generation', {
        body: buildSegmindGenerationPayload(
          {
            id: scene.id,
            mode: 'scene_image',
            prompt: scene.prompt,
            characterImages,
          },
          {
            projectId,
            generationType: 'keyframe',
          },
        ),
      });

      if (error) {
        throw new Error(error.message);
      }

      let keyframeUrl = data?.image_url ?? null;

      if (!keyframeUrl && data?.status === 'processing') {
        toast.info(`${scene.title} keyframe generation started...`);

        const task = await waitForGenerationTaskCompletion({
          supabase,
          taskId: data.task_id,
          shotId: scene.id,
          pollIntervalMs: 2000,
          maxAttempts: 90,
        });

        keyframeUrl = task.result_url ?? null;
      }

      if (!keyframeUrl) {
        throw new Error('Segmind did not return an image.');
      }

      updateScene(sceneId, (current) => ({
        ...current,
        keyframeImage: keyframeUrl!,
        status: 'ready',
      }));

      // Propagate keyframe image to existing shots for this scene
      setShots(prevShots => 
        prevShots.map(shot => 
          shot.sceneId === sceneId 
            ? { ...shot, keyframe_image: keyframeUrl! }
            : shot
        )
      );

      if (!isAdmin) {
        await refreshProfile();
      }

      toast.success(`${scene.title} keyframe generated`);
      setIsSceneDialogOpen(false);
    } catch (error) {
      console.error('Keyframe generation failed', error);
      const message = error instanceof Error ? error.message : 'Failed to generate keyframe';
      updateScene(sceneId, (current) => ({ ...current, status: 'error' }));
      toast.error(message);
    }
  }, [characterOptions, ensureCredits, isAdmin, projectId, refreshProfile, scenes, updateScene]);

  const generateAllKeyframesInternal = useCallback(async () => {
    // Generate keyframes for ALL scenes (not just ones without keyframes)
    const scenesToGenerate = scenes;

    const totalCredits = scenesToGenerate.length * getGenerationCost('keyframe');
    if (!ensureCredits(totalCredits)) {
      return;
    }

    setIsGeneratingAllKeyframes(true);
    toast.info(`Generating ${scenesToGenerate.length} keyframes...`, { duration: 5000 });

    try {
      for (const scene of scenesToGenerate) {
        updateScene(scene.id, (current) => ({ ...current, status: 'generating' }));

        try {
          const sceneCharacterImages = scene.characters
            .map((characterMention) => {
              const option = characterOptions.find((opt) => opt.mention === characterMention);
              return option?.imageUrl ?? '';
            })
            .filter(Boolean);

          const { data, error } = await supabase.functions.invoke('segmind-generation', {
            body: buildSegmindGenerationPayload(
              {
                id: scene.id,
                mode: 'scene_image',
                prompt: scene.prompt,
                characterImages: sceneCharacterImages,
              },
              {
                projectId,
                generationType: 'keyframe',
              },
            ),
          });

          if (error) {
            throw new Error(error.message);
          }

          let keyframeUrl = data?.image_url ?? null;

          if (!keyframeUrl && data?.status === 'processing') {
            const task = await waitForGenerationTaskCompletion({
              supabase,
              taskId: data.task_id,
              shotId: scene.id,
              pollIntervalMs: 2000,
              maxAttempts: 90,
            });

            keyframeUrl = task.result_url ?? null;
          }

          if (!keyframeUrl) {
            throw new Error('Segmind did not return an image.');
          }

          updateScene(scene.id, (current) => ({
            ...current,
            keyframeImage: keyframeUrl!,
            status: 'ready',
          }));

          // Propagate keyframe image to existing shots for this scene
          setShots(prevShots => 
            prevShots.map(shot => 
              shot.sceneId === scene.id 
                ? { ...shot, keyframe_image: keyframeUrl! }
                : shot
            )
          );

          toast.success(`${scene.title} keyframe generated`);
        } catch (error) {
          console.error(`Keyframe generation failed for ${scene.title}`, error);
          updateScene(scene.id, (current) => ({ ...current, status: 'error' }));
        }
      }

      if (!isAdmin) {
        await refreshProfile();
      }

      toast.success('All keyframes generated successfully!');
    } catch (error) {
      console.error('Batch keyframe generation failed', error);
      toast.error('Failed to generate all keyframes');
    } finally {
      setIsGeneratingAllKeyframes(false);
    }
  }, [scenes, characterOptions, ensureCredits, isAdmin, projectId, refreshProfile, updateScene]);

  const handleGenerateAllKeyframes = useCallback(async () => {
    // Check if any scenes already have keyframes
    const existingKeyframes = scenes.filter(scene => scene.status === 'ready');
    
    if (existingKeyframes.length > 0) {
      setIsRegenerateConfirmOpen(true);
      return;
    }

    // Collect all unique characters from all scenes
    const allCharactersInScenes = new Set<string>();
    scenes.forEach(scene => {
      scene.characters.forEach(char => allCharactersInScenes.add(char));
    });

    // Check which characters are missing images
    const missing: string[] = [];
    allCharactersInScenes.forEach(characterMention => {
      const option = characterOptions.find(opt => opt.mention === characterMention);
      if (!option?.imageUrl && !characterImages[characterMention]) {
        missing.push(characterMention);
      }
    });

    // If there are missing character images, show upload modal
    if (missing.length > 0) {
      setMissingCharacters(missing);
      setIsCharacterUploadDialogOpen(true);
      return;
    }

    // Proceed with generating all keyframes
    await generateAllKeyframesInternal();
  }, [scenes, characterOptions, characterImages, generateAllKeyframesInternal]);

  const handleConfirmRegenerate = useCallback(async () => {
    setIsRegenerateConfirmOpen(false);

    // Collect all unique characters from all scenes
    const allCharactersInScenes = new Set<string>();
    scenes.forEach(scene => {
      scene.characters.forEach(char => allCharactersInScenes.add(char));
    });

    // Check which characters are missing images
    const missing: string[] = [];
    allCharactersInScenes.forEach(characterMention => {
      const option = characterOptions.find(opt => opt.mention === characterMention);
      if (!option?.imageUrl && !characterImages[characterMention]) {
        missing.push(characterMention);
      }
    });

    // If there are missing character images, show upload modal
    if (missing.length > 0) {
      setMissingCharacters(missing);
      setIsCharacterUploadDialogOpen(true);
      return;
    }

    // Proceed with generating all keyframes
    await generateAllKeyframesInternal();
  }, [scenes, characterOptions, characterImages, generateAllKeyframesInternal]);

  const allScenesReady = scenes.length > 0 && scenes.every((scene) => scene.status === 'ready');

  const handleGenerateTimeline = useCallback(async () => {
    setIsGeneratingShots(true);
    const scenesToProcess = [...scenes];
    let allGeneratedShots: GeneratedShot[] = [...shots]; // Start with existing shots
    let hasTransitioned = false;

    toast.info(`Processing ${scenesToProcess.length} scenes...`, {
      duration: 5000,
      id: 'shot-generation-progress',
    });

    try {
      // Process scenes one at a time
      for (let i = 0; i < scenesToProcess.length; i++) {
        const scene = scenesToProcess[i];
        const sceneNumber = i + 1;

        // Check if shots already exist for this scene
        const existingSceneShots = shots.filter(shot => shot.sceneId === scene.id);
        const currentPromptHash = hashPrompt(scene.prompt);
        const savedPromptHash = scenePromptHashes[scene.id];

        // If shots exist and prompt hasn't changed, reuse existing shots
        if (existingSceneShots.length > 0 && savedPromptHash === currentPromptHash) {
          console.log(`Reusing ${existingSceneShots.length} existing shots for scene ${sceneNumber} (prompt unchanged)`);
          
          // Check if scene keyframe changed and propagate to shots
          if (scene.keyframeImage && existingSceneShots[0]?.keyframe_image !== scene.keyframeImage) {
            console.log(`Propagating new keyframe to shots for scene ${sceneNumber}`);
            const updatedShots = existingSceneShots.map(shot => ({
              ...shot,
              keyframe_image: scene.keyframeImage,
            }));
            
            // Replace old shots with updated ones in allGeneratedShots
            allGeneratedShots = allGeneratedShots.filter(shot => shot.sceneId !== scene.id).concat(updatedShots);
          }
          
          continue; // Skip re-expansion for this scene
        }

        // Scene prompt changed or no shots exist, re-expand this scene
        console.log(`Expanding scene ${sceneNumber} (prompt changed or no shots exist)`);

        // Mark this scene as loading
        setLoadingSceneIds(prev => new Set(prev).add(scene.id));

        toast.info(`Processing scene ${sceneNumber}/${scenesToProcess.length}: ${scene.title}`, {
          duration: 30000,
          id: 'shot-generation-progress',
        });

        try {
          console.log(`Invoking scene-shot-expansion for scene ${sceneNumber}/${scenesToProcess.length}`);
          
          const { data, error } = await supabase.functions.invoke<{ shots: ShotApiResponse[] }>('scene-shot-expansion', {
            body: {
              scenes: [scene].map((s) => ({
                id: s.id,
                title: s.title,
                overview: s.overview,
                start_time: s.startTime,
                end_time: s.endTime,
                visual_prompt: s.prompt,
                has_character: s.hasCharacter,
                characters: s.characters,
                keyframe_image: s.keyframeImage,
              })),
              analysis: audioAnalysis,
              concept,
              characters: characterOptions.map((character) => ({
                mention: character.mention,
                name: character.name,
                description: character.description,
              })),
            },
          });

          console.log(`Scene ${sceneNumber} response:`, { hasError: !!error, dataLength: data?.shots?.length });

          if (error) {
            console.error(`Failed to process scene ${sceneNumber}:`, error);
            toast.error(`Scene ${sceneNumber} failed: ${error.message}`, {
              duration: 5000,
            });
            
            // Remove from loading on error
            setLoadingSceneIds(prev => {
              const next = new Set(prev);
              next.delete(scene.id);
              return next;
            });
            
            continue; // Skip this scene but continue with others
          }

          const shotResponses: ShotApiResponse[] = data?.shots ?? [];
          console.log(`Scene ${sceneNumber} generated ${shotResponses.length} shots`);

          const sceneShots: GeneratedShot[] = shotResponses.map((shot, index) => ({
            id: shot.id ?? `shot-${scene.id}-${index + 1}`,
            sceneId: shot.scene_id ?? scene.id,
            sceneIndex: shot.scene_index ?? i,
            title: shot.title ?? `Shot ${index + 1}`,
            description: shot.description ?? '',
            start_time: shot.start_time ?? 0,
            end_time: shot.end_time ?? (shot.start_time ?? 0) + 4,
            image_prompt: shot.image_prompt ?? shot.description ?? '',
            video_prompt: shot.video_prompt ?? shot.description ?? '',
            has_character: Boolean(shot.has_character),
            characters: shot.characters ?? [],
            camera_direction: shot.camera_direction,
            shot_type: shot.shot_type,
            keyframe_image: scene.keyframeImage,
          }));

          // Remove old shots for this scene and add new ones
          allGeneratedShots = allGeneratedShots.filter(shot => shot.sceneId !== scene.id).concat(sceneShots);

          // Update prompt hash for this scene
          setScenePromptHashes(prev => ({
            ...prev,
            [scene.id]: currentPromptHash,
          }));

          // Remove from loading
          setLoadingSceneIds(prev => {
            const next = new Set(prev);
            next.delete(scene.id);
            return next;
          });

          console.log(`Scene ${sceneNumber} transition check: hasTransitioned=${hasTransitioned}, sceneShots=${sceneShots.length}`);

          // After first scene, transition to timeline
          if (!hasTransitioned && sceneShots.length > 0) {
            console.log('Transitioning to timeline with first scene shots');
            const timelineBeatMap = audioAnalysis.beatMap ?? audioAnalysis.beat_map ?? [];
            const alignedShots = alignShotsToBeats(allGeneratedShots, timelineBeatMap, scenes, audioAnalysis.duration, audioAnalysis.tempo);
            
            console.log(`Aligned ${alignedShots.length} shots, setting stage to timeline`);
            setShots(alignedShots);
            setStage('timeline');
            hasTransitioned = true;
            
            toast.success(`Scene ${sceneNumber} complete! Transitioning to timeline...`, {
              duration: 3000,
              id: 'shot-generation-progress',
            });
            
            await saveScenes(scenes, alignedShots);
            console.log('Timeline transition complete');
          } else if (hasTransitioned) {
            // Update shots in timeline as new scenes complete
            const timelineBeatMap = audioAnalysis.beatMap ?? audioAnalysis.beat_map ?? [];
            const alignedShots = alignShotsToBeats(allGeneratedShots, timelineBeatMap, scenes, audioAnalysis.duration, audioAnalysis.tempo);
            
            setShots(alignedShots);
            await saveScenes(scenes, alignedShots);
            
            toast.success(`Scene ${sceneNumber} complete!`, {
              duration: 2000,
            });
          }

        } catch (sceneError) {
          console.error(`Error processing scene ${sceneNumber}:`, sceneError);
          setLoadingSceneIds(prev => {
            const next = new Set(prev);
            next.delete(scene.id);
            return next;
          });
        }
      }

      // Final alignment and save
      if (allGeneratedShots.length > 0) {
        const timelineBeatMap = audioAnalysis.beatMap ?? audioAnalysis.beat_map ?? [];
        const alignedShots = alignShotsToBeats(allGeneratedShots, timelineBeatMap, scenes, audioAnalysis.duration, audioAnalysis.tempo);

        setShots(alignedShots);
        await saveScenes(scenes, alignedShots);
        
        toast.success(`Timeline ready! ${alignedShots.length} shots total.`, {
          id: 'shot-generation-progress',
        });
      } else {
        throw new Error('No shots were generated');
      }

    } catch (error) {
      console.error('Shot generation failed', error);
      const message = error instanceof Error ? error.message : 'Failed to generate shots';
      toast.error(message, {
        id: 'shot-generation-progress',
      });
    } finally {
      setIsGeneratingShots(false);
      setLoadingSceneIds(new Set());
    }
  }, [audioAnalysis, concept, scenes, characterOptions, saveScenes, shots, scenePromptHashes, hashPrompt]);

  const handleTimelineBack = useCallback(() => {
    saveScenes(scenes, shots).catch((error) => console.error('Failed to save before returning to storyboard', error));
    setStage('storyboard');
  }, [saveScenes, scenes, shots]);

  const handleTimelineComplete = useCallback(async (finalShots: GeneratedShot[]) => {
    const beatMap = audioAnalysis.beatMap ?? audioAnalysis.beat_map ?? [];
    const aligned = alignShotsToBeats(finalShots, beatMap, scenes, audioAnalysis.duration, audioAnalysis.tempo);
    setShots(aligned);
    await saveScenes(scenes, aligned);
    onComplete(aligned);
  }, [audioAnalysis, onComplete, saveScenes, scenes]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  if (stage === 'timeline') {
    return (
      <VideoEditor
        projectId={projectId}
        audioFile={audioFile}
        audioDuration={audioAnalysis.duration || 0}
        scenes={scenes}
        initialShots={shots}
        characterOptions={characterOptions}
        loadingSceneIds={loadingSceneIds}
        onBack={handleTimelineBack}
        onComplete={handleTimelineComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="border-b border-muted/40 bg-background/98 backdrop-blur-xl">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-semibold">Storyboard Editor</h1>
            <p className="text-sm text-muted-foreground">
              {scenes.length} scenes • {formatTime(audioAnalysis.duration || 0)} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            {autoSaveState === 'saving' && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 mr-2 animate-spin" /> Saving...
              </div>
            )}
            {autoSaveState === 'saved' && (
              <div className="text-xs text-muted-foreground">All changes saved</div>
            )}
            {autoSaveState === 'error' && (
              <div className="text-xs text-destructive">Auto-save failed</div>
            )}
            <Button
              className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-[35px] hover:opacity-80 transition-opacity duration-300"
              onClick={handleGenerateAllKeyframes}
              disabled={isGeneratingAllKeyframes || scenes.length === 0 || loadingScenes}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }} />
              <span className="relative z-10 flex items-center justify-center text-sm">
                {isGeneratingAllKeyframes ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate All Keyframes
                  </>
                )}
              </span>
            </Button>
            <Button
              className="relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-[35px] hover:opacity-80 transition-opacity duration-300"
              onClick={async () => {
                try {
                  await saveScenes(scenes);
                  toast.success('Storyboard saved');
                } catch (error) {
                  toast.error('Failed to save storyboard');
                }
              }}
              disabled={isSavingScenes || scenes.length === 0}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }} />
              <span className="relative z-10 flex items-center justify-center text-sm">
                {isSavingScenes ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                Save
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
              disabled={!allScenesReady || isGeneratingShots}
              onClick={handleGenerateTimeline}
            >
              <span className="relative z-10 flex items-center justify-center text-sm text-white">
                {isGeneratingShots ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating shots...
                  </>
                ) : (
                  <>
                    <Sparkle className="h-4 w-4 mr-2" />
                    Next: Timeline
                  </>
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => audioRef.current && (audioRef.current.currentTime = 0)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={togglePlayback}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <span className="text-sm text-muted-foreground min-w-[60px]">
            {formatTime(currentTime)}
          </span>
        </div>

        {loadingScenes && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Generating scenes with GPT-5...</p>
          </div>
        )}

        {sceneError && !loadingScenes && (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">{sceneError}</p>
            <Button onClick={fetchScenes}>
              <Wand2 className="h-4 w-4 mr-2" />Retry Scene Generation
            </Button>
          </div>
        )}

        {!loadingScenes && !sceneError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {scenes.map((scene) => (
              <Card
                key={scene.id}
                onClick={() => handleSceneClick(scene)}
                className="relative cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] border border-muted"
              >
                <div
                  className="relative rounded-t-lg overflow-hidden"
                  style={{
                    backgroundColor: scene.accentColor + '26',
                    height: '200px',
                  }}
                >
                  {scene.keyframeImage ? (
                    <img
                      src={scene.keyframeImage}
                      alt={scene.title}
                      className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImage(scene.keyframeImage!);
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="h-10 w-10 mb-2" />
                      <span className="text-xs">Keyframe pending</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <Badge variant="secondary" className="text-foreground" style={{ backgroundColor: '#1c1c1f' }}>
                      {formatTime(scene.startTime)} - {formatTime(scene.endTime)}
                    </Badge>
                    {scene.hasCharacter && (
                      <Badge variant="secondary" className="text-foreground flex items-center gap-1" style={{ backgroundColor: '#1c1c1f' }}>
                        <Users className="h-3 w-3" />
                        Characters
                      </Badge>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: '#1c1c1f' }}>
                      {scene.title}
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm text-foreground mb-1">Scene Overview</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {scene.overview}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{scene.status === 'ready' ? 'Keyframe ready' : scene.status === 'generating' ? 'Generating...' : 'Awaiting keyframe'}</span>
                    <span>{scene.characters.length} character{scene.characters.length === 1 ? '' : 's'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Lightbox Dialog */}
      <Dialog open={!!lightboxImage} onOpenChange={(open) => !open && setLightboxImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none">
          <div className="relative w-full h-full flex items-center justify-center p-4">
            <Button
              size="icon"
              className="absolute top-4 right-4 z-10 relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-[35px] hover:opacity-80 transition-opacity duration-300"
              onClick={() => setLightboxImage(null)}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[35px]" style={{
                background: `
                  radial-gradient(ellipse 40px 30px at 15% 20%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 60px 40px at 70% 30%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 35px 25px at 85% 70%, #d78635 0%, transparent 80%),
                  radial-gradient(ellipse 80px 50px at 25% 80%, #cc4f6b 0%, transparent 50%),
                  radial-gradient(ellipse 45px 35px at 90% 15%, #cc4f6b 0%, transparent 60%),
                  #d0583c`
              }} />
              <X className="h-6 w-6 relative z-10" />
            </Button>
            {lightboxImage && (
              <img
                src={lightboxImage}
                alt="Scene keyframe"
                className="max-w-full max-h-[85vh] object-contain rounded"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSceneDialogOpen}
        onOpenChange={(open) => {
          setIsSceneDialogOpen(open);
          if (!open) {
            setSelectedSceneId(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl" style={{ backgroundColor: '#101012' }}>
          <DialogHeader>
            <DialogTitle>{selectedScene?.title}</DialogTitle>
          </DialogHeader>
          {selectedScene && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Scene Overview</h4>
                <p className="text-sm text-foreground leading-relaxed">{selectedScene.overview}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Timing</span>
                  <p>{formatTime(selectedScene.startTime)} - {formatTime(selectedScene.endTime)}</p>
                </div>
                <div>
                  <span className="font-medium text-foreground">Characters</span>
                  <p>{selectedScene.characters.length ? selectedScene.characters.join(', ') : 'None yet'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prompt">Keyframe Prompt</Label>
                <Textarea
                  id="prompt"
                  rows={6}
                  value={selectedScene.prompt}
                  onChange={(event) => handleScenePromptChange(event.target.value)}
                  placeholder="Describe the visuals for this scene"
                  className="bg-background/60 border-muted/40"
                />
              </div>

              <div className="space-y-3">
                <Label>Add Characters</Label>
                <div className="flex flex-wrap gap-2">
                  {characterOptions.map((character) => (
                    <Button
                      key={character.mention}
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddCharacterToScene(character.mention)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {character.name}
                    </Button>
                  ))}
                </div>
                <form className="flex items-center gap-2" onSubmit={handleCharacterSubmit}>
                  <Input
                    value={sceneCharacters}
                    onChange={handleCharacterInput}
                    placeholder="Add custom @character"
                    className="bg-background/60 border-muted/40"
                  />
                  <Button 
                    type="submit" 
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
                  >
                    <span className="relative z-10 flex items-center justify-center text-sm text-white">
                      <ImagePlus className="h-4 w-4 mr-1" />
                      Add
                    </span>
                  </Button>
                </form>
              </div>

              {selectedScene.characters.length > 0 && (
                <div className="space-y-2">
                  <Label>Character Images</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Upload images for characters in this scene
                  </p>
                  <div className="space-y-2">
                    {selectedScene.characters.map((characterMention) => {
                      const existingCharacter = characterOptions.find(
                        (opt) => opt.mention === characterMention
                      );
                      const hasImage = existingCharacter?.imageUrl || characterImages[characterMention];
                      const imageUrl = characterImages[characterMention] || existingCharacter?.imageUrl;
                      
                      return (
                        <div
                          key={characterMention}
                          className="flex items-center gap-3 p-2 rounded border border-muted/40"
                          style={{ backgroundColor: '#1c1c1f' }}
                        >
                          {hasImage ? (
                            <>
                              <img
                                src={imageUrl}
                                alt={characterMention}
                                className="w-12 h-12 rounded object-cover border border-muted"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{characterMention}</p>
                                <p className="text-xs text-muted-foreground">Image attached</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCharacterImageRemove(characterMention)}
                                disabled={uploadingReferenceSceneId === characterMention}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Remove
                              </Button>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded border border-dashed border-muted flex items-center justify-center">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{characterMention}</p>
                                <p className="text-xs text-muted-foreground">No image yet</p>
                              </div>
                              {uploadingReferenceSceneId === characterMention ? (
                                <Button variant="outline" size="sm" disabled>
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  Uploading...
                                </Button>
                              ) : (
                                <label className="cursor-pointer">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    asChild
                                  >
                                    <span>
                                      <ImagePlus className="h-4 w-4 mr-1" />
                                      Upload
                                    </span>
                                  </Button>
                                  <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/webp"
                                    className="hidden"
                                    onChange={(event) => {
                                      const file = event.target.files?.[0];
                                      if (file) {
                                        handleCharacterImageUpload(characterMention, file);
                                        event.target.value = '';
                                      }
                                    }}
                                  />
                                </label>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex items-center justify-between">
            <div className="gradient-button relative overflow-hidden group bg-[#1c1c1f] border border-[#6a6a71] text-white rounded-full h-10 px-4 py-2 cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors text-xs font-normal" onClick={() => setIsSceneDialogOpen(false)}>
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
                <X className="h-4 w-4 mr-1" /> Close
              </span>
            </div>
            {selectedScene && (
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
                onClick={() => handleKeyframeGeneration(selectedScene.id)}
                disabled={selectedScene.status === 'generating'}
              >
                <span className="relative z-10 flex items-center justify-center text-sm text-white">
                  {selectedScene.status === 'generating' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4 mr-2" />
                  )}
                  Generate Keyframe
                </span>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Regenerate Confirmation Dialog */}
      <AlertDialog open={isRegenerateConfirmOpen} onOpenChange={setIsRegenerateConfirmOpen}>
        <AlertDialogContent style={{ backgroundColor: '#101012' }}>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerate All Keyframes?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete all existing keyframes and generate new ones for all scenes. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
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
              onClick={handleConfirmRegenerate}
            >
              Regenerate All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Character Upload Dialog */}
      <Dialog open={isCharacterUploadDialogOpen} onOpenChange={setIsCharacterUploadDialogOpen}>
        <DialogContent className="max-w-2xl" style={{ backgroundColor: '#101012' }}>
          <DialogHeader>
            <DialogTitle>Upload Character Images</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The following characters need images before generating keyframes:
            </p>
            <div className="space-y-2">
              {missingCharacters.map((characterMention) => {
                const hasImage = characterImages[characterMention];
                const imageUrl = characterImages[characterMention];
                
                return (
                  <div
                    key={characterMention}
                    className="flex items-center gap-3 p-2 rounded border border-muted/40"
                    style={{ backgroundColor: '#1c1c1f' }}
                  >
                    {hasImage ? (
                      <>
                        <img
                          src={imageUrl}
                          alt={characterMention}
                          className="w-12 h-12 rounded object-cover border border-muted"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{characterMention}</p>
                          <p className="text-xs text-muted-foreground">Image attached</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCharacterImageRemove(characterMention)}
                          disabled={uploadingReferenceSceneId === characterMention}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded border border-dashed border-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{characterMention}</p>
                          <p className="text-xs text-muted-foreground">No image yet</p>
                        </div>
                        {uploadingReferenceSceneId === characterMention ? (
                          <Button variant="outline" size="sm" disabled>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Uploading...
                          </Button>
                        ) : (
                          <label className="cursor-pointer">
                            <Button
                              variant="outline"
                              size="sm"
                              type="button"
                              asChild
                            >
                              <span>
                                <ImagePlus className="h-4 w-4 mr-1" />
                                Upload
                              </span>
                            </Button>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              className="hidden"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                  handleCharacterImageUpload(characterMention, file);
                                  event.target.value = '';
                                }
                              }}
                            />
                          </label>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setIsCharacterUploadDialogOpen(false)}
            >
              Cancel
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
              onClick={() => {
                setIsCharacterUploadDialogOpen(false);
                generateAllKeyframesInternal();
              }}
              disabled={missingCharacters.some(char => !characterImages[char])}
            >
              <span className="relative z-10 flex items-center justify-center text-sm text-white">
                <Wand2 className="h-4 w-4 mr-2" />
                Generate All Keyframes
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StoryboardEditor;
