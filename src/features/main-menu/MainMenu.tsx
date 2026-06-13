import { Button } from "@/components/ui/button"

interface MainMenuProps {
  onNewGame: () => void
  onContinue: () => void
  hasSave: boolean
}

export function MainMenu({ onNewGame, onContinue, hasSave }: MainMenuProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Puzzle JRPG</h1>
      <div className="flex flex-col gap-3">
        <Button onClick={onNewGame}>New Game</Button>
        <Button onClick={onContinue} disabled={!hasSave}>Continue</Button>
      </div>
    </div>
  )
}
