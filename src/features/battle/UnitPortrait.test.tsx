import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Unit } from "../../shared/unit"
import { UnitPortrait } from "./UnitPortrait"

afterEach(cleanup)

describe("UnitPortrait", () => {
  it("renders the unit name", () => {
    const unit = new Unit("Adventurer", 10, 10)
    render(<UnitPortrait unit={unit} />)
    expect(screen.getByText("Adventurer")).toBeInTheDocument()
  })

  it("shows HP bar with current/max health", () => {
    const unit = new Unit("Adventurer", 10, 10)
    unit.takeDamage(3)
    render(<UnitPortrait unit={unit} />)
    expect(screen.getByText("7/10")).toBeInTheDocument()
  })

  it("shows Focus bar with current/max focus", () => {
    const unit = new Unit("Adventurer", 10, 10)
    render(<UnitPortrait unit={unit} />)
    const focusTexts = screen.getAllByText("10/10")
    expect(focusTexts.length).toBe(2)
    expect(screen.getByText("Focus")).toBeInTheDocument()
  })

  it("HP bar is green when health > 60%", () => {
    const unit = new Unit("Adventurer", 10, 10)
    unit.takeDamage(1)
    render(<UnitPortrait unit={unit} />)
    const hpBar = screen.getByTestId("hp-bar-fill")
    expect(hpBar.className).toContain("bg-green")
  })

  it("HP bar is yellow when health is 30-60%", () => {
    const unit = new Unit("Adventurer", 10, 10)
    unit.takeDamage(6)
    render(<UnitPortrait unit={unit} />)
    const hpBar = screen.getByTestId("hp-bar-fill")
    expect(hpBar.className).toContain("bg-yellow")
  })

  it("HP bar is red when health < 30%", () => {
    const unit = new Unit("Adventurer", 10, 10)
    unit.takeDamage(8)
    render(<UnitPortrait unit={unit} />)
    const hpBar = screen.getByTestId("hp-bar-fill")
    expect(hpBar.className).toContain("bg-red")
  })

  it("dead unit appears greyed out", () => {
    const unit = new Unit("Adventurer", 10, 10)
    unit.takeDamage(10)
    render(<UnitPortrait unit={unit} />)
    const portrait = screen.getByTestId("unit-portrait")
    expect(portrait.className).toContain("opacity-50")
  })

  it("HP bar width reflects health percentage", () => {
    const unit = new Unit("Adventurer", 10, 10)
    unit.takeDamage(5)
    render(<UnitPortrait unit={unit} />)
    const hpBar = screen.getByTestId("hp-bar-fill")
    expect(hpBar.style.width).toBe("50%")
  })

  it("renders Focus bar in blue", () => {
    const unit = new Unit("Adventurer", 10, 10)
    render(<UnitPortrait unit={unit} />)
    const focusBar = screen.getByTestId("focus-bar-fill")
    expect(focusBar.className).toContain("bg-blue")
  })
})
