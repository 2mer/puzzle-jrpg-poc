import { MainMenu } from './features/main-menu/MainMenu'
import { WorldMap } from './features/world-map/WorldMap'
import { useNavigationStore } from './shared/store'

function App() {
  const screen = useNavigationStore((s) => s.screen)

  switch (screen) {
    case 'MainMenu':
      return <MainMenu />
    case 'WorldMap':
      return <WorldMap />
    case 'Battle':
      return <div>Battle</div>
    default:
      return <MainMenu />
  }
}

export default App
