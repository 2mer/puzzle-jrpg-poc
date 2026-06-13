import { cleanup, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { useBattleStore } from "../../providers/battle-store"
import { useSaveStore } from "../../providers/save-store"
import { BattleScreen } from "./BattleScreen"

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

describe("BattleScreen", () => {
  const baseProps = {
    levelLabel: "Forest Path",
    levelId: "level-1",
    onRun: vi.fn(),
  }

  beforeEach(() => {
    useSaveStore.setState({
      completedLevelIds: ["level-1"],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
  })

  it("renders the level name", () => {
    render(<BattleScreen {...baseProps} />)
    expect(screen.getByText("Battle: Forest Path")).toBeInTheDocument()
  })

  it("renders a Run button", () => {
    render(<BattleScreen {...baseProps} />)
    expect(screen.getByRole("button", { name: /run/i })).toBeInTheDocument()
  })

  it("calls onRun when the Run button is clicked", async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<BattleScreen levelLabel="Forest Path" levelId="level-1" onRun={onRun} />)
    await user.click(screen.getByRole("button", { name: /run/i }))
    expect(onRun).toHaveBeenCalledOnce()
  })

  it("renders player party panel on the left", () => {
    render(<BattleScreen {...baseProps} />)
    expect(screen.getByTestId("player-party-panel")).toBeInTheDocument()
  })

  it("renders enemy party panel on the right", () => {
    render(<BattleScreen {...baseProps} />)
    expect(screen.getByTestId("enemy-party-panel")).toBeInTheDocument()
  })

  it("renders player units from the battle store", () => {
    render(<BattleScreen {...baseProps} />)
    expect(screen.getByText("Adventurer")).toBeInTheDocument()
  })

  it("renders enemy units from the battle store", () => {
    render(<BattleScreen {...baseProps} />)
    expect(screen.getByText("Skeleton")).toBeInTheDocument()
  })
})

describe("BattleScreen win/loss modals", () => {
  beforeEach(() => {
    useSaveStore.setState({
      completedLevelIds: ["level-1"],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
  })

  it("shows Battle Won modal when battleStatus is won", async () => {
    render(<BattleScreen levelLabel="Forest Path" levelId="level-1" onRun={vi.fn()} />)
    useBattleStore.setState({ battleStatus: "won" })
    await waitFor(() => {
      expect(screen.getByTestId("battle-won-modal")).toBeInTheDocument()
    })
    expect(screen.getByText(/victory/i)).toBeInTheDocument()
    expect(screen.getByText(/continue/i)).toBeInTheDocument()
  })

  it("shows level name in the Battle Won modal", async () => {
    render(<BattleScreen levelLabel="The Beginning" levelId="level-1" onRun={vi.fn()} />)
    useBattleStore.setState({ battleStatus: "won" })
    await waitFor(() => {
      expect(screen.getByTestId("battle-won-modal")).toBeInTheDocument()
    })
    const modal = screen.getByTestId("battle-won-modal")
    expect(modal).toHaveTextContent(/the beginning/i)
  })

  it("Continue button in Battle Won modal calls onRun", async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<BattleScreen levelLabel="Forest Path" levelId="level-1" onRun={onRun} />)
    useBattleStore.setState({ battleStatus: "won" })
    await waitFor(() => {
      expect(screen.getByTestId("battle-won-modal")).toBeInTheDocument()
    })
    await user.click(screen.getByRole("button", { name: /continue/i }))
    expect(onRun).toHaveBeenCalledOnce()
  })

  it("shows Game Over modal when battleStatus is lost", async () => {
    render(<BattleScreen levelLabel="Forest Path" levelId="level-1" onRun={vi.fn()} />)
    useBattleStore.setState({ battleStatus: "lost" })
    await waitFor(() => {
      expect(screen.getByTestId("game-over-modal")).toBeInTheDocument()
    })
    expect(screen.getByText(/defeat/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /back to map/i })).toBeInTheDocument()
  })

  it("Retry button in Game Over modal restarts the battle", async () => {
    const user = userEvent.setup()
    render(<BattleScreen levelLabel="Forest Path" levelId="level-1" onRun={vi.fn()} />)
    useBattleStore.setState({ battleStatus: "lost" })
    await waitFor(() => {
      expect(screen.getByTestId("game-over-modal")).toBeInTheDocument()
    })
    await user.click(screen.getByRole("button", { name: /retry/i }))
    const state = useBattleStore.getState()
    expect(state.battleStatus).toBe("active")
    expect(state.playerParty[0].health).toBe(state.playerParty[0].maxHealth)
  })

  it("Back to Map button in Game Over modal calls onRun", async () => {
    const user = userEvent.setup()
    const onRun = vi.fn()
    render(<BattleScreen levelLabel="Forest Path" levelId="level-1" onRun={onRun} />)
    useBattleStore.setState({ battleStatus: "lost" })
    await waitFor(() => {
      expect(screen.getByTestId("game-over-modal")).toBeInTheDocument()
    })
    await user.click(screen.getByRole("button", { name: /back to map/i }))
    expect(onRun).toHaveBeenCalledOnce()
  })
})
