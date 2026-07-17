import { gamePhases } from "../data/active-game.js";

export const activeGameFactions = ["Astra Militarum", "Chaos Space Marines"];

const shortFactionName = (faction) => faction === "Astra Militarum" ? "Astra" : "Chaos";
const otherFaction = (faction) => activeGameFactions.find((candidate) => candidate !== faction) ?? activeGameFactions[0];

export function activeGameTimingLabel({ battleRound, phase, activeFaction }) {
  return `Round ${battleRound} · ${phase} · ${shortFactionName(activeFaction)} turn`;
}

export function advanceActiveGame(state) {
  const phaseIndex = gamePhases.indexOf(state.phase);
  if (phaseIndex >= 0 && phaseIndex < gamePhases.length - 1) {
    return { ...state, phase: gamePhases[phaseIndex + 1] };
  }
  if (state.activeFaction === state.firstFaction) {
    return { ...state, activeFaction: otherFaction(state.activeFaction), phase: gamePhases[0] };
  }
  return {
    ...state,
    battleRound: state.battleRound + 1,
    activeFaction: state.firstFaction,
    phase: gamePhases[0],
    usedRoundReminders: []
  };
}

export function describeNextActiveGameStep(state) {
  const next = advanceActiveGame(state);
  if (next.battleRound !== state.battleRound) return `Round ${next.battleRound}, ${shortFactionName(next.activeFaction)} Command`;
  if (next.activeFaction !== state.activeFaction) return `${shortFactionName(next.activeFaction)} Command`;
  return next.phase;
}

export function setActiveGameRound(state, value) {
  const battleRound = Math.min(99, Math.max(1, Math.trunc(Number(value) || 1)));
  if (battleRound === state.battleRound) return state;
  return { ...state, battleRound, usedRoundReminders: [] };
}

export function getBattleRoundEligibility(item, battleRound) {
  if (Number.isInteger(item.minBattleRound) && battleRound < item.minBattleRound) {
    return { eligible: false, reason: `Available from Battle Round ${item.minBattleRound}.` };
  }
  if (Number.isInteger(item.maxBattleRound) && battleRound > item.maxBattleRound) {
    return { eligible: false, reason: `Available only through Battle Round ${item.maxBattleRound}.` };
  }
  return { eligible: true, reason: "" };
}

export function buildRoundReminders({ references, detachments, usedIds = [] }) {
  const used = new Set(usedIds);
  return references.flatMap((reference) => {
    if (!["enhancement", "stratagem"].includes(reference.type)) return [];
    const detachment = detachments.find((candidate) => candidate.id === reference.parentId);
    const collection = reference.type === "enhancement" ? detachment?.enhancements : detachment?.stratagems;
    const item = collection?.find((candidate) => candidate.id === reference.id || candidate.name === reference.id);
    if (!detachment || !item || item.usageLimit !== "once-per-battle-round") return [];
    const id = `${reference.type}:${detachment.id}:${item.id}`;
    return [{
      id,
      name: item.name,
      detachment: detachment.name,
      type: reference.type,
      used: used.has(id),
      label: "Once per battle round"
    }];
  });
}
