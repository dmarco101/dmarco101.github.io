import { searchUnitDirectory } from "../lib/rule-finder.js";
import { escapeHtml } from "../lib/html.js";
import { renderUnitCard } from "../views/cards.js";

export const UNIT_DIRECTORY_BATCH_SIZE = 12;

export function buildUnitDirectoryPage(entries, visibleLimit = UNIT_DIRECTORY_BATCH_SIZE, batchSize = UNIT_DIRECTORY_BATCH_SIZE) {
  const safeLimit = Number.isInteger(visibleLimit) && visibleLimit > 0 ? visibleLimit : batchSize;
  const visibleEntries = entries.slice(0, safeLimit);
  const remaining = Math.max(0, entries.length - visibleEntries.length);
  return {
    visibleEntries,
    shown: visibleEntries.length,
    total: entries.length,
    remaining,
    nextCount: Math.min(batchSize, remaining)
  };
}

function countLabel({ shown, total }) {
  if (total === 0) return "0 units";
  const noun = total === 1 ? "unit" : "units";
  return shown < total ? `Showing ${shown} of ${total} ${noun}` : `${total} ${noun}`;
}

export function createUnitDirectoryController({ form, results, count, loadMore, batchSize = UNIT_DIRECTORY_BATCH_SIZE }) {
  let units = [];
  let weaponProfiles = [];
  let visibleLimit = batchSize;
  let verificationState = "review-needed";
  let ready = false;

  const resetWindow = () => {
    visibleLimit = batchSize;
    render();
  };

  function render() {
    if (!ready) return;
    const matches = searchUnitDirectory(units, weaponProfiles, {
      query: form.elements.query.value,
      faction: form.elements.faction.value,
      role: form.elements.role.value
    });
    const page = buildUnitDirectoryPage(matches, visibleLimit, batchSize);
    count.textContent = countLabel(page);
    results.innerHTML = page.total
      ? page.visibleEntries.map((unit) => renderUnitCard(unit, verificationState)).join("")
      : `<div class="empty-state"><h3>No unit matches</h3><p>Try a shorter unit or weapon name, or broaden the faction and role filters.</p></div>`;
    loadMore.hidden = page.remaining === 0;
    if (page.remaining > 0) loadMore.textContent = `Load ${page.nextCount} more ${page.nextCount === 1 ? "unit" : "units"}`;
  }

  form.elements.query.addEventListener("input", resetWindow);
  form.elements.faction.addEventListener("change", resetWindow);
  form.elements.role.addEventListener("change", resetWindow);
  loadMore.addEventListener("click", () => {
    visibleLimit += batchSize;
    render();
  });

  return {
    setCatalog(nextUnits, nextWeaponProfiles, nextVerificationState = "review-needed") {
      units = nextUnits;
      weaponProfiles = nextWeaponProfiles;
      verificationState = nextVerificationState;
      ready = true;
      const selectedRole = form.elements.role.value;
      const roles = [...new Set(units.map((unit) => unit.role))].sort();
      form.elements.role.innerHTML = `<option value="all">All roles</option>${roles.map((role) => `<option>${escapeHtml(role)}</option>`).join("")}`;
      form.elements.role.value = roles.includes(selectedRole) ? selectedRole : "all";
    },
    render
  };
}
