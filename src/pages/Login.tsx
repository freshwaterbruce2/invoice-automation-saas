import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { FileText,Lock, LogIn, Mail } from 'lucide-react'
import styled from 'styled-components'

import Button from '../components/common/Button'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import { theme } from '../config/theme'
import { useAuth } from '../contexts/AuthContext'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  padding: ${theme.spacing.xl};
`

const LoginCard = styled(Card)`
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

interface LoginFormData {
  email: string
  password: string
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn, signInWithGoogle } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const from = location.state?.from?.pathname || '/dashboard'
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    
    try {
      await signIn(data.email, data.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      // Google redirects automatically
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in with Google')
    }
  }

  return (
    <Container>
      <LoginCard>
        <Logo>
          <FileText size={32} />
          InvoiceFlow
        </Logo>
        
        <Title>Welcome Back</Title>
        
        <Form onSubmit={handleSubmit(onSubmit)}>
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
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            icon={<LogIn size={20} />}
          >
            Sign In
          </Button>
        </Form>
        
        <Divider>
          <span>OR</span>
        </Divider>
        
        <Button
          variant="outline"
          fullWidth
          onClick={handleGoogleSignIn}
        >
          Continue with Google
        </Button>
        
        <Footer>
          Don&apos;t have an account? <Link to="/signup">Sign up</Link>
        </Footer>
      </LoginCard>
    </Container>
  )
}

export default Login