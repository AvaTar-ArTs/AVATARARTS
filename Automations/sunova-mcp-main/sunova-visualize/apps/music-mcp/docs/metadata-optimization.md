# Metadata Optimization Playbook

This playbook operationalizes discovery tuning for the Music Video MCP connector. Follow these steps whenever you ship new tools or adjust behaviour.

## 1. Golden Prompt Set

Maintain the labelled prompt set in `/docs/golden-prompts.csv` (see below). Each row captures:
- `prompt` – the exact user utterance.
- `label` – `call`, `donotcall`, or `alternate`.
- `expectedTool` – the tool to run when `label=call`.
- `notes` – why the label matters or edge cases to watch.

Seed prompts for the current tool surface:

### Direct prompts (label `call`)
- "Ask Sunova to transcribe this vocal take." → `music.transcribe_lyrics`
- "Create a full storyboard for this pop song." → `music.generate_storyboard`
- "Render the music video with Sora at 4K." → `music.render_video`

### Indirect prompts (label `call`)
- "Break my song into shots aligned to the beatmap." → `music.plan_shot_timing`
- "Show me the timeline of scenes we planned." → `music.present_timeline`
- "I need visuals for each verse before rendering." → `music.generate_keyframes`

### Negative prompts (label `donotcall` or `alternate`)
- "Set a reminder to practice guitar tomorrow." → `donotcall` (built-in reminders).
- "Search YouTube for music video references." → `alternate` (browser connectors).
- "Explain how Sora works internally." → `donotcall` (model knowledge).

Add new prompts whenever analytics reveals misfires. Regenerate the CSV when you update the list.

## 2. Drafting Metadata

For every tool:
- **Name** – use `<domain>.<action>` (e.g. `music.generate_storyboard`).
- **Description** – start with “Use this when …” and document out-of-scope cases.
- **Parameters** – add Zod `.describe()` text and examples so JSON Schema carries instructions.
- **Read-only hint** – set `readOnlyHint: true` on tools that never change server state or bill users.

For the app manifest (see `docs/app-metadata.md`):
- Provide an icon, concise description, and starter prompts highlighting the key flows (transcribe → storyboard → render).

## 3. Evaluation Workflow

Each metadata revision requires a regression pass:
1. Deploy the connector in ChatGPT developer mode.
2. Replay the golden prompt set. Log actual tool calls, arguments, and component rendering.
3. Track metrics per prompt:
   - **Precision** – the fraction of executed calls that match `expectedTool`.
   - **Recall** – the fraction of `call` prompts that triggered any tool.
4. Capture mismatches in `/docs/metadata-evals/YYYY-MM-DD.md` with diffs of changed copy.

## 4. Iteration Guidelines

- Change one field at a time (e.g., tweak only `description`).
- Update the evaluation log with timestamp, author, and summary of precision/recall deltas.
- Share diffs across the team for review before pushing to production.
- Prioritize negative-prompt precision: avoid undesired activations before chasing extra recall.

## 5. Production Monitoring

- Review connector analytics every Monday.
- Investigate spikes in user confirmations or tool aborts—they usually signal confusing copy.
- Refresh the golden prompt replay after major launches or schema changes.
- Update README snippets so support teams can reference the latest tool strings.

## 6. Artifacts to Maintain

- `/docs/golden-prompts.csv` – canonical dataset (update with each iteration).
- `/docs/metadata-evals/` – dated runbooks with precision/recall numbers and learnings.
- `/README.md` – outward-facing summary; ensure new tool IDs and descriptions stay in sync.

Treat metadata like product copy: write, measure, iterate.
