import { describe, expect, it } from "vitest"
import { LEVELS, type OrCondition } from "./levels"

describe("level definitions", () => {
  it("defines 6-8 levels", () => {
    expect(LEVELS.length).toBeGreaterThanOrEqual(6)
    expect(LEVELS.length).toBeLessThanOrEqual(8)
  })

  it("gives each level a unique id", () => {
    const ids = LEVELS.map((l) => l.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it("gives each level an x and y position", () => {
    for (const level of LEVELS) {
      expect(typeof level.x).toBe("number")
      expect(typeof level.y).toBe("number")
    }
  })

  it("defines level-1 with no lock condition (always unlocked)", () => {
    const level1 = LEVELS.find((l) => l.id === "level-1")
    expect(level1?.lockCondition).toBeUndefined()
  })

  it("defines level-5 with milestone=true and threshold=true", () => {
    const level5 = LEVELS.find((l) => l.id === "level-5")
    expect(level5?.milestone).toBe(true)
    expect(level5?.threshold).toBe(true)
  })
})

describe("LockCondition types", () => {
  type TestCondition = string[] | OrCondition

  it("supports AND as an array of level IDs", () => {
    const andCondition: TestCondition = ["level-1", "level-2"]
    expect(Array.isArray(andCondition)).toBe(true)
  })

  it("supports OR as { type: 'or', conditions: [...] }", () => {
    const orCondition: TestCondition = {
      type: "or",
      conditions: ["level-1", "level-2"],
    }
    expect(orCondition.type).toBe("or")
    expect(Array.isArray(orCondition.conditions)).toBe(true)
  })
})
