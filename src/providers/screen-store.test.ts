import { describe, expect, it, beforeEach } from "vitest"
import { useScreenStore } from "./screen-store"

describe("useScreenStore", () => {
  beforeEach(() => {
    useScreenStore.setState({ screen: "main-menu", battleLevelId: null })
  })

  it("starts at main-menu", () => {
    expect(useScreenStore.getState().screen).toBe("main-menu")
  })

  it("goToWorldMap transitions to world-map", () => {
    useScreenStore.getState().goToWorldMap()
    expect(useScreenStore.getState().screen).toBe("world-map")
  })

  it("goToBattle transitions to battle", () => {
    useScreenStore.getState().goToBattle("level-1")
    expect(useScreenStore.getState().screen).toBe("battle")
  })

  it("goToBattle stores the level id", () => {
    useScreenStore.getState().goToBattle("level-2")
    expect(useScreenStore.getState().battleLevelId).toBe("level-2")
  })

  it("goToMainMenu returns to main-menu and clears battleLevelId", () => {
    useScreenStore.getState().goToBattle("level-1")
    useScreenStore.getState().goToMainMenu()
    expect(useScreenStore.getState().screen).toBe("main-menu")
    expect(useScreenStore.getState().battleLevelId).toBeNull()
  })
})
