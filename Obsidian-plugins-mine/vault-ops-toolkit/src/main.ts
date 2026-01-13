import { App, Notice, Plugin, TFile, TFolder, Modal, Setting } from "obsidian";
import { DEFAULT_SETTINGS, VaultOpsSettings, ConditionalRule } from "./settings";
import { VaultOpsSettingTab } from "./ui";
import { readFrontmatterAndBody, writeFrontmatterAndBody, isDue } from "./helpers";
import { exec } from "child_process";

type TrashItem = { path: string; name: string; };

export default class VaultOpsPlugin extends Plugin {
  settings!: VaultOpsSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new VaultOpsSettingTab(this.app, this));

    // 1) Auto Keyword Linker-lite (current note)
    this.addCommand({
      id: "vault-ops-link-keywords-current-note",
      name: "Link keywords in current note (Auto Keyword Linker-lite)",
      callback: () => this.linkKeywordsInCurrentNote(),
    });

    // 2) Conditional properties (current note)
    this.addCommand({
      id: "vault-ops-apply-conditional-properties",
      name: "Apply conditional properties to current note",
      callback: () => this.applyConditionalPropertiesToCurrentNote(),
    });

    // 3) Review queue navigation
    this.addCommand({
      id: "vault-ops-open-next-due-review-note",
      name: "Open next due review note",
      callback: () => this.openNextDueReviewNote(),
    });

    // 4) Open vault folder in terminal (macOS)
    this.addCommand({
      id: "vault-ops-open-vault-in-terminal",
      name: "Open vault folder in Terminal (macOS)",
      callback: () => this.openVaultInTerminal(),
    });

    // 5) Trash tools
    this.addCommand({
      id: "vault-ops-trash-explorer",
      name: "Trash Explorer: list + restore (vault .trash)",
      callback: () => this.openTrashExplorer(),
    });

    this.addRibbonIcon("terminal", "Vault Ops Toolkit", () => {
      new Notice("Vault Ops Toolkit: use the Command Palette for features.");
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }

  // -------- Feature 1: Keyword Linking --------
  async linkKeywordsInCurrentNote() {
    const file = this.app.workspace.getActiveFile();
    if (!file) return new Notice("No active file.");
    if (file.extension !== "md") return new Notice("Active file is not Markdown.");

    const [fm, body] = await readFrontmatterAndBody(this.app.vault, file);

    const keys = Object.keys(this.settings.keywordMap);
    if (keys.length === 0) return new Notice("Keyword map is empty.");

    const flags = this.settings.keywordCaseInsensitive ? "gi" : "g";

    let updated = body;
    let count = 0;

    for (const kw of keys.sort((a,b)=>b.length-a.length)) {
      const target = this.settings.keywordMap[kw];
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = this.settings.keywordWholeWordOnly ? `\\b${escaped}\\b` : escaped;
      const re = new RegExp(pattern, flags);

      // Skip existing wiki links for the same keyword to avoid [[[[...]]]]
      updated = updated.replace(re, (match, offset) => {
        // Check a small window around offset
        const start = Math.max(0, offset - 2);
        const end = Math.min(updated.length, offset + match.length + 2);
        const window = updated.slice(start, end);
        if (window.includes("[[")) return match;
        count++;
        return `[[${target}|${match}]]`;
      });
    }

    if (count === 0) return new Notice("No keyword matches found.");

    if (this.settings.dryRunByDefault) {
      new Notice(`Dry-run: would add ${count} wiki-links. Disable dry-run to write changes.`);
      return;
    }

    const out = writeFrontmatterAndBody(fm, updated);
    await this.app.vault.modify(file, out);
    new Notice(`Linked ${count} keyword occurrences.`);
  }

  // -------- Feature 2: Conditional Properties --------
  private findRule(noteType: string | undefined): ConditionalRule | undefined {
    if (!noteType) return undefined;
    return this.settings.conditionalRules.find(r => (r.noteType || "").toLowerCase() === noteType.toLowerCase());
  }

  async applyConditionalPropertiesToCurrentNote() {
    const file = this.app.workspace.getActiveFile();
    if (!file) return new Notice("No active file.");
    if (file.extension !== "md") return new Notice("Active file is not Markdown.");

    const [fm, body] = await readFrontmatterAndBody(this.app.vault, file);
    const noteTypeKey = this.settings.noteTypeProperty || "type";
    const noteType = fm[noteTypeKey];

    const rule = this.findRule(typeof noteType === "string" ? noteType : undefined);
    if (!rule) return new Notice(`No rule matched. Set frontmatter ${noteTypeKey}: <type> and add a rule in settings.`);

    const missing: string[] = [];
    for (const prop of rule.requiredProps) {
      if (fm[prop] === undefined || fm[prop] === null || fm[prop] === "") {
        missing.push(prop);
      }
    }

    if (missing.length === 0) return new Notice("All required properties already exist.");

    if (this.settings.dryRunByDefault) {
      new Notice(`Dry-run: would add properties: ${missing.join(", ")}.`);
      return;
    }

    for (const prop of missing) {
      if (rule.defaults && rule.defaults[prop] !== undefined) fm[prop] = rule.defaults[prop];
      else fm[prop] = "";
    }

    const out = writeFrontmatterAndBody(fm, body);
    await this.app.vault.modify(file, out);
    new Notice(`Added missing properties: ${missing.join(", ")}.`);
  }

  // -------- Feature 3: Review Queue --------
  async openNextDueReviewNote() {
    const dueProp = this.settings.reviewDueProperty || "reviewDue";
    const scope = (this.settings.reviewFolderScope || "").trim();

    const files = this.app.vault.getMarkdownFiles().filter(f => {
      if (!scope) return true;
      return f.path.startsWith(scope.replace(/\\/g, "/"));
    });

    const due: TFile[] = [];
    for (const f of files) {
      const [fm] = await readFrontmatterAndBody(this.app.vault, f);
      const dueDate = fm[dueProp];
      if (typeof dueDate === "string" && isDue(dueDate)) due.push(f);
    }

    if (due.length === 0) return new Notice("No due review notes found.");

    due.sort((a,b) => {
      if (this.settings.reviewSort === "alpha") return a.path.localeCompare(b.path);
      // dueThenAlpha: stable alpha for now; due date sorting would require reading all due dates again
      return a.path.localeCompare(b.path);
    });

    const next = due[0];
    await this.app.workspace.getLeaf(true).openFile(next);
    new Notice(`Review: ${next.basename}`);
  }

  // -------- Feature 4: Open in Terminal (macOS) --------
  async openVaultInTerminal() {
    if (!this.settings.enableOpenInTerminal) return new Notice("Open in Terminal is disabled in settings.");
    // Obsidian doesn't expose a universal vault path API across all adapters, but adapter.getBasePath works for local vaults
    const adapter: any = this.app.vault.adapter as any;
    const basePath = typeof adapter.getBasePath === "function" ? adapter.getBasePath() : null;
    if (!basePath) return new Notice("Vault path unavailable (non-local vault adapter?).");

    // macOS: open -a Terminal <path>
    const appName = this.settings.terminalAppMac === "iTerm" ? "iTerm" : "Terminal";
    const cmd = `open -a "${appName}" "${basePath.replace(/"/g, "\\\"")}"`;
    exec(cmd, (err) => {
      if (err) new Notice("Failed to open terminal. Check macOS permissions.");
    });
  }

  // -------- Feature 5: Trash Explorer --------
  private async listTrashItems(): Promise<TrashItem[]> {
    const trashPath = ".trash";
    const folder = this.app.vault.getAbstractFileByPath(trashPath);
    if (!(folder instanceof TFolder)) return [];
    const items: TrashItem[] = [];
    const walk = (f: any) => {
      if (f.children) {
        for (const c of f.children) walk(c);
      } else if (f instanceof TFile) {
        items.push({ path: f.path, name: f.name });
      }
    };
    walk(folder);
    return items;
  }

  async openTrashExplorer() {
    if (!this.settings.enableTrashTools) return new Notice("Trash tools are disabled in settings.");
    const items = await this.listTrashItems();
    if (items.length === 0) return new Notice("No items found in .trash.");

    new TrashExplorerModal(this.app, items, async (item) => {
      // Restore by moving file out of .trash into vault root / Restored/
      const restoredFolder = "Restored";
      const existing = this.app.vault.getAbstractFileByPath(restoredFolder);
      if (!existing) await this.app.vault.createFolder(restoredFolder);

      const file = this.app.vault.getAbstractFileByPath(item.path);
      if (!(file instanceof TFile)) return new Notice("Selected item is not a file.");

      const newPath = `${restoredFolder}/${file.name}`;
      if (this.settings.dryRunByDefault) {
        new Notice(`Dry-run: would restore ${file.name} to ${newPath}`);
        return;
      }

      await this.app.fileManager.renameFile(file, newPath);
      new Notice(`Restored: ${file.name}`);
    }).open();
  }
}

class TrashExplorerModal extends Modal {
  private items: TrashItem[];
  private onRestore: (item: TrashItem) => Promise<void>;

  constructor(app: App, items: TrashItem[], onRestore: (item: TrashItem) => Promise<void>) {
    super(app);
    this.items = items;
    this.onRestore = onRestore;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.createEl("h2", { text: "Trash Explorer (.trash)" });

    const desc = contentEl.createEl("p");
    desc.setText("Select an item to restore into /Restored/. (This is intentionally conservative.)");

    // simple list
    const list = contentEl.createEl("div");
    list.style.maxHeight = "50vh";
    list.style.overflow = "auto";
    list.style.border = "1px solid var(--background-modifier-border)";
    list.style.padding = "8px";

    for (const item of this.items.slice(0, 2000)) {
      const row = list.createEl("div");
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.gap = "8px";
      row.style.padding = "4px 0";

      row.createEl("code", { text: item.name });

      const btn = row.createEl("button", { text: "Restore" });
      btn.onclick = async () => {
        await this.onRestore(item);
      };
    }

    contentEl.createEl("p", { text: `Showing ${Math.min(this.items.length, 2000)} of ${this.items.length} items.`});
  }

  onClose() {
    this.contentEl.empty();
  }
}
