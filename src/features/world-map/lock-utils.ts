import type { LevelDefinition, LockCondition } from "./levels"

export type LevelState = "locked" | "unlocked" | "completed"

function isConditionMet(
  condition: string | LockCondition | undefined,
  completedLevelIds: Set<string>,
): boolean {
  if (condition === undefined) {
    return true
  }
  if (typeof condition === "string") {
    return completedLevelIds.has(condition)
  }
  if (Array.isArray(condition)) {
    return condition.every((id) => completedLevelIds.has(id))
  }
  return condition.conditions.some((sub) => isConditionMet(sub, completedLevelIds))
}

export function getLevelState(
  levelId: string,
  levels: LevelDefinition[],
  completedLevelIds: string[],
): LevelState {
  const completed = new Set(completedLevelIds)

  if (completed.has(levelId)) {
    return "completed"
  }

  const def = levels.find((l) => l.id === levelId)
  if (!def) {
    return "locked"
  }

  return isConditionMet(def.lockCondition, completed) ? "unlocked" : "locked"
}
