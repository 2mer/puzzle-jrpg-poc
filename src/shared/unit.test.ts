import { describe, expect, it } from "vitest"
import { Unit } from "./unit"

describe("Unit", () => {
  it("creates a unit with name, health, and focus", () => {
    const unit = new Unit("Test", 10, 5)
    expect(unit.name).toBe("Test")
    expect(unit.maxHealth).toBe(10)
    expect(unit.health).toBe(10)
    expect(unit.maxFocus).toBe(5)
    expect(unit.focus).toBe(5)
  })

  it("isDead returns false when health > 0", () => {
    const unit = new Unit("Test", 10, 5)
    expect(unit.isDead).toBe(false)
  })

  it("isDead returns true when health <= 0", () => {
    const unit = new Unit("Test", 10, 5)
    unit.takeDamage(10)
    expect(unit.isDead).toBe(true)
  })

  it("takeDamage reduces health", () => {
    const unit = new Unit("Test", 10, 5)
    unit.takeDamage(3)
    expect(unit.health).toBe(7)
  })

  it("takeDamage does not reduce health below 0", () => {
    const unit = new Unit("Test", 10, 5)
    unit.takeDamage(20)
    expect(unit.health).toBe(0)
  })

  it("heal restores health", () => {
    const unit = new Unit("Test", 10, 5)
    unit.takeDamage(5)
    unit.heal(3)
    expect(unit.health).toBe(8)
  })

  it("heal does not exceed maxHealth", () => {
    const unit = new Unit("Test", 10, 5)
    unit.takeDamage(2)
    unit.heal(5)
    expect(unit.health).toBe(10)
  })

  it("heal does nothing on dead unit", () => {
    const unit = new Unit("Test", 10, 5)
    unit.takeDamage(10)
    unit.heal(5)
    expect(unit.health).toBe(0)
  })
})

describe("Unit abilities", () => {
  it("accepts ability IDs in constructor", () => {
    const unit = new Unit("Test", 10, 10, ["slash", "power-strike"])
    expect(unit.abilityIds).toEqual(["slash", "power-strike"])
  })

  it("defaults to empty abilities", () => {
    const unit = new Unit("Test", 10, 10)
    expect(unit.abilityIds).toEqual([])
  })
})
