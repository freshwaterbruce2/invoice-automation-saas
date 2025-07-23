import React from 'react'
import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

import { theme } from '../../config/theme'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  isLoading?: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  icon?: React.ReactNode
}

const buttonVariants = {
  primary: css`
    background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
    color: white;
    
    &:hover:not(:disabled) {
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }
  `,
  secondary: css`
    background: ${theme.colors.secondary};
    color: white;
    
    &:hover:not(:disabled) {
      background: ${theme.colors.secondaryDark};
    }
  `,
  outline: css`
    background: transparent;
    color: ${theme.colors.primary};
    border: 2px solid ${theme.colors.primary};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.primary};
      color: white;
    }
  `,
  ghost: css`
    background: transparent;
    color: ${theme.colors.text};
    
    &:hover:not(:disabled) {
      background: ${theme.colors.backgroundAlt};
    }
  `,
}

const buttonSizes = {
  sm: css`
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: ${theme.fontSize.sm};
  `,
  md: css`
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    font-size: ${theme.fontSize.base};
  `,
  lg: css`
    padding: ${theme.spacing.lg} ${theme.spacing.xl};
    font-size: ${theme.fontSize.lg};
  `,
}

const StyledButton = styled(motion.button)<{
  $variant: ButtonProps['variant']
  $size: ButtonProps['size']
  $fullWidth?: boolean
}>`
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  transition: all 0.3s ease;
  outline: none;
  
  ${props => buttonVariants[props.$variant || 'primary']}
  ${props => buttonSizes[props.$size || 'md']}
  ${props => props.$fullWidth && css`width: 100%;`}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
`

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  children,
  onClick,
  type = 'button',
  disabled = false,
  icon,
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      onClick={onClick}
      type={type}
      disabled={disabled || isLoading}
      whileTap={{ scale: 0.98 }}
    >
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </StyledButton>
  )
}

export default Button