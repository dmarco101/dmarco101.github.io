import { supersededRuleRoutes } from "../data/legacy-content.js";

const allowedTypes = new Set(["unit", "rule", "faction-rule", "detachment", "datasheet", "enhancement", "stratagem"]);
const referenceKey = (item) => `${item.type}:${item.parentId ?? ""}:${item.id}`;

export function normaliseGameReferences(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter((item) => {
    if (!item || !allowedTypes.has(item.type) || typeof item.id !== "string" || !item.id.trim()) return false;
    if (item.parentId !== undefined && item.parentId !== null && typeof item.parentId !== "string") return false;
    const key = referenceKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map(({ type, id, parentId = null }) => ({ type, id, parentId }));
}

export function migrateGameReferences(references, { units = [], detachments = [] } = {}) {
  const migrated = normaliseGameReferences(references).flatMap((reference) => {
    if (reference.type === "rule" && supersededRuleRoutes[reference.id]) {
      const replacement = supersededRuleRoutes[reference.id];
      return replacement.replacementType ? [{ type: replacement.replacementType, id: replacement.replacementId, parentId: replacement.replacementParentId }] : [];
    }
    if (reference.type === "unit") {
      const unit = units.find((candidate) => candidate.referenceId === reference.id || candidate.id === reference.id);
      return [unit ? { ...reference, id: unit.referenceId } : reference];
    }
    if (!["enhancement", "stratagem"].includes(reference.type)) return [reference];
    const detachment = detachments.find((candidate) => candidate.id === reference.parentId);
    const collection = reference.type === "enhancement" ? detachment?.enhancements : detachment?.stratagems;
    const item = collection?.find((candidate) => candidate.id === reference.id || candidate.name === reference.id);
    return [item ? { ...reference, id: item.id } : reference];
  });
  return normaliseGameReferences(migrated);
}

export function addGameReference(references, item) {
  return normaliseGameReferences([...references, item]);
}

export function removeGameReference(references, type, id, parentId = null) {
  const key = referenceKey({ type, id, parentId });
  return normaliseGameReferences(references).filter((item) => referenceKey(item) !== key);
}

export function moveGameReference(references, type, id, direction, parentId = null) {
  const next = normaliseGameReferences(references);
  const key = referenceKey({ type, id, parentId });
  const index = next.findIndex((item) => referenceKey(item) === key);
  if (index < 0) return next;
  const step = direction === "up" ? -1 : 1;
  let target = index + step;
  while (target >= 0 && target < next.length && next[target].type !== type) target += step;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
