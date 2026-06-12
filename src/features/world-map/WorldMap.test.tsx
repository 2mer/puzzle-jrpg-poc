import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { LEVELS } from "./levels"
import { WorldMap } from "./WorldMap"

afterEach(cleanup)

describe("WorldMap", () => {
  it("renders the title", () => {
    render(<WorldMap completedLevelIds={[]} />)
    expect(screen.getByText("World Map")).toBeInTheDocument()
  })

  it("renders a LevelNode for each level definition", () => {
    render(<WorldMap completedLevelIds={[]} />)
    LEVELS.forEach((level) => {
      expect(screen.getByTestId(`level-node-${level.id}`)).toBeInTheDocument()
    })
  })

  it("shows level-1 as unlocked when no levels are completed", () => {
    render(<WorldMap completedLevelIds={[]} />)
    const node = screen.getByTestId("level-node-level-1")
    expect(node).toHaveAttribute("data-state", "unlocked")
  })

  it("shows level-2 as locked when no levels are completed", () => {
    render(<WorldMap completedLevelIds={[]} />)
    const node = screen.getByTestId("level-node-level-2")
    expect(node).toHaveAttribute("data-state", "locked")
  })

  it("shows level-2 as unlocked after level-1 is completed", () => {
    render(<WorldMap completedLevelIds={["level-1"]} />)
    const node = screen.getByTestId("level-node-level-2")
    expect(node).toHaveAttribute("data-state", "unlocked")
  })

  it("shows level-1 as completed when in completedLevelIds", () => {
    render(<WorldMap completedLevelIds={["level-1"]} />)
    const node = screen.getByTestId("level-node-level-1")
    expect(node).toHaveAttribute("data-state", "completed")
  })

  it("shows level-6 as unlocked when either level-4 or level-5 is completed (OR)", () => {
    render(<WorldMap completedLevelIds={["level-1", "level-2", "level-3", "level-4"]} />)
    const node = screen.getByTestId("level-node-level-6")
    expect(node).toHaveAttribute("data-state", "unlocked")
  })

  it("shows level-7 as unlocked after level-6 is completed", () => {
    render(<WorldMap completedLevelIds={["level-1", "level-2", "level-3", "level-4", "level-6"]} />)
    const node = screen.getByTestId("level-node-level-7")
    expect(node).toHaveAttribute("data-state", "unlocked")
  })

  it("renders a back to main menu button when onBack is provided", () => {
    render(<WorldMap completedLevelIds={[]} onBack={() => {}} />)
    expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument()
  })

  it("calls onLevelClick with level id when an unlocked level is clicked", async () => {
    const user = userEvent.setup()
    const onLevelClick = vi.fn()
    render(<WorldMap completedLevelIds={[]} onLevelClick={onLevelClick} />)
    await user.click(screen.getByTestId("level-node-level-1"))
    expect(onLevelClick).toHaveBeenCalledWith("level-1")
  })

  it("calls onLevelClick when a completed level is clicked", async () => {
    const user = userEvent.setup()
    const onLevelClick = vi.fn()
    render(<WorldMap completedLevelIds={["level-1"]} onLevelClick={onLevelClick} />)
    await user.click(screen.getByTestId("level-node-level-1"))
    expect(onLevelClick).toHaveBeenCalledWith("level-1")
  })

  it("does not call onLevelClick when a locked level is clicked", async () => {
    const user = userEvent.setup()
    const onLevelClick = vi.fn()
    render(<WorldMap completedLevelIds={[]} onLevelClick={onLevelClick} />)
    await user.click(screen.getByTestId("level-node-level-2"))
    expect(onLevelClick).not.toHaveBeenCalled()
  })
})
