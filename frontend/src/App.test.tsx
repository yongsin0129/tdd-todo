import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('should render the app with Vite + React + Tailwind v4 title', () => {
    render(<App />)
    expect(screen.getByText(/vite \+ react \+ tailwind v4/i)).toBeInTheDocument()
  })

  it('should increment counter when button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is 0/i })
    expect(button).toBeInTheDocument()

    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })

  it('should render Vite and React logos', () => {
    render(<App />)

    const viteLogo = screen.getByAltText(/vite logo/i)
    const reactLogo = screen.getByAltText(/react logo/i)

    expect(viteLogo).toBeInTheDocument()
    expect(reactLogo).toBeInTheDocument()
  })
})
