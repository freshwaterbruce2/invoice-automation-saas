// Mock API for development when backend is not available
import { Invoice } from '../types/invoice'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

class MockAPI {
  private invoices: Map<string, Invoice> = new Map()
  private clients: Map<string, any> = new Map()

  constructor() {
    // Initialize with some mock data
    this.seedData()
  }

  private seedData() {
    // Mock invoices
    const mockInvoices: Invoice[] = [
      {
        id: '1',
        invoiceNumber: 'INV-2024-0001',
        client: {
          id: 'client-1',
          name: 'Acme Corp',
          email: 'billing@acme.com',
          phone: '+1234567890',
          address: '123 Business St, City, State 12345'
        },
        issueDate: new Date('2024-01-15').toISOString(),
        dueDate: new Date('2024-02-15').toISOString(),
        status: 'paid',
        items: [
          {
            id: 'item-1',
            description: 'Web Development Services',
            quantity: 40,
            price: 150,
            total: 6000
          },
          {
            id: 'item-2',
            description: 'UI/UX Design',
            quantity: 20,
            price: 120,
            total: 2400
          }
        ],
        subtotal: 8400,
        tax: 840,
        total: 9240,
        notes: 'Thank you for your business!',
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString()
      },
      {
        id: '2',
        invoiceNumber: 'INV-2024-0002',
        client: {
          id: 'client-2',
          name: 'TechStart Inc',
          email: 'finance@techstart.com',
          phone: '+1987654321',
          address: '456 Innovation Ave, Tech City, TC 54321'
        },
        issueDate: new Date('2024-01-20').toISOString(),
        dueDate: new Date('2024-02-20').toISOString(),
        status: 'sent',
        items: [
          {
            id: 'item-3',
            description: 'Mobile App Development',
            quantity: 80,
            price: 175,
            total: 14000
          }
        ],
        subtotal: 14000,
        tax: 1400,
        total: 15400,
        recurringConfig: {
          enabled: true,
          frequency: 'monthly',
          interval: 1,
          startDate: '2024-01-20',
          endType: 'never'
        },
        createdAt: new Date('2024-01-20').toISOString(),
        updatedAt: new Date('2024-01-20').toISOString()
      }
    ]

    mockInvoices.forEach(invoice => {
      this.invoices.set(invoice.id, invoice)
    })

    // Mock clients
    const mockClients = [
      {
        id: 'client-1',
        name: 'Acme Corp',
        email: 'billing@acme.com',
        phone: '+1234567890',
        address: '123 Business St, City, State 12345',
        createdAt: new Date('2024-01-01').toISOString()
      },
      {
        id: 'client-2',
        name: 'TechStart Inc',
        email: 'finance@techstart.com',
        phone: '+1987654321',
        address: '456 Innovation Ave, Tech City, TC 54321',
        createdAt: new Date('2024-01-05').toISOString()
      }
    ]

    mockClients.forEach(client => {
      this.clients.set(client.id, client)
    })
  }

  // Invoice endpoints
  async getInvoices(): Promise<Invoice[]> {
    await delay(300 + Math.random() * 200) // Simulate network delay
    return Array.from(this.invoices.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    await delay(200 + Math.random() * 100)
    return this.invoices.get(id) || null
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
    await delay(400 + Math.random() * 200)
    
    const newInvoice: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.invoices.set(newInvoice.id, newInvoice)
    return newInvoice
  }

  async updateInvoice(id: string, updates: Partial<Invoice>): Promise<Invoice | null> {
    await delay(300 + Math.random() * 150)
    
    const invoice = this.invoices.get(id)
    if (!invoice) return null
    
    const updatedInvoice = {
      ...invoice,
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.invoices.set(id, updatedInvoice)
    return updatedInvoice
  }

  async deleteInvoice(id: string): Promise<boolean> {
    await delay(200 + Math.random() * 100)
    return this.invoices.delete(id)
  }

  // Client endpoints
  async getClients(): Promise<any[]> {
    await delay(200 + Math.random() * 100)
    return Array.from(this.clients.values())
  }

  async createClient(client: any): Promise<any> {
    await delay(300 + Math.random() * 150)
    
    const newClient = {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    this.clients.set(newClient.id, newClient)
    return newClient
  }

  // Payment simulation
  async processPayment(invoiceId: string, paymentDetails: any): Promise<any> {
    await delay(1000 + Math.random() * 500) // Simulate payment processing
    
    const invoice = this.invoices.get(invoiceId)
    if (!invoice) throw new Error('Invoice not found')
    
    // Update invoice status
    const updatedInvoice = {
      ...invoice,
      status: 'paid' as const,
      paidAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    this.invoices.set(invoiceId, updatedInvoice)
    
    return {
      id: `payment-${Date.now()}`,
      invoiceId,
      amount: invoice.total,
      currency: 'USD',
      status: 'succeeded',
      paymentMethod: paymentDetails.paymentMethod,
      createdAt: new Date().toISOString()
    }
  }

  // Analytics data
  async getAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<any> {
    await delay(300 + Math.random() * 200)
    
    const invoices = Array.from(this.invoices.values())
    const paidInvoices = invoices.filter(inv => inv.status === 'paid')
    
    return {
      totalRevenue: paidInvoices.reduce((sum, inv) => sum + inv.total, 0),
      totalInvoices: invoices.length,
      paidInvoices: paidInvoices.length,
      pendingInvoices: invoices.filter(inv => inv.status === 'sent').length,
      overdueInvoices: invoices.filter(inv => inv.status === 'overdue').length,
      averageInvoiceValue: invoices.length > 0 
        ? invoices.reduce((sum, inv) => sum + inv.total, 0) / invoices.length 
        : 0,
      revenueGrowth: 15.5, // Mock growth percentage
      chartData: this.generateChartData(period)
    }
  }

  private generateChartData(period: string) {
    const points = period === 'week' ? 7 : period === 'month' ? 30 : 12
    const data = []
    
    for (let i = 0; i < points; i++) {
      data.push({
        date: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toISOString(),
        revenue: Math.floor(Math.random() * 5000) + 3000,
        invoices: Math.floor(Math.random() * 10) + 5
      })
    }
    
    return data
  }
}

// Export singleton instance
export const mockApi = new MockAPI()

// Hook to use mock API in development
export const useMockApi = () => {
  const isDevelopment = import.meta.env.DEV
  const isBackendAvailable = import.meta.env.VITE_API_URL
  
  // Use mock API if in development and no backend URL is configured
  return isDevelopment && !isBackendAvailable ? mockApi : null
}