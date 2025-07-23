import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import { Mail, Lock, User, UserPlus, FileText } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { theme } from '../config/theme'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  padding: ${theme.spacing.xl};
`

const SignupCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: ${theme.spacing.xxl};
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSize['2xl']};
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.xl};
`

const Title = styled.h1`
  font-size: ${theme.fontSize['2xl']};
  text-align: center;
  margin-bottom: ${theme.spacing.lg};
  color: ${theme.colors.text};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

const Divider = styled.div`
  text-align: center;
  margin: ${theme.spacing.lg} 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: ${theme.colors.border};
  }
  
  span {
    background: white;
    padding: 0 ${theme.spacing.md};
    position: relative;
    color: ${theme.colors.textLight};
    font-size: ${theme.fontSize.sm};
  }
`

const Footer = styled.div`
  text-align: center;
  margin-top: ${theme.spacing.xl};
  color: ${theme.colors.textLight};
  font-size: ${theme.fontSize.sm};
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

const TermsText = styled.p`
  font-size: ${theme.fontSize.xs};
  color: ${theme.colors.textLight};
  text-align: center;
  margin-top: ${theme.spacing.md};
  
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`

interface SignupFormData {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}

const Signup: React.FC = () => {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>()
  const password = watch('password')

  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true)
    
    try {
      await signUp(data.email, data.password, data.fullName)
      toast.success('Account created! Please check your email to verify.')
      navigate('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle()
      // Google redirects automatically
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up with Google')
    }
  }

  return (
    <Container>
      <SignupCard>
        <Logo>
          <FileText size={32} />
          InvoiceFlow
        </Logo>
        
        <Title>Create Your Account</Title>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            label="Full Name"
            placeholder="John Doe"
            icon={<User size={20} />}
            error={errors.fullName?.message}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            })}
          />
          
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            icon={<Mail size={20} />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
          />
          
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={<Lock size={20} />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number',
              },
            })}
          />
          
          <Input
            type="password"
            label="Confirm Password"
            placeholder="••••••••"
            icon={<Lock size={20} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value => value === password || 'Passwords do not match',
            })}
          />
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            icon={<UserPlus size={20} />}
          >
            Create Account
          </Button>
        </Form>
        
        <Divider>
          <span>OR</span>
        </Divider>
        
        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleSignUp}
        >
          Sign up with Google
        </Button>
        
        <TermsText>
          By signing up, you agree to our{' '}
          <a href="/terms" target="_blank">Terms of Service</a> and{' '}
          <a href="/privacy" target="_blank">Privacy Policy</a>
        </TermsText>
        
        <Footer>
          Already have an account? <Link to="/login">Sign in</Link>
        </Footer>
      </SignupCard>
    </Container>
  )
}

export default Signup