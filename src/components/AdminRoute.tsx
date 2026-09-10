import type { ReactNode } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <section className="relative overflow-hidden pt-40 pb-24">
        <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-400 text-white shadow-xl">
            <ShieldAlert className="h-8 w-8" />
          </span>
          <h1 className="font-display mt-6 text-4xl font-bold text-slate-900">Access denied</h1>
          <p className="mt-4 text-slate-500">
            You&apos;re signed in as <span className="font-semibold text-slate-700">{user.email}</span>,
            which doesn&apos;t have administrator permissions. If you believe this is a mistake,
            contact the site owner.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/account"
              className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-7 py-3.5 text-base font-semibold text-white shadow-xl"
            >
              Go to my account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-7 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-600"
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
