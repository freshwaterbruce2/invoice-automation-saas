import React from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components'

import { theme } from '../../config/theme'

const Grid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.xl};
  margin: 4rem 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: ${theme.spacing.xl};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.3);
`

const StatNumber = styled.h3`
  font-size: ${theme.fontSize['4xl']};
  font-weight: bold;
  margin-bottom: ${theme.spacing.sm};
`

const StatLabel = styled.p`
  font-size: ${theme.fontSize.base};
  opacity: 0.9;
`

interface Stat {
  number: string
  label: string
}

const stats: Stat[] = [
  { number: '70%', label: 'Cost Reduction' },
  { number: '3x', label: 'Faster Payments' },
  { number: '500+', label: 'Happy Businesses' },
]

const StatsGrid: React.FC = () => {
  return (
    <Grid>
      {stats.map((stat, index) => (
        <StatCard
          key={stat.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <StatNumber>{stat.number}</StatNumber>
          <StatLabel>{stat.label}</StatLabel>
        </StatCard>
      ))}
    </Grid>
  )
}

export default StatsGrid