import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import Button from '../common/Button'
import Card from '../common/Card'

const Section = styled.section`
  background: ${theme.colors.backgroundAlt};
  padding: 5rem 2rem;
`

const Container = styled.div`
  max-width: 1000px;
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
  gap: ${theme.spacing.xl};
  align-items: center;
`

const PricingCard = styled(Card)<{ $featured?: boolean }>`
  position: relative;
  transform: ${props => props.$featured ? 'scale(1.05)' : 'scale(1)'};
  border: ${props => props.$featured ? `2px solid ${theme.colors.primary}` : 'none'};
`

const Badge = styled.div`
  position: absolute;
  top: -1rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${theme.colors.secondary};
  color: white;
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.sm};
  font-weight: 600;
`

const PlanName = styled.h3`
  font-size: ${theme.fontSize['2xl']};
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text};
`

const Price = styled.div`
  font-size: ${theme.fontSize['4xl']};
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.md};
  
  span {
    font-size: ${theme.fontSize.base};
    color: ${theme.colors.textLight};
  }
`

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${theme.spacing.lg} 0;
`

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.md};
  color: ${theme.colors.textLight};
`

interface Plan {
  name: string
  price: number
  features: string[]
  featured?: boolean
}

const plans: Plan[] = [
  {
    name: 'Starter',
    price: 29,
    features: [
      '50 invoices/month',
      '3 invoice templates',
      'Email reminders',
      'Basic reporting',
    ],
  },
  {
    name: 'Professional',
    price: 79,
    features: [
      'Unlimited invoices',
      'Custom branding',
      'Recurring billing',
      'Priority support',
      'Advanced analytics',
    ],
    featured: true,
  },
  {
    name: 'Agency',
    price: 199,
    features: [
      'Everything in Pro',
      'Multi-user access',
      'White-label option',
      'API access',
      'Dedicated support',
    ],
  },
]

const Pricing: React.FC = () => {
  return (
    <Section id="pricing">
      <Container>
        <Title>Simple, Transparent Pricing</Title>
        <Grid>
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PricingCard
                variant={plan.featured ? 'elevated' : 'default'}
                $featured={plan.featured}
              >
                {plan.featured && <Badge>Most Popular</Badge>}
                <PlanName>{plan.name}</PlanName>
                <Price>
                  ${plan.price}<span>/month</span>
                </Price>
                <FeatureList>
                  {plan.features.map((feature) => (
                    <FeatureItem key={feature}>
                      <CheckCircle size={20} color={theme.colors.secondary} />
                      {feature}
                    </FeatureItem>
                  ))}
                </FeatureList>
                <Button
                  variant={plan.featured ? 'primary' : 'outline'}
                  fullWidth
                  onClick={() => console.log(`Selected ${plan.name} plan`)}
                >
                  {plan.name === 'Agency' ? 'Contact Sales' : 'Start Free Trial'}
                </Button>
              </PricingCard>
            </motion.div>
          ))}
        </Grid>
      </Container>
    </Section>
  )
}

export default Pricing