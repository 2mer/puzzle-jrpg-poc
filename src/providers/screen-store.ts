import { create } from "zustand"

type Screen = "main-menu" | "world-map" | "battle"

interface ScreenState {
  screen: Screen
  goToMainMenu: () => void
  goToWorldMap: () => void
  goToBattle: () => void
}

export const useScreenStore = create<ScreenState>((set) => ({
  screen: "main-menu",
  goToMainMenu: () => set({ screen: "main-menu" }),
  goToWorldMap: () => set({ screen: "world-map" }),
  goToBattle: () => set({ screen: "battle" }),
}))
