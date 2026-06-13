import { beforeEach, describe, expect, it } from "vitest"
import { COMPANIONS } from "../shared/companions"
import { useSaveStore } from "./save-store"
import { useBattleStore } from "./battle-store"

describe("useBattleStore", () => {
  beforeEach(() => {
    useBattleStore.setState({
      levelId: null,
      playerParty: [],
      enemyParty: [],
      battleStatus: "idle",
    })
    useSaveStore.setState({
      completedLevelIds: [],
      unlockedCompanionIds: [],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
  })

  it("initializes with idle status", () => {
    const state = useBattleStore.getState()
    expect(state.battleStatus).toBe("idle")
    expect(state.playerParty).toEqual([])
    expect(state.enemyParty).toEqual([])
    expect(state.levelId).toBeNull()
  })

  it("startBattle creates player party from save data", () => {
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-1")
    const state = useBattleStore.getState()
    expect(state.levelId).toBe("level-1")
    expect(state.playerParty.length).toBe(1)
    expect(state.playerParty[0].name).toBe("Adventurer")
    expect(state.playerParty[0].maxHealth).toBe(COMPANIONS["adventurer"].maxHealth)
    expect(state.playerParty[0].maxFocus).toBe(COMPANIONS["adventurer"].maxFocus)
  })

  it("startBattle creates enemy party from level config", () => {
    useBattleStore.getState().startBattle("level-1")
    const state = useBattleStore.getState()
    expect(state.enemyParty.length).toBe(1)
    expect(state.enemyParty[0].name).toBe("Skeleton")
    expect(state.enemyParty[0].maxHealth).toBe(5)
    expect(state.enemyParty[0].maxFocus).toBe(5)
  })

  it("startBattle sets battleStatus to active", () => {
    useBattleStore.getState().startBattle("level-1")
    expect(useBattleStore.getState().battleStatus).toBe("active")
  })

  it("startBattle creates multiple enemies for multi-enemy levels", () => {
    useBattleStore.getState().startBattle("level-3")
    const state = useBattleStore.getState()
    expect(state.enemyParty.length).toBe(2)
    expect(state.enemyParty[0].name).toBe("Skeleton")
    expect(state.enemyParty[1].name).toBe("Skeleton")
  })

  it("startBattle creates Boss enemy for level-5", () => {
    useBattleStore.getState().startBattle("level-5")
    const state = useBattleStore.getState()
    expect(state.enemyParty.length).toBe(1)
    expect(state.enemyParty[0].name).toBe("Boss")
    expect(state.enemyParty[0].maxHealth).toBe(20)
    expect(state.enemyParty[0].maxFocus).toBe(10)
  })

  it("startBattle on milestone level-6 sets battleStatus to won", () => {
    useBattleStore.getState().startBattle("level-6")
    const state = useBattleStore.getState()
    expect(state.battleStatus).toBe("won")
    expect(state.playerParty.length).toBe(1)
    expect(state.enemyParty.length).toBe(1)
  })

  it("startBattle omits empty party slots", () => {
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-1")
    const state = useBattleStore.getState()
    expect(state.playerParty.length).toBe(1)
    for (const unit of state.playerParty) {
      expect(unit).toBeDefined()
    }
  })

  it("startBattle with level-7 creates 3 skeletons", () => {
    useBattleStore.getState().startBattle("level-7")
    const state = useBattleStore.getState()
    expect(state.enemyParty.length).toBe(3)
    for (const enemy of state.enemyParty) {
      expect(enemy.name).toBe("Skeleton")
    }
  })
})
