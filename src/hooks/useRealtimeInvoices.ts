import { useEffect, useState } from 'react'
import { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '../services/supabase'
import { Invoice } from '../types/invoice'
import { useAuth } from '../contexts/AuthContext'

export const useRealtimeInvoices = () => {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [_channel, setChannel] = useState<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!user) {
      setInvoices([])
      setLoading(false)
      return
    }

    // Fetch initial invoices
    const fetchInvoices = async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select(`
          *,
          client:clients(*),
          items:invoice_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching invoices:', error)
      } else {
        setInvoices(data || [])
      }
      setLoading(false)
    }

    fetchInvoices()

    // Set up real-time subscription
    const invoiceChannel = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setInvoices((prev) => [payload.new as Invoice, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setInvoices((prev) =>
              prev.map((invoice) =>
                invoice.id === payload.new.id ? (payload.new as Invoice) : invoice
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setInvoices((prev) =>
              prev.filter((invoice) => invoice.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    setChannel(invoiceChannel)

    // Cleanup
    return () => {
      if (invoiceChannel) {
        supabase.removeChannel(invoiceChannel)
      }
    }
  }, [user])

  const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        ...invoice,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  const updateInvoice = async (id: string, updates: Partial<Invoice>) => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  const deleteInvoice = async (id: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
  }

  return {
    invoices,
    loading,
    createInvoice,
    updateInvoice,
    deleteInvoice,
  }
}