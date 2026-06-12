import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { LevelNode } from "./LevelNode"

afterEach(cleanup)

describe("LevelNode", () => {
  const baseLevel = {
    id: "level-2",
    x: 350,
    y: 200,
    label: "Forest Path",
    lockCondition: ["level-1"] as string[],
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
})
