export interface CompanionData {
  id: string
  name: string
  maxHealth: number
  maxFocus: number
  abilityIds: string[]
}

export const COMPANIONS: Record<string, CompanionData> = {
  adventurer: {
    id: "adventurer",
    name: "Adventurer",
    maxHealth: 10,
    maxFocus: 10,
    abilityIds: ["slash", "power-strike"],
  },
}
