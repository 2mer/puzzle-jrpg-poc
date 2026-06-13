import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { useBattleStore } from "../../providers/battle-store"
import { Skeleton } from "../../shared/enemy"
import { EnemyPartyPanel } from "./EnemyPartyPanel"
import { resetBattleStores, setupBattleTest } from "./test-utils"

afterEach(() => {
  cleanup()
  resetBattleStores()
})

describe("EnemyPartyPanel", () => {
  beforeEach(setupBattleTest)

  it("renders enemy party units", () => {
    const enemy = new Skeleton()
    render(<EnemyPartyPanel units={[enemy]} />)
    expect(screen.getByText("Skeleton")).toBeInTheDocument()
  })

  it("renders multiple enemies", () => {
    const enemy1 = new Skeleton()
    const enemy2 = new Skeleton()
    render(<EnemyPartyPanel units={[enemy1, enemy2]} />)
    const skeletons = screen.getAllByText("Skeleton")
    expect(skeletons.length).toBe(2)
  })

  it("renders nothing for empty party", () => {
    const { container } = render(<EnemyPartyPanel units={[]} />)
    expect(container.textContent).toBe("")
  })

  it("highlights enemy with yellow ring when valid target of selected ability", async () => {
    useBattleStore.getState().selectAbility("slash")
    const { enemyParty } = useBattleStore.getState()
    render(<EnemyPartyPanel units={enemyParty} />)
    const button = screen.getByText("Skeleton").closest("button")
    expect(button?.className).toContain("ring-2")
    expect(button?.className).toContain("ring-yellow-400")
    expect(button?.disabled).toBe(false)
  })

  it("does not highlight enemy when no ability selected", () => {
    const { enemyParty } = useBattleStore.getState()
    render(<EnemyPartyPanel units={enemyParty} />)
    const button = screen.getByText("Skeleton").closest("button")
    expect(button?.className).not.toContain("ring")
    expect(button?.disabled).toBe(true)
  })

  it("clicking on highlighted target resolves ability dealing damage", async () => {
    const user = userEvent.setup()
    useBattleStore.getState().selectAbility("slash")
    const { enemyParty } = useBattleStore.getState()
    render(<EnemyPartyPanel units={enemyParty} />)
    await user.click(screen.getByText("Skeleton"))
    const state = useBattleStore.getState()
    expect(state.enemyParty[0].health).toBe(0)
    expect(state.enemyParty[0].isDead).toBe(true)
  })

  it("clicking on highlighted target deducts focus from acting unit", async () => {
    const user = userEvent.setup()
    useBattleStore.getState().selectAbility("power-strike")
    const { enemyParty } = useBattleStore.getState()
    render(<EnemyPartyPanel units={enemyParty} />)
    await user.click(screen.getByText("Skeleton"))
    const state = useBattleStore.getState()
    expect(state.playerParty[0].focus).toBe(5)
  })

  it("clicking on highlighted target marks unit as acted then resets after enemy phase", async () => {
    const user = userEvent.setup()
    useBattleStore.getState().selectAbility("slash")
    const { enemyParty } = useBattleStore.getState()
    render(<EnemyPartyPanel units={enemyParty} />)
    await user.click(screen.getByText("Skeleton"))
    const state = useBattleStore.getState()
    // Enemy was killed, enemy phase processed (dead enemy does nothing), actedUnits reset
    expect(state.enemyParty[0].isDead).toBe(true)
    expect(state.actedUnits[0]).toBe(false)
    expect(state.phase).toBe("playerTurn")
  })
})
