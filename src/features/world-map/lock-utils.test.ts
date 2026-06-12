import { describe, expect, it } from "vitest"
import { getLevelState } from "./lock-utils"
import { LEVELS } from "./levels"

describe("getLevelState", () => {
  it("returns 'unlocked' for level-1 (no lock condition)", () => {
    const state = getLevelState("level-1", LEVELS, [])
    expect(state).toBe("unlocked")
  })

  it("returns 'locked' when AND condition is not met", () => {
    const state = getLevelState("level-2", LEVELS, [])
    expect(state).toBe("locked")
  })

  it("returns 'unlocked' when AND condition is fully met", () => {
    const state = getLevelState("level-2", LEVELS, ["level-1"])
    expect(state).toBe("unlocked")
  })

  it("returns 'completed' when level is in completedLevelIds", () => {
    const state = getLevelState("level-1", LEVELS, ["level-1"])
    expect(state).toBe("completed")
  })

  it("returns 'unlocked' for OR condition when at least one path is completed", () => {
    const state = getLevelState("level-6", LEVELS, ["level-4"])
    expect(state).toBe("unlocked")
  })

  it("returns 'locked' for OR condition when no path is completed", () => {
    const state = getLevelState("level-6", LEVELS, [])
    expect(state).toBe("locked")
  })

  it("returns 'completed' for OR-condition level when completed", () => {
    const state = getLevelState("level-6", LEVELS, ["level-4", "level-6"])
    expect(state).toBe("completed")
  })

  it("returns 'locked' when only some AND conditions are met", () => {
    const state = getLevelState("level-7", LEVELS, ["level-1", "level-2", "level-3", "level-4"])
    expect(state).toBe("locked")
  })
})
