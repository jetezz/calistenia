import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { AuthGuard } from "@/features/auth";

export function RootLayout() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden safe-area-pb custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {element}
            </motion.div>
          </AnimatePresence>
        </main>
        <MobileNav />
      </div>
    </AuthGuard>
  );
}
