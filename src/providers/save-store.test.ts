import { describe, expect, it, beforeEach } from "vitest"
import { useSaveStore } from "./save-store"

describe("useSaveStore", () => {
  beforeEach(() => {
    useSaveStore.setState({
      completedLevelIds: [],
      unlockedCompanionIds: [],
      currentParty: { unit1Id: "", unit2Id: "", unit3Id: "" },
    })
  })

  it("starts with empty completedLevelIds", () => {
    expect(useSaveStore.getState().completedLevelIds).toEqual([])
  })

  it("completeLevel adds a level id to completedLevelIds", () => {
    useSaveStore.getState().completeLevel("level-2")
    expect(useSaveStore.getState().completedLevelIds).toContain("level-2")
  })

  it("completeLevel does not duplicate level ids", () => {
    useSaveStore.getState().completeLevel("level-2")
    useSaveStore.getState().completeLevel("level-2")
    expect(useSaveStore.getState().completedLevelIds).toEqual(["level-2"])
  })

  it("loadSave restores state from a SaveData object", () => {
    const saveData = {
      completedLevelIds: ["level-1", "level-2"],
      unlockedCompanionIds: ["adventurer", "warrior"],
      currentParty: { unit1Id: "adventurer", unit2Id: "warrior", unit3Id: "" },
    }
    useSaveStore.getState().loadSave(saveData)
    expect(useSaveStore.getState().completedLevelIds).toEqual(["level-1", "level-2"])
    expect(useSaveStore.getState().unlockedCompanionIds).toEqual(["adventurer", "warrior"])
    expect(useSaveStore.getState().currentParty.unit1Id).toBe("adventurer")
  })
})
