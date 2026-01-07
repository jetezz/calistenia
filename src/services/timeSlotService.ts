import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'


type TimeSlotInsert = Database['public']['Tables']['time_slots']['Insert']
type TimeSlotUpdate = Database['public']['Tables']['time_slots']['Update']

export const timeSlotService = {
  async getAll() {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .order('slot_type', { ascending: true })
      .order('day_of_week', { ascending: true })
      .order('specific_date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getActive() {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('is_active', true)
      .order('slot_type', { ascending: true })
      .order('day_of_week', { ascending: true })
      .order('specific_date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getRecurringSlots() {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('slot_type', 'recurring')
      .eq('is_active', true)
      .order('day_of_week', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getSpecificDateSlots(fromDate?: string, toDate?: string) {
    let query = supabase
      .from('time_slots')
      .select('*')
      .eq('slot_type', 'specific_date')
      .eq('is_active', true)
    
    if (fromDate) {
      query = query.gte('specific_date', fromDate)
    }
    
    if (toDate) {
      query = query.lte('specific_date', toDate)
    }
    
    const { data, error } = await query
      .order('specific_date', { ascending: true })
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getAvailableDatesInRange(fromDate: string, toDate: string) {
    // Get recurring slots that would be available in the date range
    const { data: recurringSlots, error: recurringError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('slot_type', 'recurring')
      .eq('is_active', true)
    
    if (recurringError) throw recurringError

    // Get specific date slots in the range
    const { data: specificSlots, error: specificError } = await supabase
      .from('time_slots')
      .select('*')
      .eq('slot_type', 'specific_date')
      .eq('is_active', true)
      .gte('specific_date', fromDate)
      .lte('specific_date', toDate)
    
    if (specificError) throw specificError

    return { recurringSlots, specificSlots }
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async getByDayOfWeek(dayOfWeek: number) {
    const { data, error } = await supabase
      .from('time_slots')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .eq('is_active', true)
      .order('start_time', { ascending: true })
    
    if (error) throw error
    return data
  },

  async getAvailableSpots(slotId: string, targetDate: string) {
    const { data, error } = await supabase
      .rpc('get_available_spots', {
        slot_id: slotId,
        target_date: targetDate
      })
    
    if (error) throw error
    return data as number
  },

  async create(timeSlot: TimeSlotInsert) {
    const { data, error } = await supabase
      .from('time_slots')
      .insert(timeSlot)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, updates: TimeSlotUpdate) {
    const { data, error } = await supabase
      .from('time_slots')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async toggleActive(id: string, isActive: boolean) {
    const { data, error } = await supabase
      .from('time_slots')
      .update({ is_active: isActive })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { data, error } = await supabase
      .from('time_slots')
      .delete()
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
