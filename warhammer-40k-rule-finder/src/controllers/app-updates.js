const readyMessage = "Update ready. Reload to use the latest rules and fixes.";

export function createAppUpdateController({
  serviceWorker,
  notice,
  message,
  updateButton,
  laterButton,
  reload,
  onUnavailable,
  serviceWorkerUrl = "./service-worker.js"
}) {
  let registration;
  let updateWorker;
  let dismissed = false;
  let applying = false;
  let reloadStarted = false;

  function setReadyState() {
    notice.dataset.updateState = "ready";
    message.textContent = readyMessage;
    updateButton.textContent = "Update now";
    updateButton.disabled = false;
    laterButton.disabled = false;
  }

  function showUpdate(nextRegistration, worker = nextRegistration?.waiting) {
    registration = nextRegistration ?? registration;
    updateWorker = worker ?? updateWorker;
    if (dismissed || applying || !updateWorker) return;
    setReadyState();
    notice.hidden = false;
  }

  function watchRegistration(nextRegistration) {
    registration = nextRegistration;
    if (registration.waiting && serviceWorker.controller) showUpdate(registration);
    registration.addEventListener("updatefound", () => {
      const worker = registration.installing;
      if (!worker) return;
      worker.addEventListener("statechange", () => {
        if (worker.state === "installed" && serviceWorker.controller) showUpdate(registration, worker);
      });
    });
  }

  function applyUpdate() {
    const waiting = registration?.waiting ?? updateWorker;
    if (!waiting || waiting.state === "redundant") {
      notice.hidden = true;
      onUnavailable("The pending update changed in another tab. Reload when convenient to check again.");
      return;
    }
    if (waiting.state === "activated") {
      reload();
      return;
    }
    applying = true;
    notice.dataset.updateState = "applying";
    message.textContent = "Applying update. Rule Finder will reload when it is ready.";
    updateButton.textContent = "Updating...";
    updateButton.disabled = true;
    laterButton.disabled = true;
    try {
      waiting.postMessage({ type: "SKIP_WAITING" });
    } catch {
      applying = false;
      notice.dataset.updateState = "error";
      message.textContent = "The update could not be applied. Try again or reload later.";
      updateButton.textContent = "Try update";
      updateButton.disabled = false;
      laterButton.disabled = false;
    }
  }

  function dismiss() {
    dismissed = true;
    notice.hidden = true;
  }

  async function start() {
    serviceWorker.addEventListener("controllerchange", () => {
      if (!applying || reloadStarted) return;
      reloadStarted = true;
      reload();
    });
    try {
      watchRegistration(await serviceWorker.register(serviceWorkerUrl));
    } catch {
      onUnavailable("Offline installation is unavailable. Keep this page online while using the app.");
    }
  }

  updateButton.addEventListener("click", applyUpdate);
  laterButton.addEventListener("click", dismiss);
  setReadyState();
  notice.hidden = true;

  return { showUpdate, start };
}
