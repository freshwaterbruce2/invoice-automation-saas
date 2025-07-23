import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { Check,Copy, Download, FileText, Send } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import { Invoice } from '../../types/invoice'
import Button from '../common/Button'
import Card from '../common/Card'

const Container = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  background: white;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xxl};
  padding-bottom: ${theme.spacing.xl};
  border-bottom: 2px solid ${theme.colors.border};
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: ${theme.fontSize['2xl']};
  font-weight: bold;
  color: ${theme.colors.primary};
`

const InvoiceDetails = styled.div`
  text-align: right;
`

const InvoiceNumber = styled.h1`
  font-size: ${theme.fontSize['2xl']};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.sm};
`

const DateInfo = styled.div`
  color: ${theme.colors.textLight};
  font-size: ${theme.fontSize.sm};
  line-height: 1.5;
`

const ClientSection = styled.div`
  margin-bottom: ${theme.spacing.xxl};
`

const SectionTitle = styled.h3`
  font-size: ${theme.fontSize.lg};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md};
`

const ClientInfo = styled.div`
  color: ${theme.colors.textLight};
  line-height: 1.6;
`

const ItemsTable = styled.table`
  width: 100%;
  margin-bottom: ${theme.spacing.xl};
  border-collapse: collapse;
`

const TableHeader = styled.th`
  text-align: left;
  padding: ${theme.spacing.md};
  border-bottom: 2px solid ${theme.colors.border};
  color: ${theme.colors.text};
  font-weight: 600;
  
  &:last-child {
    text-align: right;
  }
`

const TableCell = styled.td`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.textLight};
  
  &:last-child {
    text-align: right;
  }
`

const TotalSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: ${theme.spacing.xl};
`

const TotalRow = styled.div`
  display: grid;
  grid-template-columns: 150px 150px;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.sm} 0;
  
  &:last-child {
    border-top: 2px solid ${theme.colors.border};
    margin-top: ${theme.spacing.sm};
    padding-top: ${theme.spacing.md};
    font-weight: bold;
    font-size: ${theme.fontSize.lg};
    color: ${theme.colors.text};
  }
`

const TotalLabel = styled.span`
  text-align: right;
`

const TotalValue = styled.span`
  text-align: right;
`

const NotesSection = styled.div`
  margin-top: ${theme.spacing.xxl};
  padding-top: ${theme.spacing.xl};
  border-top: 1px solid ${theme.colors.border};
`

const Notes = styled.p`
  color: ${theme.colors.textLight};
  line-height: 1.6;
  white-space: pre-wrap;
`

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: center;
  margin-top: ${theme.spacing.xxl};
`

interface InvoicePreviewProps {
  invoice: Invoice
  onDownload?: () => void
  onSend?: () => void
  showActions?: boolean
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ 
  invoice, 
  onDownload,
  onSend,
  showActions = true 
}) => {
  const [copiedLink, setCopiedLink] = useState(false)
  
  const getPaymentLink = () => {
    return `${window.location.origin}/invoice/${invoice.id}/payment`
  }
  
  const copyPaymentLink = async () => {
    try {
      await navigator.clipboard.writeText(getPaymentLink())
      setCopiedLink(true)
      toast.success('Payment link copied to clipboard!')
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }
  return (
    <>
      <Container>
        <Header>
          <Logo>
            <FileText size={32} />
            InvoiceFlow
          </Logo>
          <InvoiceDetails>
            <InvoiceNumber>Invoice #{invoice.invoiceNumber}</InvoiceNumber>
            <DateInfo>
              <div>Issue Date: {format(invoice.issueDate, 'MMM dd, yyyy')}</div>
              <div>Due Date: {format(invoice.dueDate, 'MMM dd, yyyy')}</div>
            </DateInfo>
          </InvoiceDetails>
        </Header>

        <ClientSection>
          <SectionTitle>Bill To:</SectionTitle>
          <ClientInfo>
            <div style={{ fontWeight: 600, color: theme.colors.text }}>
              {invoice.client.name}
            </div>
            {invoice.client.company && <div>{invoice.client.company}</div>}
            <div>{invoice.client.email}</div>
            {invoice.client.phone && <div>{invoice.client.phone}</div>}
            {invoice.client.address && <div>{invoice.client.address}</div>}
          </ClientInfo>
        </ClientSection>

        <ItemsTable>
          <thead>
            <tr>
              <TableHeader>Description</TableHeader>
              <TableHeader>Qty</TableHeader>
              <TableHeader>Price</TableHeader>
              <TableHeader>Total</TableHeader>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>${item.total.toFixed(2)}</TableCell>
              </tr>
            ))}
          </tbody>
        </ItemsTable>

        <TotalSection>
          <TotalRow>
            <TotalLabel>Subtotal:</TotalLabel>
            <TotalValue>${invoice.subtotal.toFixed(2)}</TotalValue>
          </TotalRow>
          {invoice.tax > 0 && (
            <TotalRow>
              <TotalLabel>Tax ({invoice.tax}%):</TotalLabel>
              <TotalValue>${((invoice.subtotal * invoice.tax) / 100).toFixed(2)}</TotalValue>
            </TotalRow>
          )}
          <TotalRow>
            <TotalLabel>Total:</TotalLabel>
            <TotalValue>${invoice.total.toFixed(2)}</TotalValue>
          </TotalRow>
        </TotalSection>

        {(invoice.notes || invoice.terms) && (
          <NotesSection>
            {invoice.notes && (
              <>
                <SectionTitle>Notes</SectionTitle>
                <Notes>{invoice.notes}</Notes>
              </>
            )}
            {invoice.terms && (
              <>
                <SectionTitle style={{ marginTop: theme.spacing.lg }}>
                  Terms & Conditions
                </SectionTitle>
                <Notes>{invoice.terms}</Notes>
              </>
            )}
          </NotesSection>
        )}
      </Container>

      {showActions && (
        <Actions>
          <Button
            variant="outline"
            icon={<Download size={20} />}
            onClick={onDownload}
          >
            Download PDF
          </Button>
          <Button
            variant="outline"
            icon={copiedLink ? <Check size={20} /> : <Copy size={20} />}
            onClick={copyPaymentLink}
          >
            {copiedLink ? 'Copied!' : 'Copy Payment Link'}
          </Button>
          <Button
            variant="primary"
            icon={<Send size={20} />}
            onClick={onSend}
          >
            Send Invoice
          </Button>
        </Actions>
      )}
    </>
  )
}

export default InvoicePreview