import { cleanup, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"
import { Skeleton } from "../../shared/enemy"
import { EnemyPartyPanel } from "./EnemyPartyPanel"

afterEach(cleanup)

describe("EnemyPartyPanel", () => {
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
})
