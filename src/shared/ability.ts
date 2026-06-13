import type { Unit } from "./unit"

export type TargetSet = "single" | "party" | "all" | "self"

export interface DamageEffect {
  type: "damage"
  baseDamage: number
}

export type Effect = DamageEffect

export class Ability {
  name: string
  targetSet: TargetSet
  focusCost: number
  effects: Effect[]

  constructor(name: string, targetSet: TargetSet, focusCost: number, effects: Effect[]) {
    this.name = name
    this.targetSet = targetSet
    this.focusCost = focusCost
    this.effects = effects
  }

  canBeUsed(unit: Unit): boolean {
    return unit.focus >= this.focusCost
  }

  resolveTargets(source: Unit, allies: Unit[], enemies: Unit[]): Unit[] {
    const alive = (units: Unit[]) => units.filter((u) => !u.isDead)
    switch (this.targetSet) {
      case "self":
        return [source]
      case "single":
        return alive(enemies)
      case "party":
        return alive(allies)
      case "all":
        return [...alive(allies), ...alive(enemies)]
    }
  }

  apply(target: Unit, source?: Unit): void {
    if (source) {
      source.focus = Math.max(0, source.focus - this.focusCost)
    }
    for (const effect of this.effects) {
      if (effect.type === "damage") {
        target.takeDamage(effect.baseDamage)
      }
    }
  }
}

export const ABILITIES: Record<string, Ability> = {
  slash: new Ability("Slash", "single", 0, [{ type: "damage", baseDamage: 10 }]),
  "power-strike": new Ability("Power Strike", "single", 5, [{ type: "damage", baseDamage: 20 }]),
}
