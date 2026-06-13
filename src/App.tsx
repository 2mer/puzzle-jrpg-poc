import { BattleScreen } from "./features/battle/BattleScreen"
import { MainMenu } from "./features/main-menu/MainMenu"
import { WorldMap } from "./features/world-map/WorldMap"
import { LEVELS } from "./features/world-map/levels"
import { useSaveStore } from "./providers/save-store"
import { useScreenStore } from "./providers/screen-store"
import { createInitialSave } from "./shared/schemas/save-data"

export function App() {
  const screen = useScreenStore((s) => s.screen)
  const battleLevelId = useScreenStore((s) => s.battleLevelId)
  const goToMainMenu = useScreenStore((s) => s.goToMainMenu)
  const goToWorldMap = useScreenStore((s) => s.goToWorldMap)
  const goToBattle = useScreenStore((s) => s.goToBattle)
  const loadSave = useSaveStore((s) => s.loadSave)
  const completedLevelIds = useSaveStore((s) => s.completedLevelIds)

  const handleNewGame = () => {
    const save = createInitialSave()
    loadSave(save)
    goToWorldMap()
  }

  const handleLevelClick = (levelId: string) => {
    goToBattle(levelId)
  }

  const handleContinue = () => {
    goToWorldMap()
  }

  const handleRun = () => {
    goToWorldMap()
  }

  const hasSave = useSaveStore((s) => s.completedLevelIds.length > 0)

  if (screen === "world-map") {
    return (
      <WorldMap
        completedLevelIds={completedLevelIds}
        onBack={goToMainMenu}
        onLevelClick={handleLevelClick}
      />
    )
  }

  if (screen === "battle" && battleLevelId) {
    const level = LEVELS.find((l) => l.id === battleLevelId)
    return <BattleScreen levelLabel={level?.label ?? "Unknown"} levelId={battleLevelId} onRun={handleRun} />
  }

  return <MainMenu onNewGame={handleNewGame} onContinue={handleContinue} hasSave={hasSave} />
}
