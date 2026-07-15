const appRoutes = new Set(["home", "active-game", "rules", "detachments", "units"]);
const detailTypesByView = {
  rules: new Set(["rule", "faction-rule"]),
  detachments: new Set(["detachment", "enhancement", "stratagem"]),
  units: new Set(["unit", "datasheet"])
};

const safeDecode = (value) => {
  try { return decodeURIComponent(value); }
  catch { return null; }
};

export function parseAppRoute(hash = "") {
  const parts = String(hash).replace(/^#/, "").split("/").filter(Boolean);
  const knownView = appRoutes.has(parts[0]);
  const view = knownView ? parts[0] : "home";
  if (parts.length < 3) return { view, detailType: null, detailId: null, detailSubId: null };
  const detailType = safeDecode(parts[1]);
  const detailId = safeDecode(parts[2]);
  const detailSubId = parts.length > 3 ? safeDecode(parts.slice(3).join("/")) : null;
  if (!knownView || !detailType || !detailId || !detailTypesByView[view]?.has(detailType) || (parts.length > 3 && detailSubId === null)) return { view, detailType: null, detailId: null, detailSubId: null };
  return { view, detailType, detailId, detailSubId };
}

export function buildDetailHash(view, detailType, detailId, detailSubId = null) {
  const safeView = appRoutes.has(view) ? view : "home";
  const parts = [safeView, detailType, detailId, detailSubId].filter((part) => part !== null && part !== undefined).map(encodeURIComponent);
  parts[0] = safeView;
  return `#${parts.join("/")}`;
}
