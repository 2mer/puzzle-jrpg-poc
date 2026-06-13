import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Unit } from "../../shared/unit"
import { PlayerPartyPanel } from "./PlayerPartyPanel"

afterEach(cleanup)

describe("PlayerPartyPanel", () => {
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
})
