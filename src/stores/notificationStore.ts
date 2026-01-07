import { create } from 'zustand'

interface NotificationState {
  newBookingsCount: number
  setNewBookingsCount: (count: number) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  newBookingsCount: 0,
  
  setNewBookingsCount: (count: number) => set({ newBookingsCount: count }),
}))
