import { useCallback } from 'react'
import { useProfileStore } from '@/stores'
import { profileService } from '@/services'
import type { Database } from '@/types/database'


type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export const useProfile = () => {
  const {
    profiles,
    currentProfile,
    loading,
    error,
    setProfiles,
    setCurrentProfile,
    addProfile,
    updateProfile,
    removeProfile,
    setLoading,
    setError,
  } = useProfileStore()

  const fetchProfiles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await profileService.getAll()
      setProfiles(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch profiles')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProfileById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await profileService.getById(id)
      setCurrentProfile(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch profile')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProfileByEmail = useCallback(async (email: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await profileService.getByEmail(email)
      setCurrentProfile(data)
      return data
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch profile')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const createProfile = useCallback(async (profileData: ProfileInsert) => {
    setLoading(true)
    setError(null)
    try {
      const newProfile = await profileService.create(profileData)
      addProfile(newProfile)
      return newProfile
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create profile')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateProfileData = useCallback(async (id: string, updates: ProfileUpdate) => {
    setLoading(true)
    setError(null)
    try {
      const updatedProfile = await profileService.update(id, updates)
      updateProfile(id, updatedProfile)
      return updatedProfile
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCredits = useCallback(async (id: string, credits: number) => {
    setLoading(true)
    setError(null)
    try {
      const updatedProfile = await profileService.updateCredits(id, credits)
      updateProfile(id, updatedProfile)
      return updatedProfile
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update credits')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePaymentStatus = useCallback(async (id: string, paymentStatus: string) => {
    setLoading(true)
    setError(null)
    try {
      const updatedProfile = await profileService.updatePaymentStatus(id, paymentStatus)
      updateProfile(id, updatedProfile)
      return updatedProfile
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update payment status')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteProfile = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await profileService.delete(id)
      removeProfile(id)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete profile')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    // State
    profiles,
    currentProfile,
    loading,
    error,

    // Actions
    fetchProfiles,
    fetchProfileById,
    fetchProfileByEmail,
    createProfile,
    updateProfile: updateProfileData,
    updateCredits,
    updatePaymentStatus,
    deleteProfile,
    setCurrentProfile,
  }
}
