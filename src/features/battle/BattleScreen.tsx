import { Button } from "@/components/ui/button"

interface BattleScreenProps {
  levelLabel: string
  onRun: () => void
}

export function BattleScreen({ levelLabel, onRun }: BattleScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-8">Battle: {levelLabel}</h1>
      <Button onClick={onRun}>Run</Button>
    </div>
  )
}
