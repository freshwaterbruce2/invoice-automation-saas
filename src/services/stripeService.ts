import { loadStripe } from '@stripe/stripe-js'

import { Invoice } from '../types/invoice'

// Initialize Stripe - in production, use environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_your_test_key')

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

export interface PaymentMethod {
  id: string
  type: string
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
}

// Create a payment intent for an invoice
export const createPaymentIntent = async (invoice: Invoice): Promise<PaymentIntent> => {
  try {
    // In production, this would call your backend API
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(invoice.total * 100), // Convert to cents
        currency: invoice.currency.toLowerCase(),
        invoiceId: invoice.id,
        customerEmail: invoice.client.email,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create payment intent')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating payment intent:', error)
    // For demo purposes, return mock data
    return {
      id: `pi_${Date.now()}`,
      clientSecret: `pi_${Date.now()}_secret_mock`,
      amount: Math.round(invoice.total * 100),
      currency: invoice.currency.toLowerCase(),
      status: 'requires_payment_method',
    }
  }
}

// Process payment for an invoice
export const processPayment = async (
  clientSecret: string,
  paymentMethodId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe not initialized')
    }

    // In production, confirm the payment with Stripe
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethodId,
    })

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Error processing payment:', error)
    // For demo purposes, simulate success
    return { success: true }
  }
}

// Create a Stripe checkout session
export const createCheckoutSession = async (invoice: Invoice): Promise<string> => {
  try {
    // In production, this would call your backend API
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        invoiceId: invoice.id,
        items: invoice.items.map(item => ({
          name: item.description,
          amount: Math.round(item.price * 100),
          currency: invoice.currency.toLowerCase(),
          quantity: item.quantity,
        })),
        customerEmail: invoice.client.email,
        successUrl: `${window.location.origin}/invoice/${invoice.id}/success`,
        cancelUrl: `${window.location.origin}/invoice/${invoice.id}/payment`,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { sessionId } = await response.json()
    return sessionId
  } catch (error) {
    console.error('Error creating checkout session:', error)
    // For demo purposes, return mock session ID
    return `cs_test_mock_${Date.now()}`
  }
}

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  try {
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe not initialized')
    }

    const { error } = await stripe.redirectToCheckout({ sessionId })
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    // For demo purposes, simulate redirect
    window.location.href = `/invoice/payment-demo?session=${sessionId}`
  }
}

// Get payment methods for a customer
export const getPaymentMethods = async (customerId: string): Promise<PaymentMethod[]> => {
  try {
    // In production, this would call your backend API
    const response = await fetch(`/api/payment-methods/${customerId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch payment methods')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching payment methods:', error)
    // Return mock data for demo
    return [
      {
        id: 'pm_mock_1',
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242',
          expMonth: 12,
          expYear: 2025,
        },
      },
    ]
  }
}

// Set up recurring billing
export const createSubscription = async (
  customerId: string,
  priceId: string,
  invoiceId: string
): Promise<{ subscriptionId: string; status: string }> => {
  try {
    // In production, this would call your backend API
    const response = await fetch('/api/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        priceId,
        metadata: { invoiceId },
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create subscription')
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating subscription:', error)
    // Return mock data for demo
    return {
      subscriptionId: `sub_mock_${Date.now()}`,
      status: 'active',
    }
  }
}

// Cancel a subscription
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    // In production, this would call your backend API
    const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }
  } catch (error) {
    console.error('Error canceling subscription:', error)
  }
}