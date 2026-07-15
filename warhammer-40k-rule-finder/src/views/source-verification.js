import { escapeHtml } from "../lib/html.js";
import { getSourceVerificationState, sourceVerificationStates } from "../lib/source-verification.js";

export function renderSourceVerificationBadge(value, { compact = true } = {}) {
  const state = getSourceVerificationState(value);
  const label = compact ? state.shortLabel : state.label;
  return `<span class="source-state source-state--${escapeHtml(state.tone)}" data-source-state="${escapeHtml(state.key)}" aria-label="${escapeHtml(`${state.label}. ${state.description}`)}">${escapeHtml(label)}</span>`;
}

export function renderSourceVerificationCallout({ verificationState, sourceLabel, sourceVersion, sourceDate = "", links = [], note = "" }) {
  const state = getSourceVerificationState(verificationState);
  const safeLinks = links.filter((link) => link?.href && link?.label);
  return `<div class="source-callout source-callout--${escapeHtml(state.tone)}" data-source-state="${escapeHtml(state.key)}">
    <div class="source-callout-heading">${renderSourceVerificationBadge(state.key, { compact: false })}</div>
    <p>${escapeHtml(state.description)}</p>
    <p class="source-reference"><b>Reference</b><span>${escapeHtml(sourceLabel || "Source not recorded")}</span>${sourceVersion ? `<small>${escapeHtml(sourceVersion)}</small>` : ""}${sourceDate ? `<small>Archive date: ${escapeHtml(sourceDate)}</small>` : ""}</p>
    ${safeLinks.length ? `<div class="source-links">${safeLinks.map((link) => `<a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`).join("")}</div>` : ""}
    <small class="source-guidance">${escapeHtml(note || state.guidance)}</small>
  </div>`;
}

export function buildSourceVerificationKey() {
  const states = [
    sourceVerificationStates["official-publication"],
    sourceVerificationStates["cross-checked-transcription"],
    sourceVerificationStates["integrity-checked-import"],
    sourceVerificationStates["archived-reference"]
  ];
  return states.map((state) => `<div><dt>${renderSourceVerificationBadge(state.key, { compact: false })}</dt><dd>${escapeHtml(state.description)}</dd></div>`).join("");
}
