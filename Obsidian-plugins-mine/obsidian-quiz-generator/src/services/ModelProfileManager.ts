import { ModelProfile, QuizGeneratorSettings } from '../settings';
import { Notice } from 'obsidian';

/**
 * Manages model profiles for AI providers
 */
export class ModelProfileManager {
  private profiles: Map<string, ModelProfile>;
  private settings: QuizGeneratorSettings;

  constructor(settings: QuizGeneratorSettings) {
    this.settings = settings;
    this.profiles = new Map();
    this.loadProfiles();
  }

  /**
   * Load profiles from settings
   */
  private loadProfiles(): void {
    this.settings.modelProfiles.forEach(profile => {
      this.profiles.set(profile.id, profile);
    });
  }

  /**
   * Get all available profiles
   */
  getProfiles(): ModelProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Get a specific profile by ID
   */
  getProfile(id: string): ModelProfile | undefined {
    return this.profiles.get(id);
  }

  /**
   * Get the default profile
   */
  getDefaultProfile(): ModelProfile {
    const defaultProfile = this.profiles.get(this.settings.defaultProfileId);
    if (!defaultProfile) {
      // Fallback to first available profile
      const firstProfile = this.profiles.values().next().value;
      if (!firstProfile) {
        throw new Error('No model profiles configured');
      }
      return firstProfile;
    }
    return defaultProfile;
  }

  /**
   * Add or update a profile
   */
  async saveProfile(profile: ModelProfile): Promise<void> {
    this.profiles.set(profile.id, profile);
    
    // Update settings
    const existingIndex = this.settings.modelProfiles.findIndex(p => p.id === profile.id);
    if (existingIndex >= 0) {
      this.settings.modelProfiles[existingIndex] = profile;
    } else {
      this.settings.modelProfiles.push(profile);
    }
    
    new Notice(`Profile "${profile.name}" saved`);
  }

  /**
   * Delete a profile
   */
  async deleteProfile(id: string): Promise<void> {
    if (id === this.settings.defaultProfileId) {
      throw new Error('Cannot delete the default profile');
    }
    
    const profile = this.profiles.get(id);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    this.profiles.delete(id);
    this.settings.modelProfiles = this.settings.modelProfiles.filter(p => p.id !== id);
    
    new Notice(`Profile "${profile.name}" deleted`);
  }

  /**
   * Validate API key for a profile
   */
  hasValidApiKey(profile: ModelProfile): boolean {
    if (profile.provider === 'ollama') {
      // Ollama doesn't need an API key
      return true;
    }
    
    const apiKey = this.settings.apiKeys[profile.provider];
    return !!apiKey && apiKey.length > 0;
  }

  /**
   * Get provider-specific headers for API requests
   */
  getAuthHeaders(profile: ModelProfile): Record<string, string> {
    const headers: Record<string, string> = {};
    
    switch (profile.provider) {
      case 'openai':
        headers['Authorization'] = `Bearer ${this.settings.apiKeys.openai}`;
        break;
      case 'anthropic':
        headers['X-API-Key'] = this.settings.apiKeys.anthropic || '';
        headers['anthropic-version'] = '2023-06-01';
        break;
      case 'google':
        // Google uses API key in URL params, not headers
        break;
      case 'mistral':
        headers['Authorization'] = `Bearer ${this.settings.apiKeys.mistral}`;
        break;
      case 'cohere':
        headers['Authorization'] = `Bearer ${this.settings.apiKeys.cohere}`;
        break;
      case 'perplexity':
        headers['Authorization'] = `Bearer ${this.settings.apiKeys.perplexity}`;
        break;
      case 'ollama':
        // No auth needed for local Ollama
        break;
    }
    
    headers['Content-Type'] = 'application/json';
    return headers;
  }

  /**
   * Get the API endpoint for a profile
   */
  getApiEndpoint(profile: ModelProfile): string {
    switch (profile.provider) {
      case 'openai':
        return 'https://api.openai.com/v1/chat/completions';
      case 'anthropic':
        return 'https://api.anthropic.com/v1/messages';
      case 'google':
        return `https://generativelanguage.googleapis.com/v1beta/models/${profile.config.model}:generateContent`;
      case 'mistral':
        return 'https://api.mistral.ai/v1/chat/completions';
      case 'cohere':
        return 'https://api.cohere.ai/v1/generate';
      case 'perplexity':
        return 'https://api.perplexity.ai/chat/completions';
      case 'ollama':
        return `${profile.config.apiEndpoint || 'http://localhost:11434'}/api/generate`;
      default:
        throw new Error(`Unknown provider: ${profile.provider}`);
    }
  }

  /**
   * Estimate tokens for a given text
   */
  estimateTokens(text: string, profile: ModelProfile): number {
    // Simple estimation: ~4 characters per token
    // This varies by model and tokenizer
    const baseEstimate = Math.ceil(text.length / 4);
    
    // Adjust based on provider
    switch (profile.provider) {
      case 'anthropic':
        // Claude tends to use slightly fewer tokens
        return Math.ceil(baseEstimate * 0.9);
      case 'google':
        // Gemini token counting is different
        return Math.ceil(baseEstimate * 1.1);
      default:
        return baseEstimate;
    }
  }

  /**
   * Create a duplicate of an existing profile
   */
  duplicateProfile(id: string, newName: string): ModelProfile {
    const original = this.profiles.get(id);
    if (!original) {
      throw new Error('Profile not found');
    }
    
    const duplicate: ModelProfile = {
      ...original,
      id: `${original.id}-${Date.now()}`,
      name: newName,
      config: { ...original.config },
      performance: { ...original.performance },
    };
    
    return duplicate;
  }

  /**
   * Export profiles to JSON
   */
  exportProfiles(): string {
    return JSON.stringify(this.settings.modelProfiles, null, 2);
  }

  /**
   * Import profiles from JSON
   */
  async importProfiles(json: string): Promise<void> {
    try {
      const imported = JSON.parse(json) as ModelProfile[];
      
      // Validate structure
      if (!Array.isArray(imported)) {
        throw new Error('Invalid profile format');
      }
      
      // Merge with existing profiles
      imported.forEach(profile => {
        if (profile.id && profile.name && profile.provider && profile.config) {
          this.profiles.set(profile.id, profile);
        }
      });
      
      // Update settings
      this.settings.modelProfiles = Array.from(this.profiles.values());
      
      new Notice(`Imported ${imported.length} profiles`);
    } catch (error) {
      throw new Error(`Failed to import profiles: ${error.message}`);
    }
  }
}
