---
description: How to ensure compliance with project rules in CLAUDE.md
---

This workflow defines the mandatory initialization steps for every interaction with this project to comply with the rules set in `CLAUDE.md`.

// turbo
1. **Load Core Context**: 
   - Read `CLAUDE.md` to refresh overall protocols.
   - Read `README.md` to understand the project's current state and architecture.
   - Read `.claude/rules/development-rules.md` to ensure code compliance.

2. **Verify Architecture**:
   - Check the `src/` structure against `README.md` if any new modules are planned.
   - Consult `docs/codebase-summary.md` and `docs/system-architecture.md` for technical constraints.

3. **Follow Implementation Protocols**:
   - Adhere to the `200 lines` modularization rule.
   - Use `useTheme` and `AccessibleText` as mandatory standards.
   - Strictly follow the reporting style specified (concise, grammar sacrifice for speed, list unresolved questions).

4. **Privacy & Security**:
   - If `@@PRIVACY_PROMPT@@` is encountered, use `AskUserQuestion` immediately.

5. **Skill Activation**:
   - Explicitly check if any available skills (python scripts in `.claude/skills/`) can assist in the task.

**MANDATORY**: This workflow MUST be consulted at the beginning of any implementation or planning phase.
