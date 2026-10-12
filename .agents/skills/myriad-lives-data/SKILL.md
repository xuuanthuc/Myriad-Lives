---
name: myriad-lives-data
description: Add cultivation event JSON to Myriad Lives, with realm scopes, combat, choices, gender conditions and Vietnamese/Chinese/English translations. Use for this repository's game data, not unrelated apps.
---

# Myriad Lives data

Read root AGENTS.md first. Read references/event-schema.md when authoring data. Current code and validators are authoritative.

1. Run npm.cmd run data:stats, optionally -- --realm foundation, to identify realms and categories needing content. Shared counts are not guaranteed events per life.
2. Scaffold drafts with npm.cmd run data:new -- --realm foundation --count 6 --name foundation-new. Output is docs/event-drafts; it is not active game data. Replace sample prose with distinct scenes and full VI/ZH/EN translations.
3. Move finished JSON into src/data/events, import with with {type:'json'} in src/engine/content.js and include it once in events. New inline translations are automatically indexed; do not duplicate them into legacy/UI dictionaries.
4. Run npm.cmd run build. Update event count assertions in tests/i18n.test.js to actual totals, then run relevant tests. Run the full suite when changing weights, deaths, conditions or engine behavior. Fix invalid prose instead of relaxing validation.
5. Report added counts/scopes and checks actually run. Update docs/PROJECT_CONTEXT.md for structural changes, not each changing event count.

Preserve IDs, saves, RNG semantics and visible-state boundaries. Do not consume RNG for translations or decorative animation. More content can shift combat mortality; compare seeded simulations when materially changing the balance. Do not auto-publish or deploy because this skill was invoked.
