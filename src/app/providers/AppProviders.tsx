import { useEffect, type ReactNode } from "react";
import { AuthProvider } from "@/features/auth";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const toastElement = target.closest("[data-sonner-toast]");
      if (toastElement) {
        const id = toastElement.getAttribute("data-id");
        if (id) {
          toast.dismiss(id);
        } else {
          toast.dismiss();
        }
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <AuthProvider>
      {children}
      <Toaster position="top-center" richColors duration={2000} />
    </AuthProvider>
  );
}
