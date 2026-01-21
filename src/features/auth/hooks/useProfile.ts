import { useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { useProfileStore } from "@/stores/profileStore";
import { toast } from "sonner";

export function useProfile() {
  const { user, signOut } = useAuth();

  // Mapeamos a la nueva estructura del store
  // currentProfile -> currentItem
  // setCurrentProfile -> setCurrentItem
  // loading -> isLoading (el store tiene isLoading)
  // setLoading -> setLoading (ahora existe en BaseStore)
  const profile = useProfileStore((state) => state.currentItem);
  const isLoading = useProfileStore((state) => state.isLoading);
  const isRefreshing = useProfileStore((state) => state.isRefreshing);
  const viewMode = useProfileStore((state) => state.viewMode);

  const setCurrentProfile = useProfileStore((state) => state.setCurrentItem);
  const setIsLoading = useProfileStore((state) => state.setLoading);
  const setRefreshing = useProfileStore((state) => state.setRefreshing);

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

          // Si el error es PGRST116, significa que el perfil no existe (usuario eliminado)
          if (error.code === "PGRST116") {
            console.warn(
              "Profile not found. User may have been deleted. Signing out...",
            );
            toast.error(
              "Error crítico: No se encontró el perfil de usuario. La cuenta puede estar incompleta.",
            );
            setCurrentProfile(null);
            setIsLoading(false);
            // Cerrar sesión y limpiar todo
            await signOut();
            return;
          }

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
  }, [user, setCurrentProfile, setIsLoading, signOut]);

  const refreshProfile = useCallback(async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error refreshing profile:", error);

        // Si el error es PGRST116, significa que el perfil no existe (usuario eliminado)
        if (error.code === "PGRST116") {
          console.warn(
            "Profile not found during refresh. User may have been deleted. Signing out...",
          );
          setCurrentProfile(null);
          setRefreshing(false);
          // Cerrar sesión y limpiar todo
          await signOut();
          return;
        }
      } else {
        setCurrentProfile(data);
      }
    } catch (error) {
      console.error("Profile refresh failed:", error);
    } finally {
      setRefreshing(false);
    }
  }, [user, setCurrentProfile, setRefreshing, signOut]);

  return {
    profile, // Devolvemos 'profile' para mantener contrato con componentes consumidores
    isLoading,
    isRefreshing,
    viewMode,
    isAdmin: profile?.role === "admin",
    isApproved: profile?.approval_status === "approved",
    isPending: profile?.approval_status === "pending",
    isRejected: profile?.approval_status === "rejected",
    approvalStatus: profile?.approval_status,
    refreshProfile,
  };
}
