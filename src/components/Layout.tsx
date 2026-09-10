import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Mail, X, Copy, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { EditModeBar } from "./Editable";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";

/* Persistent email-code toast — stays until dismissed (in case they miss the email) */
function CodeToast() {
  const { toast, dismissToast } = useAuth();
  const [copied, setCopied] = useState(false);
  if (!toast) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.96 }}
        className="fixed bottom-4 right-4 z-[130] w-[calc(100%-2rem)] max-w-sm"
      >
        <div className="relative overflow-hidden rounded-2xl border border-brand-200 bg-white/95 p-5 shadow-2xl shadow-brand-900/20 backdrop-blur-xl">
          <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500/20 to-sky-400/20 blur-xl" />
          <div className="relative">
            <div className="flex items-start gap-3.5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-lg shadow-brand-500/30">
                <Mail className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-display text-sm font-bold text-slate-900">{toast.title}</p>
                  <button onClick={dismissToast} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Dismiss">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{toast.message}</p>
                {toast.code && (
                  <div className="mt-3 flex items-center justify-between rounded-xl border border-brand-200 bg-brand-50 px-3.5 py-2.5">
                    <span className="font-display text-xl font-bold tracking-[0.35em] text-brand-700">{toast.code}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(toast.code!).catch(() => {});
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1800);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                    >
                      {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
import { cn } from "../utils/cn";

function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { editMode } = useStore();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={cn(
            "fixed right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-xl shadow-brand-500/40 transition-all hover:-translate-y-1 sm:right-6",
            editMode ? "bottom-24" : "bottom-6"
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/* ScrollToTop helper: jumps to top whenever the route changes */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 antialiased">
      <ScrollToTop />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BackToTop />
      <EditModeBar />
      <CodeToast />
    </div>
  );
}
