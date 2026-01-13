/**
 * License Key Implementation for Vault Ops Toolkit
 * Handles Pro/Enterprise license validation and feature gating
 */

import { requestUrl, Notice, Plugin } from 'obsidian';
import * as crypto from 'crypto';

export interface LicenseInfo {
  key: string;
  email: string;
  plan: 'pro' | 'cloud' | 'enterprise';
  status: 'active' | 'expired' | 'cancelled';
  validUntil: string;
  features: string[];
  seats?: number;
  organizationId?: string;
}

export class LicenseManager {
  private plugin: Plugin;
  private licenseCache: LicenseInfo | null = null;
  private readonly VALIDATION_URL = 'https://api.quantumforgelabs.org/vault-ops/validate';
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private lastValidation: number = 0;

  constructor(plugin: Plugin) {
    this.plugin = plugin;
  }

  /**
   * Initialize license manager and validate stored key
   */
  async initialize(): Promise<void> {
    const storedKey = await this.getStoredLicenseKey();
    if (storedKey) {
      await this.validateLicense(storedKey, true);
    }
  }

  /**
   * Check if a specific feature is available
   */
  hasFeature(feature: string): boolean {
    // Community features are always available
    const communityFeatures = [
      'conditional-frontmatter',
      'basic-review-queue',
      'single-note-operations',
      'basic-health-check',
      'keyword-linking-current'
    ];

    if (communityFeatures.includes(feature)) {
      return true;
    }

    // Check license for pro features
    if (!this.licenseCache || this.licenseCache.status !== 'active') {
      return false;
    }

    return this.licenseCache.features.includes(feature) || 
           this.licenseCache.features.includes('all');
  }

  /**
   * Get current plan name
   */
  getCurrentPlan(): string {
    if (!this.licenseCache || this.licenseCache.status !== 'active') {
      return 'community';
    }
    return this.licenseCache.plan;
  }

  /**
   * Validate a license key
   */
  async validateLicense(key: string, silent = false): Promise<boolean> {
    try {
      // Check cache first
      if (this.licenseCache && 
          Date.now() - this.lastValidation < this.CACHE_DURATION) {
        return this.licenseCache.status === 'active';
      }

      // Validate with server
      const response = await this.validateWithServer(key);
      
      if (response.valid) {
        this.licenseCache = response.license;
        this.lastValidation = Date.now();
        await this.storeLicenseKey(key);
        
        if (!silent) {
          new Notice(`✅ License activated: ${response.license.plan} plan`);
        }
        
        // Enable pro features in settings
        await this.enableProFeatures();
        
        return true;
      } else {
        if (!silent) {
          new Notice(`❌ Invalid license key: ${response.error}`);
        }
        return false;
      }
    } catch (error) {
      // Offline grace period - trust cached license for 7 days
      if (this.licenseCache && this.isWithinGracePeriod()) {
        return true;
      }
      
      if (!silent) {
        new Notice('❌ Unable to validate license. Check internet connection.');
      }
      return false;
    }
  }

  /**
   * Validate license with server
   */
  private async validateWithServer(key: string): Promise<any> {
    const deviceId = await this.getDeviceId();
    
    const response = await requestUrl({
      url: this.VALIDATION_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Plugin-Version': this.plugin.manifest.version
      },
      body: JSON.stringify({
        key,
        deviceId,
        vaultId: this.getVaultId(),
        platform: this.getPlatform()
      })
    });

    return response.json;
  }

  /**
   * Store license key securely
   */
  private async storeLicenseKey(key: string): Promise<void> {
    // Encrypt the key before storing
    const encrypted = this.encryptKey(key);
    await this.plugin.saveData({
      ...await this.plugin.loadData(),
      license: encrypted,
      lastValidated: Date.now()
    });
  }

  /**
   * Retrieve stored license key
   */
  private async getStoredLicenseKey(): Promise<string | null> {
    const data = await this.plugin.loadData();
    if (data?.license) {
      return this.decryptKey(data.license);
    }
    return null;
  }

  /**
   * Simple encryption for license key storage
   */
  private encryptKey(key: string): string {
    const salt = this.getVaultId();
    const cipher = crypto.createCipher('aes-256-cbc', salt);
    let encrypted = cipher.update(key, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Decrypt stored license key
   */
  private decryptKey(encrypted: string): string {
    const salt = this.getVaultId();
    const decipher = crypto.createDecipher('aes-256-cbc', salt);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * Get unique device ID
   */
  private async getDeviceId(): string {
    // Use combination of vault path and hostname
    const vaultPath = (this.plugin.app.vault.adapter as any).basePath;
    const hostname = require('os').hostname();
    return crypto.createHash('sha256')
      .update(`${vaultPath}-${hostname}`)
      .digest('hex');
  }

  /**
   * Get vault ID for license binding
   */
  private getVaultId(): string {
    const vaultPath = (this.plugin.app.vault.adapter as any).basePath;
    return crypto.createHash('sha256')
      .update(vaultPath)
      .digest('hex')
      .substring(0, 16);
  }

  /**
   * Get current platform
   */
  private getPlatform(): string {
    const platform = require('os').platform();
    const arch = require('os').arch();
    return `${platform}-${arch}`;
  }

  /**
   * Check if within offline grace period
   */
  private isWithinGracePeriod(): boolean {
    if (!this.licenseCache) return false;
    
    const validUntil = new Date(this.licenseCache.validUntil).getTime();
    const gracePeriod = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    return Date.now() < validUntil + gracePeriod;
  }

  /**
   * Enable pro features after successful validation
   */
  private async enableProFeatures(): Promise<void> {
    const settings = await this.plugin.loadData();
    
    // Enable pro features based on plan
    if (this.licenseCache?.plan === 'pro' || 
        this.licenseCache?.plan === 'cloud' || 
        this.licenseCache?.plan === 'enterprise') {
      
      settings.proFeaturesEnabled = true;
      settings.bulkOperations = true;
      settings.advancedRules = true;
      settings.customWorkflows = true;
      settings.schemaTools = true;
    }

    if (this.licenseCache?.plan === 'cloud' || 
        this.licenseCache?.plan === 'enterprise') {
      settings.cloudSyncEnabled = true;
      settings.teamFeatures = true;
      settings.analytics = true;
    }

    if (this.licenseCache?.plan === 'enterprise') {
      settings.sso = true;
      settings.auditLogging = true;
      settings.centralManagement = true;
    }

    await this.plugin.saveData(settings);
  }

  /**
   * Remove license and revert to community edition
   */
  async deactivateLicense(): Promise<void> {
    this.licenseCache = null;
    this.lastValidation = 0;
    
    const settings = await this.plugin.loadData();
    delete settings.license;
    settings.proFeaturesEnabled = false;
    settings.bulkOperations = false;
    settings.advancedRules = false;
    settings.customWorkflows = false;
    settings.schemaTools = false;
    settings.cloudSyncEnabled = false;
    settings.teamFeatures = false;
    
    await this.plugin.saveData(settings);
    new Notice('License deactivated. Reverted to Community Edition.');
  }

  /**
   * Check for license updates
   */
  async checkForUpdates(): Promise<void> {
    const key = await this.getStoredLicenseKey();
    if (key) {
      await this.validateLicense(key, true);
    }
  }

  /**
   * Get license status for display
   */
  getLicenseStatus(): string {
    if (!this.licenseCache) {
      return 'Community Edition';
    }

    const validUntil = new Date(this.licenseCache.validUntil);
    const daysRemaining = Math.floor((validUntil.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

    switch (this.licenseCache.plan) {
      case 'pro':
        return `Pro Edition (${daysRemaining} days remaining)`;
      case 'cloud':
        return `Cloud Sync (${daysRemaining} days remaining)`;
      case 'enterprise':
        return `Enterprise (${this.licenseCache.organizationId})`;
      default:
        return 'Community Edition';
    }
  }
}

/**
 * License UI Component for Settings Tab
 */
export class LicenseSettings {
  private containerEl: HTMLElement;
  private manager: LicenseManager;
  private plugin: Plugin;

  constructor(containerEl: HTMLElement, manager: LicenseManager, plugin: Plugin) {
    this.containerEl = containerEl;
    this.manager = manager;
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    
    containerEl.createEl('h3', { text: '🔐 License Management' });
    
    // Current status
    const statusDiv = containerEl.createDiv({ cls: 'vault-ops-license-status' });
    statusDiv.createEl('p', { 
      text: `Current Plan: ${this.manager.getLicenseStatus()}`,
      cls: 'license-status-text'
    });

    // License key input
    const licenseDiv = containerEl.createDiv({ cls: 'vault-ops-license-input' });
    
    const inputContainer = licenseDiv.createDiv({ cls: 'license-input-container' });
    
    const input = inputContainer.createEl('input', {
      type: 'text',
      placeholder: 'Enter license key...',
      cls: 'license-key-input'
    });

    const activateBtn = inputContainer.createEl('button', {
      text: 'Activate',
      cls: 'license-activate-btn'
    });

    activateBtn.onclick = async () => {
      const key = input.value.trim();
      if (!key) {
        new Notice('Please enter a license key');
        return;
      }

      activateBtn.disabled = true;
      activateBtn.textContent = 'Validating...';

      const valid = await this.manager.validateLicense(key);
      
      if (valid) {
        input.value = '';
        this.display(); // Refresh display
      }

      activateBtn.disabled = false;
      activateBtn.textContent = 'Activate';
    };

    // Feature list
    const featuresDiv = containerEl.createDiv({ cls: 'vault-ops-features-list' });
    featuresDiv.createEl('h4', { text: 'Available Features' });
    
    const features = [
      { id: 'bulk-operations', name: 'Bulk Operations', pro: true },
      { id: 'advanced-rules', name: 'Advanced Rules', pro: true },
      { id: 'custom-workflows', name: 'Custom Workflows', pro: true },
      { id: 'schema-tools', name: 'Schema Tools', pro: true },
      { id: 'cloud-sync', name: 'Cloud Sync', cloud: true },
      { id: 'team-features', name: 'Team Features', cloud: true },
      { id: 'audit-logging', name: 'Audit Logging', enterprise: true }
    ];

    const featureList = featuresDiv.createEl('ul', { cls: 'feature-list' });
    
    features.forEach(feature => {
      const item = featureList.createEl('li');
      const hasFeature = this.manager.hasFeature(feature.id);
      
      item.createEl('span', {
        text: hasFeature ? '✅' : '🔒',
        cls: hasFeature ? 'feature-enabled' : 'feature-locked'
      });
      
      item.createEl('span', {
        text: ` ${feature.name}`,
        cls: hasFeature ? '' : 'feature-disabled'
      });
      
      if (!hasFeature) {
        const plan = feature.enterprise ? 'Enterprise' :
                     feature.cloud ? 'Cloud' : 'Pro';
        item.createEl('span', {
          text: ` (${plan})`,
          cls: 'feature-plan-tag'
        });
      }
    });

    // Purchase/upgrade buttons
    const purchaseDiv = containerEl.createDiv({ cls: 'vault-ops-purchase' });
    
    if (this.manager.getCurrentPlan() === 'community') {
      purchaseDiv.createEl('a', {
        text: '🚀 Upgrade to Pro',
        href: 'https://quantumforgelabs.org/vault-ops/pricing',
        cls: 'upgrade-btn'
      });
    }

    // Deactivate option
    if (this.manager.getCurrentPlan() !== 'community') {
      const deactivateBtn = purchaseDiv.createEl('button', {
        text: 'Deactivate License',
        cls: 'deactivate-btn'
      });
      
      deactivateBtn.onclick = async () => {
        if (confirm('Are you sure you want to deactivate your license?')) {
          await this.manager.deactivateLicense();
          this.display(); // Refresh display
        }
      };
    }
  }
}

/**
 * Feature Gate Decorator
 * Use this to protect pro features
 */
export function requiresLicense(feature: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const licenseManager = (this as any).licenseManager;
      
      if (!licenseManager.hasFeature(feature)) {
        new Notice(`This feature requires a Pro license. Visit Settings to upgrade.`);
        return;
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// Usage example in main plugin:
/*
class VaultOpsPlugin extends Plugin {
  licenseManager: LicenseManager;

  async onload() {
    this.licenseManager = new LicenseManager(this);
    await this.licenseManager.initialize();
  }

  @requiresLicense('bulk-operations')
  async bulkOperation() {
    // This will only run if user has valid pro license
  }
}
*/
