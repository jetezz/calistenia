import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'


type PaymentRequestInsert = Database['public']['Tables']['payment_requests']['Insert']
type PaymentRequestUpdate = Database['public']['Tables']['payment_requests']['Update']

export const paymentRequestService = {
  async getAll() {
    const { data, error } = await supabase
      .from('payment_requests')
      .select(`
        *,
        user:profiles!payment_requests_user_id_fkey(id, full_name, email)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByUserId(userId: string) {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getByStatus(status: string) {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getPending() {
    const { data, error } = await supabase
      .from('payment_requests')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async create(paymentRequest: PaymentRequestInsert) {
    const { data, error } = await supabase
      .from('payment_requests')
      .insert(paymentRequest)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: PaymentRequestUpdate) {
    const { data, error } = await supabase
      .from('payment_requests')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        user:profiles!payment_requests_user_id_fkey(id, full_name, email)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  async approve(id: string, processedBy: string, adminNotes?: string) {
    const updates: PaymentRequestUpdate = {
      status: 'approved',
      processed_by: processedBy,
      processed_at: new Date().toISOString(),
      admin_notes: adminNotes
    }
    
    const { data, error } = await supabase
      .from('payment_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async reject(id: string, processedBy: string, adminNotes?: string) {
    const updates: PaymentRequestUpdate = {
      status: 'rejected',
      processed_by: processedBy,
      processed_at: new Date().toISOString(),
      admin_notes: adminNotes
    }
    
    const { data, error } = await supabase
      .from('payment_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { data, error } = await supabase
      .from('payment_requests')
      .delete()
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
