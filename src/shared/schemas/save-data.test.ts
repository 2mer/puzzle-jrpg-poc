import { describe, expect, it } from "vitest"
import { SaveData, createInitialSave, SAVE_DATA_KEY } from "./save-data"

describe("SaveData schema", () => {
  it("validates a valid save object", () => {
    const data = {
      completedLevelIds: ["level-1"],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    }
    expect(SaveData.parse(data)).toEqual(data)
  })

  it("rejects missing fields", () => {
    expect(() => SaveData.parse({})).toThrow()
  })

  it("rejects wrong types", () => {
    expect(() =>
      SaveData.parse({
        completedLevelIds: "not-an-array",
        unlockedCompanionIds: ["adventurer"],
        currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
      }),
    ).toThrow()
  })
})

describe("createInitialSave", () => {
  it("returns level-1 in completedLevelIds", () => {
    const save = createInitialSave()
    expect(save.completedLevelIds).toContain("level-1")
  })

  it("includes adventurer in unlockedCompanionIds", () => {
    const save = createInitialSave()
    expect(save.unlockedCompanionIds).toContain("adventurer")
  })

  it("sets currentParty unit1Id to adventurer", () => {
    const save = createInitialSave()
    expect(save.currentParty.unit1Id).toBe("adventurer")
  })
})

describe("SAVE_DATA_KEY", () => {
  it("is a non-empty string", () => {
    expect(typeof SAVE_DATA_KEY).toBe("string")
    expect(SAVE_DATA_KEY.length).toBeGreaterThan(0)
  })
})
