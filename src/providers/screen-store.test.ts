import { describe, expect, it, beforeEach } from "vitest"
import { useScreenStore } from "./screen-store"

describe("useScreenStore", () => {
  beforeEach(() => {
    useScreenStore.setState({ screen: "main-menu" })
  })

  it("starts at main-menu", () => {
    expect(useScreenStore.getState().screen).toBe("main-menu")
  })

  it("goToWorldMap transitions to world-map", () => {
    useScreenStore.getState().goToWorldMap()
    expect(useScreenStore.getState().screen).toBe("world-map")
  })

  it("goToBattle transitions to battle", () => {
    useScreenStore.getState().goToBattle()
    expect(useScreenStore.getState().screen).toBe("battle")
  })

  it("goToMainMenu returns to main-menu", () => {
    useScreenStore.getState().goToWorldMap()
    useScreenStore.getState().goToMainMenu()
    expect(useScreenStore.getState().screen).toBe("main-menu")
  })
})
