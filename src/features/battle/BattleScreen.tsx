import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useBattleStore } from "../../providers/battle-store"
import { useSaveStore } from "../../providers/save-store"
import { AbilityBar } from "./AbilityBar"
import { BattleWonModal } from "./BattleWonModal"
import { EnemyPartyPanel } from "./EnemyPartyPanel"
import { GameOverModal } from "./GameOverModal"
import { PlayerPartyPanel } from "./PlayerPartyPanel"

interface BattleScreenProps {
  levelLabel: string
  levelId: string
  onRun: () => void
}

export function BattleScreen({ levelLabel, levelId, onRun }: BattleScreenProps) {
  const playerParty = useBattleStore((s) => s.playerParty)
  const enemyParty = useBattleStore((s) => s.enemyParty)
  const battleStatus = useBattleStore((s) => s.battleStatus)
  const startBattle = useBattleStore((s) => s.startBattle)
  const storedLevelId = useBattleStore((s) => s.levelId)
  const completeLevel = useSaveStore((s) => s.completeLevel)

  useEffect(() => {
    startBattle(levelId)
  }, [levelId, startBattle])

  const handleContinue = () => {
    if (storedLevelId) {
      completeLevel(storedLevelId)
    }
    onRun()
  }

  const handleRetry = () => {
    startBattle(levelId)
  }

  return (
    <div className="flex flex-col items-center w-full h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mt-8 mb-8">Battle: {levelLabel}</h1>

      <div className="flex justify-between w-full px-16">
        <PlayerPartyPanel units={playerParty} />
        <EnemyPartyPanel units={enemyParty} />
      </div>

      <AbilityBar />

      <div className="mt-auto mb-8 flex gap-4">
        <Button onClick={onRun}>Run</Button>
      </div>

      {battleStatus === "won" && (
        <BattleWonModal levelLabel={levelLabel} onContinue={handleContinue} />
      )}

      {battleStatus === "lost" && (
        <GameOverModal onRetry={handleRetry} onBackToMap={onRun} />
      )}
    </div>
  )
}
