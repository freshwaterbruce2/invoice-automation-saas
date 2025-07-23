import React from 'react'
import styled from 'styled-components'

import Navigation from '../components/common/Navigation'
import Features from '../components/landing/Features'
import Hero from '../components/landing/Hero'
import Pricing from '../components/landing/Pricing'
import { theme } from '../config/theme'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
`

const Landing: React.FC = () => {
  return (
    <Container>
      <Navigation />
      <Hero />
      <Features />
      <Pricing />
    </Container>
  )
}

export default Landing