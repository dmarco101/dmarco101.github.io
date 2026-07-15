export function createSearchController({ headerInput, homeInput, clearButton, onSearch }) {
  const inputs = [headerInput, homeInput].filter(Boolean);
  let query = "";

  function sync(value) {
    query = String(value ?? "");
    inputs.forEach((input) => {
      if (input.value !== query) input.value = query;
    });
    clearButton.hidden = !query;
    clearButton.disabled = !query;
  }

  function setQuery(value, { source = null, notify = true, focus = false } = {}) {
    sync(value);
    if (notify) onSearch(query, { source });
    if (focus) headerInput?.focus();
    return query;
  }

  function clear({ notify = true, focus = true } = {}) {
    return setQuery("", { source: clearButton, notify, focus });
  }

  inputs.forEach((input) => {
    input.addEventListener("input", () => setQuery(input.value, { source: input }));
  });
  clearButton.addEventListener("click", () => clear());
  sync("");

  return {
    clear,
    get query() { return query; },
    setQuery
  };
}
