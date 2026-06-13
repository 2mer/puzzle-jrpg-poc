import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { useBattleStore } from "../../providers/battle-store"
import { useSaveStore } from "../../providers/save-store"
import { AbilityBar } from "./AbilityBar"

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

describe("AbilityBar", () => {
  beforeEach(() => {
    useSaveStore.setState({
      completedLevelIds: ["level-1"],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
    useBattleStore.getState().startBattle("level-1")
  })

  it("renders the current unit name", () => {
    render(<AbilityBar />)
    expect(screen.getByText("Adventurer's Turn")).toBeInTheDocument()
  })

  it("renders abilities for the current unit", () => {
    render(<AbilityBar />)
    expect(screen.getByText("Slash")).toBeInTheDocument()
    expect(screen.getByText("Power Strike")).toBeInTheDocument()
  })

  it("shows focus cost for each ability", () => {
    render(<AbilityBar />)
    expect(screen.getByText(/0 Focus/)).toBeInTheDocument()
    expect(screen.getByText(/5 Focus/)).toBeInTheDocument()
  })

  it("shows End Turn button", () => {
    render(<AbilityBar />)
    expect(screen.getByRole("button", { name: /end turn/i })).toBeInTheDocument()
  })

  it("clicking an ability selects it", async () => {
    const user = userEvent.setup()
    render(<AbilityBar />)
    await user.click(screen.getByText("Slash"))
    expect(useBattleStore.getState().selectedAbilityId).toBe("slash")
  })

  it("highlights selected ability", async () => {
    const user = userEvent.setup()
    render(<AbilityBar />)
    await user.click(screen.getByText("Slash"))
    const button = screen.getByText("Slash").closest("button")
    expect(button?.className).toContain("ring")
  })

  it("clicking End Turn advances turn and triggers enemy phase", async () => {
    const user = userEvent.setup()
    render(<AbilityBar />)
    await user.click(screen.getByRole("button", { name: /end turn/i }))
    const state = useBattleStore.getState()
    // Enemy phase ran: skeleton damaged the player
    expect(state.playerParty[0].health).toBeLessThan(10)
    // actedUnits reset after enemy phase
    expect(state.actedUnits[0]).toBe(false)
    expect(state.phase).toBe("playerTurn")
  })

  it("does not render when phase is enemyTurn", () => {
    useBattleStore.setState({ phase: "enemyTurn" })
    const { container } = render(<AbilityBar />)
    expect(container.textContent).toBe("")
  })
})
