import { TFile, Vault, moment, parseYaml, stringifyYaml } from "obsidian";

/** Read YAML frontmatter from a markdown file. Returns [frontmatter, body]. */
export async function readFrontmatterAndBody(vault: Vault, file: TFile): Promise<[Record<string, any>, string]> {
  const text = await vault.read(file);
  const match = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return [{}, text];
  const fm = parseYaml(match[1]) as Record<string, any> ?? {};
  const body = text.slice(match[0].length);
  return [fm, body];
}

export function writeFrontmatterAndBody(frontmatter: Record<string, any>, body: string): string {
  const yaml = stringifyYaml(frontmatter).trimEnd();
  return `---\n${yaml}\n---\n${body.replace(/^\n+/, "")}`;
}

export function todayISO(): string {
  return moment().format("YYYY-MM-DD");
}

export function isDue(dateStr: string | undefined): boolean {
  if (!dateStr) return false;
  // Basic YYYY-MM-DD check
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  return dateStr <= todayISO();
}
