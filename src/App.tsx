import { MainMenu } from "./features/main-menu/MainMenu"
import { WorldMap } from "./features/world-map/WorldMap"
import { useSaveStore } from "./providers/save-store"
import { useScreenStore } from "./providers/screen-store"
import { createInitialSave } from "./shared/schemas/save-data"

export function App() {
  const screen = useScreenStore((s) => s.screen)
  const goToMainMenu = useScreenStore((s) => s.goToMainMenu)
  const goToWorldMap = useScreenStore((s) => s.goToWorldMap)
  const loadSave = useSaveStore((s) => s.loadSave)
  const completedLevelIds = useSaveStore((s) => s.completedLevelIds)

  const handleNewGame = () => {
    const save = createInitialSave()
    loadSave(save)
    goToWorldMap()
  }

  if (screen === "world-map") {
    return <WorldMap completedLevelIds={completedLevelIds} onBack={goToMainMenu} />
  }

  return <MainMenu onNewGame={handleNewGame} />
}
