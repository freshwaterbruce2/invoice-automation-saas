import React from 'react'
import { format } from 'date-fns'
import { Calendar, Pause, Play,RefreshCw } from 'lucide-react'
import styled from 'styled-components'

import { theme } from '../../config/theme'
import { formatCurrency } from '../../services/invoiceService'
import { Invoice } from '../../types/invoice'
import Button from '../common/Button'
import Card from '../common/Card'

const Container = styled(Card)`
  margin-top: ${theme.spacing.xl};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`

const Title = styled.h3`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.text};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`

const RecurringList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

const RecurringItem = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr auto;
  align-items: center;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background: ${theme.colors.backgroundAlt};
  border-radius: ${theme.borderRadius.md};
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
  }
`

const ClientInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`

const ClientName = styled.div`
  font-weight: 500;
  color: ${theme.colors.text};
`

const Frequency = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`

const Amount = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
`

const NextDate = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textLight};
  display: flex;
  align-items: center;
  gap: ${theme.spacing.xs};
`

const Status = styled.div<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
  background: ${props => props.$active ? `${theme.colors.success}20` : `${theme.colors.textLight}20`};
  color: ${props => props.$active ? theme.colors.success : theme.colors.textLight};
`

const Actions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.textLight};
`

interface RecurringInvoicesProps {
  invoices: Invoice[]
  onPause: (invoiceId: string) => void
  onResume: (invoiceId: string) => void
}

const RecurringInvoices: React.FC<RecurringInvoicesProps> = ({
  invoices,
  onPause,
  onResume,
}) => {
  const recurringInvoices = invoices.filter(inv => inv.recurring?.enabled)

  const getFrequencyLabel = (invoice: Invoice) => {
    if (!invoice.recurring) {return ''}
    
    const { frequency, interval } = invoice.recurring
    const frequencyText = frequency.replace('ly', '')
    
    if (interval === 1) {
      return `${frequency.charAt(0).toUpperCase() + frequency.slice(1)}`
    }
    
    return `Every ${interval} ${frequencyText}s`
  }

  return (
    <Container>
      <Header>
        <Title>
          <RefreshCw size={20} />
          Recurring Invoices
        </Title>
      </Header>

      {recurringInvoices.length === 0 ? (
        <EmptyState>
          No recurring invoices set up yet.
        </EmptyState>
      ) : (
        <RecurringList>
          {recurringInvoices.map((invoice) => (
            <RecurringItem key={invoice.id}>
              <ClientInfo>
                <ClientName>{invoice.client.name}</ClientName>
                <Frequency>
                  <RefreshCw size={14} />
                  {getFrequencyLabel(invoice)}
                </Frequency>
              </ClientInfo>
              
              <Amount>{formatCurrency(invoice.total)}</Amount>
              
              <NextDate>
                <Calendar size={14} />
                {invoice.recurring?.nextInvoiceDate
                  ? format(new Date(invoice.recurring.nextInvoiceDate), 'MMM dd, yyyy')
                  : 'Not scheduled'}
              </NextDate>
              
              <Status $active={invoice.recurring?.enabled || false}>
                {invoice.recurring?.enabled ? 'Active' : 'Paused'}
              </Status>
              
              <Actions>
                {invoice.recurring?.enabled ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Pause size={16} />}
                    onClick={() => onPause(invoice.id)}
                  >
                    Pause
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<Play size={16} />}
                    onClick={() => onResume(invoice.id)}
                  >
                    Resume
                  </Button>
                )}
              </Actions>
            </RecurringItem>
          ))}
        </RecurringList>
      )}
    </Container>
  )
}

export default RecurringInvoices