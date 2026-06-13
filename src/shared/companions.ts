export interface CompanionData {
  id: string
  name: string
  maxHealth: number
  maxFocus: number
}

export const COMPANIONS: Record<string, CompanionData> = {
  adventurer: {
    id: "adventurer",
    name: "Adventurer",
    maxHealth: 10,
    maxFocus: 10,
  },
}
