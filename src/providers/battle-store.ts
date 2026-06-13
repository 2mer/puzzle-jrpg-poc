import { create } from "zustand"
import { LEVELS, type EnemyType } from "../features/world-map/levels"
import { ABILITIES } from "../shared/ability"
import { COMPANIONS } from "../shared/companions"
import { AdventurerEnemy, Boss, Enemy, Skeleton } from "../shared/enemy"
import { Unit } from "../shared/unit"
import { useSaveStore } from "./save-store"

function createEnemy(type: EnemyType): Enemy {
  switch (type) {
    case "skeleton":
      return new Skeleton()
    case "boss":
      return new Boss()
    case "adventurer":
      return new AdventurerEnemy()
  }
}

function createPlayerUnit(companionId: string): Unit | null {
  const data = COMPANIONS[companionId]
  if (!data) return null
  return new Unit(data.name, data.maxHealth, data.maxFocus, data.abilityIds)
}

function computeNextUnitState(actedUnits: boolean[], playerParty: Unit[], currentUnitIndex: number): { currentUnitIndex: number; phase: "playerTurn" | "enemyTurn" } {
  const allActed = actedUnits.every((a) => a)
  if (allActed) {
    return { currentUnitIndex: 0, phase: "enemyTurn" }
  }

  let nextIndex = currentUnitIndex
  for (let i = 0; i < playerParty.length; i++) {
    nextIndex = (nextIndex + 1) % playerParty.length
    if (!actedUnits[nextIndex] && !playerParty[nextIndex].isDead) {
      return { currentUnitIndex: nextIndex, phase: "playerTurn" }
    }
  }

  return { currentUnitIndex: 0, phase: "enemyTurn" }
}

function markCurrentUnitActed(state: BattleState) {
  const actedUnits = [...state.actedUnits]
  actedUnits[state.currentUnitIndex] = true
  const { currentUnitIndex, phase } = computeNextUnitState(actedUnits, state.playerParty, state.currentUnitIndex)
  return { actedUnits, currentUnitIndex, phase }
}

function processEnemyTurn(enemyParty: Enemy[], playerParty: Unit[]): void {
  for (const enemy of enemyParty) {
    if (enemy.isDead) continue
    enemy.onTurn(playerParty)
  }
}

function findFirstActableUnit(playerParty: Unit[]): number {
  for (let i = 0; i < playerParty.length; i++) {
    if (!playerParty[i].isDead) return i
  }
  return 0
}

export type BattlePhase = "idle" | "playerTurn" | "enemyTurn"

export interface BattleState {
  levelId: string | null
  playerParty: Unit[]
  enemyParty: Enemy[]
  battleStatus: "idle" | "active" | "won" | "lost"
  phase: BattlePhase
  currentUnitIndex: number
  actedUnits: boolean[]
  selectedAbilityId: string | null
  startBattle: (levelId: string) => void
  useAbility: (abilityId: string, target: Unit) => void
  endTurn: () => void
  canBeUsed: (abilityId: string) => boolean
  selectAbility: (abilityId: string | null) => void
}

export const useBattleStore = create<BattleState>((set, get) => ({
  levelId: null,
  playerParty: [],
  enemyParty: [],
  battleStatus: "idle",
  phase: "idle",
  currentUnitIndex: 0,
  actedUnits: [],
  selectedAbilityId: null,
  startBattle: (levelId: string) => {
    const level = LEVELS.find((l) => l.id === levelId)
    if (!level) return

    const { currentParty } = useSaveStore.getState()
    const playerParty: Unit[] = []
    for (const key of ["unit1Id", "unit2Id", "unit3Id"] as const) {
      const unit = createPlayerUnit(currentParty[key])
      if (unit) playerParty.push(unit)
    }

    const enemyParty: Enemy[] = level.enemies.map((e) => createEnemy(e.type))

    const milestone = level.milestone ?? false
    const battleStatus = milestone ? "won" : "active"

    const actedUnits = playerParty.map(() => false)
    const currentUnitIndex = findFirstActableUnit(playerParty)

    const phase: BattlePhase = battleStatus === "active" ? "playerTurn" : "idle"
    set({ levelId, playerParty, enemyParty, battleStatus, phase, currentUnitIndex, actedUnits, selectedAbilityId: null })
  },
  useAbility: (abilityId: string, target: Unit) => {
    const state = get()
    if (state.phase !== "playerTurn") return
    const currentUnit = state.playerParty[state.currentUnitIndex]
    if (!currentUnit || currentUnit.isDead) return
    if (state.actedUnits[state.currentUnitIndex]) return

    const ability = ABILITIES[abilityId]
    if (!ability) return
    if (!ability.canBeUsed(currentUnit)) return

    const targets = ability.resolveTargets(currentUnit, state.playerParty, state.enemyParty)
    if (!targets.includes(target)) return

    ability.apply(target, currentUnit)

    const next = markCurrentUnitActed(state)
    if (next.phase === "enemyTurn") {
      processEnemyTurn(state.enemyParty, state.playerParty)
      const actedUnits = state.playerParty.map(() => false)
      const currentUnitIndex = findFirstActableUnit(state.playerParty)
      set({ ...next, actedUnits, currentUnitIndex, phase: "playerTurn", selectedAbilityId: null })
    } else {
      set({ ...next, selectedAbilityId: null })
    }
  },
  endTurn: () => {
    const state = get()
    if (state.phase !== "playerTurn") return

    const next = markCurrentUnitActed(state)
    if (next.phase === "enemyTurn") {
      processEnemyTurn(state.enemyParty, state.playerParty)
      const actedUnits = state.playerParty.map(() => false)
      const currentUnitIndex = findFirstActableUnit(state.playerParty)
      set({ ...next, actedUnits, currentUnitIndex, phase: "playerTurn", selectedAbilityId: null })
    } else {
      set({ ...next, selectedAbilityId: null })
    }
  },
  canBeUsed: (abilityId: string) => {
    const state = get()
    if (state.phase !== "playerTurn") return false
    const currentUnit = state.playerParty[state.currentUnitIndex]
    if (!currentUnit || currentUnit.isDead || state.actedUnits[state.currentUnitIndex]) return false
    const ability = ABILITIES[abilityId]
    if (!ability) return false
    return ability.canBeUsed(currentUnit)
  },
  selectAbility: (abilityId: string | null) => {
    set({ selectedAbilityId: abilityId })
  },
}))
