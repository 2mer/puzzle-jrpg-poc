# Glossary

## Tech Stack

- **Runtime**: React 19, TypeScript 6, Vite 8
- **Styling**: Tailwind CSS
- **Components**: shadcn (tooltips, modals)
- **State**: Zustand — one store per domain (battle, save data)
- **Persistence**: localStorage with Zod schema
- **Rendering**: React DOM for all UI; Pixi.js only if GPU-heavy perf is needed later
- **No router** — screen state machine via React state
- **No backend** — single-player, fully client-side

# Glossary

## Unit

An individual combatant in battle. Every Unit belongs to one of two sides (player or enemy). Units have Health and Focus. They may be affected by Status Effects.

## Party

A group of three Units. Both the player and the enemy side field exactly one Party in battle. The side is indicated by context (variable name, property, or storage location) — there is no canonical "party type" enum.

## Health

A Unit's hit points. When a Unit's Health reaches 0, the Unit is defeated.

## Focus

A Unit's mana-like resource. Units spend Focus to perform actions.

## Turn

A round of combat. On the player's turn, the player may order their three Units to act in any sequence, each once. On the enemy's turn, enemy Units act in a fixed top-to-bottom order, each once. The player turn always happens first.

## Companion

A specific type of Unit with a fixed set of Abilities and base stats (Health, Focus). Companions are unlocked by completing milestone stages. The player fields 1-3 Companions in their Party (partial parties allowed).

## Ability

A named action a Unit can perform during its turn. Every Ability targets exactly one selected Unit (the "target"). An Ability has:
- `name`: string
- `target` (the resolved target set): one of `"target"` | `"hostile_party"` | `"friendly_party"` | `"target_party"` | `"target_opposite_party"` | `"all_parties"` | `"caster"` | `"caster_party"`
- `costs`?: `{focus?: number}`
- `effects`: list of abstract Effect objects, each with a `run(targets: Unit[]): void` method and an `affectEntity(entity: Unit): void` method that operates per-Unit.

Abilities may be Passive (no cost, no activation, always active while the Unit is alive).

## Status Effect

A temporary modifier applied to a Unit with a duration (measured in turns). The three initial types:

- **Shield** — reduces incoming damage by a percentage for the duration
- **Regen** — restores a fixed amount of Health at the start of each turn for the duration
- **Stun** — the Unit skips its next turn

## Passive

A persistent modifier on a Unit that is always active. Passives do not require a turn to use. Represented as a special Ability with no cost and no activation. Example: "Aggro" — the enemy AI must target this Unit before others.

## Enemy AI

`Enemy extends Unit` and declares an abstract `onTurn(stage: Stage): void` method. Concrete enemies (e.g. `Skeleton`, `VeteranSkeleton`) subclass Enemy (or other enemies) and implement `onTurn` with battle-state access via `stage` and self via `this`. Inheritance allows composing behaviors (e.g. `super.onTurn(stage)` + additional logic).

## Save Data

Persisted to `localStorage` via a Zod-validated schema. Contains:
- `completedLevelIds: string[]` — levels the player has beaten
- `unlockedCompanionIds: string[]` — companions available for party selection
- `currentParty: { unit1Id: string, unit2Id: string, unit3Id: string }` — currently fielded Companions

Auto-saved after every battle outcome and party composition change.

## Screen

The game has three screens, managed via a React state machine (no URL router):
1. **Main Menu** — title screen, entry point
2. **World Map** — level selection hub, accessible from Main Menu and after battle
3. **Battle** — turn-based combat scene

Three modals overlay the screens:
- **Game Over** — shown when the player loses a battle (Lose outcome)
- **Battle Won** — shown when the player wins a battle (Win outcome)
- **Party Select** — shown on the World Map to configure Party Composition

## Party Composition

The player's selection of 1-3 Companions chosen from their unlocked roster, configured on the World Map before entering a level. Partial parties are allowed — empty slots simply do not appear in battle.

## Level

A single battle scenario on the World Map. Each Level has:
- `id`: unique identifier
- `lockingConditions`: array of conditions that must be met for the level to be unlocked. Conditions are AND-composed by default; nested `{ type: "or", conditions: [...] }` allows OR logic.
- `milestone?`: if true, completing this level unlocks a new Companion
- `threshold?`: if true, this level must be completed to progress to the next section of the map
- Enemy Party data (which enemy Units appear, their stats and abilities)

Levels are connected in a branching graph on the World Map.

## Battle Result

A battle ends with one of three outcomes:
- **Win** — all enemy Units' Health reaches 0 → player is returned to the World Map and the level is marked complete
- **Lose** — all player Units' Health reaches 0 → player sees the Game Over screen
- **Run** — player abandons the battle via an on-screen button (always available, no consequence) → player is returned to the World Map; level is NOT marked complete

