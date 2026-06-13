import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SaveData } from "../shared/schemas/save-data"
import { SAVE_DATA_KEY } from "../shared/schemas/save-data"

interface SaveState extends SaveData {
  completeLevel: (levelId: string) => void
  loadSave: (data: SaveData) => void
}

export const useSaveStore = create<SaveState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: SAVE_DATA_KEY,
      partialize: (state) => ({
        completedLevelIds: state.completedLevelIds,
        unlockedCompanionIds: state.unlockedCompanionIds,
        currentParty: state.currentParty,
      }),
    },
  ),
)
