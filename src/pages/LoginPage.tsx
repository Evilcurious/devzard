import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import AuthLayout, { AuthError, AuthSubmit } from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || "/account";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // simulate a brief network delay for realism
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Login failed.");
      }
    }, 600);
  };

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Sign in to your DEVZARD account to manage projects, track campaigns and connect with your team."
      footer={
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create one free
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
            Email <span className="text-brand-500">*</span>
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
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Password <span className="text-brand-500">*</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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

        <AuthError message={error} />

        <AuthSubmit label={loading ? "Signing in…" : "Sign in"} loading={loading} />

        <p className="text-center text-xs text-slate-400">
          🔒 Protected by 256-bit encryption. We never store plain-text passwords.
        </p>
      </form>
    </AuthLayout>
  );
}
