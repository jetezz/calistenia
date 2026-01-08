import { create } from "zustand";
import { adminDataService } from "@/services/adminDataService";
import type {
  AdminDashboardData,
  AdminSecondaryData,
} from "@/services/adminDataService";

interface AdminDataStore {
  // Dashboard data (critical - loaded first)
  dashboardData: AdminDashboardData | null;
  isDashboardLoading: boolean;
  dashboardError: string | null;
  dashboardInitialized: boolean;

  // Secondary data (loaded in background)
  secondaryData: AdminSecondaryData | null;
  isSecondaryLoading: boolean;
  secondaryError: string | null;
  secondaryInitialized: boolean;

  // Actions
  loadDashboardData: () => Promise<void>;
  loadSecondaryData: () => Promise<void>;
  loadAllData: () => Promise<void>;
  reset: () => void;
}

export const useAdminDataStore = create<AdminDataStore>((set, get) => ({
  // Initial state
  dashboardData: null,
  isDashboardLoading: false,
  dashboardError: null,
  dashboardInitialized: false,

  secondaryData: null,
  isSecondaryLoading: false,
  secondaryError: null,
  secondaryInitialized: false,

  // Load critical dashboard data
  loadDashboardData: async () => {
    // Don't reload if already loaded
    if (get().dashboardInitialized && !get().dashboardError) {
      return;
    }

    set({ isDashboardLoading: true, dashboardError: null });

    try {
      const data = await adminDataService.getDashboardData();
      set({
        dashboardData: data,
        isDashboardLoading: false,
        dashboardInitialized: true,
      });
    } catch (error) {
      set({
        dashboardError:
          error instanceof Error
            ? error.message
            : "Error loading dashboard data",
        isDashboardLoading: false,
        dashboardInitialized: true,
      });
    }
  },

  // Load secondary data in background
  loadSecondaryData: async () => {
    // Don't reload if already loaded
    if (get().secondaryInitialized && !get().secondaryError) {
      return;
    }

    set({ isSecondaryLoading: true, secondaryError: null });

    try {
      const data = await adminDataService.getSecondaryData();
      set({
        secondaryData: data,
        isSecondaryLoading: false,
        secondaryInitialized: true,
      });
    } catch (error) {
      set({
        secondaryError:
          error instanceof Error
            ? error.message
            : "Error loading secondary data",
        isSecondaryLoading: false,
        secondaryInitialized: true,
      });
    }
  },

  // Load all data (dashboard first, then secondary in background)
  loadAllData: async () => {
    // Load dashboard data first (blocking)
    await get().loadDashboardData();

    // Load secondary data in background (non-blocking)
    get().loadSecondaryData();
  },

  // Reset all data (useful for logout or switching users)
  reset: () => {
    set({
      dashboardData: null,
      isDashboardLoading: false,
      dashboardError: null,
      dashboardInitialized: false,
      secondaryData: null,
      isSecondaryLoading: false,
      secondaryError: null,
      secondaryInitialized: false,
    });
  },
}));
