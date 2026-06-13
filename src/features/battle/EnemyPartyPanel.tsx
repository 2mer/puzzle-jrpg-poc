import type { Enemy } from "../../shared/enemy"
import { UnitPortrait } from "./UnitPortrait"

interface EnemyPartyPanelProps {
  units: Enemy[]
}

export function EnemyPartyPanel({ units }: EnemyPartyPanelProps) {
  if (units.length === 0) return null

  return (
    <div className="flex flex-col gap-4" data-testid="enemy-party-panel">
      {units.map((unit, i) => (
        <UnitPortrait key={i} unit={unit} />
      ))}
    </div>
  )
}
