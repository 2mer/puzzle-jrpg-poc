import { cleanup, render, screen } from "@testing-library/react"
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
