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

  it("useAbility marks unit as acted then resets after enemy phase", () => {
    const { enemyParty } = useBattleStore.getState()
    useBattleStore.getState().useAbility("slash", enemyParty[0])
    // After enemy phase processes inline, actedUnits are reset
    expect(useBattleStore.getState().actedUnits).toEqual([false])
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

  it("enemyTurn processes after all units act, phase returns to playerTurn", () => {
    const { enemyParty } = useBattleStore.getState()
    useBattleStore.getState().useAbility("slash", enemyParty[0])
    const state = useBattleStore.getState()
    expect(state.phase).toBe("playerTurn")
    expect(state.actedUnits).toEqual([false])
  })

  it("endTurn marks unit as acted and advances to enemy phase", () => {
    useBattleStore.getState().endTurn()
    const state = useBattleStore.getState()
    expect(state.actedUnits).toEqual([false])
    expect(state.phase).toBe("playerTurn")
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

  it("enemy deals damage to player during enemy phase when enemy survives", () => {
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-1")
    // Give skeleton extra HP so it survives the player's attack
    useBattleStore.getState().enemyParty[0].maxHealth = 20
    useBattleStore.getState().enemyParty[0].health = 20
    // Player uses slash (10 dmg), skeleton survives with 10 HP
    useBattleStore.getState().useAbility("slash", useBattleStore.getState().enemyParty[0])
    const state = useBattleStore.getState()
    // Skeleton should have acted during enemy phase, slashing the player for 10 dmg
    expect(state.playerParty[0].health).toBe(0)
    expect(state.phase).toBe("playerTurn")
    expect(state.actedUnits).toEqual([false])
  })

  it("multiple enemies each act in order during enemy phase", () => {
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer", "adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "adventurer", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-3")
    // Give both skeletons extra HP so they survive
    useBattleStore.getState().enemyParty[0].maxHealth = 20
    useBattleStore.getState().enemyParty[0].health = 20
    useBattleStore.getState().enemyParty[1].maxHealth = 20
    useBattleStore.getState().enemyParty[1].health = 20
    // Player 0 acts on skeleton 0
    useBattleStore.getState().useAbility("slash", useBattleStore.getState().enemyParty[0])
    expect(useBattleStore.getState().currentUnitIndex).toBe(1)
    // Player 1 acts on skeleton 1
    useBattleStore.getState().useAbility("slash", useBattleStore.getState().enemyParty[1])
    const state = useBattleStore.getState()
    // Skeleton 0 killed player 0 (10 dmg), skeleton 1 killed player 1 (10 dmg)
    expect(state.playerParty[0].health).toBe(0)
    expect(state.playerParty[1].health).toBe(0)
    expect(state.phase).toBe("playerTurn")
    expect(state.actedUnits).toEqual([false, false])
  })

  it("only alive enemies act during enemy phase", () => {
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer", "adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "adventurer", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-3")
    // Kill skeleton 0, skeleton 1 survives with extra HP
    useBattleStore.getState().enemyParty[0].takeDamage(99)
    useBattleStore.getState().enemyParty[1].maxHealth = 20
    useBattleStore.getState().enemyParty[1].health = 20
    // Player 0 acts -> advances to player 1
    useBattleStore.getState().endTurn()
    expect(useBattleStore.getState().currentUnitIndex).toBe(1)
    // Player 1 acts -> triggers enemy phase
    useBattleStore.getState().endTurn()
    const state = useBattleStore.getState()
    // Only skeleton 1 should have acted (skeleton 0 is dead)
    // skeleton 1 attacks lowest-HP player (player 0 with 10 HP, player 1 with 10 HP -> player 0)
    expect(state.playerParty[0].health).toBe(0)
    // Player 1 should not have been attacked
    expect(state.playerParty[1].health).toBe(10)
    expect(state.phase).toBe("playerTurn")
  })

  it("player can act again after enemy phase completes", () => {
    useSaveStore.getState().loadSave({
      completedLevelIds: [],
      unlockedCompanionIds: ["adventurer", "adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "adventurer", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-3")
    // Give players extra HP so they survive enemy attacks
    useBattleStore.getState().playerParty[0].maxHealth = 30
    useBattleStore.getState().playerParty[0].health = 30
    useBattleStore.getState().playerParty[1].maxHealth = 30
    useBattleStore.getState().playerParty[1].health = 30
    // Give both skeletons extra HP so they survive player attacks
    useBattleStore.getState().enemyParty[0].maxHealth = 20
    useBattleStore.getState().enemyParty[0].health = 20
    useBattleStore.getState().enemyParty[1].maxHealth = 20
    useBattleStore.getState().enemyParty[1].health = 20
    // Both players act -> enemy phase runs -> back to playerTurn
    useBattleStore.getState().useAbility("slash", useBattleStore.getState().enemyParty[0])
    useBattleStore.getState().useAbility("slash", useBattleStore.getState().enemyParty[1])
    // After enemy phase, player 0 should be current again and can act
    expect(useBattleStore.getState().currentUnitIndex).toBe(0)
    expect(useBattleStore.getState().phase).toBe("playerTurn")
    expect(useBattleStore.getState().canBeUsed("slash")).toBe(true)
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

  it("resets to playerTurn after enemy phase even when all players dead", () => {
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
    const state = useBattleStore.getState()
    expect(state.phase).toBe("playerTurn")
    expect(state.actedUnits).toEqual([false, false])
  })
})
