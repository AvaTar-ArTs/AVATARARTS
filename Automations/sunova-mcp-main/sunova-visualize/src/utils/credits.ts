export const IMAGE_GENERATION_COST = 0.25;
export const VIDEO_GENERATION_COST = 1.0;

export type GenerationType = "keyframe" | "video";

export const getGenerationCost = (type: GenerationType): number => {
  return type === "keyframe" ? IMAGE_GENERATION_COST : VIDEO_GENERATION_COST;
};

export const formatCredits = (balance: number): string => {
  if (!Number.isFinite(balance)) {
    return "$0.00";
  }

  return `$${balance.toFixed(2)}`;
};
