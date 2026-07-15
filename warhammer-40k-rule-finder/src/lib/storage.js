import { normaliseGameReferences } from "./game-reference.js";

export const storageKeys = {
  activeGame: "rule-finder-active-game-v1",
  recent: "rule-finder-recent-v1",
  gameReferences: "rule-finder-game-reference-v2",
  legacyGameReferences: "rule-finder-game-reference-v1"
};

function readJson(storage, key) {
  try { return JSON.parse(storage.getItem(key) ?? "null"); }
  catch { return null; }
}

export function writeJson(storage, key, value) {
  try { storage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

export function normaliseActiveGame(value, defaults) {
  const candidate = value && typeof value === "object" && !Array.isArray(value) ? value : {};
  const phases = new Set(["Command", "Movement", "Shooting", "Charge", "Fight"]);
  const factions = new Set(["Astra Militarum", "Chaos Space Marines"]);
  const safeId = (input, fallback) => typeof input === "string" && /^[a-z0-9-]+$/.test(input) ? input : fallback;
  return {
    astraDetachmentId: safeId(candidate.astraDetachmentId, defaults.astraDetachmentId),
    chaosDetachmentId: safeId(candidate.chaosDetachmentId, defaults.chaosDetachmentId),
    phase: phases.has(candidate.phase) ? candidate.phase : defaults.phase,
    activeFaction: factions.has(candidate.activeFaction) ? candidate.activeFaction : defaults.activeFaction
  };
}

export function loadActiveGame(storage, defaults) {
  return normaliseActiveGame(readJson(storage, storageKeys.activeGame), defaults);
}

export function normaliseRecent(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter((item) => {
    if (!item || typeof item.title !== "string" || typeof item.subtitle !== "string" || typeof item.hash !== "string" || !item.hash.startsWith("#")) return false;
    if (seen.has(item.hash)) return false;
    seen.add(item.hash);
    return true;
  }).slice(0, 6).map(({ title, subtitle, hash, openedAt = 0 }) => ({ title, subtitle, hash, openedAt: Number.isFinite(openedAt) ? openedAt : 0 }));
}

export function loadRecent(storage) {
  return normaliseRecent(readJson(storage, storageKeys.recent));
}

export function addRecent(recent, item) {
  return normaliseRecent([{ ...item, openedAt: Date.now() }, ...normaliseRecent(recent).filter((entry) => entry.hash !== item.hash)]);
}

export function loadGameReferences(storage) {
  const current = readJson(storage, storageKeys.gameReferences);
  return normaliseGameReferences(current ?? readJson(storage, storageKeys.legacyGameReferences));
}
