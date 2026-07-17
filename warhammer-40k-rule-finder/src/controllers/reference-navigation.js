import { parseAppRoute } from "../lib/router.js";

const returnHashKey = "referenceReturnHash";

function currentHistoryState(history) {
  return history.state && typeof history.state === "object" ? history.state : {};
}

export function createReferenceNavigationController({ history, location, onNavigate }) {
  function open(targetHash) {
    const route = parseAppRoute(location.hash);
    const state = currentHistoryState(history);
    const returnHash = route.detailType ? state[returnHashKey] ?? `#${route.view}` : location.hash || "#home";
    const method = route.detailType ? "replaceState" : "pushState";
    history[method]({ ...state, [returnHashKey]: returnHash }, "", targetHash);
    onNavigate();
  }

  function close() {
    const route = parseAppRoute(location.hash);
    if (!route.detailType) return false;
    const returnHash = currentHistoryState(history)[returnHashKey];
    if (returnHash && returnHash !== location.hash) history.back();
    else location.hash = `#${route.view}`;
    return true;
  }

  return { close, open };
}
