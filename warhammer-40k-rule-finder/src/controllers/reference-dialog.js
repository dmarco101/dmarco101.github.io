export function createReferenceDialogController({ dialog, closeButton, body, onRequestClose, onClosed }) {
  const lockPage = () => body.classList.add("dialog-open");
  const unlockPage = () => body.classList.remove("dialog-open");

  function show() {
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    lockPage();
  }

  function close() {
    if (dialog.open) dialog.close();
    else unlockPage();
  }

  closeButton.addEventListener("click", onRequestClose);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) onRequestClose();
  });
  dialog.addEventListener("close", () => {
    unlockPage();
    onClosed();
  });

  return { close, show };
}
