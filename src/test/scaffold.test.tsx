import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from '../components/ui/button'

describe('project scaffold', () => {
  it('renders the Button component with correct label', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('applies Tailwind CSS classes via className prop', () => {
    render(<Button className="text-red-500">Styled</Button>)
    const button = screen.getByRole('button', { name: /styled/i })
    expect(button.className).toContain('text-red-500')
  })
})
