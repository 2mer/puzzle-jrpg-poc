import { clsx } from "clsx"
import type { LevelDefinition } from "./levels"
import type { LevelState } from "./lock-utils"
import { Check } from "lucide-react"

interface LevelNodeProps {
  level: LevelDefinition
  state: LevelState
  "data-testid"?: string
}

export function LevelNode({ level, state, "data-testid": testId }: LevelNodeProps) {
  return (
    <div
      data-testid={testId ?? "level-node"}
      data-state={state}
      className={clsx(
        "absolute flex flex-col items-center justify-center w-28 h-28 rounded-full border-2 transition-all",
        state === "locked" && "opacity-50 cursor-not-allowed border-gray-600 bg-gray-800",
        state === "unlocked" && "cursor-pointer border-blue-500 bg-blue-900 hover:bg-blue-800",
        state === "completed" && "cursor-pointer border-green-500 bg-green-900",
      )}
      style={{ left: level.x, top: level.y }}
    >
      {state === "completed" && <Check data-testid="check-icon" className="text-green-400" size={24} />}
      {level.milestone && <span className="absolute -top-2 -right-2 text-yellow-400 text-lg">★</span>}
      {level.threshold && <span className="absolute -top-2 -left-2 text-red-400 text-lg">◆</span>}
      <span className="text-xs text-center px-1 leading-tight">{level.label}</span>
    </div>
  )
}
