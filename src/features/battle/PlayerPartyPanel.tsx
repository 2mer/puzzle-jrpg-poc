import { useBattleStore } from "../../providers/battle-store"
import { ABILITIES } from "../../shared/ability"
import type { Unit } from "../../shared/unit"
import { UnitPortrait } from "./UnitPortrait"

interface PlayerPartyPanelProps {
  units: Unit[]
}

export function PlayerPartyPanel({ units }: PlayerPartyPanelProps) {
  const phase = useBattleStore((s) => s.phase)
  const selectedAbilityId = useBattleStore((s) => s.selectedAbilityId)
  const playerParty = useBattleStore((s) => s.playerParty)
  const enemyParty = useBattleStore((s) => s.enemyParty)
  const currentUnitIndex = useBattleStore((s) => s.currentUnitIndex)
  const useAbility = useBattleStore((s) => s.useAbility)
  const selectAbility = useBattleStore((s) => s.selectAbility)

  if (units.length === 0) return null

  const currentUnit = playerParty[currentUnitIndex]
  const selectedAbility = selectedAbilityId ? ABILITIES[selectedAbilityId] : undefined

  let validTargets: Unit[] = []
  if (selectedAbility && currentUnit && phase === "playerTurn") {
    const targets = selectedAbility.resolveTargets(currentUnit, playerParty, enemyParty)
    validTargets = targets.filter((t) => units.includes(t))
  }

  return (
    <div className="flex flex-col gap-4" data-testid="player-party-panel">
      {units.map((unit, i) => {
        const isTarget = validTargets.includes(unit)

        return (
          <button
            key={i}
            onClick={() => {
              if (isTarget && selectedAbilityId) {
                useAbility(selectedAbilityId, unit)
                selectAbility(null)
              }
            }}
            disabled={!isTarget}
            className={`block text-left ${isTarget ? "cursor-pointer ring-2 ring-yellow-400 rounded-lg" : ""}`}
          >
            <UnitPortrait unit={unit} />
          </button>
        )
      })}
    </div>
  )
}
