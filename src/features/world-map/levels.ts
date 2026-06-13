export interface OrCondition {
  type: "or"
  conditions: (string | OrCondition)[]
}

export type LockCondition = string[] | OrCondition

export type EnemyType = "skeleton" | "boss" | "adventurer"

export interface EnemyConfig {
  type: EnemyType
}

export interface LevelDefinition {
  id: string
  x: number
  y: number
  label: string
  lockCondition?: LockCondition
  milestone?: boolean
  threshold?: boolean
  enemies: EnemyConfig[]
}

export const LEVELS: LevelDefinition[] = [
  {
    id: "level-1",
    x: 100,
    y: 300,
    label: "The Beginning",
    enemies: [{ type: "skeleton" }],
  },
  {
    id: "level-2",
    x: 350,
    y: 200,
    label: "Forest Path",
    lockCondition: ["level-1"],
    enemies: [{ type: "skeleton" }],
  },
  {
    id: "level-3",
    x: 350,
    y: 400,
    label: "Cavern Depths",
    lockCondition: ["level-1"],
    enemies: [{ type: "skeleton" }, { type: "skeleton" }],
  },
  {
    id: "level-4",
    x: 700,
    y: 150,
    label: "Sky Summit",
    lockCondition: ["level-2"],
    enemies: [{ type: "skeleton" }, { type: "skeleton" }],
  },
  {
    id: "level-5",
    x: 700,
    y: 450,
    label: "Abyss Gate",
    lockCondition: ["level-3"],
    milestone: true,
    threshold: true,
    enemies: [{ type: "boss" }],
  },
  {
    id: "level-6",
    x: 950,
    y: 300,
    label: "Crossroads",
    lockCondition: {
      type: "or",
      conditions: ["level-4", "level-5"],
    },
    enemies: [{ type: "adventurer" }],
    milestone: true,
  },
  {
    id: "level-7",
    x: 1150,
    y: 300,
    label: "Final Bastion",
    lockCondition: ["level-6"],
    enemies: [{ type: "skeleton" }, { type: "skeleton" }, { type: "skeleton" }],
  },
]
