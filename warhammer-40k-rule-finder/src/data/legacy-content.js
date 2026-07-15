const combinedArmsHash = "#detachments/detachment/combined-arms";

export const supersededRuleRoutes = {
  "reinforcements-stratagem": {
    status: "superseded",
    replacementHash: "#detachments/stratagem/combined-arms/combined-arms-s2",
    replacementType: "stratagem",
    replacementId: "combined-arms-s2",
    replacementParentId: "combined-arms"
  },
  "suppression-fire": { status: "superseded", replacementHash: combinedArmsHash },
  "fields-of-fire": {
    status: "superseded",
    replacementHash: "#detachments/stratagem/combined-arms/combined-arms-s4",
    replacementType: "stratagem",
    replacementId: "combined-arms-s4",
    replacementParentId: "combined-arms"
  },
  "expert-bombardiers": { status: "superseded", replacementHash: combinedArmsHash },
  "armoured-might": { status: "superseded", replacementHash: combinedArmsHash },
  "inspired-command": {
    status: "superseded",
    replacementHash: "#detachments/stratagem/combined-arms/combined-arms-s5",
    replacementType: "stratagem",
    replacementId: "combined-arms-s5",
    replacementParentId: "combined-arms"
  }
};

export function resolveLegacyRoute(hash = "") {
  const match = String(hash).match(/^#rules\/rule\/([^/]+)$/);
  if (!match) return null;
  const record = supersededRuleRoutes[decodeURIComponent(match[1])];
  return record ? {
    hash: record.replacementHash,
    message: "This Index Stratagem was superseded. Showing the current Combined Arms reference."
  } : null;
}

export function migrateRecentRoutes(references = []) {
  const seen = new Set();
  return references.map((reference) => {
    const replacement = resolveLegacyRoute(reference.hash);
    return replacement ? { ...reference, hash: replacement.hash, subtitle: "Current Combined Arms reference" } : reference;
  }).filter((reference) => {
    if (seen.has(reference.hash)) return false;
    seen.add(reference.hash);
    return true;
  });
}
