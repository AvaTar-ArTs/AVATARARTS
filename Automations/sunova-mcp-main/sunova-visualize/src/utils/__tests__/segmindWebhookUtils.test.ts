import { describe, expect, it } from 'vitest';
import { extractCandidateRequestIds, normalizeRequestIdKey } from '../../../supabase/functions/_shared/segmindWebhookUtils';

describe('segmindWebhookUtils', () => {
  describe('normalizeRequestIdKey', () => {
    it('normalizes mixed characters to requestid', () => {
      expect(normalizeRequestIdKey('request_id')).toBe('requestid');
      expect(normalizeRequestIdKey('Request-ID')).toBe('requestid');
      expect(normalizeRequestIdKey('requestId')).toBe('requestid');
    });
  });

  describe('extractCandidateRequestIds', () => {
    it('finds top-level request_id values', () => {
      const payload = { request_id: 'abc-123' };
      expect(extractCandidateRequestIds(payload)).toEqual(['abc-123']);
    });

    it('deduplicates repeated request ids and trims whitespace', () => {
      const payload = {
        request_id: ' abc-123 ',
        nested: { requestId: 'abc-123' },
      };
      expect(extractCandidateRequestIds(payload)).toEqual(['abc-123']);
    });

    it('discovers nested requestId keys inside arrays', () => {
      const payload = {
        outputs: [
          { output: { requestId: 'shot-42' } },
          { meta: { REQUEST_ID: 'SHOT-42' } },
        ],
      };
      expect(extractCandidateRequestIds(payload)).toEqual(['shot-42', 'SHOT-42']);
    });

    it('ignores unrelated request_url fields', () => {
      const payload = {
        request_url: 'https://example.com',
        data: { other: 'value' },
      };
      expect(extractCandidateRequestIds(payload)).toEqual([]);
    });
  });
});
