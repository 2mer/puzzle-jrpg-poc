import { useEffect } from "react"
import { Button } from "../../components/ui/button"
import { useBattleStore } from "../../providers/battle-store"
import { EnemyPartyPanel } from "./EnemyPartyPanel"
import { PlayerPartyPanel } from "./PlayerPartyPanel"

interface BattleScreenProps {
  levelLabel: string
  levelId: string
  onRun: () => void
}

export function BattleScreen({ levelLabel, levelId, onRun }: BattleScreenProps) {
  const playerParty = useBattleStore((s) => s.playerParty)
  const enemyParty = useBattleStore((s) => s.enemyParty)
  const startBattle = useBattleStore((s) => s.startBattle)

  useEffect(() => {
    startBattle(levelId)
  }, [levelId, startBattle])

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mt-8 mb-8">Battle: {levelLabel}</h1>

      <div className="flex justify-between w-full px-16">
        <PlayerPartyPanel units={playerParty} />
        <EnemyPartyPanel units={enemyParty} />
      </div>

      <div className="mt-auto mb-8">
        <Button onClick={onRun}>Run</Button>
      </div>
    </div>
  )
}
