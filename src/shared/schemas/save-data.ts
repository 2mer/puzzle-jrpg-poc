import { z } from "zod"

export const SAVE_DATA_KEY = "puzzle-jrpg-save"

export const SaveData = z.object({
  completedLevelIds: z.array(z.string()),
  unlockedCompanionIds: z.array(z.string()),
  currentParty: z.object({
    unit1Id: z.string(),
    unit2Id: z.string(),
    unit3Id: z.string(),
  }),
})

export type SaveData = z.infer<typeof SaveData>

export function createInitialSave(): SaveData {
  return {
    completedLevelIds: ["level-1"],
    unlockedCompanionIds: ["adventurer"],
    currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
  }
}
