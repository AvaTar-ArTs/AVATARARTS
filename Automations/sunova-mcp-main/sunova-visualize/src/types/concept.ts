export interface ConceptStorylinePhase {
  phase: string;
  description?: string;
  events?: string[];
}

export interface ConceptBase {
  concept_summary?: string;
  storyline?: ConceptStorylinePhase[];
}

export type ConceptData = ConceptBase;

export interface ConceptPayload extends ConceptBase {
  [key: string]: unknown;
}

export interface CharacterImageInfo {
  url: string;
  name: string;
  attributes?: Record<string, unknown>;
}
