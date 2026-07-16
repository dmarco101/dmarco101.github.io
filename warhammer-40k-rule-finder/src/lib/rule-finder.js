import { matchesSearchQuery } from "./search-query.js";
import { isSourceVerificationState } from "./source-verification.js";

const normalise = (value) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9+]+/g, " ").trim();
const weaponMapCache = new WeakMap();
const unitSearchCache = new WeakMap();
const phases = ["Command", "Movement", "Shooting", "Charge", "Fight"];
export { parseAppRoute, buildDetailHash } from "./router.js";

export function normaliseStratagemTiming(timing) {
  const value = normalise(timing);
  const matchedPhases = value.includes("any phase")
    ? phases
    : phases.filter((phase) => value.includes(phase.toLowerCase()));
  const phaseMatches = matchedPhases.length > 0
    ? matchedPhases
    : value.includes("reinforcements step")
      ? ["Movement"]
      : value.includes("end of") && value.includes("turn")
        ? ["Fight"]
        : [];
  const turn = value.includes("opponent") ? "opponent" : value.includes("your ") ? "your" : "either";
  return { phases: phaseMatches, turn };
}

export function buildActiveGameReference({ detachments, coreStratagems, astraDetachmentId, chaosDetachmentId, phase, activeFaction }) {
  const selected = [
    detachments.find((entry) => entry.id === astraDetachmentId),
    detachments.find((entry) => entry.id === chaosDetachmentId)
  ].filter(Boolean);
  const factionEntries = selected.flatMap((detachment) => detachment.stratagems.map((item) => {
    const timingMeta = normaliseStratagemTiming(item.timing);
    const relation = detachment.faction === activeFaction ? "your" : "opponent";
    const turnMatches = timingMeta.turn === "either" || timingMeta.turn === relation;
    return { ...item, id: `${detachment.id}:${item.id}`, source: detachment.name, faction: detachment.faction, timingMeta, timingMatch: timingMeta.phases.includes(phase) && turnMatches };
  }));
  const coreEntries = coreStratagems.map((item) => ({
    ...item,
    source: "Core Stratagem",
    faction: item.turn === "either" ? "Either player" : item.turn === "your" ? activeFaction : selected.find((entry) => entry.faction !== activeFaction)?.faction ?? "Opponent",
    timingMeta: { phases: item.phases, turn: item.turn },
    timingMatch: item.phases.includes(phase)
  }));
  const all = [...coreEntries, ...factionEntries];
  return { now: all.filter((item) => item.timingMatch), later: all.filter((item) => !item.timingMatch) };
}

export function searchRuleEntries(entries, query, activeFilter = "all") {
  const ruleFilter = ["core", "weapon ability", "game flow", "battlefield fundamental", "core stratagem", "astra militarum stratagem"].includes(activeFilter)
    ? activeFilter
    : "all";

  return entries.filter((entry) => {
    const filterMatches =
      ruleFilter === "all" ||
      entry.category.toLowerCase() === ruleFilter ||
      entry.focusTags.includes(ruleFilter);
    if (!filterMatches) return false;
    if (!normalise(query)) return true;

    const haystack = normalise([
      entry.title,
      ...entry.aliases,
      entry.category,
      entry.plainEnglish,
      ...entry.whenToCheck,
      ...entry.diceImpact,
      ...entry.focusTags
    ].join(" "));
    return matchesSearchQuery(query, haystack);
  });
}

export function getEntryById(entries, id) {
  return entries.find((entry) => entry.id === id) ?? null;
}

export function getRelatedEntries(entries, entry) {
  return entry.relatedRuleIds.map((id) => getEntryById(entries, id)).filter(Boolean);
}

export function searchScenarioCards(scenarios, query, activeFilter = "all") {
  const scenarioFilter = ["astra-militarum", "chaos"].includes(activeFilter) ? activeFilter : "all";
  return scenarios.filter((scenario) => {
    const filterMatches =
      scenarioFilter === "all" ||
      scenario.focusTags.includes(scenarioFilter);
    if (!filterMatches) return false;
    if (!normalise(query)) return true;
    const haystack = normalise([
      scenario.unit,
      scenario.faction,
      scenario.unitType,
      scenario.question,
      scenario.answer,
      ...scenario.requiredContext
    ].join(" "));
    return matchesSearchQuery(query, haystack);
  });
}

export function searchDetachments(detachments, query, faction = "all") {
  return detachments.filter((detachment) => {
    if (faction !== "all" && normalise(detachment.faction) !== normalise(faction)) return false;
    if (!normalise(query)) return true;
    const haystack = normalise([
      detachment.name,
      detachment.faction,
      detachment.playstyle,
      detachment.summary,
      detachment.ruleName,
      ...detachment.enhancements.flatMap((item) => [item.name, item.eligibility, item.effect, item.restrictions]),
      ...detachment.stratagems.flatMap((item) => [item.name, item.type, item.timing, item.target, item.effect, item.restrictions]),
      ...detachment.aliases
    ].join(" "));
    return matchesSearchQuery(query, haystack);
  });
}

export function searchFactionRules(guides, query, activeFilter = "all") {
  return guides.filter((guide) => {
    const filterMatches = activeFilter === "all" || (activeFilter === "astra-militarum" && guide.faction === "Astra Militarum") || (activeFilter === "chaos" && guide.faction === "Chaos Space Marines") || !["astra-militarum", "chaos"].includes(activeFilter);
    if (!filterMatches) return false;
    if (!normalise(query)) return true;
    const haystack = normalise([
      guide.faction, guide.title, guide.summary, ...guide.aliases, ...guide.timing,
      ...guide.eligibility, ...guide.sequence, ...guide.restrictions, ...guide.commonMistakes,
      ...guide.choices.flatMap((choice) => [choice.name, choice.shorthand, choice.effect, choice.check])
    ].join(" "));
    return matchesSearchQuery(query, haystack);
  });
}

export function validateFactionRules(guides) {
  const errors = [];
  const ids = new Set();
  for (const guide of guides) {
    if (!guide.id || ids.has(guide.id)) errors.push(`Faction guide has a missing or duplicate id: ${guide.title ?? "unknown"}.`);
    ids.add(guide.id);
    if (!guide.faction || !guide.title || !guide.summary || guide.sequence.length === 0 || guide.choices.length === 0) errors.push(`Faction guide ${guide.id} is incomplete.`);
    if (!guide.source?.label || !guide.source?.version || !guide.source?.officialUrl || !guide.source?.archiveUrl || !guide.source?.verificationLevel || !isSourceVerificationState(guide.source?.verificationState)) errors.push(`Faction guide ${guide.id} has incomplete provenance.`);
    if (guide.choices.some((choice) => !choice.name || !choice.shorthand || !choice.effect || !choice.check)) errors.push(`Faction guide ${guide.id} has an incomplete choice.`);
  }
  return errors;
}

export function searchDatasheetExplainers(explainers, query, activeFilter = "all") {
  return explainers.filter((entry) => {
    const filterMatches = activeFilter === "all" || (activeFilter === "astra-militarum" && entry.faction === "Astra Militarum") || (activeFilter === "chaos" && entry.faction === "Chaos Space Marines") || !["astra-militarum", "chaos"].includes(activeFilter);
    if (!filterMatches) return false;
    if (!normalise(query)) return true;
    const haystack = normalise([entry.name, ...entry.aliases, entry.faction, entry.type, entry.identity, entry.variantNote, ...entry.keywords, ...entry.beforeGame, ...entry.duringGame, ...entry.mistakes].join(" "));
    return matchesSearchQuery(query, haystack);
  });
}

export function validateDatasheetExplainers(explainers, ruleEntries) {
  const errors = [];
  const ids = new Set();
  const ruleIds = new Set(ruleEntries.map((entry) => entry.id));
  for (const entry of explainers) {
    if (!entry.id || ids.has(entry.id)) errors.push(`Datasheet explainer has a missing or duplicate id: ${entry.name ?? "unknown"}.`);
    ids.add(entry.id);
    if (!entry.name || !entry.faction || !entry.type || !entry.identity || entry.beforeGame.length === 0 || entry.duringGame.length === 0) errors.push(`Datasheet explainer ${entry.id} is incomplete.`);
    if (!entry.source?.label || !entry.source?.version || !entry.source?.url || !isSourceVerificationState(entry.source?.verificationState)) errors.push(`Datasheet explainer ${entry.id} has incomplete provenance.`);
    for (const id of entry.ruleIds) if (!ruleIds.has(id)) errors.push(`Datasheet explainer ${entry.id} links to missing rule ${id}.`);
  }
  return errors;
}

function unitSearchScore(unit, query) {
  const name = normalise(unit.name);
  if (name === query) return 0;
  const characterPenalty = unit.role === "Characters" ? 1 : 0;
  if (name.startsWith(`${query} `)) return 1 + characterPenalty;
  return 3 + characterPenalty;
}

export function searchUnitDirectory(units, weaponProfiles, { query = "", faction = "all", role = "all" } = {}) {
  let weaponMap = weaponMapCache.get(weaponProfiles);
  if (!weaponMap) { weaponMap = new Map(weaponProfiles.map((weapon) => [weapon.id, weapon])); weaponMapCache.set(weaponProfiles, weaponMap); }
  const normalizedQuery = normalise(query);
  const matches = units.filter((unit) => {
    if (faction !== "all" && unit.faction !== faction) return false;
    if (role !== "all" && unit.role !== role) return false;
    if (!normalizedQuery) return true;
    let cached = unitSearchCache.get(unit);
    if (!cached || cached.weaponProfiles !== weaponProfiles) {
      const weapons = unit.weaponProfileIds.map((id) => weaponMap.get(id)).filter(Boolean);
      cached = { weaponProfiles, haystack: normalise([
        unit.name, unit.faction, unit.role, unit.transport, ...unit.composition, ...unit.keywords, ...unit.factionKeywords,
        ...unit.models.flatMap((model) => [model.name, model.move, model.toughness, model.save, model.wounds, model.leadership, model.objectiveControl]),
        ...unit.abilities.flatMap((ability) => [ability.name, ability.type, ability.parameter]),
        ...unit.canLead, ...unit.canBeLedBy,
        ...weapons.flatMap((weapon) => [weapon.name, weapon.type, weapon.abilities, weapon.range, weapon.strength, weapon.ap, weapon.damage])
      ].join(" ")) };
      unitSearchCache.set(unit, cached);
    }
    const { haystack } = cached;
    return matchesSearchQuery(query, haystack);
  });
  if (!normalizedQuery) return matches;
  return matches.map((unit, index) => ({ unit, index, score: unitSearchScore(unit, normalizedQuery) }))
    .sort((left, right) => left.score - right.score || left.index - right.index)
    .map(({ unit }) => unit);
}

export function validateUnitDirectory(units, weaponProfiles, metadata) {
  const errors = [];
  const unitIds = new Set();
  const unitNames = new Set(units.map((unit) => unit.name));
  const weaponIds = new Set(weaponProfiles.map((weapon) => weapon.id));
  if (!isSourceVerificationState(metadata?.verificationState)) errors.push("Unit directory has no valid verification state.");
  if (weaponIds.size !== weaponProfiles.length) errors.push("Weapon profile IDs are not unique.");
  for (const unit of units) {
    if (!unit.id || unitIds.has(unit.id)) errors.push(`Unit has a missing or duplicate id: ${unit.name ?? "unknown"}.`);
    unitIds.add(unit.id);
    if (!unit.name || !unit.faction || !unit.role || unit.models.length === 0 || unit.composition.length === 0) errors.push(`Unit ${unit.id} is incomplete.`);
    if (unit.models.some((model) => !model.name || !model.move || !model.toughness || !model.save || !model.wounds || !model.leadership || !model.objectiveControl)) errors.push(`Unit ${unit.id} has an incomplete model profile.`);
    if (!unit.source?.label || !unit.source?.version || !unit.source?.url || !unit.link) errors.push(`Unit ${unit.id} has incomplete provenance.`);
    for (const id of unit.weaponProfileIds) if (!weaponIds.has(id)) errors.push(`Unit ${unit.id} links to missing weapon ${id}.`);
    for (const name of [...unit.canLead, ...unit.canBeLedBy]) if (!unitNames.has(name)) errors.push(`Unit ${unit.id} links to missing unit ${name}.`);
  }
  if (weaponProfiles.some((weapon) => !weapon.name || !weapon.type || !weapon.attacks || !weapon.strength || !weapon.damage)) errors.push("Weapon profiles contain an incomplete record.");
  return errors;
}

export function validateDetachments(detachments) {
  const errors = [];
  const ids = new Set();
  for (const detachment of detachments) {
    if (!detachment.id || ids.has(detachment.id)) errors.push(`Detachment has a missing or duplicate id: ${detachment.name ?? "unknown"}.`);
    ids.add(detachment.id);
    if (!detachment.name || !detachment.faction || !detachment.playstyle || !detachment.summary) errors.push(`Detachment ${detachment.id} is incomplete.`);
    if (!detachment.source?.label || !detachment.source?.version || !detachment.source?.url || !isSourceVerificationState(detachment.source?.verificationState)) errors.push(`Detachment ${detachment.id} has no complete source metadata.`);
    if (detachment.enhancements.length !== 4) errors.push(`Detachment ${detachment.id} must have four Enhancements.`);
    if (detachment.stratagems.length !== 6) errors.push(`Detachment ${detachment.id} must have six Stratagems.`);
    if (!detachment.rulesSource?.label || !detachment.rulesSource?.version || !detachment.rulesSource?.verificationLevel || !detachment.rulesSource?.url || !isSourceVerificationState(detachment.rulesSource?.verificationState)) errors.push(`Detachment ${detachment.id} has no complete rules provenance.`);
    if (detachment.enhancements.some((item) => !item.id || !item.name || !Number.isInteger(item.points) || !item.eligibility || !item.effect || !item.restrictions || !item.sourceUrl)) errors.push(`Detachment ${detachment.id} has an incomplete Enhancement.`);
    if (detachment.stratagems.some((item) => !item.id || !item.name || !Number.isInteger(item.cp) || !item.type || !item.timing || !item.target || !item.effect || !item.restrictions || !item.sourceUrl)) errors.push(`Detachment ${detachment.id} has an incomplete Stratagem.`);
  }
  return errors;
}

export function validateContent(entries, scenarios) {
  const errors = [];
  const ids = new Set();
  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id)) errors.push(`Rule entry has a missing or duplicate id: ${entry.title ?? "unknown"}.`);
    ids.add(entry.id);
    if (!entry.title || !entry.plainEnglish || entry.diceImpact.length === 0) errors.push(`Rule entry ${entry.id} is incomplete.`);
    if (!entry.source?.label || !entry.source?.version || !entry.source?.url || !isSourceVerificationState(entry.source?.verificationState)) errors.push(`Rule entry ${entry.id} has no complete source metadata.`);
    for (const relatedId of entry.relatedRuleIds) {
      if (!entries.some((candidate) => candidate.id === relatedId)) errors.push(`Rule entry ${entry.id} links to missing rule ${relatedId}.`);
    }
  }
  for (const scenario of scenarios) {
    if (!scenario.id || !scenario.unit || !scenario.question) errors.push("A scenario card is incomplete.");
    for (const ruleId of scenario.ruleIds) {
      if (!entries.some((candidate) => candidate.id === ruleId)) errors.push(`Scenario ${scenario.id} links to missing rule ${ruleId}.`);
    }
  }
  return errors;
}

export function calculateBlastBonus(modelCount, multiplier = 1) {
  const models = Number(modelCount);
  const amount = Number(multiplier);
  if (!Number.isInteger(models) || models < 0) throw new TypeError("Model count must be a whole number of zero or more.");
  if (!Number.isInteger(amount) || amount < 1) throw new TypeError("Blast multiplier must be a positive whole number.");
  return Math.floor(models / 5) * amount;
}

export function calculateRapidFireAttacks(baseAttacks, rapidFireValue, isWithinHalfRange) {
  const base = Number(baseAttacks);
  const bonus = Number(rapidFireValue);
  if (!Number.isInteger(base) || base < 0 || !Number.isInteger(bonus) || bonus < 0) {
    throw new TypeError("Attack values must be whole numbers of zero or more.");
  }
  return base + (isWithinHalfRange ? bonus : 0);
}

export function calculateArmourSave({ baseSave, armourPenetration = 0, hasCover = false, ignoresCover = false }) {
  const base = Number(baseSave);
  const ap = Number(armourPenetration);
  if (!Number.isInteger(base) || base < 2 || base > 6) throw new TypeError("Base armour save must be from 2 to 6.");
  if (!Number.isInteger(ap) || ap > 0) throw new TypeError("Armour Penetration must be zero or a negative whole number.");

  const coverAllowed = hasCover && !ignoresCover && !(base <= 3 && ap === 0);
  const required = base + Math.abs(ap) - (coverAllowed ? 1 : 0);
  const finalValue = Math.max(2, required);
  return {
    coverApplied: coverAllowed,
    required: finalValue > 6 ? null : finalValue,
    display: finalValue > 6 ? "No armour save" : `${finalValue}+`,
    note: coverAllowed ? "Benefit of Cover applied to the armour save." : hasCover ? "Benefit of Cover did not apply." : "No Benefit of Cover applied."
  };
}
