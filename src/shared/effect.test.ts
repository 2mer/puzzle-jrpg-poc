import { describe, expect, it } from "vitest"
import { Unit } from "./unit"
import { DamageEffect, Effect } from "./effect"

describe("Effect", () => {
  it("is an abstract class with run and affectEntity methods", () => {
    class TestEffect extends Effect {
      affectEntity(_unit: Unit): void {}
    }
    const effect = new TestEffect()
    expect(typeof effect.run).toBe("function")
    expect(typeof effect.affectEntity).toBe("function")
  })

  it("run calls affectEntity for each target", () => {
    const affected: Unit[] = []
    class TestEffect extends Effect {
      affectEntity(unit: Unit): void {
        affected.push(unit)
      }
    }
    const effect = new TestEffect()
    const units = [new Unit("A", 10, 10), new Unit("B", 10, 10)]
    effect.run(units)
    expect(affected).toEqual(units)
  })
})

describe("DamageEffect", () => {
  it("has a baseDamage property", () => {
    const effect = new DamageEffect(5)
    expect(effect.baseDamage).toBe(5)
  })

  it("affectEntity deals damage to a unit", () => {
    const unit = new Unit("Test", 10, 10)
    const effect = new DamageEffect(3)
    effect.affectEntity(unit)
    expect(unit.health).toBe(7)
  })

  it("affectEntity kills unit when damage exceeds health", () => {
    const unit = new Unit("Test", 5, 5)
    const effect = new DamageEffect(5)
    effect.affectEntity(unit)
    expect(unit.isDead).toBe(true)
  })

  it("run applies damage to all targets", () => {
    const targets = [new Unit("A", 10, 10), new Unit("B", 10, 10)]
    const effect = new DamageEffect(4)
    effect.run(targets)
    expect(targets[0].health).toBe(6)
    expect(targets[1].health).toBe(6)
  })
})
