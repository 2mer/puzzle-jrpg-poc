export class Unit {
  name: string
  health: number
  maxHealth: number
  focus: number
  maxFocus: number

  constructor(name: string, maxHealth: number, maxFocus: number) {
    this.name = name
    this.maxHealth = maxHealth
    this.health = maxHealth
    this.maxFocus = maxFocus
    this.focus = maxFocus
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
