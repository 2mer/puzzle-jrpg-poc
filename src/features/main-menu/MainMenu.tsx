import { Button } from '@/components/ui/button'
import { createNewSave, saveGame } from '@/shared/save'
import { useNavigationStore } from '@/shared/store'

export function MainMenu() {
  const navigate = useNavigationStore((s) => s.navigate)

  function handleNewGame() {
    const save = createNewSave()
    saveGame(save)
    navigate('WorldMap')
  }

  return (
    <div>
      <h1>Main Menu</h1>
      <Button onClick={handleNewGame}>New Game</Button>
    </div>
  )
}
