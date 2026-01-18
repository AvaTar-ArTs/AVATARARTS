export type ConditionalRule = {
  noteType: string;         // e.g. "lecture", "meeting", "recipe"
  requiredProps: string[];  // e.g. ["topic", "reviewDue", "difficulty"]
  defaults: Record<string, string>; // string defaults; advanced users can override
};

export interface VaultOpsSettings {
  // Auto Keyword Linker-lite
  keywordMap: Record<string, string>; // keyword -> target note name (or path)
  keywordCaseInsensitive: boolean;
  keywordWholeWordOnly: boolean;

  // Conditional properties
  conditionalRules: ConditionalRule[];
  noteTypeProperty: string; // frontmatter property used to decide rule, default: "type"

  // Review queue
  reviewDueProperty: string; // default "reviewDue" (YYYY-MM-DD)
  reviewSort: "dueThenAlpha" | "alpha";
  reviewFolderScope: string; // empty means whole vault

  // Terminal / shell tools
  enableOpenInTerminal: boolean;
  terminalAppMac: "Terminal" | "iTerm"; // macOS only
  enableTrashTools: boolean;

  // Safety
  dryRunByDefault: boolean;
}

export const DEFAULT_SETTINGS: VaultOpsSettings = {
  keywordMap: {
    "API": "API",
    "Dataview": "Dataview",
    "Templater": "Templater",
  },
  keywordCaseInsensitive: true,
  keywordWholeWordOnly: true,

  conditionalRules: [
    {
      noteType: "study",
      requiredProps: ["topic", "reviewDue", "difficulty"],
      defaults: { difficulty: "medium" }
    },
    {
      noteType: "meeting",
      requiredProps: ["attendees", "decisions", "actionItems"],
      defaults: {}
    }
  ],
  noteTypeProperty: "type",

  reviewDueProperty: "reviewDue",
  reviewSort: "dueThenAlpha",
  reviewFolderScope: "",

  enableOpenInTerminal: true,
  terminalAppMac: "Terminal",
  enableTrashTools: true,

  dryRunByDefault: true,
};
