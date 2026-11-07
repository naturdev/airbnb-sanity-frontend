import { render, screen } from '@testing-library/react'
import NavBar from '../../components/NavBar'

describe('NavBar', () => {
  it('renders without crashing', () => {
    render(<NavBar />)
    const navElement = screen.getByRole('generic', { class: 'nav' })
    expect(navElement).toBeInTheDocument()
  })

  it('renders the logo container', () => {
    const { container } = render(<NavBar />)
    const logo = container.querySelector('.logo')
    expect(logo).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    const { container } = render(<NavBar />)
    const nav = container.querySelector('.nav')
    const logo = container.querySelector('.logo')
    
    expect(nav).toHaveClass('nav')
    expect(logo).toHaveClass('logo')
  })
})
