const END_TOKEN = '[END OF CONCEPT]';

const narrativeKeywords = ['beginning', 'middle', 'end'];

export const stripEndToken = (content: string): string => {
  if (!content) return '';
  return content.replace(END_TOKEN, '').trim();
};

export const containsEndToken = (content: string): boolean => {
  return content.includes(END_TOKEN);
};

const containsNarrativeStructure = (content: string): boolean => {
  const normalized = stripEndToken(content).toLowerCase();
  return narrativeKeywords.every((keyword) => normalized.includes(keyword));
};

export const shouldTriggerConceptDecision = (
  content: string,
  hasShownDecision: boolean
): boolean => {
  if (hasShownDecision) return false;
  if (!content) return false;

  const hasEndToken = containsEndToken(content);
  const hasNarrative = containsNarrativeStructure(content);

  return hasEndToken && hasNarrative;
};

export const normalizeConversationContent = (content: string): string => {
  if (!content) return '';
  const trimmed = content.trim();
  return containsEndToken(trimmed) ? stripEndToken(trimmed) : trimmed;
};

export const appendEndTokenIfMissing = (content: string): string => {
  const trimmed = content.trim();
  if (!trimmed) {
    return END_TOKEN;
  }
  return containsEndToken(trimmed) ? trimmed : `${trimmed}\n\n${END_TOKEN}`;
};

export const getEndToken = (): string => END_TOKEN;
