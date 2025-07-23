import { mockApi } from '../../services/mockApi'

describe('mockApi', () => {
  describe('Invoice operations', () => {
    it('should get all invoices', async () => {
      const invoices = await mockApi.getInvoices()
      
      expect(Array.isArray(invoices)).toBe(true)
      expect(invoices.length).toBeGreaterThan(0)
      expect(invoices[0]).toHaveProperty('id')
      expect(invoices[0]).toHaveProperty('invoiceNumber')
      expect(invoices[0]).toHaveProperty('client')
      expect(invoices[0]).toHaveProperty('total')
    })

    it('should get a specific invoice', async () => {
      const invoices = await mockApi.getInvoices()
      const firstInvoice = invoices[0]
      
      const invoice = await mockApi.getInvoice(firstInvoice.id)
      
      expect(invoice).toBeDefined()
      expect(invoice?.id).toBe(firstInvoice.id)
    })

    it('should create a new invoice', async () => {
      const newInvoice = {
        invoiceNumber: 'INV-2024-TEST',
        client: {
          id: 'client-test',
          name: 'Test Client',
          email: 'test@example.com',
          phone: '+1234567890',
          address: 'Test Address'
        },
        issueDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft' as const,
        items: [
          {
            id: 'item-test',
            description: 'Test Service',
            quantity: 1,
            price: 100,
            total: 100
          }
        ],
        subtotal: 100,
        tax: 10,
        total: 110,
        notes: 'Test invoice'
      }

      const created = await mockApi.createInvoice(newInvoice)
      
      expect(created).toHaveProperty('id')
      expect(created).toHaveProperty('createdAt')
      expect(created).toHaveProperty('updatedAt')
      expect(created.invoiceNumber).toBe(newInvoice.invoiceNumber)
      expect(created.total).toBe(newInvoice.total)
    })

    it('should update an invoice', async () => {
      const invoices = await mockApi.getInvoices()
      const invoice = invoices[0]
      
      const updated = await mockApi.updateInvoice(invoice.id, {
        status: 'paid',
        notes: 'Updated notes'
      })
      
      expect(updated).toBeDefined()
      expect(updated?.status).toBe('paid')
      expect(updated?.notes).toBe('Updated notes')
      expect(updated?.updatedAt).not.toBe(invoice.updatedAt)
    })

    it('should delete an invoice', async () => {
      const newInvoice = {
        invoiceNumber: 'INV-DELETE-TEST',
        client: {
          id: 'client-test',
          name: 'Test Client',
          email: 'test@example.com',
          phone: '+1234567890',
          address: 'Test Address'
        },
        issueDate: new Date().toISOString(),
        dueDate: new Date().toISOString(),
        status: 'draft' as const,
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        notes: ''
      }

      const created = await mockApi.createInvoice(newInvoice)
      const deleted = await mockApi.deleteInvoice(created.id)
      
      expect(deleted).toBe(true)
      
      const notFound = await mockApi.getInvoice(created.id)
      expect(notFound).toBeNull()
    })
  })

  describe('Payment operations', () => {
    it('should process payment successfully', async () => {
      const invoices = await mockApi.getInvoices()
      const unpaidInvoice = invoices.find(inv => inv.status !== 'paid')
      
      if (!unpaidInvoice) {
        throw new Error('No unpaid invoice found for testing')
      }

      const payment = await mockApi.processPayment(unpaidInvoice.id, {
        paymentMethod: 'card_test_123'
      })
      
      expect(payment).toHaveProperty('id')
      expect(payment.status).toBe('succeeded')
      expect(payment.amount).toBe(unpaidInvoice.total)
      
      // Check invoice was updated
      const updatedInvoice = await mockApi.getInvoice(unpaidInvoice.id)
      expect(updatedInvoice?.status).toBe('paid')
    })

    it('should fail payment for non-existent invoice', async () => {
      await expect(
        mockApi.processPayment('non-existent-id', { paymentMethod: 'test' })
      ).rejects.toThrow('Invoice not found')
    })
  })

  describe('Analytics operations', () => {
    it('should return analytics data', async () => {
      const analytics = await mockApi.getAnalytics('month')
      
      expect(analytics).toHaveProperty('totalRevenue')
      expect(analytics).toHaveProperty('totalInvoices')
      expect(analytics).toHaveProperty('paidInvoices')
      expect(analytics).toHaveProperty('pendingInvoices')
      expect(analytics).toHaveProperty('overdueInvoices')
      expect(analytics).toHaveProperty('averageInvoiceValue')
      expect(analytics).toHaveProperty('revenueGrowth')
      expect(analytics).toHaveProperty('chartData')
      
      expect(Array.isArray(analytics.chartData)).toBe(true)
      expect(analytics.chartData.length).toBeGreaterThan(0)
    })

    it('should return different chart data for different periods', async () => {
      const weekData = await mockApi.getAnalytics('week')
      const monthData = await mockApi.getAnalytics('month')
      const yearData = await mockApi.getAnalytics('year')
      
      expect(weekData.chartData.length).toBe(7)
      expect(monthData.chartData.length).toBe(30)
      expect(yearData.chartData.length).toBe(12)
    })
  })

  describe('Client operations', () => {
    it('should get all clients', async () => {
      const clients = await mockApi.getClients()
      
      expect(Array.isArray(clients)).toBe(true)
      expect(clients.length).toBeGreaterThan(0)
      expect(clients[0]).toHaveProperty('id')
      expect(clients[0]).toHaveProperty('name')
      expect(clients[0]).toHaveProperty('email')
    })

    it('should create a new client', async () => {
      const newClient = {
        name: 'New Test Client',
        email: 'newclient@test.com',
        phone: '+9876543210',
        address: 'New Test Address'
      }

      const created = await mockApi.createClient(newClient)
      
      expect(created).toHaveProperty('id')
      expect(created).toHaveProperty('createdAt')
      expect(created.name).toBe(newClient.name)
      expect(created.email).toBe(newClient.email)
    })
  })
})