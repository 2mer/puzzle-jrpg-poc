import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../App'
import { useNavigationStore } from '../shared/store'

describe('Main Menu → New Game → World Map', () => {
  beforeEach(() => {
    cleanup()
    localStorage.clear()
    useNavigationStore.getState().reset()
  })

  it('renders the Main Menu by default with a New Game button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
  })

  it('creates save data in localStorage when New Game is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /new game/i }))
    const raw = localStorage.getItem('puzzle-jrpg-save')
    expect(raw).not.toBeNull()
    const save = JSON.parse(raw!)
    expect(save.levelUnlocked).toBe(1)
    expect(save.party).toHaveLength(1)
    expect(save.party[0].name).toBe('Adventurer')
    expect(save.createdAt).toBeDefined()
  })

  it('transitions to World Map screen after clicking New Game', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /new game/i }))
    expect(screen.getByText(/world map/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /new game/i })).not.toBeInTheDocument()
  })

  it('provides back navigation from World Map to Main Menu', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /new game/i }))
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument()
  })
})
