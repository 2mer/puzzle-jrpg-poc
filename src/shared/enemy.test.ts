import { describe, expect, it } from "vitest"
import { Boss, Enemy, Skeleton } from "./enemy"

describe("Enemy", () => {
  it("has an onTurn stub", () => {
    const enemy = new (class extends Enemy {
      constructor() {
        super("Test", 10, 5)
      }
      onTurn(): void {
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
