import React, { useEffect,useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { format } from 'date-fns'
import { CheckCircle, Clock, CreditCard,DollarSign, FileText, Plus } from 'lucide-react'
import styled from 'styled-components'

import Button from '../components/common/Button'
import Card from '../components/common/Card'
import RecurringInvoices from '../components/dashboard/RecurringInvoices'
import RevenueChart from '../components/dashboard/RevenueChart'
import { theme } from '../config/theme'
import { formatCurrency,getInvoices } from '../services/invoiceService'
import { pauseRecurringInvoice, resumeRecurringInvoice } from '../services/recurringService'
import { Invoice } from '../types/invoice'

const Container = styled.div`
  min-height: 100vh;
  background: ${theme.colors.backgroundAlt};
  padding: ${theme.spacing.xl};
`

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto ${theme.spacing.xxl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Title = styled.h1`
  font-size: ${theme.fontSize['3xl']};
  color: ${theme.colors.text};
`

const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto ${theme.spacing.xxl};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
`

const StatCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};
`

const IconWrapper = styled.div<{ $color: string }>`
  width: 60px;
  height: 60px;
  background: ${props => props.$color}20;
  border-radius: ${theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
`

const StatContent = styled.div``

const StatValue = styled.div`
  font-size: ${theme.fontSize['2xl']};
  font-weight: bold;
  color: ${theme.colors.text};
`

const StatLabel = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textLight};
`

const ContentGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing.xxl};
`

const InvoiceSection = styled.div``

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`

const SectionTitle = styled.h2`
  font-size: ${theme.fontSize.xl};
  color: ${theme.colors.text};
`

const InvoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`

const InvoiceItem = styled(Card)`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr 1fr auto;
  align-items: center;
  gap: ${theme.spacing.md};
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`

const InvoiceNumber = styled.div`
  font-weight: 600;
  color: ${theme.colors.text};
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

const ClientEmail = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textLight};
`

const Amount = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
`

const DueDate = styled.div`
  font-size: ${theme.fontSize.sm};
  color: ${theme.colors.textLight};
`

const Status = styled.div<{ $status: Invoice['status'] }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing.xs};
  padding: ${theme.spacing.xs} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.fontSize.sm};
  font-weight: 500;
  
  ${props => {
    switch (props.$status) {
      case 'paid':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `
      case 'overdue':
        return `
          background: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `
      case 'sent':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `
      default:
        return `
          background: ${theme.colors.textLight}20;
          color: ${theme.colors.textLight};
        `
    }
  }}
`

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl};
  color: ${theme.colors.textLight};
`

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      const data = await getInvoices()
      setInvoices(data)
    } catch (error) {
      console.error('Failed to load invoices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = () => {
    const total = invoices.reduce((sum, inv) => sum + inv.total, 0)
    const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0)
    const pending = invoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.total, 0)
    const overdue = invoices.filter(inv => inv.status === 'overdue').length
    
    return { total, paid, pending, overdue }
  }

  const stats = calculateStats()

  const handlePauseRecurring = async (invoiceId: string) => {
    try {
      await pauseRecurringInvoice(invoiceId)
      await loadInvoices()
      toast.success('Recurring invoice paused')
    } catch (error) {
      toast.error('Failed to pause recurring invoice')
    }
  }

  const handleResumeRecurring = async (invoiceId: string) => {
    try {
      await resumeRecurringInvoice(invoiceId)
      await loadInvoices()
      toast.success('Recurring invoice resumed')
    } catch (error) {
      toast.error('Failed to resume recurring invoice')
    }
  }

  const getStatusIcon = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} />
      case 'overdue':
        return <Clock size={16} />
      default:
        return null
    }
  }

  return (
    <Container>
      <Header>
        <Title>Dashboard</Title>
        <Button
          icon={<Plus size={20} />}
          onClick={() => navigate('/invoice/new')}
        >
          New Invoice
        </Button>
      </Header>

      <StatsGrid>
        <StatCard>
          <IconWrapper $color={theme.colors.primary}>
            <FileText size={28} />
          </IconWrapper>
          <StatContent>
            <StatValue>{invoices.length}</StatValue>
            <StatLabel>Total Invoices</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <IconWrapper $color={theme.colors.success}>
            <DollarSign size={28} />
          </IconWrapper>
          <StatContent>
            <StatValue>{formatCurrency(stats.paid)}</StatValue>
            <StatLabel>Paid</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <IconWrapper $color={theme.colors.warning}>
            <Clock size={28} />
          </IconWrapper>
          <StatContent>
            <StatValue>{formatCurrency(stats.pending)}</StatValue>
            <StatLabel>Pending</StatLabel>
          </StatContent>
        </StatCard>

        <StatCard>
          <IconWrapper $color={theme.colors.error}>
            <FileText size={28} />
          </IconWrapper>
          <StatContent>
            <StatValue>{stats.overdue}</StatValue>
            <StatLabel>Overdue</StatLabel>
          </StatContent>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <RevenueChart />
        
        <InvoiceSection>
        <SectionHeader>
          <SectionTitle>Recent Invoices</SectionTitle>
        </SectionHeader>
        
        {(() => {
          if (isLoading) {
            return <EmptyState>Loading invoices...</EmptyState>
          }
          if (invoices.length === 0) {
            return (
              <EmptyState>
                <p>No invoices yet. Create your first invoice to get started!</p>
              </EmptyState>
            )
          }
          return (
          <InvoiceList>
            {invoices.map((invoice) => (
              <InvoiceItem key={invoice.id}>
                <InvoiceNumber>{invoice.invoiceNumber}</InvoiceNumber>
                <ClientInfo>
                  <ClientName>{invoice.client.name}</ClientName>
                  <ClientEmail>{invoice.client.email}</ClientEmail>
                </ClientInfo>
                <Amount>{formatCurrency(invoice.total)}</Amount>
                <DueDate>Due {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}</DueDate>
                <Status $status={invoice.status}>
                  {getStatusIcon(invoice.status)}
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </Status>
                {invoice.status === 'sent' && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<CreditCard size={16} />}
                    onClick={() => {
                      navigate(`/invoice/${invoice.id}/payment`)
                    }}
                  >
                    Pay
                  </Button>
                )}
              </InvoiceItem>
            ))}
          </InvoiceList>
          )
        })()}
      </InvoiceSection>
      
      <RecurringInvoices
        invoices={invoices}
        onPause={handlePauseRecurring}
        onResume={handleResumeRecurring}
      />
      </ContentGrid>
    </Container>
  )
}

export default Dashboard