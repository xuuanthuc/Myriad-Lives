---
name: myriad-lives-data
description: Add cultivation event JSON to Myriad Lives, with realm scopes, combat, choices, gender conditions and Vietnamese/Chinese/English translations. Use for this repository's game data, not unrelated apps.
---

# Myriad Lives data

Read root AGENTS.md first. Read references/event-schema.md when authoring data. Current code and validators are authoritative.

1. Run npm.cmd run data:stats, optionally -- --realm foundation or -- --plane blood, to identify realms, planes and categories needing content. Plane reports show dedicated content only. Shared counts are not guaranteed events per life.
2. Scaffold drafts with npm.cmd run data:new -- --realm foundation --count 6 --name foundation-new. Output is docs/event-drafts; it is not active game data. Replace sample prose with distinct scenes and full VI/ZH/EN translations.
3. Merge finished drafts into existing JSON arrays by category: life -> src/data/events/life.json, cultivation -> cultivation.json, opportunity -> opportunities.json, disaster -> disasters.json. Partner scenes use life with partnerStatus:bonded; choices and combat follow their event category. Do not create active JSON files by batch or realm. These files are already imported in src/engine/content.js; include each event once. Preserve IDs when reorganizing data. New inline translations are automatically indexed; do not duplicate them into legacy/UI dictionaries.
4. Run npm.cmd run build. Update event count assertions in tests/i18n.test.js to actual totals, then run relevant tests. Run the full suite when changing weights, deaths, conditions or engine behavior. Fix invalid prose instead of relaxing validation.
5. Report added counts/scopes and checks actually run. Update docs/PROJECT_CONTEXT.md for structural changes, not each changing event count.

Preserve IDs, saves, RNG semantics and visible-state boundaries. Do not consume RNG for translations or decorative animation. More content can shift combat mortality; compare seeded simulations when materially changing the balance. Do not auto-publish or deploy because this skill was invoked.

## Birth and ending narratives

Birth and ending records are narrative templates, not encounters. Append to the existing birth.json/endings.json when expanding openings or conclusions. Birth variants use unique id, originId matching src/data/origins.js, text and inline zh/en text translations; omit originId for the legacy generic template. Ending variants use unique id, kind (age/ascend/injury), text and inline translations; legacy age/ascend IDs remain valid. Keep all narratives within the existing language length limits. src/engine/narrative.js selects from known state without consuming RNG; preserve origin eligibility, recorded facts and outcome-specific death narratives. Engine/i18n changes need focused regression checks and the repository test suite. Template additions do not change encounter count assertions.
