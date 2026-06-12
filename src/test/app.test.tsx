import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"
import { App } from "../App"
import { useSaveStore } from "../providers/save-store"
import { useScreenStore } from "../providers/screen-store"

afterEach(() => {
  cleanup()
  useScreenStore.setState({ screen: "main-menu" })
  useSaveStore.setState({
    completedLevelIds: [],
    unlockedCompanionIds: [],
    currentParty: { unit1Id: "", unit2Id: "", unit3Id: "" },
  })
})

describe("App integration", () => {
  it("renders the main menu by default", () => {
    render(<App />)
    expect(screen.getByText("Puzzle JRPG")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /new game/i })).toBeInTheDocument()
  })

  it("transitions to world map after new game", async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole("button", { name: /new game/i }))
    expect(screen.getByText("World Map")).toBeInTheDocument()
  })

  it("loads initial save data when starting new game", async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole("button", { name: /new game/i }))
    expect(screen.getByTestId("level-node-level-1")).toHaveAttribute("data-state", "completed")
    expect(screen.getByTestId("level-node-level-2")).toHaveAttribute("data-state", "unlocked")
  })

  it("navigates back to main menu from world map", async () => {
    const user = userEvent.setup()
    useScreenStore.getState().goToWorldMap()
    render(<App />)
    await user.click(screen.getByRole("button", { name: /back/i }))
    expect(screen.getByText("Puzzle JRPG")).toBeInTheDocument()
  })
})
