# Event JSON schema

JSON files contain arrays. Example: ../assets/event.json. Source of truth: src/engine/content.js and lifeRunner.js.

Common fields: id (globally unique), category (life/cultivation/opportunity/disaster), title, text, weight, minAge, optional maxAge, cooldownYears, maxOccurrencesPerLife, importance. Weight finite and preferably positive; usually maxOccurrencesPerLife 1. Add translations.zh and translations.en, each containing title/text. Every narrative in VI/EN must be 15–35 words; ZH 15–160 characters, simplified Chinese. Titles/hints/ending reasons must translate but have no narrative word limit.

allowedRealms is an array of IDs; omitted means all, [] means never. IDs: mortal, qi_refining, foundation, golden_core, nascent_soul, spirit_transformation, void_refining, body_integration, mahayana, true_immortal, golden_immortal, mystic_immortal, immortal_king, immortal_emperor.

conditions supports numeric minimum health/resources/luck/comprehension, exact gender male/female, canonical Vietnamese root/physique name, sectStatus none/member/resident, partnerStatus none/bonded. Do not invent engine condition keys.

effects supports numeric cultivation/health/resources/lifespan deltas, sectStatus/partnerStatus assignments, death boolean. No talent/luck buff keys without engine work.

Automatic fights: combat:true, category:disaster, outcomes array (not choices). Outcomes need id, weight, text, translations, effects. Add victory/injury/death. Death requires endingReason plus translations.zh/en.endingReason. Injury should have its own battle-specific reason when health loss can kill. Examples: src/data/combatEvents.js.

Choices: 2–3 choices, never alongside event outcomes. Each has id/text/hint, translations.zh/en for text/hint, and nonempty weighted outcomes. Retreat may have one safe outcome with empty effects. Examples: src/data/combatChoices.js.

Use realm-appropriate scenes and distinct stakes. Do not repeat generic prose across realms. Sect scenes need membership, partner scenes require bonded. Gender changes story eligibility, not assumed superiority. World danger and relative luck affect fatal outcome weights; disaster also affects encounter weight. Validate mortality when materially increasing heavy combat content.
