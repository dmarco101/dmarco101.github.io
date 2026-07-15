import { escapeHtml } from "../lib/html.js";

const groups = [
  { type: "rule", title: "Rules", targetView: "rules" },
  { type: "unit", title: "Units", targetView: "units" },
  { type: "detachment", title: "Detachments", targetView: "detachments" },
  { type: "enhancement", title: "Enhancements", targetView: "detachments" },
  { type: "stratagem", title: "Stratagems", targetView: "detachments" }
];

function resultGroup({ title, targetView }, entries) {
  const viewAll = entries.length > 4 ? `<button class="view-all-results" type="button" data-view-all="${escapeHtml(targetView)}">View all ${entries.length} ${escapeHtml(title)}</button>` : "";
  return `<section class="search-result-group"><div class="panel-heading"><h2>${escapeHtml(title)}</h2><span>${entries.length}</span></div><div class="reference-list">${entries.slice(0, 4).map((entry) => `<button type="button" data-deep-link="${escapeHtml(entry.hash)}"><strong>${escapeHtml(entry.title)}</strong><span>${escapeHtml(entry.subtitle)}</span></button>`).join("")}${viewAll}</div></section>`;
}

export function buildHomeSearchView(matches, query, savedCount = 0) {
  if (!query.trim()) return `
    <section class="search-start">
      <p class="eyebrow">Table-side shortcuts</p>
      <h2>${savedCount ? `Continue with ${savedCount} saved ${savedCount === 1 ? "reference" : "references"}` : "Ready when you are"}</h2>
      <p>Search the current rules, units, detachments, Enhancements, and Stratagems, or jump straight into your game.</p>
      <div class="search-start-actions"><button type="button" data-view-all="active-game">Open Active Game</button><button class="ghost" type="button" data-view-all="rules">Browse rules</button><button class="ghost" type="button" data-view-all="units">Browse units</button></div>
    </section>`;
  const visibleGroups = groups.map((group) => ({ group, entries: matches.filter((entry) => entry.type === group.type) })).filter(({ entries }) => entries.length);
  if (!visibleGroups.length) return `<div class="empty-state search-empty"><h2>No current reference matches</h2><p>Try a shorter rule name, unit name, detachment, or common term such as cover or charge.</p></div>`;
  return visibleGroups.map(({ group, entries }) => resultGroup(group, entries)).join("");
}
