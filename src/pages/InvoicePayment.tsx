import React, { useEffect,useState } from 'react'
import { useNavigate,useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CheckCircle } from 'lucide-react'
import styled from 'styled-components'

import Button from '../components/common/Button'
import InvoicePreview from '../components/invoice/InvoicePreview'
import PaymentForm from '../components/invoice/PaymentForm'
import { theme } from '../config/theme'
import { getInvoices } from '../services/invoiceService'
import { Invoice } from '../types/invoice'

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.backgroundAlt};
  padding: ${theme.spacing.xl};
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xxl};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`

const SuccessContainer = styled.div`
  max-width: 600px;
  margin: 4rem auto;
  text-align: center;
`

const SuccessIcon = styled.div`
  width: 120px;
  height: 120px;
  background: ${theme.colors.success}20;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.xl};
`

const SuccessTitle = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`

const SuccessMessage = styled.p`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.textLight};
  margin-bottom: ${theme.spacing.xl};
`

const InvoicePayment: React.FC = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    loadInvoice()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoiceId])

  const loadInvoice = async () => {
    try {
      // In production, fetch specific invoice from API
      const invoices = await getInvoices()
      const foundInvoice = invoices.find(inv => inv.id === invoiceId)
      
      if (foundInvoice) {
        setInvoice(foundInvoice)
      } else {
        // For demo, create a mock invoice
        const mockInvoice: Invoice = {
          id: invoiceId || 'demo-1',
          invoiceNumber: 'INV-2024-0001',
          issueDate: new Date(),
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          client: {
            id: 'client-1',
            name: 'John Doe',
            email: 'john@example.com',
            company: 'Acme Corp',
          },
          items: [
            {
              id: 'item-1',
              description: 'Web Development Services',
              quantity: 1,
              price: 2500,
              total: 2500,
            },
          ],
          subtotal: 2500,
          tax: 10,
          total: 2750,
          status: 'sent',
          currency: 'USD',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        setInvoice(mockInvoice)
      }
    } catch (error) {
      console.error('Failed to load invoice:', error)
      toast.error('Failed to load invoice')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = async () => {
    setPaymentSuccess(true)
    toast.success('Payment successful!')
    
    // Update invoice status
    if (invoice) {
      const updatedInvoice = { ...invoice, status: 'paid' as const }
      // In production, update via API
      const invoices = await getInvoices()
      const updatedInvoices = invoices.map(inv => 
        inv.id === invoice.id ? updatedInvoice : inv
      )
      localStorage.setItem('invoices', JSON.stringify(updatedInvoices))
    }
  }

  if (isLoading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          Loading invoice...
        </div>
      </Container>
    )
  }

  if (!invoice) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Invoice not found</h2>
          <div style={{ marginTop: '2rem' }}>
            <Button onClick={() => navigate('/')}>
              Go to Homepage
            </Button>
          </div>
        </div>
      </Container>
    )
  }

  if (paymentSuccess) {
    return (
      <Container>
        <SuccessContainer>
          <SuccessIcon>
            <CheckCircle size={80} color={theme.colors.success} />
          </SuccessIcon>
          <SuccessTitle>Payment Successful!</SuccessTitle>
          <SuccessMessage>
            Thank you for your payment. A receipt has been sent to {invoice.client.email}.
          </SuccessMessage>
          <Button onClick={() => navigate('/dashboard')} size="lg">
            Back to Dashboard
          </Button>
        </SuccessContainer>
      </Container>
    )
  }

  return (
    <Container>
      <ContentWrapper>
        <div>
          <h2 style={{ 
            fontSize: theme.fontSize['2xl'], 
            marginBottom: theme.spacing.xl,
            color: theme.colors.text 
          }}>
            Invoice Details
          </h2>
          <InvoicePreview invoice={invoice} showActions={false} />
        </div>
        
        <div>
          <h2 style={{ 
            fontSize: theme.fontSize['2xl'], 
            marginBottom: theme.spacing.xl,
            color: theme.colors.text 
          }}>
            Payment Information
          </h2>
          <PaymentForm 
            invoice={invoice} 
            onSuccess={handlePaymentSuccess}
            savedCards={[
              {
                id: 'card-1',
                brand: 'visa',
                last4: '4242',
                expMonth: 12,
                expYear: 2025,
              }
            ]}
          />
        </div>
      </ContentWrapper>
    </Container>
  )
}

export default InvoicePayment