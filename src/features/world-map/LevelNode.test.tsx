import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"
import { LevelNode } from "./LevelNode"

afterEach(cleanup)

describe("LevelNode", () => {
  const baseLevel = {
    id: "level-2",
    x: 350,
    y: 200,
    label: "Forest Path",
    lockCondition: ["level-1"] as string[],
    enemies: [{ type: "skeleton" as const }],
  }

  it("renders the level label", () => {
    render(<LevelNode level={baseLevel} state="locked" />)
    expect(screen.getByText("Forest Path")).toBeInTheDocument()
  })

  it("renders with locked visual state", () => {
    render(<LevelNode level={baseLevel} state="locked" />)
    expect(screen.getByTestId("level-node")).toHaveAttribute("data-state", "locked")
  })

  it("renders with unlocked visual state", () => {
    render(<LevelNode level={baseLevel} state="unlocked" />)
    expect(screen.getByTestId("level-node")).toHaveAttribute("data-state", "unlocked")
  })

  it("renders with completed visual state including checkmark", () => {
    render(<LevelNode level={baseLevel} state="completed" />)
    expect(screen.getByTestId("level-node")).toHaveAttribute("data-state", "completed")
    expect(screen.getByTestId("check-icon")).toBeInTheDocument()
  })

  it("shows milestone indicator when milestone=true", () => {
    render(<LevelNode level={{ ...baseLevel, milestone: true }} state="locked" />)
    expect(screen.getByText("★")).toBeInTheDocument()
  })

  it("shows threshold indicator when threshold=true", () => {
    render(<LevelNode level={{ ...baseLevel, threshold: true }} state="locked" />)
    expect(screen.getByText("◆")).toBeInTheDocument()
  })

  it("calls onClick when unlocked and clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<LevelNode level={baseLevel} state="unlocked" onClick={onClick} />)
    await user.click(screen.getByTestId("level-node"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("calls onClick when completed and clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<LevelNode level={baseLevel} state="completed" onClick={onClick} />)
    await user.click(screen.getByTestId("level-node"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not call onClick when locked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<LevelNode level={baseLevel} state="locked" onClick={onClick} />)
    await user.click(screen.getByTestId("level-node"))
    expect(onClick).not.toHaveBeenCalled()
  })
})
