import { addDays, addMonths, addQuarters, addYears, isAfter, isBefore } from 'date-fns'

import { Invoice, RecurringInvoice } from '../types/invoice'

import { generateInvoiceNumber, saveInvoice } from './invoiceService'

export const calculateNextInvoiceDate = (
  recurring: RecurringInvoice,
  lastInvoiceDate: Date = new Date()
): Date | null => {
  if (!recurring.enabled) {return null}

  let nextDate = new Date(lastInvoiceDate)

  switch (recurring.frequency) {
    case 'weekly':
      nextDate = addDays(nextDate, 7 * recurring.interval)
      break
    case 'monthly':
      nextDate = addMonths(nextDate, recurring.interval)
      break
    case 'quarterly':
      nextDate = addQuarters(nextDate, recurring.interval)
      break
    case 'yearly':
      nextDate = addYears(nextDate, recurring.interval)
      break
  }

  // Check if we've reached the end conditions
  if (recurring.endType === 'date' && recurring.endDate) {
    if (isAfter(nextDate, recurring.endDate)) {
      return null
    }
  }

  return nextDate
}

export const shouldCreateNextInvoice = (
  recurring: RecurringInvoice,
  createdInvoicesCount: number = 0
): boolean => {
  if (!recurring.enabled) {return false}

  // Check occurrence limit
  if (recurring.endType === 'occurrences' && recurring.occurrences) {
    if (createdInvoicesCount >= recurring.occurrences) {
      return false
    }
  }

  // Check end date
  if (recurring.endType === 'date' && recurring.endDate) {
    const today = new Date()
    if (isAfter(today, recurring.endDate)) {
      return false
    }
  }

  return true
}

export const createNextRecurringInvoice = async (
  baseInvoice: Invoice
): Promise<Invoice | null> => {
  if (!baseInvoice.recurring || !baseInvoice.recurring.enabled) {
    return null
  }

  const nextDate = calculateNextInvoiceDate(
    baseInvoice.recurring,
    baseInvoice.issueDate
  )

  if (!nextDate) {return null}

  // Calculate due date based on the same interval as the original
  const originalInterval = Math.floor(
    (baseInvoice.dueDate.getTime() - baseInvoice.issueDate.getTime()) / 
    (1000 * 60 * 60 * 24)
  )
  const newDueDate = addDays(nextDate, originalInterval)

  const newInvoice: Invoice = {
    ...baseInvoice,
    id: `inv-${Date.now()}`,
    invoiceNumber: generateInvoiceNumber(),
    issueDate: nextDate,
    dueDate: newDueDate,
    status: 'draft',
    parentInvoiceId: baseInvoice.parentInvoiceId || baseInvoice.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Update the recurring next invoice date
  if (newInvoice.recurring) {
    newInvoice.recurring.nextInvoiceDate = calculateNextInvoiceDate(
      newInvoice.recurring,
      nextDate
    ) || undefined
  }

  return await saveInvoice(newInvoice)
}

export const getUpcomingRecurringInvoices = async (
  days: number = 30
): Promise<Invoice[]> => {
  // In production, this would query the backend
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]') as Invoice[]
  const upcomingInvoices: Invoice[] = []
  const cutoffDate = addDays(new Date(), days)

  for (const invoice of invoices) {
    if (invoice.recurring && invoice.recurring.enabled) {
      const nextDate = invoice.recurring.nextInvoiceDate || 
        calculateNextInvoiceDate(invoice.recurring, invoice.issueDate)
      
      if (nextDate && isBefore(nextDate, cutoffDate)) {
        upcomingInvoices.push({
          ...invoice,
          issueDate: nextDate,
          status: 'draft'
        })
      }
    }
  }

  return upcomingInvoices
}

export const pauseRecurringInvoice = async (invoiceId: string): Promise<void> => {
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]') as Invoice[]
  const updatedInvoices = invoices.map(invoice => {
    if (invoice.id === invoiceId && invoice.recurring) {
      return {
        ...invoice,
        recurring: {
          ...invoice.recurring,
          enabled: false
        }
      }
    }
    return invoice
  })
  
  localStorage.setItem('invoices', JSON.stringify(updatedInvoices))
}

export const resumeRecurringInvoice = async (invoiceId: string): Promise<void> => {
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]') as Invoice[]
  const updatedInvoices = invoices.map(invoice => {
    if (invoice.id === invoiceId && invoice.recurring) {
      return {
        ...invoice,
        recurring: {
          ...invoice.recurring,
          enabled: true,
          nextInvoiceDate: calculateNextInvoiceDate(
            invoice.recurring,
            new Date()
          ) || undefined
        }
      }
    }
    return invoice
  })
  
  localStorage.setItem('invoices', JSON.stringify(updatedInvoices))
}

// Automated scheduling service (would run on backend)
export const checkAndCreateRecurringInvoices = async (): Promise<Invoice[]> => {
  const invoices = JSON.parse(localStorage.getItem('invoices') || '[]') as Invoice[]
  const createdInvoices: Invoice[] = []
  const today = new Date()

  for (const invoice of invoices) {
    if (
      invoice.recurring && 
      invoice.recurring.enabled &&
      invoice.recurring.nextInvoiceDate &&
      isBefore(invoice.recurring.nextInvoiceDate, today)
    ) {
      const newInvoice = await createNextRecurringInvoice(invoice)
      if (newInvoice) {
        createdInvoices.push(newInvoice)
      }
    }
  }

  return createdInvoices
}