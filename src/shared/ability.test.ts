import { describe, expect, it } from "vitest"
import { Ability, ABILITIES } from "./ability"
import { DamageEffect } from "./effect"
import { Unit } from "./unit"

describe("Ability", () => {
  it("creates an ability with name, targetSet, focusCost, and effects", () => {
    const ability = new Ability("Slash", "single", 0, [new DamageEffect(5)])
    expect(ability.name).toBe("Slash")
    expect(ability.targetSet).toBe("single")
    expect(ability.focusCost).toBe(0)
    expect(ability.effects).toEqual([new DamageEffect(5)])
  })

  it("canBeUsed returns true when unit has enough focus", () => {
    const unit = new Unit("Test", 10, 10)
    const ability = new Ability("Slash", "single", 5, [new DamageEffect(5)])
    expect(ability.canBeUsed(unit)).toBe(true)
  })

  it("canBeUsed returns false when unit lacks enough focus", () => {
    const unit = new Unit("Test", 10, 10)
    unit.focus = 3
    const ability = new Ability("Power Strike", "single", 5, [new DamageEffect(20)])
    expect(ability.canBeUsed(unit)).toBe(false)
  })
})

describe("resolveTargets", () => {
  it("resolves 'self' target to the source unit", () => {
    const source = new Unit("Hero", 10, 10)
    const allies = [source, new Unit("Ally", 8, 8)]
    const enemies = [new Unit("Enemy", 5, 5)]
    const ability = new Ability("Defend", "self", 0, [])
    const targets = ability.resolveTargets(source, allies, enemies)
    expect(targets).toEqual([source])
  })

  it("resolves 'single' target to alive enemies by default", () => {
    const source = new Unit("Hero", 10, 10)
    const enemies = [new Unit("Skeleton", 5, 5), new Unit("Skeleton", 5, 5)]
    const ability = new Ability("Slash", "single", 0, [])
    const targets = ability.resolveTargets(source, [], enemies)
    expect(targets).toEqual(enemies)
  })

  it("resolves 'single' excludes dead enemies", () => {
    const source = new Unit("Hero", 10, 10)
    const alive = new Unit("Skeleton", 5, 5)
    const dead = new Unit("Skeleton", 5, 5)
    dead.takeDamage(5)
    const ability = new Ability("Slash", "single", 0, [])
    const targets = ability.resolveTargets(source, [], [alive, dead])
    expect(targets).toEqual([alive])
  })

  it("resolves 'party' target to all alive party members", () => {
    const source = new Unit("Hero", 10, 10)
    const allies = [new Unit("Ally1", 8, 8), new Unit("Ally2", 8, 8)]
    const ability = new Ability("Heal", "party", 0, [])
    const targets = ability.resolveTargets(source, allies, [])
    expect(targets).toEqual(allies)
  })

  it("resolves 'all' target to all alive units (enemies + player party)", () => {
    const source = new Unit("Hero", 10, 10)
    const allies = [new Unit("Ally", 8, 8)]
    const enemies = [new Unit("Skeleton", 5, 5)]
    const ability = new Ability("AoE", "all", 0, [])
    const targets = ability.resolveTargets(source, allies, enemies)
    expect(targets).toContain(allies[0])
    expect(targets).toContain(enemies[0])
  })
})

describe("apply", () => {
  it("applies damage effect: reduces target health", () => {
    const target = new Unit("Skeleton", 5, 5)
    const ability = new Ability("Slash", "single", 0, [new DamageEffect(3)])
    ability.apply([target])
    expect(target.health).toBe(2)
  })

  it("applies damage effect: kills target when damage >= health", () => {
    const target = new Unit("Skeleton", 5, 5)
    const ability = new Ability("Slash", "single", 0, [new DamageEffect(5)])
    ability.apply([target])
    expect(target.isDead).toBe(true)
  })

  it("deducts focus cost when applied", () => {
    const source = new Unit("Hero", 10, 10)
    const target = new Unit("Skeleton", 5, 5)
    const ability = new Ability("Power Strike", "single", 5, [new DamageEffect(20)])
    ability.apply([target], source)
    expect(source.focus).toBe(5)
    expect(target.health).toBe(0)
  })
})

describe("ABILITIES", () => {
  it("defines Slash: single target, 0 focus, 5 damage", () => {
    const slash = ABILITIES["slash"]
    expect(slash).toBeDefined()
    expect(slash.name).toBe("Slash")
    expect(slash.targetSet).toBe("single")
    expect(slash.focusCost).toBe(0)
    expect(slash.effects).toEqual([new DamageEffect(5)])
  })

  it("defines Power Strike: single target, 5 focus, 20 damage", () => {
    const ps = ABILITIES["power-strike"]
    expect(ps).toBeDefined()
    expect(ps.name).toBe("Power Strike")
    expect(ps.targetSet).toBe("single")
    expect(ps.focusCost).toBe(5)
    expect(ps.effects).toEqual([new DamageEffect(20)])
  })
})
