import { create } from 'zustand'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

interface ProfileStore {
  profiles: Profile[]
  currentProfile: Profile | null
  loading: boolean
  error: string | null

  setProfiles: (profiles: Profile[]) => void
  setCurrentProfile: (profile: Profile | null) => void
  addProfile: (profile: Profile) => void
  updateProfile: (id: string, updates: Partial<Profile>) => void
  removeProfile: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  profiles: [],
  currentProfile: null,
  loading: false,
  error: null,
}

export const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState,

  setProfiles: (profiles) => set({ profiles }),
  
  setCurrentProfile: (currentProfile) => set({ currentProfile }),
  
  addProfile: (profile) => set((state) => ({
    profiles: [profile, ...state.profiles]
  })),
  
  updateProfile: (id, updates) => set((state) => ({
    profiles: state.profiles.map((profile) =>
      profile.id === id ? { ...profile, ...updates } : profile
    ),
    currentProfile: state.currentProfile?.id === id
      ? { ...state.currentProfile, ...updates }
      : state.currentProfile
  })),
  
  removeProfile: (id) => set((state) => ({
    profiles: state.profiles.filter((profile) => profile.id !== id),
    currentProfile: state.currentProfile?.id === id ? null : state.currentProfile
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
}))
