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

describe("Unit status effects", () => {
  it("starts with no status effects", () => {
    const unit = new Unit("Test", 10, 10)
    expect(unit.statusEffects).toEqual([])
  })

  it("addStatusEffect adds a status effect", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "shield", duration: 3, data: { percentage: 0.5 } })
    expect(unit.statusEffects.length).toBe(1)
    expect(unit.statusEffects[0].type).toBe("shield")
  })

  it("hasStatusEffect returns true when effect is present", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "shield", duration: 3, data: { percentage: 0.5 } })
    expect(unit.hasStatusEffect("shield")).toBe(true)
    expect(unit.hasStatusEffect("regen")).toBe(false)
  })

  it("isStunned returns true when stunned", () => {
    const unit = new Unit("Test", 10, 10)
    expect(unit.isStunned).toBe(false)
    unit.addStatusEffect({ type: "stun", duration: 1, data: {} })
    expect(unit.isStunned).toBe(true)
  })

  it("clearStatusEffect removes a status effect", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "stun", duration: 1, data: {} })
    unit.clearStatusEffect("stun")
    expect(unit.isStunned).toBe(false)
    expect(unit.hasStatusEffect("stun")).toBe(false)
  })

  it("tickStatusEffects heals from regen", () => {
    const unit = new Unit("Test", 10, 10)
    unit.takeDamage(4)
    unit.addStatusEffect({ type: "regen", duration: 3, data: { amount: 2 } })
    unit.tickStatusEffects()
    expect(unit.health).toBe(8) // 6 + 2 regen
  })

  it("tickStatusEffects decrements duration", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "shield", duration: 3, data: { percentage: 0.5 } })
    unit.tickStatusEffects()
    expect(unit.statusEffects[0].duration).toBe(2)
  })

  it("tickStatusEffects removes expired effects", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "shield", duration: 1, data: { percentage: 0.5 } })
    unit.tickStatusEffects()
    expect(unit.statusEffects.length).toBe(0)
  })

  it("shield reduces incoming damage by percentage", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "shield", duration: 3, data: { percentage: 0.5 } })
    unit.takeDamage(10)
    expect(unit.health).toBe(5) // 10 - round(10 * 0.5) = 10 - 5 = 5
  })

  it("shield with 0.25 reduces damage by 25%", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "shield", duration: 3, data: { percentage: 0.25 } })
    unit.takeDamage(8)
    expect(unit.health).toBe(4) // 10 - round(8 * 0.75) = 10 - 6 = 4
  })

  it("shield expires after duration and no longer reduces damage", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "shield", duration: 1, data: { percentage: 0.5 } })
    unit.tickStatusEffects() // expires
    unit.takeDamage(6)
    expect(unit.health).toBe(4) // no reduction
  })

  it("tickStatusEffects does nothing when no regen", () => {
    const unit = new Unit("Test", 10, 10)
    unit.takeDamage(3)
    unit.addStatusEffect({ type: "stun", duration: 1, data: {} })
    unit.tickStatusEffects()
    expect(unit.statusEffects.length).toBe(0) // expired after decrement
  })

  it("multiple status effects coexist", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "shield", duration: 3, data: { percentage: 0.5 } })
    unit.addStatusEffect({ type: "regen", duration: 2, data: { amount: 2 } })
    unit.addStatusEffect({ type: "stun", duration: 1, data: {} })
    expect(unit.statusEffects.length).toBe(3)
    expect(unit.hasStatusEffect("shield")).toBe(true)
    expect(unit.hasStatusEffect("regen")).toBe(true)
    expect(unit.hasStatusEffect("stun")).toBe(true)
  })

  it("tick does not affect stun duration (stun cleared separately)", () => {
    const unit = new Unit("Test", 10, 10)
    unit.addStatusEffect({ type: "stun", duration: 1, data: {} })
    // tickStatusEffects decrements all durations, including stun
    unit.tickStatusEffects()
    expect(unit.hasStatusEffect("stun")).toBe(false)
  })
})
