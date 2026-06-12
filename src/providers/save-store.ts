import { create } from "zustand"
import type { SaveData } from "../shared/schemas/save-data"

interface SaveState extends SaveData {
  completeLevel: (levelId: string) => void
  loadSave: (data: SaveData) => void
}

export const useSaveStore = create<SaveState>((set) => ({
  completedLevelIds: [],
  unlockedCompanionIds: [],
  currentParty: { unit1Id: "", unit2Id: "", unit3Id: "" },
  completeLevel: (levelId: string) =>
    set((state) => ({
      completedLevelIds: state.completedLevelIds.includes(levelId)
        ? state.completedLevelIds
        : [...state.completedLevelIds, levelId],
    })),
  loadSave: (data: SaveData) =>
    set({
      completedLevelIds: data.completedLevelIds,
      unlockedCompanionIds: data.unlockedCompanionIds,
      currentParty: data.currentParty,
    }),
}))
