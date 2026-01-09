import { useCallback } from "react";
import { useProfileStore } from "@/stores";
import type { Database } from "@/types/database";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

/**
 * Adapter hook to maintain backward compatibility with the new Store Architecture.
 * This wraps the new useProfileStore (BaseStore) to match the old useProfile API where possible.
 */
export const useProfile = () => {
  const store = useProfileStore();

  // Map state
  const profiles = store.items;
  const currentProfile = store.currentItem;
  const loading = store.isLoading;
  const error = store.error;

  // Map actions
  const fetchProfiles = useCallback(async () => {
    await store.fetchAll();
  }, [store]);

  const fetchProfileById = useCallback(
    async (id: string) => {
      // The new store doesn't have a specific "fetchById" that updates currentItem automatically via API,
      // but we can simulate it or just use select if data is already there.
      // Ideally, we should implement fetchById in the store or service.
      // For now, let's use the service directly through the store if possible,
      // or better: utilize the store's select if loaded, or force a fetch.

      // Simplest approach for compatibility:
      // If we want to fetch a single profile into 'currentProfile', strictly speaking BaseStore doesn't do "fetch one and set as current".
      // It does "select one from items".

      // If the user expects a network call, we might be limited here unless we add fetchById to BaseStore or ProfileStore.
      // But let's try to just select it if it exists, or fetch all??
      // Mmm, fetchAll is too heavy.

      // Workaround: We will rely on the store having or fetching the item.
      // Since we can't easily add 'fetchById' to BaseStore without changing it all,
      // let's assume for now we might need to implement it in ProfileStore if it's critical.
      // BUT, checks 'profileService.getById(id)'.

      // Let's implement a direct service call here to respect the "fetch" contract,
      // and then update the store if successful.
      // Wait, the new architecture says: UX -> Hooks -> Store -> Service.
      // So we should add `fetchById` to `ProfileStore`.

      // For this quick fix to UNBREAK the app, I will use store.select if it's there.
      store.select(id);
      if (!store.items.find((p) => p.id === id)) {
        // If not found, previously it fetched from API.
        // We can trigger a full fetch or let it fail for now to see.
        // Or better, let's just stick to the pattern:
        await store.fetchAll();
        store.select(id);
      }
      return store.items.find((p) => p.id === id);
    },
    [store]
  );

  const fetchProfileByEmail = useCallback(
    async (email: string) => {
      // Similar issue. Adapter limitation.
      await store.fetchAll();
      const found = store.items.find((p) => p.email === email);
      if (found) store.select(found.id);
      return found;
    },
    [store]
  );

  const createProfile = useCallback(
    async (profileData: ProfileInsert) => {
      await store.create(profileData);
    },
    [store]
  );

  const updateProfileData = useCallback(
    async (id: string, updates: ProfileUpdate) => {
      await store.update(id, updates);
    },
    [store]
  );

  const updateCredits = useCallback(
    async (id: string, credits: number) => {
      await store.updateCredits(id, credits);
    },
    [store]
  );

  const updatePaymentStatus = useCallback(
    async (id: string, paymentStatus: string) => {
      await store.updatePaymentStatus(id, paymentStatus);
    },
    [store]
  );

  const deleteProfile = useCallback(
    async (id: string) => {
      await store.delete(id);
    },
    [store]
  );

  const createUser = useCallback(
    async (email: string, password: string, fullName: string) => {
      await store.createUser(email, password, fullName);
    },
    [store]
  );

  const deleteUser = useCallback(
    async (userId: string) => {
      await store.deleteUser(userId);
    },
    [store]
  );

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
    createUser,
    deleteUser,
    setCurrentProfile: store.select, // Map to select
  };
};
