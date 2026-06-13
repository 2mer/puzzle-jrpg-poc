import { useBattleStore } from "../../providers/battle-store"
import { ABILITIES } from "../../shared/ability"
import type { Enemy } from "../../shared/enemy"
import { UnitPortrait } from "./UnitPortrait"

interface EnemyPartyPanelProps {
  units: Enemy[]
}

export function EnemyPartyPanel({ units }: EnemyPartyPanelProps) {
  const phase = useBattleStore((s) => s.phase)
  const selectedAbilityId = useBattleStore((s) => s.selectedAbilityId)
  const playerParty = useBattleStore((s) => s.playerParty)
  const currentUnitIndex = useBattleStore((s) => s.currentUnitIndex)
  const useAbility = useBattleStore((s) => s.useAbility)
  const selectAbility = useBattleStore((s) => s.selectAbility)

  if (units.length === 0) return null

  const currentUnit = playerParty[currentUnitIndex]
  const selectedAbility = selectedAbilityId ? ABILITIES[selectedAbilityId] : undefined

  let validTargets: Enemy[] = []
  if (selectedAbility && currentUnit && phase === "playerTurn") {
    const targets = selectedAbility.resolveTargets(currentUnit, playerParty, units)
    validTargets = targets.filter((t): t is Enemy => units.includes(t as Enemy))
  }

  return (
    <div className="flex flex-col gap-4" data-testid="enemy-party-panel">
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
