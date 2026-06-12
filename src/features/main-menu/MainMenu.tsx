import { Button } from "@/components/ui/button"

interface MainMenuProps {
  onNewGame: () => void
}

export function MainMenu({ onNewGame }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Puzzle JRPG</h1>
      <Button onClick={onNewGame}>New Game</Button>
    </div>
  )
}
