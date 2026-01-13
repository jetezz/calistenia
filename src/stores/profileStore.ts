import { create } from "zustand";
import { createBaseStore, type BaseStoreState } from "./BaseStore";
import { profileService } from "@/services/profileService";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

interface ProfileStore
  extends BaseStoreState<Profile, ProfileInsert, ProfileUpdate> {
  // Estado para recargas en segundo plano
  isRefreshing: boolean;
  setRefreshing: (isRefreshing: boolean) => void;

  // Métodos extra específicos de usuarios
  updateCredits: (id: string, credits: number) => Promise<void>;
  updatePaymentStatus: (id: string, status: string) => Promise<void>;
  createUser: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateApprovalStatus: (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => Promise<void>;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string) => Promise<void>;
}

export const useProfileStore = create<ProfileStore>((set, get, store) => {
  const baseStore = createBaseStore<Profile, ProfileInsert, ProfileUpdate>(
    profileService
  )(set, get, store);

  return {
    ...baseStore,

    // Estado y método para recargas en segundo plano
    isRefreshing: false,
    setRefreshing: (isRefreshing: boolean) => set({ isRefreshing }),

    updateCredits: async (id: string, credits: number) => {
      // Optimistic Update
      set((state) => ({
        items: state.items.map((p) => (p.id === id ? { ...p, credits } : p)),
      }));

      try {
        await profileService.updateCredits(id, credits);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
      }
    },

    updatePaymentStatus: async (id: string, status: string) => {
      set((state) => ({
        items: state.items.map((p) =>
          p.id === id ? { ...p, payment_status: status } : p
        ),
      }));

      try {
        await profileService.updatePaymentStatus(id, status);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
      }
    },

    createUser: async (email, password, fullName) => {
      set({ isLoading: true, error: null });
      try {
        await profileService.createUser(email, password, fullName);
        // After creating, we might want to refresh the list?
        // BaseStore fetchAll?
        const items = await profileService.getAll();
        set({ items, isLoading: false });
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message, isLoading: false });
      }
    },

    deleteUser: async (userId) => {
      // Optimistic delete
      set((state) => ({
        items: state.items.filter((p) => p.id !== userId),
      }));

      try {
        await profileService.deleteUser(userId);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
        // Should revert here implicitly by fetching again or rolling back state?
        // Since we don't have easy rollback without snapshots, we might just re-fetch
        const items = await profileService.getAll();
        set({ items });
      }
    },

    updateApprovalStatus: async (id, status) => {
      // Optimistic Update
      set((state) => ({
        items: state.items.map((p) =>
          p.id === id ? { ...p, approval_status: status } : p
        ),
      }));

      try {
        await profileService.updateApprovalStatus(id, status);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
        // Revert on error
        const items = await profileService.getAll();
        set({ items });
      }
    },

    approveUser: async (userId) => {
      // Optimistic Update
      set((state) => ({
        items: state.items.map((p) =>
          p.id === userId ? { ...p, approval_status: "approved" } : p
        ),
      }));

      try {
        await profileService.approveUser(userId);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
        // Revert on error
        const items = await profileService.getAll();
        set({ items });
      }
    },

    rejectUser: async (userId) => {
      // Optimistic Update
      set((state) => ({
        items: state.items.map((p) =>
          p.id === userId ? { ...p, approval_status: "rejected" } : p
        ),
      }));

      try {
        await profileService.rejectUser(userId);
      } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        set({ error: error.message });
        // Revert on error
        const items = await profileService.getAll();
        set({ items });
      }
    },
  };
});
