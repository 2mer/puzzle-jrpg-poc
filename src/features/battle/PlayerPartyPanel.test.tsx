import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { useBattleStore } from "../../providers/battle-store"
import { useSaveStore } from "../../providers/save-store"
import { Unit } from "../../shared/unit"
import { PlayerPartyPanel } from "./PlayerPartyPanel"

afterEach(() => {
  cleanup()
  useBattleStore.setState({
    levelId: null,
    playerParty: [],
    enemyParty: [],
    battleStatus: "idle",
    phase: "idle",
    currentUnitIndex: 0,
    actedUnits: [],
    selectedAbilityId: null,
  })
  useSaveStore.setState({
    completedLevelIds: [],
    unlockedCompanionIds: [],
    currentParty: { unit1Id: "", unit2Id: "", unit3Id: "" },
  })
})

describe("PlayerPartyPanel", () => {
  beforeEach(() => {
    useSaveStore.setState({
      completedLevelIds: ["level-1"],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-1")
  })

  it("renders player party units", () => {
    const unit = new Unit("Adventurer", 10, 10)
    render(<PlayerPartyPanel units={[unit]} />)
    expect(screen.getByText("Adventurer")).toBeInTheDocument()
  })

  it("renders multiple units", () => {
    const unit1 = new Unit("Adventurer", 10, 10)
    const unit2 = new Unit("Warrior", 12, 8)
    render(<PlayerPartyPanel units={[unit1, unit2]} />)
    expect(screen.getByText("Adventurer")).toBeInTheDocument()
    expect(screen.getByText("Warrior")).toBeInTheDocument()
  })

  it("renders nothing for empty party", () => {
    const { container } = render(<PlayerPartyPanel units={[]} />)
    expect(container.textContent).toBe("")
  })

  it("does not highlight player units when ability targets enemies", () => {
    useBattleStore.getState().selectAbility("slash")
    const { playerParty } = useBattleStore.getState()
    render(<PlayerPartyPanel units={playerParty} />)
    const button = screen.getByText("Adventurer").closest("button")
    expect(button?.className).not.toContain("ring")
    expect(button?.disabled).toBe(true)
  })

  it("clicking non-target player unit does nothing", async () => {
    const user = userEvent.setup()
    useBattleStore.getState().selectAbility("slash")
    const { playerParty, enemyParty } = useBattleStore.getState()
    render(<PlayerPartyPanel units={playerParty} />)
    await user.click(screen.getByText("Adventurer"))
    const state = useBattleStore.getState()
    expect(state.actedUnits[0]).toBe(false)
    expect(state.enemyParty[0].health).toBe(5)
  })
})
