import type { AppliedStatusEffect, StatusEffectType } from "./status-effect"

export class Unit {
  name: string
  health: number
  maxHealth: number
  focus: number
  maxFocus: number
  abilityIds: string[]
  statusEffects: AppliedStatusEffect[] = []

  constructor(name: string, maxHealth: number, maxFocus: number, abilityIds: string[] = []) {
    this.name = name
    this.maxHealth = maxHealth
    this.health = maxHealth
    this.maxFocus = maxFocus
    this.focus = maxFocus
    this.abilityIds = abilityIds
  }

  get isDead(): boolean {
    return this.health <= 0
  }

  get isStunned(): boolean {
    return this.hasStatusEffect("stun")
  }

  addStatusEffect(effect: AppliedStatusEffect): void {
    this.statusEffects.push(effect)
  }

  hasStatusEffect(type: StatusEffectType): boolean {
    return this.statusEffects.some((e) => e.type === type)
  }

  clearStatusEffect(type: StatusEffectType): void {
    this.statusEffects = this.statusEffects.filter((e) => e.type !== type)
  }

  tickStatusEffects(): void {
    for (const effect of this.statusEffects) {
      if (effect.type === "regen") {
        this.heal(effect.data.amount ?? 0)
      }
    }
    this.statusEffects = this.statusEffects
      .map((e) => ({ ...e, duration: e.duration - 1 }))
      .filter((e) => e.duration > 0)
  }

  takeDamage(amount: number): void {
    let modified = amount
    for (const effect of this.statusEffects) {
      if (effect.type === "shield") {
        modified = Math.max(0, Math.round(modified * (1 - (effect.data.percentage ?? 0))))
      }
    }
    this.health = Math.max(0, this.health - modified)
  }

  heal(amount: number): void {
    if (this.isDead) return
    this.health = Math.min(this.maxHealth, this.health + amount)
  }
}
