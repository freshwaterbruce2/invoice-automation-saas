import React from 'react'
import styled from 'styled-components'

import { theme } from '../../config/theme'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`

const Label = styled.label`
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
  color: ${theme.colors.text};
`

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const StyledInput = styled.input<{ $hasError?: boolean; $hasIcon?: boolean }>`
  width: 100%;
  padding: ${theme.spacing.md} ${props => props.$hasIcon ? '2.5rem' : theme.spacing.md};
  border: 2px solid ${props => props.$hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.base};
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: ${props => props.$hasError ? theme.colors.error : theme.colors.primary};
    transform: scale(1.02);
  }
  
  &:disabled {
    background: ${theme.colors.backgroundAlt};
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: ${theme.colors.textLight};
  }
`

const IconWrapper = styled.div`
  position: absolute;
  left: ${theme.spacing.md};
  color: ${theme.colors.textLight};
  pointer-events: none;
`

const ErrorMessage = styled.span`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.error};
`

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, ...props }, ref) => {
    return (
      <InputWrapper>
        {label && <Label>{label}</Label>}
        <InputContainer>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <StyledInput
            ref={ref}
            $hasError={!!error}
            $hasIcon={!!icon}
            {...props}
          />
        </InputContainer>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputWrapper>
    )
  }
)

Input.displayName = 'Input'

export default Input