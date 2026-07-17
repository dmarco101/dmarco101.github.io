import { escapeHtml } from "../lib/html.js";
import { activeGameTimingLabel, advanceActiveGame, describeNextActiveGameStep, setActiveGameRound } from "../lib/active-game.js";

export function createActiveGameController({
  state,
  defaultState,
  section,
  appHeader,
  form,
  toolbar,
  timingSentinel,
  timingControls,
  timingToggle,
  timingCurrent,
  timingAction,
  roundSwitcher,
  roundCurrent,
  phaseSwitcher,
  turnSwitcher,
  nextStepButtons,
  nextStepLabels,
  summary,
  resetButton,
  scrollTarget,
  mobileQuery,
  requestFrame,
  onChange,
  onAnnounce = () => {}
}) {
  let initialised = false;
  let compact = false;
  let stuck = false;
  let framePending = false;

  function currentTimingLabel() {
    return activeGameTimingLabel(state);
  }

  function syncNextStep() {
    const nextLabel = describeNextActiveGameStep(state);
    nextStepLabels.forEach((label) => { label.textContent = nextLabel; });
    nextStepButtons.forEach((button) => button.setAttribute("aria-label", `Advance game to ${nextLabel}`));
  }

  function applyToolbarState(headerBottom = appHeader.getBoundingClientRect().bottom) {
    toolbar.classList.toggle("is-stuck", stuck);
    toolbar.classList.toggle("is-compact", compact);
    timingControls.hidden = compact;
    timingCurrent.textContent = currentTimingLabel();
    syncNextStep();
    timingAction.textContent = compact ? "Change" : "Done";
    timingToggle.setAttribute("aria-expanded", String(!compact));
    timingToggle.setAttribute("aria-label", `${currentTimingLabel()}. ${compact ? "Change timing" : "Hide timing controls"}`);
    const contentTop = stuck ? toolbar.getBoundingClientRect().bottom + 8 : headerBottom + 8;
    section.style.setProperty("--active-game-sticky-top", `${Math.ceil(contentTop)}px`);
  }

  function updateStickyState() {
    if (!mobileQuery.matches) {
      stuck = false;
      compact = false;
      toolbar.classList.remove("is-stuck", "is-compact");
      timingControls.hidden = false;
      section.style.removeProperty("--active-game-sticky-top");
      return;
    }
    const headerBottom = appHeader.getBoundingClientRect().bottom;
    const nextStuck = timingSentinel.getBoundingClientRect().top <= headerBottom + 2;
    if (nextStuck !== stuck) {
      stuck = nextStuck;
      compact = nextStuck;
    }
    applyToolbarState(headerBottom);
  }

  function scheduleStickySync() {
    if (framePending) return;
    framePending = true;
    requestFrame(() => {
      framePending = false;
      updateStickyState();
    });
  }

  function sync() {
    if (!initialised) return;
    form.elements.astraDetachmentId.value = state.astraDetachmentId;
    form.elements.chaosDetachmentId.value = state.chaosDetachmentId;
    form.elements.firstFaction.value = state.firstFaction;
    roundCurrent.textContent = String(state.battleRound);
    roundSwitcher.querySelectorAll("[data-battle-round-change]").forEach((button) => {
      button.disabled = button.dataset.battleRoundChange === "-1" && state.battleRound === 1;
    });
    phaseSwitcher.querySelectorAll("[data-game-phase]").forEach((button) => {
      const active = button.dataset.gamePhase === state.phase;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    turnSwitcher.querySelectorAll("[data-active-faction]").forEach((button) => {
      const active = button.dataset.activeFaction === state.activeFaction;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const astraName = form.elements.astraDetachmentId.selectedOptions[0]?.textContent ?? "Astra";
    const chaosName = form.elements.chaosDetachmentId.selectedOptions[0]?.textContent ?? "Chaos";
    summary.textContent = `${astraName} · ${chaosName}`;
    timingCurrent.textContent = currentTimingLabel();
    syncNextStep();
    updateStickyState();
  }

  function commit() {
    sync();
    onChange();
  }

  function replace(nextState, { notify = false } = {}) {
    Object.assign(state, nextState);
    sync();
    if (notify) onChange();
  }

  function initialise(detachments) {
    if (initialised) return;
    const astra = detachments.filter((entry) => entry.faction === "Astra Militarum");
    const chaos = detachments.filter((entry) => entry.faction === "Chaos Space Marines");
    form.elements.astraDetachmentId.innerHTML = astra.map((entry) => `<option value="${entry.id}">${escapeHtml(entry.name)}</option>`).join("");
    form.elements.chaosDetachmentId.innerHTML = chaos.map((entry) => `<option value="${entry.id}">${escapeHtml(entry.name)}</option>`).join("");
    initialised = true;

    form.addEventListener("change", () => {
      const previousFirstFaction = state.firstFaction;
      state.astraDetachmentId = form.elements.astraDetachmentId.value;
      state.chaosDetachmentId = form.elements.chaosDetachmentId.value;
      state.firstFaction = form.elements.firstFaction.value;
      if (state.firstFaction !== previousFirstFaction && state.battleRound === 1 && state.phase === "Command" && state.activeFaction === previousFirstFaction) {
        state.activeFaction = state.firstFaction;
      }
      commit();
    });
    roundSwitcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-battle-round-change]");
      if (!button) return;
      const next = setActiveGameRound(state, state.battleRound + Number(button.dataset.battleRoundChange));
      if (next === state) return;
      Object.assign(state, next);
      commit();
      onAnnounce(`${currentTimingLabel()}. Round reminders reset.`);
    });
    phaseSwitcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-game-phase]");
      if (!button) return;
      state.phase = button.dataset.gamePhase;
      commit();
    });
    turnSwitcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-active-faction]");
      if (!button) return;
      state.activeFaction = button.dataset.activeFaction;
      commit();
    });
    nextStepButtons.forEach((button) => button.addEventListener("click", () => {
      Object.assign(state, advanceActiveGame(state));
      commit();
      onAnnounce(`${currentTimingLabel()}.`);
    }));
    timingToggle.addEventListener("click", () => {
      if (!stuck) return;
      compact = !compact;
      applyToolbarState();
    });
    resetButton.addEventListener("click", () => replace(defaultState, { notify: true }));
    scrollTarget.addEventListener("scroll", scheduleStickySync, { passive: true });
    scrollTarget.addEventListener("resize", scheduleStickySync);
    if (mobileQuery.addEventListener) mobileQuery.addEventListener("change", scheduleStickySync);
    else mobileQuery.addListener?.(scheduleStickySync);
    sync();
  }

  return { initialise, replace, sync };
}
