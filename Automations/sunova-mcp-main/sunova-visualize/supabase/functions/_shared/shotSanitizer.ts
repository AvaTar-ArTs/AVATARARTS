const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
};

const toStringArray = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return [];
};

export interface RawShot {
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
  characters?: unknown;
  camera_direction?: string;
  shot_type?: string;
  style?: string;
  camera?: string;
  environment?: string;
  subject?: string;
  elements?: string;
  lighting?: string;
  colors?: string;
  motion?: string;
  mood?: string;
}

export interface ShotSanitizerOptions {
  defaultSceneId: string;
  defaultSceneIndex: number;
}

export type SanitizedShot = Required<Pick<RawShot,
  | 'id'
  | 'scene_id'
  | 'scene_index'
  | 'shot_index'
  | 'title'
  | 'description'
  | 'start_time'
  | 'end_time'
  | 'image_prompt'
  | 'video_prompt'
  | 'has_character'
  | 'camera_direction'
  | 'shot_type'
>> & RawShot & { characters: string[] };

export const sanitizeShots = (
  rawShots: RawShot[],
  options: ShotSanitizerOptions,
): SanitizedShot[] => {
  const fallbackDuration = 4;

  const sanitized = rawShots.map((shot, index) => {
    const start = Math.max(0, toNumber(shot.start_time) ?? index * fallbackDuration);
    const tentativeEnd = toNumber(shot.end_time) ?? start + fallbackDuration;
    const end = Math.max(start + 1, tentativeEnd);

    return {
      ...shot,
      id: shot.id && typeof shot.id === 'string' ? shot.id : `shot-${index + 1}`,
      scene_id: shot.scene_id && typeof shot.scene_id === 'string' ? shot.scene_id : options.defaultSceneId,
      scene_index: Number.isFinite(shot.scene_index) ? shot.scene_index! : options.defaultSceneIndex,
      shot_index: Number.isFinite(shot.shot_index) ? shot.shot_index! : index,
      title: shot.title && typeof shot.title === 'string' ? shot.title : `Shot ${index + 1}`,
      description: shot.description && typeof shot.description === 'string' ? shot.description : '',
      start_time: Math.round(start),
      end_time: Math.round(end),
      image_prompt: shot.image_prompt && typeof shot.image_prompt === 'string' ? shot.image_prompt : '',
      video_prompt: shot.video_prompt && typeof shot.video_prompt === 'string' ? shot.video_prompt : '',
      has_character: Boolean(shot.has_character),
      characters: toStringArray(shot.characters),
      camera_direction: shot.camera_direction && typeof shot.camera_direction === 'string' ? shot.camera_direction : '',
      shot_type: shot.shot_type && typeof shot.shot_type === 'string' ? shot.shot_type : '',
    } as SanitizedShot;
  });

  return sanitized.sort((a, b) => a.start_time - b.start_time);
};
