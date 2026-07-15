import { escapeHtml, list } from "../lib/html.js";
import { renderSourceVerificationCallout } from "./source-verification.js";

export function buildUnitDetailView({ unit, weapons, unitNameMap, metadata, referenceButton }) {
  const unitLinks = (names) => names.length
    ? names.map((name) => `<button type="button" data-open-unit="${unitNameMap.get(name)?.referenceId ?? ""}">${escapeHtml(name)}</button>`).join("")
    : `<span class="muted">None listed</span>`;
  return `
    <p class="eyebrow">${escapeHtml(unit.faction)} · ${escapeHtml(unit.role)}</p>
    <h2>${escapeHtml(unit.name)}</h2>
    <div class="dialog-toolbar">${referenceButton}</div>
    <p class="dialog-summary">Complete standard-unit reference from the final 10th Edition archive. Ability names are indexed here; use the linked source for full proprietary ability wording and edge cases.</p>
    ${renderSourceVerificationCallout({
      verificationState: metadata.verificationState,
      sourceLabel: unit.source.label,
      sourceVersion: unit.source.version,
      sourceDate: unit.source.date,
      links: [
        { label: "Open archived unit reference", href: unit.link },
        { label: "Open official faction source", href: unit.source.url }
      ]
    })}
    <section><h3>Unit composition</h3>${list(unit.composition)}</section>
    <section><h3>Model characteristics</h3><div class="table-scroll"><table class="profile-table"><thead><tr><th>Model</th><th>M</th><th>T</th><th>Sv</th><th>Inv</th><th>W</th><th>Ld</th><th>OC</th><th>Base</th></tr></thead><tbody>${unit.models.map((model) => `<tr><td>${escapeHtml(model.name)}</td><td>${escapeHtml(model.move)}</td><td>${escapeHtml(model.toughness)}</td><td>${escapeHtml(model.save)}</td><td>${escapeHtml(model.invulnerableSave || "—")}</td><td>${escapeHtml(model.wounds)}</td><td>${escapeHtml(model.leadership)}</td><td>${escapeHtml(model.objectiveControl)}</td><td>${escapeHtml(model.baseSize || "—")}</td></tr>`).join("")}</tbody></table></div></section>
    ${unit.transport ? `<section><h3>Transport capacity</h3><p>${escapeHtml(unit.transport)}</p></section>` : ""}
    <section><h3>Keywords</h3><div class="tag-row">${[...unit.keywords, ...unit.factionKeywords].map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div></section>
    <section><h3>Named abilities</h3><div class="ability-index">${unit.abilities.length ? unit.abilities.map((ability) => `<div><strong>${escapeHtml(ability.name)}</strong><span>${escapeHtml([ability.type, ability.parameter].filter(Boolean).join(" · ") || "Datasheet ability")}</span></div>`).join("") : `<span class="muted">No named abilities listed.</span>`}</div></section>
    <section><div class="dialog-list-heading"><h3>Weapon profiles</h3><span>${weapons.length} profiles</span></div><div class="table-scroll"><table class="profile-table weapon-table"><thead><tr><th>Weapon</th><th>Range</th><th>A</th><th>Skill</th><th>S</th><th>AP</th><th>D</th><th>Abilities</th></tr></thead><tbody>${weapons.map((weapon) => `<tr><td>${escapeHtml(weapon.name)}</td><td>${escapeHtml(weapon.type === "Melee" ? "Melee" : weapon.range ? `${weapon.range}"` : "—")}</td><td>${escapeHtml(weapon.attacks)}</td><td>${escapeHtml(weapon.skill && weapon.skill !== "N/A" ? `${weapon.skill}+` : weapon.skill || "—")}</td><td>${escapeHtml(weapon.strength)}</td><td>${escapeHtml(weapon.ap)}</td><td>${escapeHtml(weapon.damage)}</td><td>${escapeHtml(weapon.abilities || "—")}</td></tr>`).join("")}</tbody></table></div></section>
    <section><h3>Leader relationships</h3><p><b>Can lead</b></p><div class="related-row">${unitLinks(unit.canLead)}</div><p><b>Can be led by</b></p><div class="related-row">${unitLinks(unit.canBeLedBy)}</div></section>
    <div class="scope-callout"><strong>Scope</strong><br />${escapeHtml(metadata.scope)}<br /><small>Imported from the Wahapedia data export.</small></div>`;
}
