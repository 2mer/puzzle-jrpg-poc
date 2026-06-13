import { ABILITIES } from "./ability"
import { Unit } from "./unit"

export abstract class Enemy extends Unit {
  abstract onTurn(targets: Unit[]): void
}

export class Skeleton extends Enemy {
  constructor() {
    super("Skeleton", 5, 5)
  }

  onTurn(playerParty: Unit[]): void {
    const alive = playerParty.filter((u) => !u.isDead)
    if (alive.length === 0) return

    const target = alive.reduce((lowest, current) =>
      current.health < lowest.health ? current : lowest,
    )

    const ability = ABILITIES["slash"]
    if (ability) {
      ability.apply(target, this)
    }
  }
}

export class Boss extends Enemy {
  constructor() {
    super("Boss", 20, 10)
  }

  onTurn(_targets: Unit[]): void {}
}

export class AdventurerEnemy extends Enemy {
  constructor() {
    super("Adventurer", 10, 10)
  }

  onTurn(_targets: Unit[]): void {}
}
