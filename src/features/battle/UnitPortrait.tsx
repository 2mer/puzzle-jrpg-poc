import type { Unit } from "../../shared/unit"

interface UnitPortraitProps {
  unit: Unit
}

function hpBarColor(health: number, maxHealth: number): string {
  const ratio = health / maxHealth
  if (ratio > 0.6) return "bg-green-500"
  if (ratio >= 0.3) return "bg-yellow-500"
  return "bg-red-500"
}

function statusEffectColor(type: string): string {
  switch (type) {
    case "shield":
      return "bg-blue-500"
    case "regen":
      return "bg-green-500"
    case "stun":
      return "bg-yellow-500"
    default:
      return "bg-gray-500"
  }
}

export function UnitPortrait({ unit }: UnitPortraitProps) {
  const hpPercent = (unit.health / unit.maxHealth) * 100
  const focusPercent = (unit.focus / unit.maxFocus) * 100

  return (
    <div
      data-testid="unit-portrait"
      className={`bg-gray-800 rounded-lg p-3 w-48 border border-gray-700 ${unit.isDead ? "opacity-50" : ""}`}
    >
      <p className="text-white font-bold text-center mb-2">{unit.name}</p>

      {unit.statusEffects.length > 0 && (
        <div data-testid="status-effects" className="flex justify-center gap-1 mb-1">
          {unit.statusEffects.map((effect) => (
            <div
              key={effect.type}
              data-testid={`status-effect-${effect.type}`}
              className={`w-2.5 h-2.5 rounded-full ${statusEffectColor(effect.type)}`}
              title={`${effect.type} (${effect.duration} turns)`}
            />
          ))}
        </div>
      )}

      <div className="mb-1">
        <div className="flex justify-between text-xs text-gray-300 mb-0.5">
          <span>HP</span>
          <span>{unit.health}/{unit.maxHealth}</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded overflow-hidden">
          <div
            data-testid="hp-bar-fill"
            className={`h-full rounded transition-all ${hpBarColor(unit.health, unit.maxHealth)}`}
            style={{ width: `${hpPercent}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs text-gray-300 mb-0.5">
          <span>Focus</span>
          <span>{unit.focus}/{unit.maxFocus}</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded overflow-hidden">
          <div
            data-testid="focus-bar-fill"
            className="h-full rounded transition-all bg-blue-500"
            style={{ width: `${focusPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
