import React from 'react'
import { FileText } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'

const Nav = styled.nav`
  padding: ${theme.spacing.lg} ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled.a`
  color: white;
  font-size: ${theme.fontSize['2xl']};
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  text-decoration: none;
  cursor: pointer;
`

const NavLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.xl};
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    display: none;
  }
`

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
  
  &:hover {
    opacity: 0.8;
  }
`

const Navigation: React.FC = () => {
  return (
    <Nav>
      <Logo href="/">
        <FileText size={32} />
        InvoiceFlow
      </Logo>
      <NavLinks>
        <NavLink href="#features">Features</NavLink>
        <NavLink href="#pricing">Pricing</NavLink>
        <NavLink href="#contact">Contact</NavLink>
      </NavLinks>
    </Nav>
  )
}

export default Navigation