import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'
import { motion } from 'framer-motion'
import { 
  ArrowRight,
  BarChart3,
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText,
  RefreshCw,
  Shield,
  Zap} from 'lucide-react'
import styled from 'styled-components'

import 'react-toastify/dist/ReactToastify.css'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

const Nav = styled.nav`
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
`

const Logo = styled.h1`
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  
  a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.3s;
    
    &:hover {
      opacity: 0.8;
    }
  }
`

const Hero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  text-align: center;
  color: white;
`

const Title = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  line-height: 1.2;
`

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`

const Stats = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
`

const StatNumber = styled.h3`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.p`
  font-size: 1rem;
  opacity: 0.9;
`

const EmailForm = styled(motion.form)`
  display: flex;
  gap: 1rem;
  max-width: 500px;
  margin: 2rem auto;
`

const Input = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  outline: none;
  transition: transform 0.2s;
  
  &:focus {
    transform: scale(1.02);
  }
`

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  
  &:hover {
    background: #059669;
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const Features = styled.section`
  background: white;
  padding: 5rem 2rem;
`

const FeaturesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const SectionTitle = styled.h3`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 3rem;
  color: #1f2937;
`

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
`

const FeatureCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
`

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
`

const FeatureTitle = styled.h4`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #1f2937;
`

const FeatureDescription = styled.p`
  color: #6b7280;
  line-height: 1.6;
`

const Pricing = styled.section`
  background: #f9fafb;
  padding: 5rem 2rem;
`

const PricingGrid = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`

const PricingCard = styled(motion.div)<{ featured?: boolean }>`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: ${props => props.featured ? '0 20px 40px rgba(0,0,0,0.1)' : '0 10px 20px rgba(0,0,0,0.05)'};
  border: ${props => props.featured ? '2px solid #667eea' : '1px solid #e5e7eb'};
  position: relative;
  transform: ${props => props.featured ? 'scale(1.05)' : 'scale(1)'};
`

const PlanName = styled.h4`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
`

const Price = styled.div`
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 1rem;
  
  span {
    font-size: 1rem;
    color: #6b7280;
  }
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
`

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #4b5563;
`

const GetStartedButton = styled.button<{ featured?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: ${props => props.featured ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#e5e7eb'};
  color: ${props => props.featured ? 'white' : '#1f2937'};
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
`

const Badge = styled.div`
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background: #10b981;
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
`

interface FormData {
  email: string;
}

const LandingPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In real app, you'd send this to your backend
    console.log('Email submitted:', data.email)
    
    toast.success('🎉 You\'re on the list! Check your email for early access.', {
      position: "top-center",
      autoClose: 5000,
    })
    
    reset()
    setIsSubmitting(false)
  }

  return (
    <Container>
      <ToastContainer />
      <Nav>
        <Logo>
          <FileText size={32} />
          InvoiceFlow
        </Logo>
        <NavLinks>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#contact">Contact</a>
        </NavLinks>
      </Nav>

      <Hero>
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

        <EmailForm 
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Input 
            type="email" 
            placeholder="Enter your email for early access"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Please enter a valid email'
              }
            })}
          />
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Joining...' : 'Get Early Access'} 
            <ArrowRight size={20} />
          </SubmitButton>
        </EmailForm>
        {errors.email && <p style={{ color: '#fbbf24' }}>{errors.email.message}</p>}

        <Stats>
          <StatCard
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <StatNumber>70%</StatNumber>
            <StatLabel>Cost Reduction</StatLabel>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <StatNumber>3x</StatNumber>
            <StatLabel>Faster Payments</StatLabel>
          </StatCard>
          <StatCard
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <StatNumber>500+</StatNumber>
            <StatLabel>Happy Businesses</StatLabel>
          </StatCard>
        </Stats>
      </Hero>

      <Features id="features">
        <FeaturesContainer>
          <SectionTitle>Everything You Need to Get Paid Faster</SectionTitle>
          <FeatureGrid>
            <FeatureCard
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>
                <Zap size={40} />
              </IconWrapper>
              <FeatureTitle>Instant Invoice Creation</FeatureTitle>
              <FeatureDescription>
                Create professional invoices in seconds with our smart templates. 
                Auto-fill client details and save hours every month.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>
                <RefreshCw size={40} />
              </IconWrapper>
              <FeatureTitle>Automated Recurring Billing</FeatureTitle>
              <FeatureDescription>
                Set it and forget it. Schedule invoices to send automatically 
                and never miss a billing cycle again.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>
                <Clock size={40} />
              </IconWrapper>
              <FeatureTitle>Smart Payment Reminders</FeatureTitle>
              <FeatureDescription>
                Gentle, automated follow-ups that get you paid without the 
                awkward conversations. Customizable timing for each client.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>
                <DollarSign size={40} />
              </IconWrapper>
              <FeatureTitle>One-Click Payments</FeatureTitle>
              <FeatureDescription>
                Accept payments instantly with Stripe integration. 
                Your clients can pay directly from the invoice.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>
                <BarChart3 size={40} />
              </IconWrapper>
              <FeatureTitle>Real-Time Analytics</FeatureTitle>
              <FeatureDescription>
                Track revenue, pending payments, and cash flow at a glance. 
                Make informed decisions with powerful insights.
              </FeatureDescription>
            </FeatureCard>

            <FeatureCard
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <IconWrapper>
                <Shield size={40} />
              </IconWrapper>
              <FeatureTitle>Bank-Level Security</FeatureTitle>
              <FeatureDescription>
                Your data is encrypted and secure. PCI compliant with 
                automatic backups and 99.9% uptime guarantee.
              </FeatureDescription>
            </FeatureCard>
          </FeatureGrid>
        </FeaturesContainer>
      </Features>

      <Pricing id="pricing">
        <SectionTitle>Simple, Transparent Pricing</SectionTitle>
        <PricingGrid>
          <PricingCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <PlanName>Starter</PlanName>
            <Price>$29<span>/month</span></Price>
            <FeatureList>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                50 invoices/month
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                3 invoice templates
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Email reminders
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Basic reporting
              </FeatureItem>
            </FeatureList>
            <GetStartedButton>Start Free Trial</GetStartedButton>
          </PricingCard>

          <PricingCard
            featured
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Badge>Most Popular</Badge>
            <PlanName>Professional</PlanName>
            <Price>$79<span>/month</span></Price>
            <FeatureList>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Unlimited invoices
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Custom branding
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Recurring billing
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Priority support
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Advanced analytics
              </FeatureItem>
            </FeatureList>
            <GetStartedButton featured>Start Free Trial</GetStartedButton>
          </PricingCard>

          <PricingCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PlanName>Agency</PlanName>
            <Price>$199<span>/month</span></Price>
            <FeatureList>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Everything in Pro
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Multi-user access
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                White-label option
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                API access
              </FeatureItem>
              <FeatureItem>
                <CheckCircle size={20} color="#10b981" />
                Dedicated support
              </FeatureItem>
            </FeatureList>
            <GetStartedButton>Contact Sales</GetStartedButton>
          </PricingCard>
        </PricingGrid>
      </Pricing>
    </Container>
  )
}

export default LandingPage