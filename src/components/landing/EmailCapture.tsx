import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { ArrowRight, Mail } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import Button from '../common/Button'
import Input from '../common/Input'

const Form = styled(motion.form)`
  display: flex;
  gap: ${theme.spacing.md};
  max-width: 500px;
  margin: ${theme.spacing.xl} auto;
  
  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: column;
  }
`

const InputWrapper = styled.div`
  flex: 1;
`

interface FormData {
  email: string
}

const EmailCapture: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // TODO: Replace with actual API endpoint
      console.log('Email submitted:', data.email)
      
      toast.success('🎉 You\'re on the list! Check your email for early access.', {
        position: "top-center",
        autoClose: 5000,
      })
      
      // Redirect to dashboard after signup
      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 2000)
      
      reset()
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form 
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <InputWrapper>
        <Input
          type="email"
          placeholder="Enter your email for early access"
          icon={<Mail size={20} />}
          error={errors.email?.message}
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Please enter a valid email'
            }
          })}
          style={{ 
            background: 'white',
            color: theme.colors.text 
          }}
        />
      </InputWrapper>
      <Button
        type="submit"
        variant="secondary"
        isLoading={isSubmitting}
        icon={<ArrowRight size={20} />}
      >
        {isSubmitting ? 'Joining...' : 'Get Early Access'}
      </Button>
    </Form>
  )
}

export default EmailCapture