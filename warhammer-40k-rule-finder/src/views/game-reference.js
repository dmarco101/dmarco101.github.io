import { buildDetailHash } from "../lib/router.js";
import { escapeHtml } from "../lib/html.js";

const groups = [
  { title: "Units", types: ["unit", "datasheet"] },
  { title: "Rules", types: ["rule", "faction-rule"] },
  { title: "Detachments", types: ["detachment"] },
  { title: "Enhancements", types: ["enhancement"] },
  { title: "Stratagems", types: ["stratagem"] }
];

function resolveReference(reference, context) {
  const { unitDirectory, datasheetExplainers, ruleEntries, factionRuleGuides, detachmentEntries, getRule } = context;
  if (reference.type === "unit") {
    const unit = unitDirectory.find((item) => item.referenceId === reference.id || item.id === reference.id);
    return unit ? { ...reference, id: unit.referenceId, title: unit.name, subtitle: `${unit.faction} · ${unit.role}`, hash: buildDetailHash("units", "unit", unit.referenceId), unit } : null;
  }
  if (reference.type === "datasheet") {
    const item = datasheetExplainers.find((candidate) => candidate.id === reference.id);
    return item ? { ...reference, title: item.name, subtitle: `${item.faction} · Interaction guide`, hash: buildDetailHash("units", "datasheet", item.id) } : null;
  }
  if (reference.type === "rule") {
    const item = getRule(ruleEntries, reference.id);
    return item ? { ...reference, title: item.title, subtitle: item.category, hash: buildDetailHash("rules", "rule", item.id) } : null;
  }
  if (reference.type === "faction-rule") {
    const item = factionRuleGuides.find((candidate) => candidate.id === reference.id);
    return item ? { ...reference, title: item.title, subtitle: `${item.faction} · Army rule`, hash: buildDetailHash("rules", "faction-rule", item.id) } : null;
  }
  if (reference.type === "detachment") {
    const item = detachmentEntries.find((candidate) => candidate.id === reference.id);
    return item ? { ...reference, title: item.name, subtitle: `${item.faction} · Detachment`, hash: buildDetailHash("detachments", "detachment", item.id) } : null;
  }
  const detachment = detachmentEntries.find((candidate) => candidate.id === reference.parentId);
  const collection = reference.type === "enhancement" ? detachment?.enhancements : detachment?.stratagems;
  const item = collection?.find((candidate) => candidate.id === reference.id || candidate.name === reference.id);
  if (!item || !detachment) return null;
  const detail = reference.type === "enhancement" ? `${item.points} pts` : `${item.cp}CP · ${item.type}`;
  return { ...reference, id: item.id, title: item.name, subtitle: `${detachment.name} · ${detail}`, hash: buildDetailHash("detachments", reference.type, detachment.id, item.id) };
}

function renderWeapons(unit, weaponProfileMap) {
  const weapons = unit.weaponProfileIds.map((id) => weaponProfileMap.get(id)).filter((weapon) => weapon?.name);
  if (!weapons.length) return "";
  return `<details class="saved-weapons"><summary>${weapons.length} weapon profiles</summary><div class="table-scroll"><table class="profile-table weapon-table"><thead><tr><th>Weapon</th><th>Range</th><th>A</th><th>Skill</th><th>S</th><th>AP</th><th>D</th><th>Abilities</th></tr></thead><tbody>${weapons.map((weapon) => `<tr><td>${escapeHtml(weapon.name)}</td><td>${escapeHtml(weapon.type === "Melee" ? "Melee" : weapon.range ? `${weapon.range}\"` : "—")}</td><td>${escapeHtml(weapon.attacks)}</td><td>${escapeHtml(weapon.skill && weapon.skill !== "N/A" ? `${weapon.skill}+` : weapon.skill || "—")}</td><td>${escapeHtml(weapon.strength)}</td><td>${escapeHtml(weapon.ap)}</td><td>${escapeHtml(weapon.damage)}</td><td>${escapeHtml(weapon.abilities || "—")}</td></tr>`).join("")}</tbody></table></div></details>`;
}

export function buildGameReferenceView(references, context) {
  const resolved = references.map((reference) => resolveReference(reference, context)).filter(Boolean);
  if (!resolved.length) return { count: 0, html: `<div class="empty-state"><h3>No saved references</h3><p>Open any unit, rule, detachment, Enhancement, or Stratagem and choose Save to Game.</p></div>` };
  const html = groups.map((group) => {
    const items = resolved.filter((item) => group.types.includes(item.type));
    if (!items.length) return "";
    return `<section class="game-reference-group"><div class="panel-heading"><h4>${group.title}</h4><span>${items.length}</span></div><div class="game-reference-items">${items.map((item) => `<article class="game-reference-item"><div><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.subtitle)}</span></div><div class="reference-controls"><button type="button" data-move-reference="up" data-reference-type="${item.type}" data-reference-id="${escapeHtml(item.id)}" data-parent-id="${escapeHtml(item.parentId ?? "")}" aria-label="Move ${escapeHtml(item.title)} up">↑</button><button type="button" data-move-reference="down" data-reference-type="${item.type}" data-reference-id="${escapeHtml(item.id)}" data-parent-id="${escapeHtml(item.parentId ?? "")}" aria-label="Move ${escapeHtml(item.title)} down">↓</button><button type="button" data-deep-link="${escapeHtml(item.hash)}">Open</button><button type="button" data-remove-reference="${item.type}" data-reference-id="${escapeHtml(item.id)}" data-parent-id="${escapeHtml(item.parentId ?? "")}">Remove</button></div>${item.unit ? renderWeapons(item.unit, context.weaponProfileMap) : ""}</article>`).join("")}</div></section>`;
  }).join("");
  return { count: resolved.length, html };
}
