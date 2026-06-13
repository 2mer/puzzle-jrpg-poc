import { describe, expect, it } from "vitest"
import { Boss, Enemy, Skeleton } from "./enemy"
import { Unit } from "./unit"

describe("Enemy", () => {
  it("has an onTurn stub", () => {
    const enemy = new (class extends Enemy {
      constructor() {
        super("Test", 10, 5)
      }
      onTurn(_targets: Unit[]): void {
        // stub
      }
    })()
    expect(typeof enemy.onTurn).toBe("function")
  })
})

describe("Skeleton", () => {
  it("has 5 health and 5 focus", () => {
    const skeleton = new Skeleton()
    expect(skeleton.maxHealth).toBe(5)
    expect(skeleton.health).toBe(5)
    expect(skeleton.maxFocus).toBe(5)
    expect(skeleton.focus).toBe(5)
  })

  it("has the name Skeleton", () => {
    const skeleton = new Skeleton()
    expect(skeleton.name).toBe("Skeleton")
  })

  it("can take damage and die", () => {
    const skeleton = new Skeleton()
    skeleton.takeDamage(5)
    expect(skeleton.health).toBe(0)
    expect(skeleton.isDead).toBe(true)
  })

  it("onTurn attacks the lowest-HP player unit with slash", () => {
    const skeleton = new Skeleton()
    const highHp = new Unit("High HP", 20, 10)
    const lowHp = new Unit("Low HP", 10, 10)
    lowHp.takeDamage(5)

    skeleton.onTurn([highHp, lowHp])

    expect(lowHp.health).toBe(0)
    expect(highHp.health).toBe(20)
  })

  it("onTurn does nothing when no alive player units", () => {
    const skeleton = new Skeleton()
    const dead = new Unit("Dead", 10, 10)
    dead.takeDamage(10)

    skeleton.onTurn([dead])

    expect(dead.health).toBe(0)
  })

  it("onTurn deals correct damage amount", () => {
    const skeleton = new Skeleton()
    const target = new Unit("Target", 20, 10)

    skeleton.onTurn([target])

    expect(target.health).toBe(10)
  })
})

describe("Boss", () => {
  it("has 20 health and 10 focus", () => {
    const boss = new Boss()
    expect(boss.maxHealth).toBe(20)
    expect(boss.health).toBe(20)
    expect(boss.maxFocus).toBe(10)
    expect(boss.focus).toBe(10)
  })

  it("has the name Boss", () => {
    const boss = new Boss()
    expect(boss.name).toBe("Boss")
  })
})
