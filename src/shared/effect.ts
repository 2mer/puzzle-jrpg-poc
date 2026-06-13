import type { Unit } from "./unit"

export abstract class Effect {
  abstract affectEntity(unit: Unit): void

  run(targets: Unit[]): void {
    for (const target of targets) {
      this.affectEntity(target)
    }
  }
}

export class DamageEffect extends Effect {
  baseDamage: number

  constructor(baseDamage: number) {
    super()
    this.baseDamage = baseDamage
  }

  affectEntity(unit: Unit): void {
    unit.takeDamage(this.baseDamage)
  }
}
