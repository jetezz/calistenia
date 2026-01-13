import { useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AuthContext, type AuthContextType } from "./AuthContextValue";
import { useProfileStore } from "@/stores/profileStore";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // 1. Setup listener - usually fastest for local changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    // 2. Explicit check - reliable for initial state
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted && !isLoading) {
        // Only update if we are still "loading" or if session differs?
        // Actually, just syncing state is fine.
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    });

    // 3. Safety timeout - prevents infinite loading state if Supabase hangs
    const timeout = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn(
          "Auth initialization timed out, forcing load state completion"
        );
        setIsLoading(false);
      }
    }, 1000); // 1s max wait time

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error as Error | null };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error: error as Error | null };
  };

  useEffect(() => {
    // Listen for deep links (Native only)
    if (Capacitor.isNativePlatform()) {
      import("@capacitor/app").then(({ App }) => {
        App.addListener("appUrlOpen", async (event) => {
          console.log("[DEEP LINK] Url received:", event.url);

          if (
            event.url.includes("access_token") ||
            event.url.includes("refresh_token")
          ) {
            // Extract params from fragment (hash)
            const url = new URL(event.url);
            const hash = url.hash.substring(1); // remove #
            const params = new URLSearchParams(hash);
            const accessToken = params.get("access_token");
            const refreshToken = params.get("refresh_token");

            if (accessToken && refreshToken) {
              const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

              if (error) {
                console.error("[DEEP LINK] Error setting session:", error);
                toast.error("Error al iniciar sesión desde Google");
              } else {
                console.log("[DEEP LINK] Session set successfully");
                toast.success("Sesión iniciada correctamente");
                // Close browser if open
                await Browser.close().catch(() => {});
              }
            }
          }
        });
      });
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      console.log("[GOOGLE AUTH] Starting OAuth flow...");

      const isNative = Capacitor.isNativePlatform();
      // Use custom scheme for native, /app route for web
      const redirectUrl = isNative
        ? "com.calistenia.app://auth/callback"
        : `${window.location.origin}/app`;

      console.log("[GOOGLE AUTH] Redirect URL:", redirectUrl);
      toast.info("Abriendo Google...", { duration: 2000 });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: isNative,
        },
      });

      if (error) {
        console.error("[GOOGLE AUTH] OAuth error:", error);
        toast.error(`❌ Error: ${error.message}`, { duration: 10000 });
        return { error: error as Error };
      }

      if (isNative && data?.url) {
        console.log("[GOOGLE AUTH] Opening browser with URL:", data.url);

        // Open browser
        await Browser.open({
          url: data.url,
          windowName: "_self",
        });
      }

      return { error: null };
    } catch (error) {
      console.error("[GOOGLE AUTH] Catch block error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.error(`❌ Error inesperado: ${errorMessage}`, {
        duration: 15000,
      });
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      // Limpiar el perfil del store antes de cerrar sesión
      useProfileStore.getState().setCurrentItem(null);

      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error al cerrar sesión");
        console.error("Error signing out:", error);
      } else {
        // No mostrar toast de éxito si es un cierre automático por usuario eliminado
        // El mensaje se mostrará solo si es un cierre manual
        if (!error) {
          toast.success("Sesión cerrada correctamente");
        }
      }

      // Forzar redirección al login después de cerrar sesión
      window.location.href = "/login";
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error("SignOut error:", error);
      // Incluso si hay error, limpiar e ir al login
      window.location.href = "/login";
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
