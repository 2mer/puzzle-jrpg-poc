import { create } from "zustand"
import { LEVELS } from "../features/world-map/levels"
import { COMPANIONS } from "../shared/companions"
import { Boss, Enemy, Skeleton } from "../shared/enemy"
import { Unit } from "../shared/unit"
import { useSaveStore } from "./save-store"

function createEnemy(type: "skeleton" | "boss" | "adventurer"): Enemy {
  switch (type) {
    case "skeleton":
      return new Skeleton()
    case "boss":
      return new Boss()
    case "adventurer": {
      return new (class extends Enemy {
        constructor() {
          super("Adventurer", 10, 10)
        }
        onTurn(): void {
          // stub
        }
      })()
    }
  }
}

function createPlayerUnit(companionId: string): Unit | null {
  const data = COMPANIONS[companionId]
  if (!data) return null
  return new Unit(data.name, data.maxHealth, data.maxFocus)
}

export interface BattleState {
  levelId: string | null
  playerParty: Unit[]
  enemyParty: Enemy[]
  battleStatus: "idle" | "active" | "won" | "lost"
  startBattle: (levelId: string) => void
}

export const useBattleStore = create<BattleState>((set) => ({
  levelId: null,
  playerParty: [],
  enemyParty: [],
  battleStatus: "idle",
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

    set({ levelId, playerParty, enemyParty, battleStatus })
  },
}))
