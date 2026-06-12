import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { BattleScreen } from "./BattleScreen"

afterEach(cleanup)

describe("BattleScreen", () => {
  const baseProps = {
    levelLabel: "Forest Path",
    onRun: vi.fn(),
  }

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
    render(<BattleScreen levelLabel="Forest Path" onRun={onRun} />)
    await user.click(screen.getByRole("button", { name: /run/i }))
    expect(onRun).toHaveBeenCalledOnce()
  })
})
