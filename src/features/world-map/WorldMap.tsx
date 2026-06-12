import { Button } from "@/components/ui/button"
import { LEVELS } from "./levels"
import { getLevelState } from "./lock-utils"
import { LevelNode } from "./LevelNode"

interface WorldMapProps {
  completedLevelIds: string[]
  onBack?: () => void
  onLevelClick?: (levelId: string) => void
}

export function WorldMap({ completedLevelIds, onBack, onLevelClick }: WorldMapProps) {
  return (
    <div className="relative w-full h-screen bg-gray-900 text-white overflow-auto">
      <div className="sticky top-0 z-10 p-4">
        <h1 className="text-2xl font-bold">World Map</h1>
        {onBack && <Button onClick={onBack}>Back</Button>}
      </div>
      <div className="relative w-[1400px] h-[700px]">
        {LEVELS.map((level) => (
          <LevelNode
            key={level.id}
            level={level}
            state={getLevelState(level.id, LEVELS, completedLevelIds)}
            onClick={onLevelClick ? () => onLevelClick(level.id) : undefined}
            data-testid={`level-node-${level.id}`}
          />
        ))}
      </div>
    </div>
  )
}
