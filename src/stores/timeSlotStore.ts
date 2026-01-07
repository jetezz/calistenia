import { create } from 'zustand'
import type { Database } from '@/types/database'

type TimeSlot = Database['public']['Tables']['time_slots']['Row']

interface TimeSlotStore {
  timeSlots: TimeSlot[]
  activeTimeSlots: TimeSlot[]
  currentTimeSlot: TimeSlot | null
  availabilityCache: Record<string, number>
  loading: boolean
  error: string | null

  setTimeSlots: (timeSlots: TimeSlot[]) => void
  setActiveTimeSlots: (timeSlots: TimeSlot[]) => void
  setCurrentTimeSlot: (timeSlot: TimeSlot | null) => void
  addTimeSlot: (timeSlot: TimeSlot) => void
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void
  removeTimeSlot: (id: string) => void
  setAvailability: (slotId: string, date: string, spots: number) => void
  getAvailability: (slotId: string, date: string) => number | undefined
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  timeSlots: [],
  activeTimeSlots: [],
  currentTimeSlot: null,
  availabilityCache: {},
  loading: false,
  error: null,
}

export const useTimeSlotStore = create<TimeSlotStore>((set, get) => ({
  ...initialState,

  setTimeSlots: (timeSlots) => set({ timeSlots }),
  
  setActiveTimeSlots: (activeTimeSlots) => set({ activeTimeSlots }),
  
  setCurrentTimeSlot: (currentTimeSlot) => set({ currentTimeSlot }),
  
  addTimeSlot: (timeSlot) => set((state) => ({
    timeSlots: [...state.timeSlots, timeSlot].sort((a, b) => {
      if (a.day_of_week !== b.day_of_week) {
        return a.day_of_week - b.day_of_week
      }
      return a.start_time.localeCompare(b.start_time)
    }),
    activeTimeSlots: timeSlot.is_active 
      ? [...state.activeTimeSlots, timeSlot].sort((a, b) => {
          if (a.day_of_week !== b.day_of_week) {
            return a.day_of_week - b.day_of_week
          }
          return a.start_time.localeCompare(b.start_time)
        })
      : state.activeTimeSlots
  })),
  
  updateTimeSlot: (id, updates) => set((state) => {
    const updatedTimeSlots = state.timeSlots.map((timeSlot) =>
      timeSlot.id === id ? { ...timeSlot, ...updates } : timeSlot
    )
    
    const updatedActiveTimeSlots = updatedTimeSlots.filter(slot => slot.is_active)
    
    return {
      timeSlots: updatedTimeSlots,
      activeTimeSlots: updatedActiveTimeSlots,
      currentTimeSlot: state.currentTimeSlot?.id === id
        ? { ...state.currentTimeSlot, ...updates }
        : state.currentTimeSlot
    }
  }),
  
  removeTimeSlot: (id) => set((state) => ({
    timeSlots: state.timeSlots.filter((timeSlot) => timeSlot.id !== id),
    activeTimeSlots: state.activeTimeSlots.filter((timeSlot) => timeSlot.id !== id),
    currentTimeSlot: state.currentTimeSlot?.id === id ? null : state.currentTimeSlot
  })),
  
  setAvailability: (slotId, date, spots) => set((state) => ({
    availabilityCache: {
      ...state.availabilityCache,
      [`${slotId}-${date}`]: spots
    }
  })),
  
  getAvailability: (slotId, date) => {
    const state = get()
    return state.availabilityCache[`${slotId}-${date}`]
  },
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}))