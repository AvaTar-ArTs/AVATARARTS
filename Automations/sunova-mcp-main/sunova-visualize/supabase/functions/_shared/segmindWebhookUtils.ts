export const normalizeRequestIdKey = (key: string): string => {
  return key.toLowerCase().replace(/[^a-z]/g, '');
};

export const extractCandidateRequestIds = (payload: unknown): string[] => {
  const candidates = new Set<string>();

  const visit = (value: unknown, parentKey?: string) => {
    if (value === null || value === undefined) {
      return;
    }

    if (typeof value === 'string') {
      if (parentKey && normalizeRequestIdKey(parentKey) === 'requestid') {
        const trimmed = value.trim();
        if (trimmed) {
          candidates.add(trimmed);
        }
      }
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => visit(item));
      return;
    }

    if (typeof value === 'object') {
      for (const [key, nestedValue] of Object.entries(value as Record<string, unknown>)) {
        const normalized = normalizeRequestIdKey(key);
        if (normalized === 'requestid' && typeof nestedValue === 'string') {
          const trimmed = nestedValue.trim();
          if (trimmed) {
            candidates.add(trimmed);
          }
        }

        visit(nestedValue, key);
      }
    }
  };

  visit(payload);

  return Array.from(candidates);
};
