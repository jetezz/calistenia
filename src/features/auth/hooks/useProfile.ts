import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { useProfileStore } from "@/stores/profileStore";

export function useProfile() {
  const { user } = useAuth();
  const {
    currentProfile: profile,
    setCurrentProfile,
    loading: isLoading,
    setLoading: setIsLoading,
  } = useProfileStore();

  useEffect(() => {
    if (!user) {
      // If there's a profile in the store but no user, clear it
      if (useProfileStore.getState().currentProfile) {
        setCurrentProfile(null);
      }
      return;
    }

    const checkAndFetchProfile = async () => {
      // Access the most current state directly from the store to avoid race conditions
      // where multiple components might call this effect simultaneously with stale closure values
      const state = useProfileStore.getState();

      // If we already have the correct profile loaded, don't fetch
      if (state.currentProfile?.id === user.id) {
        return;
      }

      // If a fetch is already in progress, don't start another one
      if (state.loading) {
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setCurrentProfile(null);
        } else {
          setCurrentProfile(data);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
        setCurrentProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAndFetchProfile();

    return () => {
      // No cleanup needed
    };
  }, [user, setCurrentProfile, setIsLoading]);

  const refreshProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error refreshing profile:", error);
      } else {
        setCurrentProfile(data);
      }
    } catch (error) {
      console.error("Profile refresh failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    isAdmin: profile?.role === "admin",
    refreshProfile,
  };
}
