import { create } from 'zustand'

export type Screen = 'MainMenu' | 'WorldMap' | 'Battle'

interface NavigationState {
  screen: Screen
  navigate: (screen: Screen) => void
  reset: () => void
}

const initialState: { screen: Screen } = { screen: 'MainMenu' }

export const useNavigationStore = create<NavigationState>((set) => ({
  ...initialState,
  navigate: (screen) => set({ screen }),
  reset: () => set(initialState),
}))
