import React from 'react'
import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { theme } from '../../config/theme'

interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
  onClick?: () => void
  className?: string
}

const cardVariants = {
  default: css`
    background: ${theme.colors.background};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  `,
  elevated: css`
    background: ${theme.colors.background};
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  `,
  outlined: css`
    background: ${theme.colors.background};
    border: 2px solid ${theme.colors.border};
    box-shadow: none;
  `,
}

const cardPadding = {
  sm: theme.spacing.md,
  md: theme.spacing.lg,
  lg: theme.spacing.xl,
}

const StyledCard = styled(motion.div)<{
  $variant: CardProps['variant']
  $padding: CardProps['padding']
  $hoverable?: boolean
  $clickable?: boolean
}>`
  border-radius: ${theme.borderRadius.lg};
  transition: all 0.3s ease;
  
  ${props => cardVariants[props.$variant || 'default']}
  padding: ${props => cardPadding[props.$padding || 'md']};
  
  ${props => props.$clickable && css`
    cursor: pointer;
  `}
  
  ${props => props.$hoverable && css`
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }
  `}
`

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
  className,
}) => {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $hoverable={hoverable}
      $clickable={!!onClick}
      onClick={onClick}
      className={className}
      whileHover={hoverable ? { y: -4 } : undefined}
      transition={{ duration: 0.3 }}
    >
      {children}
    </StyledCard>
  )
}

export default Card