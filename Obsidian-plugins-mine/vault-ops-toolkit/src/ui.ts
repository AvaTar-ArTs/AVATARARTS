import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import type VaultOpsPlugin from "./main";
import { DEFAULT_SETTINGS } from "./settings";

export class VaultOpsSettingTab extends PluginSettingTab {
  plugin: VaultOpsPlugin;

  constructor(app: App, plugin: VaultOpsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Vault Ops Toolkit — Settings" });

    new Setting(containerEl)
      .setName("Dry-run by default")
      .setDesc("When enabled, actions will preview changes before writing files. Recommended.")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.dryRunByDefault).onChange(async (v) => {
          this.plugin.settings.dryRunByDefault = v;
          await this.plugin.saveSettings();
        })
      );

    containerEl.createEl("h3", { text: "Auto Keyword Linker-lite" });

    new Setting(containerEl)
      .setName("Case-insensitive matching")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.keywordCaseInsensitive).onChange(async (v) => {
          this.plugin.settings.keywordCaseInsensitive = v;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Whole-word only")
      .setDesc("Avoid linking partial matches (recommended).")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.keywordWholeWordOnly).onChange(async (v) => {
          this.plugin.settings.keywordWholeWordOnly = v;
          await this.plugin.saveSettings();
        })
      );

    const mapSetting = new Setting(containerEl)
      .setName("Keyword map (JSON)")
      .setDesc('Map "keyword" -> "target note name/path". Example: {"Dataview":"Dataview","API":"API"}');

    mapSetting.addTextArea((ta) => {
      ta.setValue(JSON.stringify(this.plugin.settings.keywordMap, null, 2));
      ta.inputEl.rows = 10;
      ta.inputEl.cols = 60;
      ta.onChange(async (value) => {
        try {
          const parsed = JSON.parse(value);
          if (typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Must be a JSON object");
          this.plugin.settings.keywordMap = parsed;
          await this.plugin.saveSettings();
        } catch (e: any) {
          // Don't spam; only show on blur
        }
      });
      ta.inputEl.addEventListener("blur", () => {
        try {
          JSON.parse(ta.getValue());
        } catch (e: any) {
          new Notice("Keyword map JSON is invalid. Changes not saved.");
          ta.setValue(JSON.stringify(this.plugin.settings.keywordMap, null, 2));
        }
      });
    });

    containerEl.createEl("h3", { text: "Conditional Properties" });
    new Setting(containerEl)
      .setName("Note type property")
      .setDesc('Frontmatter key used to decide which rule to apply (default: "type").')
      .addText((t) =>
        t.setValue(this.plugin.settings.noteTypeProperty).onChange(async (v) => {
          this.plugin.settings.noteTypeProperty = v.trim() || DEFAULT_SETTINGS.noteTypeProperty;
          await this.plugin.saveSettings();
        })
      );

    const rulesSetting = new Setting(containerEl)
      .setName("Conditional rules (JSON)")
      .setDesc("Rules that ensure required frontmatter exists based on note type.");

    rulesSetting.addTextArea((ta) => {
      ta.setValue(JSON.stringify(this.plugin.settings.conditionalRules, null, 2));
      ta.inputEl.rows = 12;
      ta.inputEl.cols = 60;
      ta.onChange(async (value) => {
        try {
          const parsed = JSON.parse(value);
          if (!Array.isArray(parsed)) throw new Error("Must be a JSON array");
          this.plugin.settings.conditionalRules = parsed;
          await this.plugin.saveSettings();
        } catch (e: any) {
          // validate on blur
        }
      });
      ta.inputEl.addEventListener("blur", () => {
        try {
          const parsed = JSON.parse(ta.getValue());
          if (!Array.isArray(parsed)) throw new Error("Must be a JSON array");
        } catch (e: any) {
          new Notice("Conditional rules JSON is invalid. Reverting.");
          ta.setValue(JSON.stringify(this.plugin.settings.conditionalRules, null, 2));
        }
      });
    });

    containerEl.createEl("h3", { text: "Review Queue" });
    new Setting(containerEl)
      .setName("Review due property")
      .setDesc('Frontmatter key used for due date, format YYYY-MM-DD (default: "reviewDue").')
      .addText((t) =>
        t.setValue(this.plugin.settings.reviewDueProperty).onChange(async (v) => {
          this.plugin.settings.reviewDueProperty = v.trim() || DEFAULT_SETTINGS.reviewDueProperty;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Review folder scope")
      .setDesc("Limit review queue to a folder path (optional). Example: Notes/Study")
      .addText((t) =>
        t.setValue(this.plugin.settings.reviewFolderScope).onChange(async (v) => {
          this.plugin.settings.reviewFolderScope = v.trim();
          await this.plugin.saveSettings();
        })
      );

    containerEl.createEl("h3", { text: "Power Tools" });

    new Setting(containerEl)
      .setName("Enable Open in Terminal (macOS)")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.enableOpenInTerminal).onChange(async (v) => {
          this.plugin.settings.enableOpenInTerminal = v;
          await this.plugin.saveSettings();
        })
      );

    new Setting(containerEl)
      .setName("Terminal app (macOS)")
      .setDesc("Choose which app to open (Terminal or iTerm).")
      .addDropdown((d) =>
        d.addOption("Terminal", "Terminal")
          .addOption("iTerm", "iTerm")
          .setValue(this.plugin.settings.terminalAppMac)
          .onChange(async (v: any) => {
            this.plugin.settings.terminalAppMac = v;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Enable Trash Tools")
      .setDesc("Adds commands to list/restore items in .trash.")
      .addToggle((t) =>
        t.setValue(this.plugin.settings.enableTrashTools).onChange(async (v) => {
          this.plugin.settings.enableTrashTools = v;
          await this.plugin.saveSettings();
        })
      );
  }
}
