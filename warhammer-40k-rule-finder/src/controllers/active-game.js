import { escapeHtml } from "../lib/html.js";

export function createActiveGameController({
  state,
  defaultState,
  form,
  phaseSwitcher,
  turnSwitcher,
  summary,
  resetButton,
  onChange
}) {
  let initialised = false;

  function sync() {
    if (!initialised) return;
    form.elements.astraDetachmentId.value = state.astraDetachmentId;
    form.elements.chaosDetachmentId.value = state.chaosDetachmentId;
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
      state.astraDetachmentId = form.elements.astraDetachmentId.value;
      state.chaosDetachmentId = form.elements.chaosDetachmentId.value;
      commit();
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
    resetButton.addEventListener("click", () => replace(defaultState, { notify: true }));
    sync();
  }

  return { initialise, replace, sync };
}
