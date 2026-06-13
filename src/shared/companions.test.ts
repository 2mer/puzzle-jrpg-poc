import { describe, expect, it } from "vitest"
import { COMPANIONS } from "./companions"

describe("companions", () => {
  it("defines Adventurer with 10 health and 10 focus", () => {
    const adventurer = COMPANIONS["adventurer"]
    expect(adventurer).toBeDefined()
    expect(adventurer.maxHealth).toBe(10)
    expect(adventurer.maxFocus).toBe(10)
    expect(adventurer.name).toBe("Adventurer")
  })
})
