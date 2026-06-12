import { create } from 'zustand'

export type Screen = 'MainMenu' | 'WorldMap' | 'Battle'

interface NavigationState {
  screen: Screen
  navigate: (screen: Screen) => void
  reset: () => void
}

export const useNavigationStore = create<NavigationState>((set) => ({
  screen: 'MainMenu',
  navigate: (screen) => set({ screen }),
  reset: () => set({ screen: 'MainMenu' }),
}))
