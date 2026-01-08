import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Booking = Database["public"]["Tables"]["bookings"]["Row"];
type PaymentRequest = Database["public"]["Tables"]["payment_requests"]["Row"];
type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];
type PricingPackage = Database["public"]["Tables"]["pricing_packages"]["Row"];
type PaymentMethod = Database["public"]["Tables"]["payment_methods"]["Row"];
type AppSetting = Database["public"]["Tables"]["app_settings"]["Row"];

export interface BookingWithRelations extends Booking {
  time_slot: TimeSlot;
  user: {
    id: string;
    full_name: string;
    email: string;
  };
}

export interface AdminDashboardData {
  profiles: Profile[];
  bookings: BookingWithRelations[];
  pending_payment_requests: PaymentRequest[];
  active_time_slots: TimeSlot[];
}

export interface AdminSecondaryData {
  all_time_slots: TimeSlot[];
  all_payment_requests: PaymentRequest[];
  pricing_packages: PricingPackage[];
  payment_methods: PaymentMethod[];
  app_settings: AppSetting[];
}

class AdminDataService {
  /**
   * Fetches critical admin dashboard data in a single RPC call
   * This includes: profiles, bookings, pending payment requests, active time slots
   */
  async getDashboardData(): Promise<AdminDashboardData> {
    const { data, error } = await supabase.rpc("get_admin_dashboard_data");

    if (error) {
      console.error("Error fetching admin dashboard data:", error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No data returned from get_admin_dashboard_data");
    }

    // Parse the JSONB response
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;

    return {
      profiles: parsedData.profiles || [],
      bookings: parsedData.bookings || [],
      pending_payment_requests: parsedData.pending_payment_requests || [],
      active_time_slots: parsedData.active_time_slots || [],
    };
  }

  /**
   * Fetches secondary admin data in background
   * This includes: all time slots, all payment requests, pricing packages, payment methods, app settings
   */
  async getSecondaryData(): Promise<AdminSecondaryData> {
    const { data, error } = await supabase.rpc("get_admin_secondary_data");

    if (error) {
      console.error("Error fetching admin secondary data:", error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error("No data returned from get_admin_secondary_data");
    }

    // Parse the JSONB response
    const parsedData = typeof data === "string" ? JSON.parse(data) : data;

    return {
      all_time_slots: parsedData.all_time_slots || [],
      all_payment_requests: parsedData.all_payment_requests || [],
      pricing_packages: parsedData.pricing_packages || [],
      payment_methods: parsedData.payment_methods || [],
      app_settings: parsedData.app_settings || [],
    };
  }

  /**
   * Fetches all admin data (both critical and secondary) in 2 parallel calls
   */
  async getAllData(): Promise<{
    dashboard: AdminDashboardData;
    secondary: AdminSecondaryData;
  }> {
    const [dashboard, secondary] = await Promise.all([
      this.getDashboardData(),
      this.getSecondaryData(),
    ]);

    return { dashboard, secondary };
  }
}

export const adminDataService = new AdminDataService();
