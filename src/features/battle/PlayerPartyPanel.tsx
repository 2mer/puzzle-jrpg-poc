import type { Unit } from "../../shared/unit"
import { UnitPortrait } from "./UnitPortrait"

interface PlayerPartyPanelProps {
  units: Unit[]
}

export function PlayerPartyPanel({ units }: PlayerPartyPanelProps) {
  if (units.length === 0) return null

  return (
    <div className="flex flex-col gap-4" data-testid="player-party-panel">
      {units.map((unit, i) => (
        <UnitPortrait key={i} unit={unit} />
      ))}
    </div>
  )
}
