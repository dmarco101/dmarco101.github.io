import { escapeHtml, list } from "../lib/html.js";
import { renderSourceVerificationCallout } from "./source-verification.js";

export function buildDetachmentDetailView({ entry, referenceButton, referenceButtonFor }) {
  return `
    <p class="eyebrow">${escapeHtml(entry.faction)} · ${escapeHtml(entry.edition)}</p>
    <h2>${escapeHtml(entry.name)}</h2>
    <div class="dialog-toolbar">${referenceButton}</div>
    <p class="dialog-summary">${escapeHtml(entry.summary)}</p>
    <section><h3>Battlefield identity</h3><p>${escapeHtml(entry.playstyle)}</p></section>
    <section><h3>Detachment rule</h3><p><strong>${escapeHtml(entry.ruleName)}</strong></p><button type="button" data-open-faction-rule="${entry.faction === "Astra Militarum" ? "voice-of-command" : "dark-pacts"}">Open faction army rule</button></section>
    <section><div class="dialog-list-heading"><h3>Enhancements</h3><span>4 options</span></div><div class="rule-details-list">${entry.enhancements.map((item) => `
      <details class="rule-detail" data-reference-type="enhancement" data-reference-id="${escapeHtml(item.id)}" data-reference-detail="${escapeHtml(item.name)}"><summary><strong>${escapeHtml(item.name)}</strong><span>${item.points} pts</span></summary><div class="rule-detail-body">
        ${referenceButtonFor("enhancement", item.id, entry.id)}<p><b>Eligibility</b>${escapeHtml(item.eligibility)}</p><p><b>Effect</b>${escapeHtml(item.effect)}</p><p><b>Restrictions</b>${escapeHtml(item.restrictions)}</p>
        <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer">Open archived source</a>
      </div></details>`).join("")}</div></section>
    <section><div class="dialog-list-heading"><h3>Stratagems</h3><span>6 options</span></div><div class="rule-details-list">${entry.stratagems.map((item) => `
      <details class="rule-detail" data-reference-type="stratagem" data-reference-id="${escapeHtml(item.id)}" data-reference-detail="${escapeHtml(item.name)}"><summary><strong>${escapeHtml(item.name)}</strong><span>${item.cp}CP · ${escapeHtml(item.type)}</span></summary><div class="rule-detail-body">
        ${referenceButtonFor("stratagem", item.id, entry.id)}<p><b>When</b>${escapeHtml(item.timing)}</p><p><b>Target</b>${escapeHtml(item.target)}</p><p><b>Effect</b>${escapeHtml(item.effect)}</p><p><b>Restrictions</b>${escapeHtml(item.restrictions)}</p>
        <a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noreferrer">Open archived source</a>
      </div></details>`).join("")}</div></section>
    ${renderSourceVerificationCallout({
      verificationState: entry.rulesSource.verificationState,
      sourceLabel: entry.rulesSource.label,
      sourceVersion: entry.rulesSource.version,
      links: [
        { label: "Open archived transcription", href: entry.rulesSource.url },
        { label: "Open official detachment preview", href: entry.source.url }
      ],
      note: "Enhancement and Stratagem summaries are structured from the archived source and checked against available official material. Confirm edge cases against your table's final references."
    })}`;
}

export function buildFactionRuleDetailView({ guide, referenceButton }) {
  return `
    <p class="eyebrow">${escapeHtml(guide.faction)} · Army rule</p>
    <h2>${escapeHtml(guide.title)}</h2>
    <div class="dialog-toolbar">${referenceButton}</div>
    <p class="dialog-summary">${escapeHtml(guide.summary)}</p>
    ${renderSourceVerificationCallout({
      verificationState: guide.source.verificationState,
      sourceLabel: guide.source.label,
      sourceVersion: guide.source.version,
      links: [
        { label: "Open official downloads", href: guide.source.officialUrl },
        { label: "Open archived 10th Edition reference", href: guide.source.archiveUrl }
      ]
    })}
    <section><h3>When to use it</h3>${list(guide.timing)}</section>
    <section><h3>Eligibility</h3>${list(guide.eligibility)}</section>
    <section class="dice-section"><h3>Resolution sequence</h3><ol>${guide.sequence.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></section>
    <section><div class="dialog-list-heading"><h3>${guide.id === "voice-of-command" ? "Orders" : "Choices"}</h3><span>${guide.choices.length} options</span></div><div class="rule-details-list">${guide.choices.map((choice) => `
      <details class="rule-detail"><summary><strong>${escapeHtml(choice.name)}</strong><span>${escapeHtml(choice.shorthand)}</span></summary><div class="rule-detail-body"><p><b>Effect</b>${escapeHtml(choice.effect)}</p><p><b>Check</b>${escapeHtml(choice.check)}</p></div></details>`).join("")}</div></section>
    <section><h3>Restrictions</h3>${list(guide.restrictions)}</section>
    <section><h3>Common mistakes</h3>${list(guide.commonMistakes)}</section>`;
}

export function buildDatasheetDetailView({ entry, related, referenceButton }) {
  return `
    <p class="eyebrow">${escapeHtml(entry.faction)} · ${escapeHtml(entry.type)}</p>
    <h2>${escapeHtml(entry.name)}</h2>
    <div class="dialog-toolbar">${referenceButton}</div>
    <p class="dialog-summary">${escapeHtml(entry.identity)}</p>
    <div class="timing-warning"><strong>Confirm the exact datasheet.</strong> ${escapeHtml(entry.variantNote)}</div>
    ${renderSourceVerificationCallout({
      verificationState: entry.source.verificationState,
      sourceLabel: entry.source.label,
      sourceVersion: entry.source.version,
      links: [{ label: "Open archived unit reference", href: entry.source.url }]
    })}
    <section><h3>Keywords that drive interactions</h3><div class="tag-row">${entry.keywords.map((keyword) => `<span>${escapeHtml(keyword)}</span>`).join("")}</div></section>
    <section><h3>Confirm before the game</h3>${list(entry.beforeGame)}</section>
    <section class="dice-section"><h3>Check during the game</h3>${list(entry.duringGame)}</section>
    <section><h3>Common mistakes</h3>${list(entry.mistakes)}</section>
    <section><h3>Related rules</h3><div class="related-row">${related.map((rule) => `<button type="button" data-open-rule="${escapeHtml(rule.id)}">${escapeHtml(rule.title)}</button>`).join("")}</div></section>`;
}

export function buildRuleDetailView({ entry, related, referenceButton }) {
  return `
    <p class="eyebrow">${escapeHtml(entry.category)}</p>
    <h2>${escapeHtml(entry.title)}</h2>
    <div class="dialog-toolbar">${referenceButton}</div>
    <p class="dialog-summary">${escapeHtml(entry.plainEnglish)}</p>
    ${renderSourceVerificationCallout({
      verificationState: entry.source.verificationState,
      sourceLabel: entry.source.label,
      sourceVersion: entry.source.version,
      links: [{ label: "Open official source", href: entry.source.url }]
    })}
    <section><h3>When to check it</h3>${list(entry.whenToCheck)}</section>
    <section class="dice-section"><h3>What changes at the table</h3>${list(entry.diceImpact)}</section>
    <section><h3>What it does not change</h3>${list(entry.doesNotChange)}</section>
    <section><h3>Common mistake</h3>${list(entry.commonMistakes)}</section>
    <section><h3>Example</h3><p>${escapeHtml(entry.example)}</p></section>
    <section><h3>Related rules</h3><div class="related-row">${related.map((item) => `<button type="button" data-open-rule="${escapeHtml(item.id)}">${escapeHtml(item.title)}</button>`).join("")}</div></section>`;
}
