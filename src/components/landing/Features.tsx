import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Clock, 
  DollarSign, 
  RefreshCw, 
  Shield, 
  Zap} from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import Card from '../common/Card'

const Section = styled.section`
  background: ${theme.colors.background};
  padding: 5rem 2rem;
`

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`

const Title = styled.h2`
  font-size: ${theme.fontSize['3xl']};
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
  color: ${theme.colors.text};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xxl};
`

const FeatureCard = styled(Card)`
  text-align: center;
`

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.lg};
  color: white;
`

const FeatureTitle = styled.h3`
  font-size: ${theme.fontSize.xl};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.text};
`

const FeatureDescription = styled.p`
  color: ${theme.colors.textLight};
  line-height: 1.6;
`

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: <Zap size={40} />,
    title: 'Instant Invoice Creation',
    description: 'Create professional invoices in seconds with our smart templates. Auto-fill client details and save hours every month.',
  },
  {
    icon: <RefreshCw size={40} />,
    title: 'Automated Recurring Billing',
    description: 'Set it and forget it. Schedule invoices to send automatically and never miss a billing cycle again.',
  },
  {
    icon: <Clock size={40} />,
    title: 'Smart Payment Reminders',
    description: 'Gentle, automated follow-ups that get you paid without the awkward conversations. Customizable timing for each client.',
  },
  {
    icon: <DollarSign size={40} />,
    title: 'One-Click Payments',
    description: 'Accept payments instantly with Stripe integration. Your clients can pay directly from the invoice.',
  },
  {
    icon: <BarChart3 size={40} />,
    title: 'Real-Time Analytics',
    description: 'Track revenue, pending payments, and cash flow at a glance. Make informed decisions with powerful insights.',
  },
  {
    icon: <Shield size={40} />,
    title: 'Bank-Level Security',
    description: 'Your data is encrypted and secure. PCI compliant with automatic backups and 99.9% uptime guarantee.',
  },
]

const Features: React.FC = () => {
  return (
    <Section id="features">
      <Container>
        <Title>Everything You Need to Get Paid Faster</Title>
        <Grid>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <FeatureCard hoverable padding="lg">
                <IconWrapper>{feature.icon}</IconWrapper>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

export default Features