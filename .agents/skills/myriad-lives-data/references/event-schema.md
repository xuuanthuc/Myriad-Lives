# Event JSON schema

JSON files contain arrays. Example: ../assets/event.json. Source of truth: src/engine/content.js and lifeRunner.js.

Common fields: id (globally unique), category (life/cultivation/opportunity/disaster), title, text, weight, minAge, optional maxAge, cooldownYears, maxOccurrencesPerLife, importance. Weight finite and preferably positive; usually maxOccurrencesPerLife 1. Add translations.zh and translations.en, each containing title/text. Every narrative in VI/EN must be 15–35 words; ZH 15–160 characters, simplified Chinese. Titles/hints/ending reasons must translate but have no narrative word limit.

allowedRealms is an array of IDs; omitted means all, [] means never. IDs: mortal, qi_refining, foundation, golden_core, nascent_soul, spirit_transformation, void_refining, body_integration, mahayana, true_immortal, golden_immortal, mystic_immortal, immortal_king, immortal_emperor.

allowedPlanes is an optional nonempty array of unique world-plane IDs: peaceful, abundant, turmoil, wild, declining, hidden, blood, shattered. Omitted means shared across planes. Combine with allowedRealms to restrict both world and cultivation stage. Engine eventEligibility.js uses worldPlaneId(world), with the same stable legacy-save fallback as the UI; never roll a new plane for old saves. Invalid or duplicate plane IDs fail validation. Inspect dedicated plane content with npm.cmd run data:stats -- --plane blood.

conditions supports numeric minimum health/resources/luck/comprehension, exact gender male/female, canonical Vietnamese root/physique name, sectStatus none/member/resident, partnerStatus none/bonded. Do not invent engine condition keys.

effects supports numeric cultivation/health/resources/lifespan/luck deltas, rootUpgrade:1 (one canonical root grade), sectStatus/partnerStatus assignments, death boolean. Luck clamps to 0–100. No talent buff keys. Birth profile stays immutable; evolved luck/root are in state and read with currentProfile(run). Existing snapshots and fact.traitChanges preserve the narrated before/after values. Normal injuries do not automatically reduce luck.

conditions.rootBelow is an exclusive upper bound on the current root score. Root renewal events use rootBelow:100, health:40, allowedRealms from foundation through body_integration, weight:1, maxOccurrencesPerLife:1 and exclusiveGroup:"root_transformation". The group is consumed when an event is offered, including refusal/failure; all root renewal events share one lifetime opportunity. Missing state.encounterGroups in old saves means no consumed group. Never mutate birth identity or consume additional RNG for trait updates. New traits affect later rolls, not the roll granting them.

Choice encounters receive a ×3 engine encounter-weight factor after eligibility. Do not bake this into JSON weights or apply it to outcome weights. This does not guarantee a fixed number of choices per life. Existing special outcomes may change luck when the narrative explicitly supports blessings, inheritance, curses, karmic harm or surviving a calamity. Preserve prior effects and IDs, translate the explanation, and leave ordinary injury/withdrawal/death outcomes unchanged. Saved pending options keep their serialized effects.

Automatic fights: combat:true, category:disaster, outcomes array (not choices). Outcomes need id, weight, text, translations, effects. Add victory/injury/death. Death requires endingReason plus translations.zh/en.endingReason. Injury should have its own battle-specific reason when health loss can kill. Examples: src/data/combatEvents.js.

Choices: 2–3 choices, never alongside event outcomes. Each has id/text/hint, translations.zh/en for text/hint, and nonempty weighted outcomes. Retreat may have one safe outcome with empty effects. Examples: src/data/combatChoices.js.

Prefer three choices only when the third is a materially different action with its own cost, reward and narrative (negotiation, appraisal, supplies, scouting, coordinated assistance). Keep binary acceptance/refusal decisions at two. Preserve existing option/outcome IDs and weights when extending an event; saved pending choices remain valid.

Use realm-appropriate scenes and distinct stakes. Do not repeat generic prose across realms. Sect scenes need membership, partner scenes require bonded. Gender changes story eligibility, not assumed superiority. World danger and relative luck affect fatal outcome weights; disaster also affects encounter weight. Validate mortality when materially increasing heavy combat content.
