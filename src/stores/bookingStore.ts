import { create } from 'zustand'
import type { Database } from '@/types/database'

type Booking = Database['public']['Tables']['bookings']['Row']
type TimeSlot = Database['public']['Tables']['time_slots']['Row']

type BookingWithTimeSlot = Booking & {
  time_slot: TimeSlot
}

interface BookingStore {
  bookings: BookingWithTimeSlot[]
  currentBooking: BookingWithTimeSlot | null
  userBookings: BookingWithTimeSlot[]
  upcomingBookings: BookingWithTimeSlot[]
  loading: boolean
  error: string | null

  setBookings: (bookings: BookingWithTimeSlot[]) => void
  setCurrentBooking: (booking: BookingWithTimeSlot | null) => void
  setUserBookings: (bookings: BookingWithTimeSlot[]) => void
  setUpcomingBookings: (bookings: BookingWithTimeSlot[]) => void
  addBooking: (booking: BookingWithTimeSlot) => void
  updateBooking: (id: string, updates: Partial<BookingWithTimeSlot>) => void
  removeBooking: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  bookings: [],
  currentBooking: null,
  userBookings: [],
  upcomingBookings: [],
  loading: false,
  error: null,
}

export const useBookingStore = create<BookingStore>((set) => ({
  ...initialState,

  setBookings: (bookings) => set({ bookings }),
  
  setCurrentBooking: (currentBooking) => set({ currentBooking }),
  
  setUserBookings: (userBookings) => set({ userBookings }),
  
  setUpcomingBookings: (upcomingBookings) => set({ upcomingBookings }),
  
  addBooking: (booking) => set((state) => ({
    bookings: [booking, ...state.bookings],
    userBookings: [booking, ...state.userBookings],
  })),
  
  updateBooking: (id, updates) => set((state) => ({
    bookings: state.bookings.map((booking) =>
      booking.id === id ? { ...booking, ...updates } : booking
    ),
    userBookings: state.userBookings.map((booking) =>
      booking.id === id ? { ...booking, ...updates } : booking
    ),
    upcomingBookings: state.upcomingBookings.map((booking) =>
      booking.id === id ? { ...booking, ...updates } : booking
    ),
    currentBooking: state.currentBooking?.id === id
      ? { ...state.currentBooking, ...updates }
      : state.currentBooking
  })),
  
  removeBooking: (id) => set((state) => ({
    bookings: state.bookings.filter((booking) => booking.id !== id),
    userBookings: state.userBookings.filter((booking) => booking.id !== id),
    upcomingBookings: state.upcomingBookings.filter((booking) => booking.id !== id),
    currentBooking: state.currentBooking?.id === id ? null : state.currentBooking
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}))
