import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

import { Invoice } from '../types/invoice'

export const generateInvoiceNumber = (): string => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV-${year}${month}-${random}`
}

export const downloadInvoicePDF = async (elementId: string, filename: string): Promise<void> => {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error('Invoice element not found')
  }

  try {
    // Create canvas from HTML element
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
    })

    // Calculate PDF dimensions
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // Create PDF
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: 'a4',
    })

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    
    // Download PDF
    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

export const calculateInvoiceTotals = (
  items: { quantity: number; price: number }[],
  taxRate: number = 0
): { subtotal: number; tax: number; total: number } => {
  const subtotal = items.reduce((sum, item) => {
    return sum + (item.quantity * item.price)
  }, 0)
  
  const tax = (subtotal * taxRate) / 100
  const total = subtotal + tax
  
  return { subtotal, tax, total }
}

export const getInvoiceStatus = (dueDate: Date): Invoice['status'] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  
  if (due < today) {
    return 'overdue'
  }
  
  return 'sent'
}

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Mock API calls - replace with actual API integration
export const saveInvoice = async (invoice: Invoice): Promise<Invoice> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // In a real app, this would save to backend
  const savedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]')
  savedInvoices.push(invoice)
  localStorage.setItem('invoices', JSON.stringify(savedInvoices))
  
  return invoice
}

export const getInvoices = async (): Promise<Invoice[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // In a real app, this would fetch from backend
  return JSON.parse(localStorage.getItem('invoices') || '[]')
}

export const sendInvoiceEmail = async (invoice: Invoice): Promise<void> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // In a real app, this would send via email service
  console.log('Sending invoice to:', invoice.client.email)
}