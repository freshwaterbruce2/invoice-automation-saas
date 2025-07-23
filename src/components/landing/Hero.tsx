import React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

import { theme } from '../../config/theme'

import EmailCapture from './EmailCapture'
import StatsGrid from './StatsGrid'

const HeroSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
  color: white;
`

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: bold;
  margin-bottom: ${theme.spacing.lg};
  line-height: 1.2;
`

const Subtitle = styled(motion.p)`
  font-size: clamp(1.125rem, 3vw, 1.5rem);
  margin-bottom: ${theme.spacing.xxl};
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`

const Hero: React.FC = () => {
  return (
    <HeroSection>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Stop Chasing Payments.<br />
        Start Growing Your Business.
      </Title>
      
      <Subtitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Automate your invoicing, get paid 3x faster, and save 70% on processing costs. 
        Join 500+ businesses already using InvoiceFlow.
      </Subtitle>

      <EmailCapture />
      <StatsGrid />
    </HeroSection>
  )
}

export default Hero