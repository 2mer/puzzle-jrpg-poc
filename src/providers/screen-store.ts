import { create } from "zustand"

type Screen = "main-menu" | "world-map" | "battle"

interface ScreenState {
  screen: Screen
  battleLevelId: string | null
  goToMainMenu: () => void
  goToWorldMap: () => void
  goToBattle: (levelId: string) => void
}

export const useScreenStore = create<ScreenState>((set) => ({
  screen: "main-menu",
  battleLevelId: null,
  goToMainMenu: () => set({ screen: "main-menu", battleLevelId: null }),
  goToWorldMap: () => set({ screen: "world-map" }),
  goToBattle: (levelId: string) => set({ screen: "battle", battleLevelId: levelId }),
}))
