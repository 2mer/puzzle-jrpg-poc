import { Unit } from "./unit"

export abstract class Enemy extends Unit {
  abstract onTurn(): void
}

export class Skeleton extends Enemy {
  constructor() {
    super("Skeleton", 5, 5)
  }

  onTurn(): void {}
}

export class Boss extends Enemy {
  constructor() {
    super("Boss", 20, 10)
  }

  onTurn(): void {}
}

export class AdventurerEnemy extends Enemy {
  constructor() {
    super("Adventurer", 10, 10)
  }

  onTurn(): void {}
}
