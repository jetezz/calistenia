import { useEffect, useState, type ReactNode } from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AuthContext, type AuthContextType } from "./AuthContextValue";

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

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error("Error al cerrar sesión");
        console.error("Error signing out:", error);
      } else {
        toast.success("Sesión cerrada correctamente");
      }
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error("SignOut error:", error);
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
