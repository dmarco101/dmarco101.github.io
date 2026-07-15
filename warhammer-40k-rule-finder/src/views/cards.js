import { escapeHtml } from "../lib/html.js";
import { renderSourceVerificationBadge } from "./source-verification.js";

const tagLabel = (tag) => tag === "astra-militarum" ? "Astra Militarum" : tag[0].toUpperCase() + tag.slice(1);

export function renderRuleCard(entry) {
  return `<article class="rule-card"><div class="card-topline"><span>${escapeHtml(entry.category)}</span>${renderSourceVerificationBadge(entry.source.verificationState)}</div><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.plainEnglish)}</p><div class="tag-row">${entry.focusTags.map((tag) => `<span>${escapeHtml(tagLabel(tag))}</span>`).join("")}</div><button class="card-action" type="button" data-open-rule="${escapeHtml(entry.id)}">Open rule guide <span>→</span></button></article>`;
}

export function renderScenarioCard(scenario, ruleMap, datasheetMap) {
  return `<article class="scenario-card"><div class="scenario-meta"><span>${escapeHtml(scenario.faction)}</span><span>${escapeHtml(scenario.unitType)}</span></div><h2>${escapeHtml(scenario.unit)}</h2><p class="scenario-question">${escapeHtml(scenario.question)}</p><p>${escapeHtml(scenario.answer)}</p><div class="scenario-rule-links"><button type="button" data-open-datasheet="${escapeHtml(datasheetMap.get(scenario.unit)?.id ?? "")}">Open unit explainer</button>${scenario.ruleIds.map((id) => `<button type="button" data-open-rule="${escapeHtml(id)}">${escapeHtml(ruleMap.get(id)?.title ?? id)}</button>`).join("")}</div></article>`;
}

export function renderDatasheetCard(entry) {
  return `<article class="datasheet-card ${entry.faction === "Astra Militarum" ? "astra" : "chaos"}"><div class="card-topline"><span>${escapeHtml(entry.faction)}</span><span>${escapeHtml(entry.type)}</span></div>${renderSourceVerificationBadge(entry.source.verificationState)}<h3>${escapeHtml(entry.name)}</h3><p>${escapeHtml(entry.identity)}</p><div class="choice-preview">${entry.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div><button class="card-action" type="button" data-open-datasheet="${escapeHtml(entry.id)}">Open unit explainer <span>→</span></button></article>`;
}

export function renderUnitCard(unit, verificationState) {
  return `<article class="unit-directory-card ${unit.faction === "Astra Militarum" ? "astra" : "chaos"}"><div class="card-topline"><span>${escapeHtml(unit.faction)}</span><span>${escapeHtml(unit.role)}</span></div>${renderSourceVerificationBadge(verificationState)}<h2>${escapeHtml(unit.name)}</h2><p>${unit.models.map((model) => `${escapeHtml(model.name)} · M ${escapeHtml(model.move)} · T ${escapeHtml(model.toughness)} · Sv ${escapeHtml(model.save)} · W ${escapeHtml(model.wounds)} · OC ${escapeHtml(model.objectiveControl)}`).join("<br />")}</p><div class="choice-preview">${unit.keywords.slice(0, 6).map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div><button class="card-action" type="button" data-open-unit="${escapeHtml(unit.referenceId)}">Open complete unit reference <span>→</span></button></article>`;
}

export function renderDetachmentCard(entry) {
  return `<article class="detachment-card ${entry.faction === "Astra Militarum" ? "astra" : "chaos"}"><div class="card-topline"><span>${escapeHtml(entry.faction)}</span><span>10th Edition</span></div>${renderSourceVerificationBadge(entry.rulesSource.verificationState)}<h2>${escapeHtml(entry.name)}</h2><p class="detachment-style">${escapeHtml(entry.playstyle)}</p><p>${escapeHtml(entry.summary)}</p><button class="card-action" type="button" data-open-detachment="${escapeHtml(entry.id)}">Open detachment guide <span>→</span></button></article>`;
}

export function renderFactionRuleCard(guide) {
  return `<article class="faction-rule-card ${guide.faction === "Astra Militarum" ? "astra" : "chaos"}"><div class="card-topline"><span>${escapeHtml(guide.faction)}</span><span>Army rule</span></div>${renderSourceVerificationBadge(guide.source.verificationState)}<h3>${escapeHtml(guide.title)}</h3><p>${escapeHtml(guide.summary)}</p><div class="choice-preview">${guide.choices.map((choice) => `<span>${escapeHtml(choice.name)}</span>`).join("")}</div><button class="card-action" type="button" data-open-faction-rule="${escapeHtml(guide.id)}">Open faction guide <span>→</span></button></article>`;
}
