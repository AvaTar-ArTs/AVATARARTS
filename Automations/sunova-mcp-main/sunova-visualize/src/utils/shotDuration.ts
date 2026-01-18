export const SUPPORTED_SHOT_DURATIONS = [5, 10] as const;

export type SupportedShotDuration = (typeof SUPPORTED_SHOT_DURATIONS)[number];

/**
 * Normalizes a requested duration to the closest Segmind-supported option.
 * Ties round up to favor longer renders that avoid truncation.
 */
export const mapToSupportedDuration = (duration: number): SupportedShotDuration => {
  if (Number.isNaN(duration) || !Number.isFinite(duration)) {
    return SUPPORTED_SHOT_DURATIONS[0];
  }

  const rounded = Math.max(0, duration);

  return SUPPORTED_SHOT_DURATIONS.reduce((closest, candidate) => {
    const currentDiff = Math.abs(candidate - rounded);
    const closestDiff = Math.abs(closest - rounded);

    if (currentDiff < closestDiff) {
      return candidate;
    }

    if (currentDiff === closestDiff) {
      return Math.max(candidate, closest) as SupportedShotDuration;
    }

    return closest;
  });
};

export type SegmindGenerationContext =
  | {
      id: string;
      mode: 'scene_image';
      prompt: string;
      characterImages?: string[];
    }
  | {
      id: string;
      mode: 'shot_video';
      sceneId?: string;
      sceneIndex?: number;
      videoPrompt: string;
      imagePrompt: string;
      duration: number;
      audioUrl?: string;
      characterImage?: string;
      keyframeImage?: string;
    };

export type SegmindGenerationType = 'video' | 'keyframe';

export interface SegmindGenerationOptions {
  projectId?: string;
  resolution?: 'FHD' | '2k' | '4k';
  generationType?: SegmindGenerationType;
}

export interface SegmindGenerationPayload {
  mode: 'scene_image' | 'shot_video';
  requestId?: string;
  projectId?: string;
  sceneId?: string;
  shotId?: string;
  sceneIndex?: number;
  video_prompt: string;
  image_prompt: string;
  shot_audio?: string;
  shot_duration: SupportedShotDuration;
  shot_character?: string | string[];
  scene_character?: string | string[];
  shot_keyframe?: string;
  Resolution: 'FHD' | '2k' | '4k';
  generation_type: SegmindGenerationType;
}

export const buildSegmindGenerationPayload = (
  context: SegmindGenerationContext,
  options: SegmindGenerationOptions
): SegmindGenerationPayload => {
  const resolution = options.resolution ?? 'FHD';

  if (context.mode === 'scene_image') {
    const payload: SegmindGenerationPayload = {
      mode: 'scene_image',
      requestId: context.id,
      projectId: options.projectId,
      sceneId: context.id,
      shotId: context.id,
      video_prompt: context.prompt,
      image_prompt: context.prompt,
      shot_audio: '',
      shot_duration: SUPPORTED_SHOT_DURATIONS[0],
      scene_character: context.characterImages ?? [],
      Resolution: resolution,
      generation_type: options.generationType ?? 'keyframe',
    };

    return payload;
  }

  const payload: SegmindGenerationPayload = {
    mode: 'shot_video',
    requestId: context.id,
    projectId: options.projectId,
    video_prompt: context.videoPrompt,
    image_prompt: context.imagePrompt,
    shot_duration: mapToSupportedDuration(context.duration),
    Resolution: resolution,
    generation_type: options.generationType ?? 'video',
  };
  
  // Only include optional fields if they have valid values
  if (context.sceneId) payload.sceneId = context.sceneId;
  payload.shotId = context.id;
  if (context.sceneIndex !== undefined) payload.sceneIndex = context.sceneIndex;
  payload.shot_audio = context.audioUrl ?? '';
  if (context.characterImage) payload.shot_character = context.characterImage;
  if (context.keyframeImage) payload.shot_keyframe = context.keyframeImage;
  
  return payload;
};
