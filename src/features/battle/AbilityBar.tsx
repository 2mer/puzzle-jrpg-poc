import { useBattleStore } from "../../providers/battle-store"
import { ABILITIES } from "../../shared/ability"

export function AbilityBar() {
  const phase = useBattleStore((s) => s.phase)
  const currentUnitIndex = useBattleStore((s) => s.currentUnitIndex)
  const playerParty = useBattleStore((s) => s.playerParty)
  const selectedAbilityId = useBattleStore((s) => s.selectedAbilityId)
  const selectAbility = useBattleStore((s) => s.selectAbility)
  const endTurn = useBattleStore((s) => s.endTurn)
  const canBeUsed = useBattleStore((s) => s.canBeUsed)

  if (phase !== "playerTurn") return null

  const currentUnit = playerParty[currentUnitIndex]
  if (!currentUnit || currentUnit.isDead) return null

  return (
    <div className="flex flex-col items-center gap-4 mt-4" data-testid="ability-bar">
      <p className="text-white font-bold">{currentUnit.name}'s Turn</p>

      <div className="flex gap-2">
        {currentUnit.abilityIds.map((id) => {
          const ability = ABILITIES[id]
          if (!ability) return null
          const usable = canBeUsed(id)
          const isSelected = selectedAbilityId === id

          return (
            <button
              key={id}
              onClick={() => selectAbility(isSelected ? null : id)}
              disabled={!usable}
              className={`px-4 py-2 rounded text-white text-sm font-medium transition-all ${
                isSelected
                  ? "bg-blue-600 ring-2 ring-yellow-400"
                  : usable
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              <div>{ability.name}</div>
              <div className="text-xs opacity-70">{ability.focusCost} Focus</div>
            </button>
          )
        })}
      </div>

      <button
        onClick={endTurn}
        className="px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded font-medium"
      >
        End Turn
      </button>
    </div>
  )
}
