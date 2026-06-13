export class Unit {
  name: string
  health: number
  maxHealth: number
  focus: number
  maxFocus: number
  abilityIds: string[]

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

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount)
  }

  heal(amount: number): void {
    if (this.isDead) return
    this.health = Math.min(this.maxHealth, this.health + amount)
  }
}
