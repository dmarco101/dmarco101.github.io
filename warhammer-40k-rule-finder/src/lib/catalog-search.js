import { getSearchIntent, matchesSearchQuery } from "./search-query.js";

export function searchCatalog(entries, query = "") {
  const intent = getSearchIntent(query);
  if (intent.rawTokens.length === 0) return entries;
  return entries.filter((entry) => matchesSearchQuery(query, entry.search)).map((entry, index) => {
    const title = getSearchIntent(entry.title).phrase;
    const aliases = (entry.aliases ?? []).map((alias) => getSearchIntent(alias).phrase);
    const score = title === intent.phrase ? 0
      : aliases.includes(intent.phrase) ? 1
        : title.startsWith(intent.phrase) ? 2
          : aliases.some((alias) => alias.startsWith(intent.phrase)) ? 3
            : matchesSearchQuery(query, entry.title) ? 4 : 5;
    return { entry, index, score };
  }).sort((left, right) => left.score - right.score || left.index - right.index).map(({ entry }) => entry);
}

export function findConfidentSearchMatch(entries, query = "") {
  const intent = getSearchIntent(query);
  if (intent.rawTokens.length === 0) return null;
  const exactMatches = searchCatalog(entries, query).filter((entry) => {
    const title = getSearchIntent(entry.title).phrase;
    const aliases = (entry.aliases ?? []).map((alias) => getSearchIntent(alias).phrase);
    return title === intent.phrase || aliases.includes(intent.phrase);
  });
  return exactMatches.length === 1 ? exactMatches[0] : null;
}
