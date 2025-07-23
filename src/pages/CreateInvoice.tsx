import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowLeft } from 'lucide-react'
import styled from 'styled-components'

import Button from '../components/common/Button'
import InvoiceForm from '../components/invoice/InvoiceForm'
import InvoicePreview from '../components/invoice/InvoicePreview'
import { theme } from '../config/theme'
import { 
  calculateInvoiceTotals, 
  downloadInvoicePDF,
  generateInvoiceNumber, 
  saveInvoice,
  sendInvoiceEmail 
} from '../services/invoiceService'
import { calculateNextInvoiceDate } from '../services/recurringService'
import { Invoice, InvoiceFormData, RecurringInvoice } from '../types/invoice'
import type { RecurringConfig } from '../components/invoice/RecurringSettings'

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.backgroundAlt};
  padding: ${theme.spacing.xl};
`

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto ${theme.spacing.xxl};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
`

const Title = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  color: ${theme.colors.text};
`

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.xxl};
`

const PreviewWrapper = styled.div`
  position: sticky;
  top: ${theme.spacing.xl};
`

const CreateInvoice: React.FC = () => {
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [, setIsLoading] = useState(false)

  const handleSubmit = async (data: InvoiceFormData, recurringConfig?: RecurringConfig) => {
    try {
      setIsLoading(true)

      // Calculate totals
      const items = data.items.map((item, index) => ({
        id: `item-${index}`,
        description: item.description || '',
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
        total: (Number(item.quantity) || 0) * (Number(item.price) || 0)
      }))

      const { subtotal, total } = calculateInvoiceTotals(items, data.tax)

      // Create recurring configuration if enabled
      let recurring: RecurringInvoice | undefined
      if (recurringConfig && recurringConfig.enabled) {
        recurring = {
          enabled: true,
          frequency: recurringConfig.frequency,
          interval: recurringConfig.interval,
          startDate: new Date(recurringConfig.startDate),
          endDate: recurringConfig.endDate ? new Date(recurringConfig.endDate) : undefined,
          endType: recurringConfig.endType,
          occurrences: recurringConfig.occurrences,
          nextInvoiceDate: calculateNextInvoiceDate({
            ...recurringConfig,
            startDate: new Date(recurringConfig.startDate),
            endDate: recurringConfig.endDate ? new Date(recurringConfig.endDate) : undefined,
          }, new Date(data.issueDate)) || undefined,
        }
      }

      // Create invoice object
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: generateInvoiceNumber(),
        issueDate: new Date(data.issueDate),
        dueDate: new Date(data.dueDate),
        client: {
          id: `client-${Date.now()}`,
          name: data.client.name || '',
          email: data.client.email || '',
          phone: data.client.phone,
          company: data.client.company,
          address: data.client.address,
        },
        items,
        subtotal,
        tax: data.tax || 0,
        total,
        status: 'draft',
        notes: data.notes,
        terms: data.terms,
        currency: 'USD',
        recurring,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save invoice
      const savedInvoice = await saveInvoice(newInvoice)
      setInvoice(savedInvoice)
      
      toast.success('Invoice created successfully!')
    } catch (error) {
      toast.error('Failed to create invoice')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!invoice) {return}
    
    try {
      // In production, you'd need to get the element differently
      const element = document.querySelector('[data-invoice-preview]')
      if (element) {
        await downloadInvoicePDF(element.id || 'invoice', `${invoice.invoiceNumber}.pdf`)
      }
      toast.success('Invoice downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download invoice')
      console.error(error)
    }
  }

  const handleSend = async () => {
    if (!invoice) {return}
    
    try {
      setIsLoading(true)
      await sendInvoiceEmail(invoice)
      toast.success(`Invoice sent to ${invoice.client.email}!`)
      
      // Update invoice status
      const updatedInvoice = { ...invoice, status: 'sent' as const }
      await saveInvoice(updatedInvoice)
      setInvoice(updatedInvoice)
    } catch (error) {
      toast.error('Failed to send invoice')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container>
      <Header>
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate('/dashboard')}
        >
          Back
        </Button>
        <Title>Create New Invoice</Title>
      </Header>

      <ContentWrapper>
        {!invoice ? (
          <InvoiceForm onSubmit={handleSubmit} />
        ) : (
          <PreviewWrapper>
            <InvoicePreview
              invoice={invoice}
              onDownload={handleDownload}
              onSend={handleSend}
            />
          </PreviewWrapper>
        )}
      </ContentWrapper>
    </Container>
  )
}

export default CreateInvoice