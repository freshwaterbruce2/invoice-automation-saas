import React, { useState } from 'react'
import { Check,CreditCard, Lock } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import { formatCurrency } from '../../services/invoiceService'
import { Invoice } from '../../types/invoice'
import Button from '../common/Button'
import Card from '../common/Card'
import Input from '../common/Input'

const Container = styled(Card)`
  max-width: 500px;
  margin: 0 auto;
`

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
`

const Title = styled.h2`
  font-size: ${theme.fontSize['2xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`

const Amount = styled.div`
  font-size: ${theme.fontSize['3xl']};
  font-weight: bold;
  color: ${theme.colors.primary};
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`

const CardInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.md};
`

const SecurityNote = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textLight};
  margin-top: ${theme.spacing.md};
`

const TestModeNote = styled.div`
  background: ${theme.colors.warning}20;
  color: ${theme.colors.warning};
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  font-size: ${theme.fontSize.sm};
  text-align: center;
`

const SavedCards = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`

const SavedCardItem = styled.div<{ $selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  border: 2px solid ${props => props.$selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${theme.colors.primary};
  }
`

const CardInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`

const CardBrand = styled.div`
  text-transform: capitalize;
  font-weight: 500;
`

const CardLast4 = styled.div`
  color: ${theme.colors.textLight};
`

interface PaymentFormProps {
  invoice: Invoice
  onSuccess: () => void
  savedCards?: Array<{
    id: string
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }>
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  invoice, 
  onSuccess,
  savedCards = []
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string | null>(
    savedCards.length > 0 ? savedCards[0].id : null
  )
  const [useNewCard, setUseNewCard] = useState(savedCards.length === 0)
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onSuccess()
    } catch (error) {
      console.error('Payment failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.slice(0, 2)  }/${  v.slice(2, 4)}`
    }
    return v
  }

  return (
    <Container>
      <Header>
        <Title>Payment Details</Title>
        <Amount>{formatCurrency(invoice.total)}</Amount>
      </Header>

      <TestModeNote>
        Test Mode: Use card 4242 4242 4242 4242
      </TestModeNote>

      <Form onSubmit={handleSubmit}>
        {savedCards.length > 0 && (
          <SavedCards>
            <h3 style={{ fontSize: theme.fontSize.lg, marginBottom: theme.spacing.md }}>
              Saved Payment Methods
            </h3>
            {savedCards.map(card => (
              <SavedCardItem
                key={card.id}
                $selected={selectedCard === card.id && !useNewCard}
                onClick={() => {
                  setSelectedCard(card.id)
                  setUseNewCard(false)
                }}
              >
                <CardInfo>
                  <CreditCard size={24} />
                  <div>
                    <CardBrand>{card.brand}</CardBrand>
                    <CardLast4>•••• {card.last4}</CardLast4>
                  </div>
                </CardInfo>
                {selectedCard === card.id && !useNewCard && (
                  <Check size={20} color={theme.colors.primary} />
                )}
              </SavedCardItem>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => setUseNewCard(true)}
              fullWidth
            >
              Use a different card
            </Button>
          </SavedCards>
        )}

        {(useNewCard || savedCards.length === 0) && (
          <>
            <Input
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
              required
            />

            <Input
              label="Card Number"
              placeholder="4242 4242 4242 4242"
              icon={<CreditCard size={20} />}
              value={cardDetails.number}
              onChange={(e) => setCardDetails({ 
                ...cardDetails, 
                number: formatCardNumber(e.target.value) 
              })}
              maxLength={19}
              required
            />

            <CardInputGroup>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ 
                  ...cardDetails, 
                  expiry: formatExpiry(e.target.value) 
                })}
                maxLength={5}
                required
              />
              <Input
                label="CVC"
                placeholder="123"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails({ 
                  ...cardDetails, 
                  cvc: e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                })}
                maxLength={3}
                required
              />
            </CardInputGroup>
          </>
        )}

        <Button
          type="submit"
          size="lg"
          fullWidth
          isLoading={isProcessing}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : `Pay ${formatCurrency(invoice.total)}`}
        </Button>

        <SecurityNote>
          <Lock size={16} />
          Your payment information is encrypted and secure
        </SecurityNote>
      </Form>
    </Container>
  )
}

export default PaymentForm