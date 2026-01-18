import {
  App,
  Plugin,
  PluginSettingTab,
  Setting,
  Notice,
  TFile,
  TFolder,
  WorkspaceLeaf,
} from 'obsidian';
import { QuizGeneratorSettings, DEFAULT_SETTINGS } from './settings';
import { QuizGeneratorService } from './services/QuizGeneratorService';
import { ModelProfileManager } from './services/ModelProfileManager';
import { QuizDashboardView, QUIZ_DASHBOARD_VIEW } from './ui/QuizDashboardView';
import { QuizModal } from './ui/QuizModal';
import { TestModeModal } from './ui/TestModeModal';
import { QuizParser } from './parsers/QuizParser';
import { ChunkingService } from './services/ChunkingService';

/**
 * Quiz Generator 2026 – AvaTarArTs Edition
 * 
 * An advanced AI-powered quiz generator for Obsidian
 * Fork of the original Quiz Generator by ECuiDev
 * Maintained by AvaTarArTs
 */
export default class QuizGenerator2026Plugin extends Plugin {
  settings: QuizGeneratorSettings;
  generatorService: QuizGeneratorService;
  profileManager: ModelProfileManager;
  chunkingService: ChunkingService;
  parser: QuizParser;

  async onload() {
    console.log('Loading Quiz Generator 2026 – AvaTarArTs Edition');
    
    await this.loadSettings();
    
    // Initialize services
    this.profileManager = new ModelProfileManager(this.settings);
    this.chunkingService = new ChunkingService(this.settings);
    this.parser = new QuizParser();
    this.generatorService = new QuizGeneratorService(
      this.settings,
      this.profileManager,
      this.chunkingService,
      this.parser
    );

    // Register quiz dashboard view
    this.registerView(
      QUIZ_DASHBOARD_VIEW,
      (leaf) => new QuizDashboardView(leaf, this)
    );

    // Add dashboard command
    this.addCommand({
      id: 'open-quiz-dashboard',
      name: 'Open Quiz Dashboard',
      callback: () => this.openQuizDashboard(),
    });

    // Generate quiz from note command
    this.addCommand({
      id: 'generate-quiz-from-note',
      name: 'Generate Quiz from Current Note',
      callback: () => this.generateQuizFromCurrentNote(),
    });

    // Generate quiz from folder command
    this.addCommand({
      id: 'generate-quiz-from-folder',
      name: 'Generate Quiz from Folder',
      callback: () => this.generateQuizFromFolder(),
    });

    // Open saved quiz command
    this.addCommand({
      id: 'open-saved-quiz',
      name: 'Open Saved Quiz',
      callback: () => this.openSavedQuiz(),
    });

    // Start test mode command
    this.addCommand({
      id: 'start-test-mode',
      name: 'Start Test Mode',
      callback: () => this.startTestMode(),
    });

    // Add settings tab
    this.addSettingTab(new QuizGeneratorSettingTab(this.app, this));

    // Add ribbon icon
    this.addRibbonIcon('brain-circuit', 'Quiz Generator 2026', () => {
      this.openQuizDashboard();
    });

    // Register markdown post processor for embedded quizzes
    this.registerMarkdownCodeBlockProcessor('quiz', (source, el, ctx) => {
      this.processEmbeddedQuiz(source, el, ctx);
    });

    // Display welcome message on first load
    if (this.settings.isFirstLoad) {
      new Notice(
        'Welcome to Quiz Generator 2026! Check settings to configure your AI providers.',
        5000
      );
      this.settings.isFirstLoad = false;
      await this.saveSettings();
    }
  }

  onunload() {
    console.log('Unloading Quiz Generator 2026');
    this.app.workspace.detachLeavesOfType(QUIZ_DASHBOARD_VIEW);
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async openQuizDashboard() {
    const { workspace } = this.app;
    
    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(QUIZ_DASHBOARD_VIEW);
    
    if (leaves.length > 0) {
      // Dashboard already open
      leaf = leaves[0];
    } else {
      // Open new dashboard
      leaf = workspace.getRightLeaf(false);
      await leaf.setViewState({ type: QUIZ_DASHBOARD_VIEW, active: true });
    }
    
    workspace.revealLeaf(leaf);
  }

  async generateQuizFromCurrentNote() {
    const activeFile = this.app.workspace.getActiveFile();
    
    if (!activeFile) {
      new Notice('No active note found');
      return;
    }
    
    const content = await this.app.vault.read(activeFile);
    
    if (!content) {
      new Notice('Note is empty');
      return;
    }

    new QuizModal(
      this.app,
      this,
      [activeFile],
      'note'
    ).open();
  }

  async generateQuizFromFolder() {
    // Implementation for folder selection and quiz generation
    new Notice('Folder quiz generation coming soon!');
  }

  async openSavedQuiz() {
    // Implementation for opening saved quizzes
    new Notice('Saved quiz browser coming soon!');
  }

  async startTestMode() {
    const activeFile = this.app.workspace.getActiveFile();
    
    if (!activeFile || !activeFile.path.contains('quiz')) {
      new Notice('Please open a quiz file first');
      return;
    }

    new TestModeModal(this.app, this, activeFile).open();
  }

  async processEmbeddedQuiz(source: string, el: HTMLElement, ctx: any) {
    // Parse embedded quiz options and render quiz UI
    try {
      const options = JSON.parse(source);
      // Render quiz based on options
      el.createEl('div', {
        text: 'Embedded quiz rendering coming soon!',
        cls: 'quiz-generator-embedded',
      });
    } catch (error) {
      el.createEl('div', {
        text: 'Invalid quiz configuration',
        cls: 'quiz-generator-error',
      });
    }
  }
}

/**
 * Settings Tab
 */
class QuizGeneratorSettingTab extends PluginSettingTab {
  plugin: QuizGenerator2026Plugin;

  constructor(app: App, plugin: QuizGenerator2026Plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();
    
    // Header with attribution
    containerEl.createEl('h1', { text: 'Quiz Generator 2026 Settings' });
    
    const attribution = containerEl.createEl('div', { cls: 'quiz-generator-attribution' });
    attribution.createEl('p', {
      text: 'Maintained by AvaTarArts | Originally created by ECuiDev',
      cls: 'setting-item-description',
    });
    attribution.createEl('a', {
      text: 'View original repository',
      href: 'https://github.com/ECuiDev/obsidian-quiz-generator',
    });

    // Model Profiles Section
    containerEl.createEl('h2', { text: '🤖 Model Profiles' });
    
    new Setting(containerEl)
      .setName('Default Profile')
      .setDesc('Select the default model profile for quiz generation')
      .addDropdown(dropdown => {
        const profiles = this.plugin.profileManager.getProfiles();
        profiles.forEach(profile => {
          dropdown.addOption(profile.id, profile.name);
        });
        dropdown
          .setValue(this.plugin.settings.defaultProfileId)
          .onChange(async (value) => {
            this.plugin.settings.defaultProfileId = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Manage Profiles')
      .setDesc('Add, edit, or remove model profiles')
      .addButton(button => {
        button
          .setButtonText('Manage')
          .onClick(() => {
            // Open profile manager modal
            new Notice('Profile manager coming soon!');
          });
      });

    // Generation Settings Section
    containerEl.createEl('h2', { text: '⚙️ Generation Settings' });
    
    new Setting(containerEl)
      .setName('Default Difficulty')
      .setDesc('Default difficulty level for generated questions')
      .addDropdown(dropdown => {
        dropdown
          .addOption('basic', 'Basic')
          .addOption('intermediate', 'Intermediate')
          .addOption('advanced', 'Advanced')
          .setValue(this.plugin.settings.defaultDifficulty)
          .onChange(async (value: any) => {
            this.plugin.settings.defaultDifficulty = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Questions per Generation')
      .setDesc('Default number of questions to generate')
      .addText(text => {
        text
          .setPlaceholder('10')
          .setValue(String(this.plugin.settings.questionsPerGeneration))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num > 0) {
              this.plugin.settings.questionsPerGeneration = num;
              await this.plugin.saveSettings();
            }
          });
      });

    new Setting(containerEl)
      .setName('Enable Chunking')
      .setDesc('Automatically chunk large notes for better processing')
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.enableChunking)
          .onChange(async (value) => {
            this.plugin.settings.enableChunking = value;
            await this.plugin.saveSettings();
          });
      });

    // Storage Settings Section
    containerEl.createEl('h2', { text: '💾 Storage Settings' });
    
    new Setting(containerEl)
      .setName('Quiz Storage Folder')
      .setDesc('Folder where generated quizzes will be saved')
      .addText(text => {
        text
          .setPlaceholder('Quizzes')
          .setValue(this.plugin.settings.quizStorageFolder)
          .onChange(async (value) => {
            this.plugin.settings.quizStorageFolder = value;
            await this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName('Save Format')
      .setDesc('Default format for saving quiz questions')
      .addDropdown(dropdown => {
        dropdown
          .addOption('callout', 'Callout Format')
          .addOption('flashcard', 'Flashcard Format')
          .addOption('both', 'Both Formats')
          .setValue(this.plugin.settings.saveFormat)
          .onChange(async (value: any) => {
            this.plugin.settings.saveFormat = value;
            await this.plugin.saveSettings();
          });
      });

    // Test Mode Settings Section
    containerEl.createEl('h2', { text: '📊 Test Mode Settings' });
    
    new Setting(containerEl)
      .setName('Default Time Limit')
      .setDesc('Default time limit for test mode (minutes, 0 for no limit)')
      .addText(text => {
        text
          .setPlaceholder('30')
          .setValue(String(this.plugin.settings.defaultTimeLimit))
          .onChange(async (value) => {
            const num = parseInt(value);
            if (!isNaN(num) && num >= 0) {
              this.plugin.settings.defaultTimeLimit = num;
              await this.plugin.saveSettings();
            }
          });
      });

    new Setting(containerEl)
      .setName('Save Test Results')
      .setDesc('Automatically save test results to a log file')
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.saveTestResults)
          .onChange(async (value) => {
            this.plugin.settings.saveTestResults = value;
            await this.plugin.saveSettings();
          });
      });

    // Advanced Section
    containerEl.createEl('h2', { text: '🔬 Advanced Settings' });
    
    new Setting(containerEl)
      .setName('Debug Mode')
      .setDesc('Enable debug logging for troubleshooting')
      .addToggle(toggle => {
        toggle
          .setValue(this.plugin.settings.debugMode)
          .onChange(async (value) => {
            this.plugin.settings.debugMode = value;
            await this.plugin.saveSettings();
          });
      });

    // Footer
    const footer = containerEl.createEl('div', { cls: 'quiz-generator-footer' });
    footer.createEl('hr');
    footer.createEl('p', {
      text: 'Quiz Generator 2026 – Transforming knowledge into interactive learning',
      cls: 'setting-item-description',
    });
    
    const links = footer.createEl('div', { cls: 'quiz-generator-links' });
    links.createEl('a', {
      text: 'Documentation',
      href: 'https://github.com/AvaTar-ArTs/obsidian-quiz-generator/wiki',
    });
    links.createEl('span', { text: ' | ' });
    links.createEl('a', {
      text: 'Report Issue',
      href: 'https://github.com/AvaTar-ArTs/obsidian-quiz-generator/issues',
    });
    links.createEl('span', { text: ' | ' });
    links.createEl('a', {
      text: 'Support Development',
      href: 'https://www.buymeacoffee.com/avatararts',
    });
  }
}
