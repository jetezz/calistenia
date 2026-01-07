import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Booking = Database['public']['Tables']['bookings']['Row']
type BookingInsert = Database['public']['Tables']['bookings']['Insert']
type BookingUpdate = Database['public']['Tables']['bookings']['Update']
type TimeSlot = Database['public']['Tables']['time_slots']['Row']

type BookingWithTimeSlot = Booking & {
  time_slot: TimeSlot
  user: { id: string; full_name: string | null; email: string }
}

export const bookingService = {
  async getAll() {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*),
        user:profiles!bookings_user_id_fkey(id, full_name, email)
      `)
      .order('booking_date', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as BookingWithTimeSlot[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as BookingWithTimeSlot
  },

  async getByUserId(userId: string, limit?: number) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*)
      `)
      .eq('user_id', userId)
      .order('booking_date', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (limit) {
      query = query.limit(limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    return data as BookingWithTimeSlot[]
  },

  async getUpcomingByUserId(userId: string, limit: number = 10) {
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'confirmed')
      .gte('booking_date', today)
      .order('booking_date', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(limit)
    
    if (error) throw error
    return data as BookingWithTimeSlot[]
  },

  async getByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*)
      `)
      .gte('booking_date', startDate)
      .lte('booking_date', endDate)
      .order('booking_date', { ascending: true })
    
    if (error) throw error
    return data as BookingWithTimeSlot[]
  },

  async create(booking: BookingInsert) {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*)
      `)
      .single()
    
    if (error) throw error
    return data as BookingWithTimeSlot
  },

  async update(id: string, updates: BookingUpdate) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*)
      `)
      .single()
    
    if (error) throw error
    return data as BookingWithTimeSlot
  },

  async cancel(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*)
      `)
      .single()
    
    if (error) throw error
    return data as BookingWithTimeSlot
  },

  async delete(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async checkBookingConflict(userId: string, timeSlotId: string, bookingDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('user_id', userId)
      .eq('time_slot_id', timeSlotId)
      .eq('booking_date', bookingDate)
      .eq('status', 'confirmed')
      .single()
    
    if (error && error.code !== 'PGRST116') throw error
    return data !== null
  },

  async cancelBooking(id: string) {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getBookingsByTimeSlotAndDate(timeSlotId: string, bookingDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        user:profiles!bookings_user_id_fkey(id, full_name, email)
      `)
      .eq('time_slot_id', timeSlotId)
      .eq('booking_date', bookingDate)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data as (Booking & { user: { id: string; full_name: string | null; email: string } })[]
  },

  async getBookingsByDate(bookingDate: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        time_slot:time_slots!bookings_time_slot_id_fkey(*),
        user:profiles!bookings_user_id_fkey(id, full_name, email)
      `)
      .eq('booking_date', bookingDate)
      .eq('status', 'confirmed')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data as (Booking & { 
      time_slot: TimeSlot;
      user: { id: string; full_name: string | null; email: string } 
    })[]
  }
}
