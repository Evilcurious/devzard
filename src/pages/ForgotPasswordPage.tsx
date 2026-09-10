import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, KeyRound, ArrowRight, CheckCircle2, Copy, Sparkles } from "lucide-react";
import AuthLayout, { AuthError, AuthSubmit } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function ForgotPasswordPage() {
  const { requestReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await requestReset(email);
    setLoading(false);
    if (result.success) {
      setSentCode(result.code || "sent");
    } else {
      setError(result.error || "Could not send reset code.");
    }
  };

  const copyCode = () => {
    if (sentCode) {
      navigator.clipboard.writeText(sentCode).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AuthLayout
      title="Reset your password."
      subtitle="Enter the email linked to your DEVZARD account and we'll send you a 6-digit security code."
      footer={
        <p className="text-center text-sm text-slate-500">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to sign in
          </Link>
        </p>
      }
    >
      <AnimatePresence mode="wait">
        {!sentCode ? (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Account email <span className="text-brand-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-xl border border-brand-100 bg-brand-50/40 py-3.5 pr-4 pl-11 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                />
              </div>
            </div>

            <AuthError message={error} />

            <AuthSubmit label={loading ? "Sending code…" : "Send reset code"} loading={loading} />

            <p className="flex items-start gap-2 rounded-xl bg-brand-50/60 p-3.5 text-xs leading-relaxed text-slate-600">
              <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" />
              The code is delivered to your account email and expires after 15 minutes.
            </p>
          </motion.form>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              Code sent to <span className="font-semibold">{email}</span>. It expires in 15 minutes.
            </div>

            {sentCode !== "sent" && (
              <div className="rounded-2xl border border-brand-100 bg-brand-50/40 p-6 text-center">
                <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Preview security code
                </p>
                <p className="font-display mt-3 text-5xl font-bold tracking-[0.3em] text-brand-700">
                  {sentCode}
                </p>
                <button
                  onClick={copyCode}
                  className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-4 py-2 text-xs font-semibold text-brand-600 transition-colors hover:bg-brand-50"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "Copied!" : "Copy code"}
                </button>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => setSentCode(null)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-brand-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-600"
              >
                Use a different email
              </button>
              <Link
                to={`/reset-password?email=${encodeURIComponent(email)}${sentCode !== "sent" ? `&code=${sentCode}` : ""}`}
                className="btn-shine inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-brand-500/30 transition-all hover:-translate-y-0.5"
              >
                <KeyRound className="h-4 w-4" />
                Enter code now
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
