import { ruleEntries } from "./data/rules.js";
import { scenarioCards } from "./data/scenarios.js";
import { coreStratagemTimings, defaultActiveGame } from "./data/active-game.js";
import { factionRuleGuides } from "./data/faction-rules.js";
import { datasheetExplainers } from "./data/datasheet-explainers.js";
import { globalSearchIndex } from "./data/search-index.js";
import { migrateRecentRoutes, resolveLegacyRoute } from "./data/legacy-content.js";
import {
  calculateArmourSave,
  calculateBlastBonus,
  calculateRapidFireAttacks,
  getEntryById,
  getRelatedEntries,
  searchRuleEntries,
  searchScenarioCards,
  searchDetachments,
  searchFactionRules,
  searchDatasheetExplainers,
  buildActiveGameReference,
  parseAppRoute,
  buildDetailHash
} from "./lib/rule-finder.js";
import { addGameReference, migrateGameReferences, moveGameReference, removeGameReference } from "./lib/game-reference.js";
import { buildRoundReminders } from "./lib/active-game.js";
import { addRecent, loadActiveGame, loadGameReferences, loadRecent, storageKeys, writeJson } from "./lib/storage.js";
import { findConfidentSearchMatch, searchCatalog } from "./lib/catalog-search.js";
import { escapeHtml } from "./lib/html.js";
import { createVoiceSearch, speechRecognitionConstructor } from "./lib/voice-search.js";
import { renderDatasheetCard, renderDetachmentCard, renderFactionRuleCard, renderRuleCard, renderScenarioCard } from "./views/cards.js";
import { buildGameReferenceView } from "./views/game-reference.js";
import { buildHomeSearchView } from "./views/home-search.js";
import { buildUnitDetailView } from "./views/unit-detail.js";
import { buildDatasheetDetailView, buildDetachmentDetailView, buildFactionRuleDetailView, buildRuleDetailView } from "./views/reference-details.js";
import { buildSourceVerificationKey } from "./views/source-verification.js";
import { createAppUpdateController } from "./controllers/app-updates.js";
import { createActiveGameController } from "./controllers/active-game.js";
import { createReferenceDialogController } from "./controllers/reference-dialog.js";
import { createSearchController } from "./controllers/search-state.js";
import { createUnitDirectoryController } from "./controllers/unit-directory.js";

const state = { filter: "all", detachmentFaction: "all", route: "home" };
const searchInput = document.querySelector("#rule-search");
const homeSearchInput = document.querySelector("#home-search");
const voiceButton = document.querySelector("#voice-search");
const voiceStatus = document.querySelector("#voice-status");
const resultGrid = document.querySelector("#rule-results");
const resultCount = document.querySelector("#result-count");
const resultsTitle = document.querySelector("#results-title");
const dialog = document.querySelector("#rule-dialog");
const dialogContent = document.querySelector("#dialog-content");
const referenceDialogController = createReferenceDialogController({
  dialog,
  closeButton: document.querySelector("#close-dialog"),
  body: document.body,
  onRequestClose: closeDetail,
  onClosed: () => {
    const route = parseAppRoute(location.hash);
    if (route.detailType) location.hash = `#${route.view}`;
  }
});
const searchController = createSearchController({
  headerInput: searchInput,
  homeInput: homeSearchInput,
  clearButton: document.querySelector("#clear-search"),
  onSearch: (_query, { source }) => {
    if (source !== homeSearchInput && parseAppRoute(location.hash).view !== "home") {
      location.hash = "#home";
      return;
    }
    void renderRouteSafely(state.route);
  }
});
const unitDirectoryController = createUnitDirectoryController({
  form: document.querySelector("#unit-directory-controls"),
  results: document.querySelector("#unit-directory-results"),
  count: document.querySelector("#unit-directory-count"),
  loadMore: document.querySelector("#unit-directory-load-more")
});
const quickQueries = ["Turn order", "Command Re-roll", "Fire Overwatch", "Fields of Fire", "Vehicle engaged", "Hazardous"];
const activeGame = loadActiveGame(localStorage, defaultActiveGame);
const activeGameController = createActiveGameController({
  state: activeGame,
  defaultState: defaultActiveGame,
  section: document.querySelector(".active-game-section"),
  appHeader: document.querySelector(".app-header"),
  form: document.querySelector("#active-game-controls"),
  toolbar: document.querySelector("#game-timing-toolbar"),
  timingSentinel: document.querySelector("#game-timing-sentinel"),
  timingControls: document.querySelector("#game-timing-controls"),
  timingToggle: document.querySelector("#game-timing-toggle"),
  timingCurrent: document.querySelector("#game-timing-current"),
  timingAction: document.querySelector("#game-timing-action"),
  roundSwitcher: document.querySelector("#battle-round-switcher"),
  roundCurrent: document.querySelector("#battle-round-current"),
  phaseSwitcher: document.querySelector("#phase-switcher"),
  turnSwitcher: document.querySelector("#turn-switcher"),
  nextStepButtons: document.querySelectorAll("[data-next-game-step]"),
  nextStepLabels: document.querySelectorAll("[data-next-game-label]"),
  summary: document.querySelector("#game-setup-summary"),
  resetButton: document.querySelector("#reset-active-game"),
  scrollTarget: window,
  mobileQuery: window.matchMedia("(max-width: 560px)"),
  requestFrame: window.requestAnimationFrame.bind(window),
  onChange: () => { saveActiveGame(); void renderActiveGame(); },
  onAnnounce: (message) => { document.querySelector("#route-status").textContent = message; }
});
let gameReferences = loadGameReferences(localStorage);
let recentReferences = migrateRecentRoutes(loadRecent(localStorage));
let detachmentEntries = [];
let unitDirectory = [];
let unitDirectoryMetadata = {};
let weaponProfiles = [];
let weaponProfileMap = new Map();
let unitNameMap = new Map();
let detachmentLoadPromise;
let unitLoadPromise;
let detachmentLoadAttempt = 0;
let unitLoadAttempt = 0;
let undoTimer;
let persistenceIsDurable = true;
let focusRouteOnChange = false;
let installPrompt;

function showAppStatus(message, { actionLabel = "", action = null } = {}) {
  const notice = document.querySelector("#app-status");
  const actionButton = document.querySelector("#app-status-action");
  notice.querySelector("span").textContent = message;
  actionButton.hidden = !actionLabel;
  actionButton.textContent = actionLabel;
  actionButton.onclick = action;
  notice.hidden = false;
}

function reportPersistenceFailure() {
  persistenceIsDurable = false;
  showAppStatus("Browser storage is unavailable. Changes are saved for this session only.");
}

function persist(key, value) {
  const saved = writeJson(localStorage, key, value);
  if (!saved) reportPersistenceFailure();
  return saved;
}

function migrateLoadedReferences() {
  const migrated = migrateGameReferences(gameReferences, { units: unitDirectory, detachments: detachmentEntries });
  if (JSON.stringify(migrated) === JSON.stringify(gameReferences)) return;
  gameReferences = migrated;
  saveGameReferences();
}

async function ensureDetachments() {
  const suffix = detachmentLoadAttempt ? `?retry=${detachmentLoadAttempt}` : "";
  if (!detachmentLoadPromise) detachmentLoadPromise = import(`./data/detachments.js${suffix}`)
    .then((module) => { detachmentEntries = module.detachmentEntries; migrateLoadedReferences(); })
    .catch((error) => { detachmentLoadPromise = undefined; detachmentLoadAttempt += 1; throw error; });
  await detachmentLoadPromise;
}

async function ensureUnits() {
  const suffix = unitLoadAttempt ? `?retry=${unitLoadAttempt}` : "";
  if (!unitLoadPromise) unitLoadPromise = import(`./data/unit-directory.js${suffix}`)
    .then((module) => {
      unitDirectory = module.unitDirectory;
      unitDirectoryMetadata = module.unitDirectoryMetadata;
      weaponProfiles = module.weaponProfiles;
      weaponProfileMap = new Map(weaponProfiles.map((weapon) => [weapon.id, weapon]));
      unitNameMap = new Map(unitDirectory.map((unit) => [unit.name, unit]));
      unitDirectoryController.setCatalog(unitDirectory, weaponProfiles, unitDirectoryMetadata.verificationState);
      migrateLoadedReferences();
    })
    .catch((error) => { unitLoadPromise = undefined; unitLoadAttempt += 1; throw error; });
  await unitLoadPromise;
}

function saveActiveGame() {
  return persist(storageKeys.activeGame, activeGame);
}

function saveGameReferences() {
  return persist(storageKeys.gameReferences, gameReferences);
}

function isGameReferenceSaved(type, id, parentId = null) {
  return gameReferences.some((item) => item.type === type && item.id === id && (item.parentId ?? null) === parentId);
}

function gameReferenceButton(type, id, parentId = "") {
  const saved = isGameReferenceSaved(type, id, parentId || null);
  const savedLabel = persistenceIsDurable ? "Saved to Game" : "Saved for this session";
  return `<button class="save-reference${saved ? " saved" : ""}" type="button" data-save-reference="${escapeHtml(type)}" data-reference-id="${escapeHtml(id)}" data-parent-id="${escapeHtml(parentId)}">${saved ? savedLabel : "Save to Game"}</button>`;
}

function recordRecent(item) {
  recentReferences = addRecent(recentReferences, item);
  persist(storageKeys.recent, recentReferences);
  renderRecent();
}

function renderRecent() {
  const container = document.querySelector("#recent-results");
  if (!container) return;
  container.innerHTML = recentReferences.length ? recentReferences.map((entry) => `<button type="button" data-deep-link="${escapeHtml(entry.hash)}"><strong>${escapeHtml(entry.title)}</strong><span>${escapeHtml(entry.subtitle)}</span></button>`).join("") : `<p class="empty-copy">Opened rules, units, and detachments will appear here.</p>`;
}

function offerUndo(message, restore) {
  const notice = document.querySelector("#undo-notice");
  notice.querySelector("span").textContent = message;
  notice.hidden = false;
  clearTimeout(undoTimer);
  document.querySelector("#undo-action").onclick = () => { restore(); notice.hidden = true; clearTimeout(undoTimer); };
  undoTimer = setTimeout(() => { notice.hidden = true; }, 8000);
}

function renderGlobalSearch() {
  const query = searchController.query.trim();
  const matches = searchCatalog(globalSearchIndex, query);
  document.querySelector("#search-status").textContent = query ? `${matches.length} current references match ${query}.` : "Search the current reference or open a table-side shortcut.";
  document.querySelector("#global-search-results").innerHTML = buildHomeSearchView(matches, query, gameReferences.length);
}

function renderRules() {
  const entries = searchRuleEntries(ruleEntries, "", state.filter);
  resultsTitle.textContent = "Browse 10th Edition concepts";
  resultCount.textContent = `${entries.length} ${entries.length === 1 ? "card" : "cards"}`;
  resultGrid.innerHTML = entries.length
    ? entries.map(renderRuleCard).join("")
    : `<div class="empty-state"><h3>No matching card yet</h3><p>Try Blast, cover, mortal wounds, Vehicle, or save.</p></div>`;
}

function renderQuickLinks() {
  document.querySelector("#quick-links").innerHTML = quickQueries
    .map((query) => `<button type="button" class="quick-link" data-query="${escapeHtml(query)}">${escapeHtml(query)} <span>→</span></button>`)
    .join("");
}

function renderScenarios() {
  const ruleMap = new Map(ruleEntries.map((entry) => [entry.id, entry]));
  const datasheetMap = new Map(datasheetExplainers.map((entry) => [entry.name, entry]));
  const cards = searchScenarioCards(scenarioCards, "", state.filter);
  document.querySelector("#scenario-results").innerHTML = cards.length
    ? cards
    .map((scenario) => renderScenarioCard(scenario, ruleMap, datasheetMap))
    .join("")
    : `<div class="empty-state"><h3>No roster situation matches this search</h3><p>Clear the search to browse the initial Astra Militarum versus Chaos roster.</p></div>`;
}

function renderDatasheets() {
  const entries = searchDatasheetExplainers(datasheetExplainers, "", state.filter);
  document.querySelector("#datasheet-count").textContent = `${entries.length} ${entries.length === 1 ? "unit" : "units"}`;
  document.querySelector("#datasheet-results").innerHTML = entries.length ? entries.map(renderDatasheetCard).join("") : `<div class="empty-state"><h3>No roster unit matches</h3><p>Try Leman Russ, Sentinel, Cultists, Rhino, or Terminators.</p></div>`;
}

async function renderUnitDirectory() {
  await ensureUnits();
  if (state.route !== "units") return;
  unitDirectoryController.render();
}

async function renderDetachments() {
  await ensureDetachments();
  if (state.route !== "detachments") return;
  const entries = searchDetachments(detachmentEntries, "", state.detachmentFaction);
  document.querySelector("#detachment-count").textContent = `${entries.length} ${entries.length === 1 ? "detachment" : "detachments"}`;
  document.querySelector("#detachment-results").innerHTML = entries.length
    ? entries.map(renderDetachmentCard).join("")
    : `<div class="empty-state"><h3>No matching detachment</h3><p>Clear the main search or choose both factions.</p></div>`;
}

function renderFactionRules() {
  const guides = searchFactionRules(factionRuleGuides, "", state.filter);
  document.querySelector("#faction-rule-count").textContent = `${guides.length} ${guides.length === 1 ? "guide" : "guides"}`;
  document.querySelector("#faction-rule-results").innerHTML = guides.length ? guides.map(renderFactionRuleCard).join("") : `<div class="empty-state"><h3>No faction rule matches</h3><p>Try Orders, Take Aim, Dark Pacts, Lethal Hits, or Sustained Hits.</p></div>`;
}

function renderActiveStratagem(item) {
  const factionGuide = item.faction === "Astra Militarum" ? "voice-of-command" : item.faction === "Chaos Space Marines" ? "dark-pacts" : null;
  const factionLink = factionGuide ? `<button type="button" data-open-faction-rule="${factionGuide}">Open ${escapeHtml(item.faction)} army rule</button>` : "";
  const [parentId, referenceId] = item.id.split(":");
  const save = item.source === "Core Stratagem" ? gameReferenceButton("rule", item.id) : gameReferenceButton("stratagem", referenceId, parentId);
  const detail = item.target ? `<p><b>Target</b>${escapeHtml(item.target)}</p><p><b>Effect</b>${escapeHtml(item.effect)}</p><p><b>Restrictions</b>${escapeHtml(item.restrictions)}</p>${factionLink}` : `<button type="button" data-open-rule="${escapeHtml(item.id)}">Open Core rule guide</button>`;
  const roundNotice = item.roundEligibility?.eligible === false ? `<p class="round-lock-notice"><b>Battle round</b>${escapeHtml(item.roundEligibility.reason)}</p>` : "";
  const roundSummary = item.roundEligibility?.eligible === false ? `<small class="round-lock-summary">${escapeHtml(item.roundEligibility.reason)}</small>` : "";
  return `<details class="active-stratagem"><summary><span><small>${escapeHtml(item.source)} · ${escapeHtml(item.faction)}</small><strong>${escapeHtml(item.name)}</strong>${roundSummary}</span><b>${item.cp}CP</b></summary><div>${save}${roundNotice}<p><b>When</b>${escapeHtml(item.timing)}</p>${detail}</div></details>`;
}

function renderRoundReminders() {
  const reminders = buildRoundReminders({ references: gameReferences, detachments: detachmentEntries, usedIds: activeGame.usedRoundReminders });
  const section = document.querySelector("#round-reminders");
  section.hidden = reminders.length === 0;
  document.querySelector("#round-reminder-round").textContent = String(activeGame.battleRound);
  document.querySelector("#round-reminder-count").textContent = `${reminders.filter((item) => item.used).length}/${reminders.length} used`;
  document.querySelector("#round-reminder-results").innerHTML = reminders.map((item) => `<article class="round-reminder${item.used ? " is-used" : ""}"><div><small>${escapeHtml(item.detachment)}</small><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.label)}</span></div><button type="button" data-round-reminder-id="${escapeHtml(item.id)}" aria-pressed="${item.used}">${item.used ? "Used · Undo" : "Mark used"}</button></article>`).join("");
}

async function renderGameReference() {
  if (gameReferences.some((item) => item.type === "unit")) await ensureUnits();
  if (gameReferences.some((item) => ["detachment", "enhancement", "stratagem"].includes(item.type))) await ensureDetachments();
  const view = buildGameReferenceView(gameReferences, { unitDirectory, datasheetExplainers, ruleEntries, factionRuleGuides, detachmentEntries, getRule: getEntryById, weaponProfileMap });
  document.querySelector(".game-reference").dataset.empty = String(view.count === 0);
  document.querySelector("#game-reference-count").textContent = `${view.count} saved`;
  document.querySelector("#clear-game-reference").disabled = view.count === 0;
  document.querySelector("#game-reference-results").innerHTML = view.html;
  renderRoundReminders();
}

async function renderActiveGame() {
  await ensureDetachments();
  activeGameController.initialise(detachmentEntries);
  if (state.route !== "active-game") return;
  activeGameController.sync();
  const reference = buildActiveGameReference({ detachments: detachmentEntries, coreStratagems: coreStratagemTimings, ...activeGame });
  document.querySelector("#active-now-count").textContent = `${reference.now.length} matches`;
  document.querySelector("#round-locked-count").textContent = `${reference.roundLocked.length} locked`;
  document.querySelector("#active-later-count").textContent = `${reference.later.length} later`;
  document.querySelector("#active-now").innerHTML = reference.now.length ? reference.now.map(renderActiveStratagem).join("") : `<div class="empty-state"><h3>No timing matches</h3><p>There are no Core or selected-detachment Stratagems matching this phase and active player.</p></div>`;
  document.querySelector("#round-locked-group").hidden = reference.roundLocked.length === 0;
  document.querySelector("#round-locked").innerHTML = reference.roundLocked.map(renderActiveStratagem).join("");
  document.querySelector("#active-later").innerHTML = reference.later.map(renderActiveStratagem).join("");
  await renderGameReference();
}

function focusDetachmentDetail(type, id) {
  if (!type || !id) return;
  const detail = [...dialogContent.querySelectorAll("details[data-reference-detail]")].find((candidate) => candidate.dataset.referenceType === type && (candidate.dataset.referenceId === id || candidate.dataset.referenceDetail === id));
  if (!detail) return;
  detail.open = true;
  detail.classList.add("deep-link-target");
  requestAnimationFrame(() => detail.scrollIntoView({ block: "center" }));
}

async function openDetachment(id, focusType = null, focusId = null) {
  await ensureDetachments();
  const entry = detachmentEntries.find((candidate) => candidate.id === id);
  if (!entry) return;
  const focusedItem = focusType === "enhancement" ? entry.enhancements.find((item) => item.id === focusId || item.name === focusId) : focusType === "stratagem" ? entry.stratagems.find((item) => item.id === focusId || item.name === focusId) : null;
  recordRecent(focusedItem ? { title: focusedItem.name, subtitle: `${entry.name} · ${focusType === "enhancement" ? "Enhancement" : "Stratagem"}`, hash: buildDetailHash("detachments", focusType, entry.id, focusedItem.id) } : { title: entry.name, subtitle: `${entry.faction} · Detachment`, hash: buildDetailHash("detachments", "detachment", entry.id) });
  dialogContent.innerHTML = buildDetachmentDetailView({
    entry,
    referenceButton: gameReferenceButton("detachment", entry.id),
    referenceButtonFor: gameReferenceButton
  });
  referenceDialogController.show();
  focusDetachmentDetail(focusType, focusedItem?.id ?? focusId);
}

function openFactionRule(id) {
  const guide = factionRuleGuides.find((candidate) => candidate.id === id);
  if (!guide) return;
  recordRecent({ title: guide.title, subtitle: `${guide.faction} · Army rule`, hash: buildDetailHash("rules", "faction-rule", guide.id) });
  dialogContent.innerHTML = buildFactionRuleDetailView({ guide, referenceButton: gameReferenceButton("faction-rule", guide.id) });
  referenceDialogController.show();
}

function openDatasheet(id) {
  const entry = datasheetExplainers.find((candidate) => candidate.id === id);
  if (!entry) return;
  recordRecent({ title: entry.name, subtitle: `${entry.faction} · Interaction guide`, hash: buildDetailHash("units", "datasheet", entry.id) });
  const related = entry.ruleIds.map((ruleId) => getEntryById(ruleEntries, ruleId)).filter(Boolean);
  dialogContent.innerHTML = buildDatasheetDetailView({ entry, related, referenceButton: gameReferenceButton("datasheet", entry.id) });
  referenceDialogController.show();
}

async function openUnit(id) {
  await ensureUnits();
  const unit = unitDirectory.find((candidate) => candidate.referenceId === id || candidate.id === id);
  if (!unit) return;
  recordRecent({ title: unit.name, subtitle: `${unit.faction} · ${unit.role}`, hash: buildDetailHash("units", "unit", unit.referenceId) });
  const weapons = unit.weaponProfileIds.map((weaponId) => weaponProfileMap.get(weaponId)).filter(Boolean);
  dialogContent.innerHTML = buildUnitDetailView({ unit, weapons, unitNameMap, metadata: unitDirectoryMetadata, referenceButton: gameReferenceButton("unit", unit.referenceId) });
  referenceDialogController.show();
}

function openRule(id) {
  const entry = getEntryById(ruleEntries, id);
  if (!entry) return;
  recordRecent({ title: entry.title, subtitle: entry.category, hash: buildDetailHash("rules", "rule", entry.id) });
  const related = getRelatedEntries(ruleEntries, entry);
  dialogContent.innerHTML = buildRuleDetailView({ entry, related, referenceButton: gameReferenceButton("rule", entry.id) });
  referenceDialogController.show();
}

async function renderRouteContent(view) {
  if (view === "home") { renderGlobalSearch(); renderRecent(); }
  if (view === "active-game") await renderActiveGame();
  if (view === "rules") { renderRules(); renderFactionRules(); }
  if (view === "detachments") await renderDetachments();
  if (view === "units") { renderDatasheets(); renderScenarios(); await renderUnitDirectory(); }
}

function renderRouteError(view) {
  const configurations = {
    units: { target: "#unit-directory-results", count: "#unit-directory-count", title: "Unit references unavailable", action: "Retry loading units" },
    detachments: { target: "#detachment-results", count: "#detachment-count", title: "Detachment references unavailable", action: "Retry loading detachments" },
    "active-game": { target: "#active-now", count: "#active-now-count", title: "Game references unavailable", action: "Retry loading game references" }
  };
  const configuration = configurations[view];
  if (!configuration) return;
  const target = document.querySelector(configuration.target);
  const count = document.querySelector(configuration.count);
  if (count) count.textContent = "Unavailable";
  target.innerHTML = `<div class="empty-state"><h3>${escapeHtml(configuration.title)}</h3><p>The reference data could not be loaded. Check the connection and try again.</p><button type="button" data-retry-route="${escapeHtml(view)}">${escapeHtml(configuration.action)}</button></div>`;
}

async function renderRouteSafely(view) {
  try {
    await renderRouteContent(view);
    return true;
  } catch {
    if (state.route === view) renderRouteError(view);
    return false;
  }
}

async function openRouteDetail(type, id, subId) {
  if (type === "rule") openRule(id);
  if (type === "faction-rule") openFactionRule(id);
  if (type === "detachment") await openDetachment(id);
  if (type === "enhancement" || type === "stratagem") await openDetachment(id, type, subId);
  if (type === "unit") await openUnit(id);
  if (type === "datasheet") openDatasheet(id);
}

async function applyRoute() {
  const legacyRoute = resolveLegacyRoute(location.hash);
  if (legacyRoute) {
    history.replaceState(null, "", legacyRoute.hash);
    showAppStatus(legacyRoute.message);
  }
  const requestedHash = location.hash;
  const route = parseAppRoute(location.hash);
  const viewChanged = state.route !== route.view;
  state.route = route.view;
  document.body.dataset.route = route.view;
  document.querySelectorAll("[data-view]").forEach((section) => section.classList.toggle("view-hidden", section.dataset.view !== route.view));
  document.querySelectorAll("[data-route-link]").forEach((link) => {
    const active = link.dataset.routeLink === route.view;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  const rendered = await renderRouteSafely(route.view);
  if (!rendered) return;
  if (location.hash !== requestedHash) return;
  if (route.detailType && route.detailId) await openRouteDetail(route.detailType, route.detailId, route.detailSubId);
  else if (dialog.open) referenceDialogController.close();
  const viewTitle = { home: "10th Edition Rule Finder", "active-game": "Active Game | 10th Edition Rule Finder", rules: "Rules | 10th Edition Rule Finder", detachments: "Detachments | 10th Edition Rule Finder", units: "Units | 10th Edition Rule Finder" }[route.view];
  document.title = viewTitle;
  if (viewChanged) document.querySelector("#route-status").textContent = `${route.view === "active-game" ? "Active Game" : route.view[0].toUpperCase() + route.view.slice(1)} view loaded.`;
  if (viewChanged && !route.detailType) {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (focusRouteOnChange) {
      const heading = document.querySelector(`[data-view="${route.view}"] h1, [data-view="${route.view}"] h2`);
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); heading.addEventListener("blur", () => heading.removeAttribute("tabindex"), { once: true }); }
    }
  }
  focusRouteOnChange = false;
}

function navigateDetail(view, type, id) {
  location.hash = buildDetailHash(view, type, id);
}

function closeDetail() {
  const route = parseAppRoute(location.hash);
  if (route.detailType) location.hash = `#${route.view}`;
  else referenceDialogController.close();
}

function bindCalculator(formId, handler) {
  const form = document.querySelector(formId);
  const output = form.querySelector("output");
  const update = () => {
    try {
      output.textContent = handler(new FormData(form));
      output.classList.remove("error");
    } catch (error) {
      output.textContent = error.message;
      output.classList.add("error");
    }
  };
  form.addEventListener("submit", (event) => { event.preventDefault(); update(); });
  update();
}

document.querySelector("#filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;
  state.filter = button.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach((candidate) => { const active = candidate === button; candidate.classList.toggle("active", active); candidate.setAttribute("aria-pressed", String(active)); });
  renderRules();
  renderFactionRules();
});

document.querySelector("#detachment-filters").addEventListener("click", (event) => {
  const button = event.target.closest("[data-detachment-faction]");
  if (!button) return;
  state.detachmentFaction = button.dataset.detachmentFaction;
  document.querySelectorAll("[data-detachment-faction]").forEach((candidate) => { const active = candidate === button; candidate.classList.toggle("active", active); candidate.setAttribute("aria-pressed", String(active)); });
  void renderRouteSafely("detachments");
});

document.addEventListener("click", (event) => {
  const routeLink = event.target.closest("[data-route-link], .app-brand");
  if (routeLink) {
    focusRouteOnChange = true;
    searchController.clear({ notify: false, focus: false });
    const targetView = routeLink.dataset.routeLink ?? "home";
    if (targetView === parseAppRoute(location.hash).view) void renderRouteSafely(targetView);
  }
  const saveReference = event.target.closest("[data-save-reference]");
  if (saveReference) {
    gameReferences = addGameReference(gameReferences, { type: saveReference.dataset.saveReference, id: saveReference.dataset.referenceId, parentId: saveReference.dataset.parentId || null });
    const persisted = saveGameReferences();
    saveReference.textContent = persisted ? "Saved to Game" : "Saved for this session";
    saveReference.classList.add("saved");
    if (state.route === "active-game") void renderGameReference();
  }
  const removeReference = event.target.closest("[data-remove-reference]");
  if (removeReference) {
    gameReferences = removeGameReference(gameReferences, removeReference.dataset.removeReference, removeReference.dataset.referenceId, removeReference.dataset.parentId || null);
    saveGameReferences(); void renderGameReference();
  }
  const moveReference = event.target.closest("[data-move-reference]");
  if (moveReference) {
    gameReferences = moveGameReference(gameReferences, moveReference.dataset.referenceType, moveReference.dataset.referenceId, moveReference.dataset.moveReference, moveReference.dataset.parentId || null);
    saveGameReferences(); void renderGameReference();
  }
  const roundReminder = event.target.closest("[data-round-reminder-id]");
  if (roundReminder) {
    const id = roundReminder.dataset.roundReminderId;
    const used = new Set(activeGame.usedRoundReminders);
    if (used.has(id)) used.delete(id);
    else used.add(id);
    activeGameController.replace({ usedRoundReminders: [...used] });
    saveActiveGame();
    renderRoundReminders();
    document.querySelector("#route-status").textContent = `${roundReminder.textContent.startsWith("Used") ? "Reminder available again" : "Reminder marked used"} for Battle Round ${activeGame.battleRound}.`;
  }
  const deepLink = event.target.closest("[data-deep-link]");
  if (deepLink) location.hash = deepLink.dataset.deepLink;
  const viewAll = event.target.closest("[data-view-all]");
  if (viewAll) {
    searchController.clear({ notify: false, focus: false });
    location.hash = `#${viewAll.dataset.viewAll}`;
  }
  const retryRoute = event.target.closest("[data-retry-route]");
  if (retryRoute) void renderRouteSafely(retryRoute.dataset.retryRoute);
  const ruleButton = event.target.closest("[data-open-rule]");
  if (ruleButton) navigateDetail("rules", "rule", ruleButton.dataset.openRule);
  const queryButton = event.target.closest("[data-query]");
  if (queryButton) {
    searchController.setQuery(queryButton.dataset.query, { source: queryButton });
  }
  const detachmentButton = event.target.closest("[data-open-detachment]");
  if (detachmentButton) navigateDetail("detachments", "detachment", detachmentButton.dataset.openDetachment);
  const factionRuleButton = event.target.closest("[data-open-faction-rule]");
  if (factionRuleButton) navigateDetail("rules", "faction-rule", factionRuleButton.dataset.openFactionRule);
  const datasheetButton = event.target.closest("[data-open-datasheet]");
  if (datasheetButton) navigateDetail("units", "datasheet", datasheetButton.dataset.openDatasheet);
  const unitButton = event.target.closest("[data-open-unit]");
  if (unitButton) navigateDetail("units", "unit", unitButton.dataset.openUnit);
});

const voiceSearch = createVoiceSearch({
  Recognition: speechRecognitionConstructor(window),
  onTranscript: (transcript) => {
    searchController.setQuery(transcript, { notify: false });
    const match = findConfidentSearchMatch(globalSearchIndex, transcript);
    if (match) {
      voiceStatus.textContent = `Opening ${match.title}.`;
      if (location.hash === match.hash) void applyRoute();
      else location.hash = match.hash;
      return;
    }
    voiceStatus.textContent = `Searching for ${transcript}.`;
    searchController.setQuery(transcript, { source: voiceButton });
    searchInput.focus();
  },
  onListening: (listening) => {
    voiceButton.setAttribute("aria-pressed", String(listening));
    voiceButton.textContent = listening ? "Stop" : "Speak";
    voiceStatus.textContent = listening ? "Listening for a rule, unit, or detachment." : "Voice search stopped.";
  },
  onError: (message) => {
    voiceStatus.textContent = message;
    showAppStatus(message);
  }
});
if (voiceSearch.supported) {
  voiceButton.hidden = false;
  voiceButton.addEventListener("click", () => {
    try {
      if (voiceButton.getAttribute("aria-pressed") === "true") voiceSearch.stop();
      else voiceSearch.start();
    } catch {
      showAppStatus("Voice search could not start. Check microphone access and try again.");
    }
  });
}
document.querySelector("#clear-recent").addEventListener("click", () => { recentReferences = []; persist(storageKeys.recent, recentReferences); renderRecent(); });
document.querySelector("#clear-game-reference").addEventListener("click", () => {
  if (!gameReferences.length) return;
  const previous = gameReferences;
  gameReferences = []; saveGameReferences(); void renderGameReference();
  offerUndo("Game references cleared.", () => { gameReferences = previous; saveGameReferences(); void renderGameReference(); });
});
document.querySelector("#start-new-game").addEventListener("click", () => {
  const previousGame = { ...activeGame };
  const previousReferences = gameReferences;
  activeGameController.replace(defaultActiveGame);
  gameReferences = [];
  saveActiveGame(); saveGameReferences(); void renderActiveGame();
  offerUndo("New game started.", () => {
    activeGameController.replace(previousGame); gameReferences = previousReferences;
    saveActiveGame(); saveGameReferences(); void renderActiveGame();
  });
});
window.addEventListener("hashchange", () => { void applyRoute(); });
document.querySelector("#dismiss-app-status").addEventListener("click", () => { document.querySelector("#app-status").hidden = true; });

const installCard = document.querySelector("#install-card");
const installButton = document.querySelector("#install-app");
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches;

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  if (isStandalone()) return;
  installPrompt = event;
  installCard.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!installPrompt) return;
  const prompt = installPrompt;
  installPrompt = undefined;
  installButton.disabled = true;
  try {
    await prompt.prompt();
    const choice = await prompt.userChoice;
    installCard.hidden = true;
    if (choice?.outcome === "dismissed") {
      showAppStatus("Installation was cancelled. You can install later from your browser menu.");
    }
  } catch {
    installCard.hidden = true;
    showAppStatus("Installation could not start. Try Install app from your browser menu.");
  } finally {
    installButton.disabled = false;
  }
});

window.addEventListener("appinstalled", () => {
  installPrompt = undefined;
  installCard.hidden = true;
  showAppStatus("Rule Finder is installed and ready for table-side use.");
});

bindCalculator("#blast-calculator", (data) => {
  const models = data.get("modelCount");
  const bonus = calculateBlastBonus(models);
  return `${models} models → +${bonus} ${bonus === 1 ? "attack" : "attacks"}.`;
});
bindCalculator("#rapid-fire-calculator", (data) => {
  const attacks = calculateRapidFireAttacks(data.get("baseAttacks"), data.get("rapidFireValue"), data.get("halfRange") === "on");
  return `Final attacks: ${attacks}.`;
});
bindCalculator("#save-calculator", (data) => {
  const result = calculateArmourSave({
    baseSave: data.get("baseSave"),
    armourPenetration: data.get("ap"),
    hasCover: data.get("cover") === "on",
    ignoresCover: data.get("ignoresCover") === "on"
  });
  return `Armour save: ${result.display}. ${result.note}`;
});

renderQuickLinks();
document.querySelector("#source-verification-key").innerHTML = buildSourceVerificationKey();
if (!location.hash) history.replaceState(null, "", "#home");
void applyRoute();
if ("serviceWorker" in navigator) {
  const appUpdates = createAppUpdateController({
    serviceWorker: navigator.serviceWorker,
    notice: document.querySelector("#update-notice"),
    message: document.querySelector("#update-notice-message"),
    updateButton: document.querySelector("#refresh-app"),
    laterButton: document.querySelector("#dismiss-update"),
    reload: () => location.reload(),
    onUnavailable: showAppStatus
  });
  void appUpdates.start();
} else {
  showAppStatus("Offline installation is not supported by this browser. Keep this page online while using the app.");
}
