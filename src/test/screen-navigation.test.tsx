import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { App } from "../App"
import { useSaveStore } from "../providers/save-store"
import { useScreenStore } from "../providers/screen-store"
import { SAVE_DATA_KEY } from "../shared/schemas/save-data"

describe("Main Menu → New Game → World Map", () => {
  beforeEach(() => {
    cleanup()
    localStorage.clear()
    useScreenStore.setState({ screen: "main-menu", battleLevelId: null })
    useSaveStore.setState({
      completedLevelIds: [],
      unlockedCompanionIds: [],
      currentParty: { unit1Id: "", unit2Id: "", unit3Id: "" },
    })
    // zustand persist middleware writes empty state back to localStorage on setState,
    // so clear it again to simulate "no saved game"
    localStorage.removeItem(SAVE_DATA_KEY)
  })

  it("renders the Main Menu by default with a New Game button", () => {
    render(<App />)
    expect(screen.getByRole("button", { name: /new game/i })).toBeInTheDocument()
  })

  it("transitions to World Map screen after clicking New Game", async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole("button", { name: /new game/i }))
    expect(screen.getByText(/world map/i)).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /new game/i })).not.toBeInTheDocument()
  })

  it("provides back navigation from World Map to Main Menu", async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole("button", { name: /new game/i }))
    await user.click(screen.getByRole("button", { name: /back/i }))
    expect(screen.getByRole("button", { name: /new game/i })).toBeInTheDocument()
  })

  it("renders Continue button disabled when no saved game exists", () => {
    render(<App />)
    expect(screen.getByRole("button", { name: /continue/i })).toBeDisabled()
  })

  it("renders Continue button enabled when a saved game exists", () => {
    useSaveStore.setState({
      completedLevelIds: ["level-1"],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
    render(<App />)
    expect(screen.getByRole("button", { name: /continue/i })).not.toBeDisabled()
  })

  it("transitions to World Map screen after clicking Continue with a save", async () => {
    const user = userEvent.setup()
    useSaveStore.setState({
      completedLevelIds: ["level-1"],
      unlockedCompanionIds: ["adventurer"],
      currentParty: { unit1Id: "adventurer", unit2Id: "", unit3Id: "" },
    })
    render(<App />)
    await user.click(screen.getByRole("button", { name: /continue/i }))
    expect(screen.getByText(/world map/i)).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /continue/i })).not.toBeInTheDocument()
  })
})
