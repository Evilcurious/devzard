import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";
import AuthLayout, { AuthError, AuthSubmit } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [code, setCode] = useState(searchParams.get("code") || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (code.trim().length !== 6) {
      setError("Please enter the 6-digit security code.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = resetPassword(email, code, password);
      setLoading(false);
      if (result.success) {
        setDone(true);
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setError(result.error || "Reset failed.");
      }
    }, 700);
  };

  return (
    <AuthLayout
      title="Set a new password."
      subtitle="Enter your 6-digit security code and choose a new password. You'll be signed out of all other sessions."
      footer={
        <p className="text-center text-sm text-slate-500">
          Didn&apos;t get a code?{" "}
          <Link to="/forgot-password" className="font-semibold text-brand-600 hover:text-brand-700">
            Request a new one
          </Link>
        </p>
      }
    >
      {done ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center py-8 text-center"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </span>
          <h3 className="font-display mt-6 text-2xl font-bold text-slate-900">
            Password updated! 🎉
          </h3>
          <p className="mt-3 max-w-sm text-slate-500">
            Your password has been changed. You&apos;ll be redirected to sign in with your new
            credentials…
          </p>
          <Link
            to="/login"
            className="btn-shine mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/30"
          >
            Continue to sign in <KeyRound className="h-4 w-4" />
          </Link>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Account email <span className="text-brand-500">*</span>
            </label>
            <div className="relative">
              <ShieldCheck className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
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

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
              6-digit security code <span className="text-brand-500">*</span>
            </label>
            <input
              type="text"
              required
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="font-display w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-center text-2xl font-bold tracking-[0.5em] text-slate-800 placeholder-slate-300 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
            <p className="mt-2 text-[11px] text-slate-400">
              Enter the code shown after you requested the reset.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
              New password <span className="text-brand-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                minLength={6}
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-brand-100 bg-brand-50/40 py-3.5 pr-11 pl-11 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-brand-50 hover:text-brand-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Confirm new password <span className="text-brand-500">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirm}
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repeat your new password"
                className={cn(
                  "w-full rounded-xl border bg-brand-50/40 py-3.5 pr-4 pl-11 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:bg-white focus:ring-4",
                  confirm && password === confirm
                    ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                    : "border-brand-100 focus:border-brand-500 focus:ring-brand-500/10"
                )}
              />
            </div>
          </div>

          <AuthError message={error} />

          <AuthSubmit label={loading ? "Updating…" : "Update password"} loading={loading} />

          <p className="text-center text-xs text-slate-400">
            🔒 For your security, this resets all active sessions.
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
