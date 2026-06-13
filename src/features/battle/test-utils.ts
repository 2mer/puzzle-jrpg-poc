import { useBattleStore } from "../../providers/battle-store"
import { useSaveStore } from "../../providers/save-store"

export function resetBattleStores() {
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
    currentParty: { unit1Id: "", unit2Id: "", unit3Id: "" },
  })
}

export function setupBattleTest() {
  useSaveStore.setState({
    completedLevelIds: ["level-1"],
    unlockedCompanionIds: ["adventurer"],
    currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
  })
  useBattleStore.getState().startBattle("level-1")
}
