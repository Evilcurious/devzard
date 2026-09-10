import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import AuthLayout, { AuthError, AuthSubmit } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { cn } from "../utils/cn";

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { score, label: "Weak", color: "bg-rose-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
  if (score <= 4) return { score, label: "Good", color: "bg-sky-500" };
  return { score, label: "Strong", color: "bg-emerald-500" };
}

export default function RegisterPage() {
  const { requestSignup, verifySignup, resendSignupCode } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<"details" | "code">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  const strength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordsMatch = confirm.length > 0 && password === confirm;

  const handleSubmit = async (e: FormEvent) => {
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
    if (!agree) {
      setError("Please accept the Terms of Service to continue.");
      return;
    }
    setLoading(true);
    const result = await requestSignup(name, email, password);
    setLoading(false);
    if (result.success) {
      setStep("code");
    } else {
      setError(result.error || "Could not create account.");
    }
  };

  const handleVerify = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (code.trim().length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const result = verifySignup(email, code);
      setLoading(false);
      if (result.success) {
        navigate("/account", { replace: true });
      } else {
        setError(result.error || "Verification failed.");
      }
    }, 600);
  };

  if (step === "code") {
    return (
      <AuthLayout
        title="Verify your email."
        subtitle="We sent you a 6-digit verification code. Enter it below to finish creating your DEVZARD account."
        footer={
          <p className="text-center text-sm text-slate-500">
            Didn't get it? Check spam, or{" "}
            <button type="button" onClick={() => void resendSignupCode(email)} className="font-semibold text-brand-600 hover:text-brand-700">
              resend the code
            </button>
          </p>
        }
      >
        <VerifyStep
          email={email}
          code={code}
          setCode={setCode}
          error={error}
          loading={loading}
          onVerify={handleVerify}
          onResend={() => void resendSignupCode(email)}
          onBack={() => setStep("details")}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account."
      subtitle="Join DEVZARD to manage projects, track campaigns and grow faster. We'll email you a code to verify your account."
      footer={
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Full name <span className="text-brand-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              required
              minLength={2}
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full rounded-xl border border-brand-100 bg-brand-50/40 py-3.5 pr-4 pl-11 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Work email <span className="text-brand-500">*</span>
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

        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Password <span className="text-brand-500">*</span>
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

          {/* strength meter */}
          {password && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 space-y-1.5"
            >
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 flex-1 rounded-full transition-colors duration-300",
                      i <= strength.score ? strength.color : "bg-slate-200"
                    )}
                  />
                ))}
              </div>
              <p className="text-[11px] font-semibold text-slate-500">
                Password strength: <span className="text-slate-700">{strength.label}</span>
              </p>
            </motion.div>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Confirm password <span className="text-brand-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={confirm}
              autoComplete="new-password"
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className={cn(
                "w-full rounded-xl border bg-brand-50/40 py-3.5 pr-11 pl-11 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:bg-white focus:ring-4",
                passwordsMatch
                  ? "border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                  : "border-brand-100 focus:border-brand-500 focus:ring-brand-500/10"
              )}
            />
            {passwordsMatch && (
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-emerald-500">
                <Check className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-brand-100 bg-brand-50/40 p-4">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-brand-300 text-brand-600 accent-brand-600"
          />
          <span className="text-xs leading-relaxed text-slate-600">
            I agree to the DEVZARD{" "}
            <Link to="/" className="font-semibold text-brand-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/" className="font-semibold text-brand-600">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <AuthError message={error} />

        <AuthSubmit label={loading ? "Sending verification…" : "Continue → verify email"} loading={loading} />

        <p className="text-center text-xs text-slate-400">
          🔒 Your data is encrypted and never shared. No credit card required.
        </p>
      </form>
    </AuthLayout>
  );
}

/* ================= Step 2: verify email code ================= */
export function VerifyStep({
  email, code, setCode, error, loading, onVerify, onResend, onBack,
}: {
  email: string;
  code: string;
  setCode: (v: string) => void;
  error: string | null;
  loading: boolean;
  onVerify: (e: FormEvent) => void;
  onResend: () => void;
  onBack: () => void;
}) {
  return (
    <form onSubmit={onVerify} className="space-y-5">
      <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-5 text-center">
        <Mail className="mx-auto h-8 w-8 text-brand-500" />
        <p className="mt-2 text-sm font-semibold text-slate-800">Check your inbox</p>
        <p className="mt-1 text-xs text-slate-500">
          We sent a 6-digit code to<br />
          <span className="font-semibold text-brand-700">{email}</span>
        </p>
      </div>

      <div>
        <label className="mb-1.5 block text-center text-xs font-semibold tracking-wider text-slate-500 uppercase">
          6-digit verification code
        </label>
        <input
          inputMode="numeric"
          maxLength={6}
          required
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="000000"
          className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-center font-display text-2xl font-bold tracking-[0.5em] text-slate-800 placeholder-slate-300 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
        />
      </div>

      <AuthError message={error} />

      <AuthSubmit label={loading ? "Verifying…" : "Verify & create account"} loading={loading} />

      <div className="flex items-center justify-between text-xs">
        <button type="button" onClick={onBack} className="font-semibold text-slate-500 hover:text-brand-600">
          ← Edit details
        </button>
        <button type="button" onClick={onResend} className="font-semibold text-brand-600 hover:text-brand-700">
          Resend code
        </button>
      </div>
    </form>
  );
}
