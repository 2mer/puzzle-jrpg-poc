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
      selectedAbilityId: null,
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

  it("startBattle gives player units ability IDs from companion data", () => {
    useBattleStore.getState().startBattle("level-1")
    const { playerParty } = useBattleStore.getState()
    expect(playerParty[0].abilityIds).toEqual(["slash", "power-strike"])
  })

  it("startBattle initializes phase to playerTurn with currentUnitIndex 0", () => {
    useBattleStore.getState().startBattle("level-1")
    const state = useBattleStore.getState()
    expect(state.phase).toBe("playerTurn")
    expect(state.currentUnitIndex).toBe(0)
    expect(state.actedUnits).toEqual([false])
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

describe("useBattleStore phase/actions", () => {
  beforeEach(() => {
    useBattleStore.setState({
      levelId: null,
      playerParty: [],
      enemyParty: [],
      battleStatus: "idle",
      phase: "idle",
      currentUnitIndex: 0,
      actedUnits: [],
      selectedAbilityId: null,
    })
    useSaveStore.setState({
      completedLevelIds: [],
      unlockedCompanionIds: [],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-1")
  })

  it("useAbility applies damage and deducts focus", () => {
    const { playerParty, enemyParty } = useBattleStore.getState()
    const initialFocus = playerParty[0].focus
    const target = enemyParty[0]

    useBattleStore.getState().useAbility("slash", target)

    const state = useBattleStore.getState()
    expect(state.enemyParty[0].health).toBe(0)
    expect(state.enemyParty[0].isDead).toBe(true)
    expect(state.playerParty[0].focus).toBe(initialFocus)
  })

  it("useAbility deducts focus cost for Power Strike", () => {
    const { enemyParty } = useBattleStore.getState()
    useBattleStore.getState().useAbility("power-strike", enemyParty[0])
    expect(useBattleStore.getState().playerParty[0].focus).toBe(5)
  })

  it("useAbility marks unit as acted", () => {
    const { enemyParty } = useBattleStore.getState()
    useBattleStore.getState().useAbility("slash", enemyParty[0])
    expect(useBattleStore.getState().actedUnits).toEqual([true])
  })

  it("useAbility advances to next unit after acting", () => {
    // With 2 units, after unit 0 acts, unit 1 should be current
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer", "adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "adventurer", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-3")
    const { enemyParty } = useBattleStore.getState()
    useBattleStore.getState().useAbility("slash", enemyParty[0])
    const state = useBattleStore.getState()
    expect(state.currentUnitIndex).toBe(1)
    expect(state.phase).toBe("playerTurn")
  })

  it("useAbility switches phase to enemyTurn after all units acted", () => {
    const { enemyParty } = useBattleStore.getState()
    useBattleStore.getState().useAbility("slash", enemyParty[0])
    expect(useBattleStore.getState().phase).toBe("enemyTurn")
  })

  it("endTurn marks unit as acted and advances", () => {
    useBattleStore.getState().endTurn()
    expect(useBattleStore.getState().actedUnits).toEqual([true])
    expect(useBattleStore.getState().phase).toBe("enemyTurn")
  })

  it("canBeUsed returns true for affordable ability", () => {
    expect(useBattleStore.getState().canBeUsed("slash")).toBe(true)
  })

  it("canBeUsed returns false for unaffordable ability", () => {
    useBattleStore.getState().playerParty[0].focus = 0
    expect(useBattleStore.getState().canBeUsed("power-strike")).toBe(false)
  })

  it("useAbility does nothing for unaffordable ability", () => {
    const { enemyParty } = useBattleStore.getState()
    useBattleStore.getState().playerParty[0].focus = 0
    useBattleStore.getState().useAbility("power-strike", enemyParty[0])
    const state = useBattleStore.getState()
    expect(state.actedUnits).toEqual([false])
    expect(state.currentUnitIndex).toBe(0)
  })

  it("skips dead units when advancing to next unit", () => {
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer", "adventurer", "adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "adventurer", unit3Id: "adventurer" },
    })
    useBattleStore.getState().startBattle("level-3")
    // currentUnitIndex=0, kill unit 0, then endTurn should advance to next alive unit
    useBattleStore.getState().playerParty[0].takeDamage(99)
    useBattleStore.getState().endTurn()
    // Unit 0 was dead -> marked as acted, advance should find unit 1 (alive, not acted)
    const state = useBattleStore.getState()
    expect(state.currentUnitIndex).toBe(1)
    expect(state.phase).toBe("playerTurn")
  })

  it("selectAbility sets selectedAbilityId", () => {
    useBattleStore.getState().selectAbility("slash")
    expect(useBattleStore.getState().selectedAbilityId).toBe("slash")
  })

  it("selectAbility with null clears selection", () => {
    useBattleStore.getState().selectAbility("slash")
    useBattleStore.getState().selectAbility(null)
    expect(useBattleStore.getState().selectedAbilityId).toBeNull()
  })

  it("useAbility clears selectedAbilityId after use", () => {
    const { enemyParty } = useBattleStore.getState()
    useBattleStore.getState().selectAbility("slash")
    useBattleStore.getState().useAbility("slash", enemyParty[0])
    expect(useBattleStore.getState().selectedAbilityId).toBeNull()
  })

  it("endTurn clears selectedAbilityId", () => {
    useBattleStore.getState().selectAbility("slash")
    useBattleStore.getState().endTurn()
    expect(useBattleStore.getState().selectedAbilityId).toBeNull()
  })

  it("switches to enemyTurn when all remaining units are dead", () => {
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer", "adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "adventurer", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-3")
    // Kill both units
    useBattleStore.getState().playerParty[0].takeDamage(99)
    useBattleStore.getState().playerParty[1].takeDamage(99)
    // endTurn marks unit 0 as acted (dead), advance should find no alive units -> enemyTurn
    useBattleStore.getState().endTurn()
    expect(useBattleStore.getState().phase).toBe("enemyTurn")
  })
})
