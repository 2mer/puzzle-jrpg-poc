export type StatusEffectType = "shield" | "regen" | "stun"

export interface AppliedStatusEffect {
  type: StatusEffectType
  duration: number
  data: Record<string, number>
}
