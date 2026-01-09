import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { useProfileStore } from "@/stores/profileStore";

export function useProfile() {
  const { user } = useAuth();

  // Mapeamos a la nueva estructura del store
  // currentProfile -> currentItem
  // setCurrentProfile -> setCurrentItem
  // loading -> isLoading (el store tiene isLoading)
  // setLoading -> setLoading (ahora existe en BaseStore)
  const store = useProfileStore();

  const profile = store.currentItem;
  const isLoading = store.isLoading;
  const setCurrentProfile = store.setCurrentItem;
  const setIsLoading = store.setLoading;

  useEffect(() => {
    if (!user) {
      if (useProfileStore.getState().currentItem) {
        setCurrentProfile(null);
      }
      return;
    }

    const checkAndFetchProfile = async () => {
      const state = useProfileStore.getState();

      // Check currentItem instead of currentProfile
      if (state.currentItem?.id === user.id) {
        return;
      }

      if (state.isLoading) {
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
    profile, // Devolvemos 'profile' para mantener contrato con componentes consumidores
    isLoading,
    isAdmin: profile?.role === "admin",
    refreshProfile,
  };
}
