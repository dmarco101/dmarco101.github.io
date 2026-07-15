const conversationalWords = new Set([
  "a", "about", "an", "are", "be", "been", "being", "can", "could", "did", "do", "does", "doing",
  "explain", "find", "for", "from", "how", "i", "in", "is", "it", "look", "looking", "mean", "meaning",
  "means", "me", "my", "of", "on", "our", "rule", "rules", "search", "should", "show", "tell", "that",
  "the", "these", "this", "those", "to", "us", "was", "we", "were", "what", "whats", "when", "where",
  "which", "who", "why", "will", "with", "work", "working", "works", "would", "you", "your"
]);

const singularExceptions = new Set(["chaos", "glass", "this"]);

export const normaliseSearchText = (value) => String(value ?? "")
  .toLowerCase()
  .replace(/[^a-z0-9+]+/g, " ")
  .trim();

function canonicalToken(token) {
  if (singularExceptions.has(token)) return token;
  if (token.length > 4 && token.endsWith("ies")) return `${token.slice(0, -3)}y`;
  if (token.length > 4 && /(ches|shes|sses|xes|zes)$/.test(token)) return token.slice(0, -2);
  if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
  return token;
}

export function getSearchIntent(value) {
  const normalized = normaliseSearchText(value);
  const rawTokens = normalized.split(" ").filter(Boolean);
  const meaningfulTokens = rawTokens.filter((token) => !conversationalWords.has(token));
  const tokens = meaningfulTokens.length > 0 ? meaningfulTokens : rawTokens;
  return { normalized, rawTokens, tokens, phrase: tokens.map(canonicalToken).join(" ") };
}

function tokenVariants(token) {
  return new Set([token, canonicalToken(token)]);
}

function isWithinOneEdit(left, right) {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;
  let leftIndex = 0;
  let rightIndex = 0;
  let edits = 0;
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] === right[rightIndex]) {
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (left.length > right.length) leftIndex += 1;
    else if (right.length > left.length) rightIndex += 1;
    else {
      leftIndex += 1;
      rightIndex += 1;
    }
  }
  if (leftIndex < left.length || rightIndex < right.length) edits += 1;
  return edits <= 1;
}

function matchesToken(queryToken, normalizedHaystack, haystackWords) {
  const queryVariants = tokenVariants(queryToken);
  if ([...queryVariants].some((variant) => normalizedHaystack.includes(variant))) return true;

  for (const word of haystackWords) {
    const wordVariants = tokenVariants(word);
    for (const queryVariant of queryVariants) {
      if (wordVariants.has(queryVariant)) return true;
      if (queryVariant.length < 5) continue;
      for (const wordVariant of wordVariants) {
        if (wordVariant.length >= 5 && queryVariant.slice(0, 2) === wordVariant.slice(0, 2) && isWithinOneEdit(queryVariant, wordVariant)) return true;
      }
    }
  }
  return false;
}

export function matchesSearchQuery(query, haystack) {
  const intent = getSearchIntent(query);
  if (intent.rawTokens.length === 0) return true;
  const normalizedHaystack = normaliseSearchText(haystack);
  const haystackWords = normalizedHaystack.split(" ").filter(Boolean);
  return intent.tokens.every((token) => matchesToken(token, normalizedHaystack, haystackWords));
}
