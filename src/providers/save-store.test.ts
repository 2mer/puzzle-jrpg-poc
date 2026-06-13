import { describe, expect, it, beforeEach } from "vitest"
import { SAVE_DATA_KEY } from "../shared/schemas/save-data"
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

  it("persists completedLevelIds to localStorage after completeLevel", () => {
    useSaveStore.getState().completeLevel("level-2")
    const stored = JSON.parse(localStorage.getItem(SAVE_DATA_KEY)!)
    expect(stored.state.completedLevelIds).toContain("level-2")
  })

  it("persists only the selected fields (no functions) to localStorage", () => {
    useSaveStore.getState().completeLevel("level-2")
    const stored = JSON.parse(localStorage.getItem(SAVE_DATA_KEY)!)
    expect(stored.state.completedLevelIds).toEqual(["level-2"])
    expect(stored.state.unlockedCompanionIds).toEqual([])
    expect(stored.state.currentParty).toEqual({ unit1Id: "", unit2Id: "", unit3Id: "" })
    expect(stored.state.completeLevel).toBeUndefined()
    expect(stored.state.loadSave).toBeUndefined()
  })

  it("rehydrates state from localStorage", () => {
    useSaveStore.persist.clearStorage()
    const savedData = {
      completedLevelIds: ["level-1", "level-5"],
      unlockedCompanionIds: ["adventurer", "warrior"],
      currentParty: { unit1Id: "adventurer", unit2Id: "warrior", unit3Id: "" },
    }
    localStorage.setItem(SAVE_DATA_KEY, JSON.stringify({ state: savedData, version: 0 }))
    useSaveStore.persist.rehydrate()
    const state = useSaveStore.getState()
    expect(state.completedLevelIds).toEqual(["level-1", "level-5"])
    expect(state.unlockedCompanionIds).toEqual(["adventurer", "warrior"])
    expect(state.currentParty.unit1Id).toBe("adventurer")
  })
})
