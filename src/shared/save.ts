import { z } from 'zod'

export const PartyMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number(),
  hp: z.number(),
  maxHp: z.number(),
})

export const GameSaveSchema = z.object({
  levelUnlocked: z.number(),
  party: z.array(PartyMemberSchema),
  createdAt: z.string(),
})

export type GameSave = z.infer<typeof GameSaveSchema>

const SAVE_KEY = 'puzzle-jrpg-save'

export function createNewSave(): GameSave {
  return {
    levelUnlocked: 1,
    party: [
      { id: 'adventurer', name: 'Adventurer', level: 1, hp: 20, maxHp: 20 },
    ],
    createdAt: new Date().toISOString(),
  }
}

export function saveGame(data: GameSave): void {
  const parsed = GameSaveSchema.parse(data)
  localStorage.setItem(SAVE_KEY, JSON.stringify(parsed))
}

export function loadGame(): GameSave | null {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null
  try {
    return GameSaveSchema.parse(JSON.parse(raw))
  } catch {
    return null
  }
}
