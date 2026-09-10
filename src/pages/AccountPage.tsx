import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  ShieldCheck,
  Bell,
  CreditCard,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Check,
  Trash2,
  Crown,
  Calendar,
  Mail,
  KeyRound,
  Smartphone,
  Globe,
  Monitor,
  Download,
  AlertTriangle,
  ArrowRight,
  Zap,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useAuth, AVATAR_COLORS } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { Reveal } from "../components/shared";
import { cn } from "../utils/cn";

type TabId = "overview" | "profile" | "security" | "notifications" | "billing" | "orders";

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "My Orders", icon: ShoppingBag },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function dateFmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SectionCard({
  title,
  desc,
  children,
  action,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-7 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{desc}</p>
        </div>
        {action}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
      />
    </div>
  );
}

function ActionButton({
  children,
  variant = "primary",
  onClick,
  type = "button",
  danger = false,
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onClick?: () => void;
  type?: "button" | "submit";
  danger?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all",
        danger
          ? "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
          : variant === "primary"
          ? "btn-shine bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/25 hover:-translate-y-0.5"
          : "border border-brand-200 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-600"
      )}
    >
      {children}
    </button>
  );
}

function Feedback({ message, ok }: { message: string | null; ok: boolean }) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm",
        ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white",
          ok ? "bg-emerald-500" : "bg-rose-500"
        )}
      >
        {ok ? "✓" : "!"}
      </span>
      {message}
    </motion.div>
  );
}

/* ============================== Main ============================== */

export default function AccountPage() {
  const {
    user, logout, updateProfile, changePassword, updateNotifications,
    deleteAccount, addPaymentMethod, removePaymentMethod,
  } = useAuth();
  const { orders } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("overview");
  const [showPmForm, setShowPmForm] = useState(false);
  const [pmForm, setPmForm] = useState({
    brand: "Visa", number: "", expMonth: "12", expYear: "2028", holder: "",
  });

  const myOrders = user
    ? orders.filter((o) => o.customerEmail.toLowerCase() === user.email.toLowerCase())
    : [];

  // profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || AVATAR_COLORS[0]);
  const [profileFeedback, setProfileFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  // password state
  const [currentPw, setCurrentPw] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pwFeedback, setPwFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  // notifications
  const [notif, setNotif] = useState(user?.notifications || { product: true, marketing: false, security: true });

  // delete account
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) return null;

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    const result = updateProfile({ name: name.trim(), email: email.trim(), avatarColor });
    setProfileFeedback(
      result.success
        ? { ok: true, message: "Profile updated successfully." }
        : { ok: false, message: result.error || "Could not update profile." }
    );
  };

  const handleChangePassword = (e: FormEvent) => {
    e.preventDefault();
    setPwFeedback(null);
    if (nextPw.length < 6) {
      setPwFeedback({ ok: false, message: "New password must be at least 6 characters." });
      return;
    }
    if (nextPw !== confirmPw) {
      setPwFeedback({ ok: false, message: "New passwords do not match." });
      return;
    }
    setPwLoading(true);
    setTimeout(() => {
      const result = changePassword(currentPw, nextPw);
      setPwLoading(false);
      if (result.success) {
        setPwFeedback({ ok: true, message: "Password changed. Other sessions have been signed out." });
        setCurrentPw("");
        setNextPw("");
        setConfirmPw("");
      } else {
        setPwFeedback({ ok: false, message: result.error || "Could not change password." });
      }
    }, 600);
  };

  const handleDeleteAccount = () => {
    deleteAccount();
    navigate("/");
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-36">
      <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-40 -left-40 h-[420px] w-[420px] rounded-full bg-brand-400/15 blur-[130px]" />
      <div className="absolute -top-20 -right-32 h-[420px] w-[420px] rounded-full bg-cyan-accent/15 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br font-display text-xl font-bold text-white shadow-lg",
                  avatarColor
                )}
              >
                {initials(user.name)}
              </span>
              <div>
                <p className="text-xs font-semibold tracking-wider text-brand-600 uppercase">
                  {user.plan === "free" ? "Free plan" : user.plan === "pro" ? "Pro plan" : "Business plan"}
                </p>
                <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  Welcome back, {user.name.split(" ")[0]}
                </h1>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </Reveal>

        {/* Tabs + content */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Sidebar tabs */}
          <Reveal>
            <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-brand-100 bg-white p-2 lg:flex-col lg:overflow-visible">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all lg:shrink",
                    tab === t.id
                      ? "bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/25"
                      : "text-slate-600 hover:bg-brand-50 hover:text-brand-600"
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </button>
              ))}
            </nav>
          </Reveal>

          {/* Content */}
          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-6"
              >
                {tab === "overview" && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {[
                        { icon: Crown, label: "Current plan", value: user.plan.toUpperCase(), gradient: "from-brand-600 to-sky-400" },
                        { icon: Calendar, label: "Member since", value: dateFmt(user.createdAt), gradient: "from-rose-500 to-pink-400" },
                        { icon: Zap, label: "Last login", value: dateFmt(user.lastLogin), gradient: "from-violet-600 to-indigo-400" },
                      ].map((stat) => (
                        <div key={stat.label} className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
                          <span className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md", stat.gradient)}>
                            <stat.icon className="h-5 w-5" />
                          </span>
                          <p className="mt-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">{stat.label}</p>
                          <p className="font-display mt-1 text-lg font-bold text-slate-900">{stat.value}</p>
                        </div>
                      ))}
                    </div>

                    <SectionCard title="Quick actions" desc="Jump straight to the things you do most.">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <button
                          onClick={() => setTab("profile")}
                          className="group flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-left transition-all hover:border-brand-300 hover:bg-brand-50"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">Edit profile</p>
                            <p className="mt-0.5 text-xs text-slate-500">Name, email, avatar</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-1" />
                        </button>
                        <button
                          onClick={() => setTab("security")}
                          className="group flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-left transition-all hover:border-brand-300 hover:bg-brand-50"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">Change password</p>
                            <p className="mt-0.5 text-xs text-slate-500">Keep your account secure</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-1" />
                        </button>
                        <Link
                          to="/contact"
                          className="group flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-left transition-all hover:border-brand-300 hover:bg-brand-50"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">Contact support</p>
                            <p className="mt-0.5 text-xs text-slate-500">We reply within 12 hours</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                          to="/products"
                          className="group flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-left transition-all hover:border-brand-300 hover:bg-brand-50"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">Browse products</p>
                            <p className="mt-0.5 text-xs text-slate-500">Servers, templates, brand kits</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                          to="/reviews"
                          className="group flex items-center justify-between rounded-2xl border border-brand-100 bg-brand-50/40 p-5 text-left transition-all hover:border-brand-300 hover:bg-brand-50"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">Leave a review</p>
                            <p className="mt-0.5 text-xs text-slate-500">Share your experience with others</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-brand-400 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </SectionCard>

                    <SectionCard title="Recent activity" desc="The latest events on your account.">
                      <ul className="divide-y divide-brand-50">
                        {[
                          { icon: KeyRound, text: "Signed in", time: "Just now" },
                          { icon: ShieldCheck, text: "Security check passed", time: "2 days ago" },
                          { icon: Mail, text: "Email preferences updated", time: "1 week ago" },
                          { icon: Crown, text: "Plan changed to Pro", time: dateFmt(user.createdAt) },
                        ].map((a) => (
                          <li key={a.text} className="flex items-center gap-4 py-3.5">
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                              <a.icon className="h-4 w-4" />
                            </span>
                            <p className="flex-1 text-sm font-medium text-slate-700">{a.text}</p>
                            <p className="text-xs text-slate-400">{a.time}</p>
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  </>
                )}

                {tab === "profile" && (
                  <>
                    <SectionCard title="Public profile" desc="How you appear across DEVZARD.">
                      <form onSubmit={handleSaveProfile} className="space-y-5">
                        <Field label="Full name" value={name} onChange={setName} placeholder="Alex Rivera" />
                        <Field
                          label="Email address"
                          type="email"
                          value={email}
                          onChange={setEmail}
                          placeholder="you@company.com"
                          autoComplete="email"
                        />

                        <div>
                          <label className="mb-2 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Avatar color
                          </label>
                          <div className="flex flex-wrap gap-3">
                            {AVATAR_COLORS.map((color) => (
                              <button
                                key={color}
                                type="button"
                                onClick={() => setAvatarColor(color)}
                                className={cn(
                                  "flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-md transition-all",
                                  color,
                                  avatarColor === color
                                    ? "ring-2 ring-brand-600 ring-offset-2 scale-110"
                                    : "opacity-60 hover:opacity-100 hover:scale-105"
                                )}
                                aria-label={`Select color ${color}`}
                              >
                                {avatarColor === color && <Check className="h-4 w-4" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        <Feedback message={profileFeedback?.message || null} ok={profileFeedback?.ok ?? true} />

                        <div className="flex gap-3">
                          <ActionButton type="submit">Save changes</ActionButton>
                          <ActionButton
                            variant="ghost"
                            onClick={() => {
                              setName(user.name);
                              setEmail(user.email);
                              setAvatarColor(user.avatarColor);
                              setProfileFeedback(null);
                            }}
                          >
                            Reset
                          </ActionButton>
                        </div>
                      </form>
                    </SectionCard>

                    <SectionCard title="Account" desc="Danger zone — proceed with caution.">
                      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50/50 p-5 sm:flex-row sm:items-center">
                        <div>
                          <p className="flex items-center gap-2 font-semibold text-rose-700">
                            <AlertTriangle className="h-4 w-4" /> Delete account
                          </p>
                          <p className="mt-1 text-sm text-rose-600/80">
                            This permanently removes your account, projects and data. This cannot be undone.
                          </p>
                        </div>
                        {confirmDelete ? (
                          <div className="flex gap-2">
                            <ActionButton danger onClick={handleDeleteAccount}>
                              <Trash2 className="h-4 w-4" /> Confirm delete
                            </ActionButton>
                            <ActionButton variant="ghost" onClick={() => setConfirmDelete(false)}>
                              Cancel
                            </ActionButton>
                          </div>
                        ) : (
                          <ActionButton danger onClick={() => setConfirmDelete(true)}>
                            Delete account
                          </ActionButton>
                        )}
                      </div>
                    </SectionCard>
                  </>
                )}

                {tab === "security" && (
                  <>
                    <SectionCard title="Change password" desc="Use a strong, unique password. We recommend 12+ characters.">
                      <form onSubmit={handleChangePassword} className="space-y-5">
                        <div>
                          <label className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            Current password
                          </label>
                          <div className="relative">
                            <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showPw ? "text" : "password"}
                              value={currentPw}
                              autoComplete="current-password"
                              onChange={(e) => setCurrentPw(e.target.value)}
                              className="w-full rounded-xl border border-brand-100 bg-brand-50/40 py-3 pr-11 pl-11 text-sm text-slate-800 transition-all outline-none focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-500/10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPw(!showPw)}
                              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-brand-50 hover:text-brand-600"
                            >
                              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                          <Field label="New password" type={showPw ? "text" : "password"} value={nextPw} onChange={setNextPw} placeholder="At least 6 characters" />
                          <Field label="Confirm new password" type={showPw ? "text" : "password"} value={confirmPw} onChange={setConfirmPw} placeholder="Repeat password" />
                        </div>

                        <Feedback message={pwFeedback?.message || null} ok={pwFeedback?.ok ?? true} />

                        <ActionButton type="submit">{pwLoading ? "Updating…" : "Update password"}</ActionButton>
                      </form>
                    </SectionCard>

                    <SectionCard title="Active sessions" desc="Devices currently signed in to your account.">
                      <ul className="divide-y divide-brand-50">
                        {[
                          { icon: Monitor, device: "MacBook Pro · Chrome", location: "Lisbon, PT", current: true },
                          { icon: Smartphone, device: "iPhone 15 · Safari", location: "Lisbon, PT", current: false },
                          { icon: Globe, device: "Windows · Edge", location: "Berlin, DE", current: false },
                        ].map((s) => (
                          <li key={s.device} className="flex items-center gap-4 py-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                              <s.icon className="h-5 w-5" />
                            </span>
                            <div className="flex-1">
                              <p className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                                {s.device}
                                {s.current && (
                                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-600 uppercase">
                                    This device
                                  </span>
                                )}
                              </p>
                              <p className="text-xs text-slate-400">{s.location}</p>
                            </div>
                            {!s.current && (
                              <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">
                                Revoke
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  </>
                )}

                {tab === "notifications" && (
                  <SectionCard title="Email preferences" desc="Choose what we're allowed to email you about.">
                    <div className="space-y-4">
                      {[
                        { key: "product" as const, title: "Product updates", desc: "New features, improvements and fixes." },
                        { key: "marketing" as const, title: "Marketing & tips", desc: "Growth plays, case studies and offers." },
                        { key: "security" as const, title: "Security alerts", desc: "Sign-ins, password changes, important notices." },
                      ].map((n) => (
                        <label
                          key={n.key}
                          className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 transition-colors hover:bg-brand-50"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">{n.title}</p>
                            <p className="mt-0.5 text-sm text-slate-500">{n.desc}</p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={notif[n.key]}
                            onClick={() => {
                              const next = { ...notif, [n.key]: !notif[n.key] };
                              setNotif(next);
                              updateNotifications(next);
                            }}
                            className={cn(
                              "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-300",
                              notif[n.key] ? "bg-gradient-to-r from-brand-600 to-sky-400" : "bg-slate-300"
                            )}
                          >
                            <span
                              className={cn(
                                "inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300",
                                notif[n.key] ? "translate-x-6" : "translate-x-1"
                              )}
                            />
                          </button>
                        </label>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {tab === "orders" && (
                  <>
                    <SectionCard title={`My orders (${myOrders.length})`} desc="Every order placed with this email address.">
                      {!myOrders.length ? (
                        <div className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/30 p-10 text-center">
                          <ShoppingBag className="mx-auto h-10 w-10 text-brand-300" />
                          <p className="mt-4 font-semibold text-slate-700">No orders yet</p>
                          <p className="mt-1 text-sm text-slate-500">Browse our products and services to get started.</p>
                          <div className="mt-5 flex flex-wrap justify-center gap-2">
                            <Link to="/products" className="rounded-xl bg-gradient-to-r from-brand-600 to-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                              Browse products
                            </Link>
                            <Link to="/services" className="rounded-xl border border-brand-200 px-5 py-2.5 text-sm font-semibold text-slate-700">
                              Browse services
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {myOrders.map((o) => (
                            <div key={o.id} className="rounded-2xl border border-brand-100 bg-brand-50/30 p-5">
                              <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                  <p className="flex items-center gap-2 font-display font-bold text-slate-900">
                                    <span className="font-mono text-sm text-brand-600">{o.reference}</span>
                                  </p>
                                  <p className="mt-0.5 text-xs text-slate-500">
                                    {new Date(o.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {o.paymentMethod}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-display text-xl font-bold text-slate-900">{o.total}</p>
                                  <span
                                    className={cn(
                                      "mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase",
                                      o.status === "completed" && "bg-emerald-100 text-emerald-600",
                                      o.status === "processing" && "bg-brand-100 text-brand-600",
                                      o.status === "pending" && "bg-amber-100 text-amber-600",
                                      o.status === "cancelled" && "bg-slate-100 text-slate-500",
                                      o.status === "refunded" && "bg-violet-100 text-violet-600"
                                    )}
                                  >
                                    {o.status}
                                  </span>
                                </div>
                              </div>
                              <ul className="mt-4 divide-y divide-brand-100 border-t border-brand-100">
                                {o.items.map((i, idx) => (
                                  <li key={idx} className="flex items-center justify-between py-2.5 text-sm">
                                    <span className="text-slate-600">{i.name} <span className="text-slate-400">× {i.qty}</span></span>
                                    <span className="font-semibold text-slate-800">{i.price}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}
                    </SectionCard>
                  </>
                )}

                {tab === "billing" && (
                  <>
                    <SectionCard title="Current plan" desc="You're on the following plan. Upgrade or downgrade anytime.">
                      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 sm:flex-row sm:items-center">
                        <div>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-600 to-sky-400 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                            <Crown className="h-3 w-3" /> {user.plan}
                          </span>
                          <p className="font-display mt-3 text-3xl font-bold text-slate-900">
                            {user.plan === "free" ? "$0" : user.plan === "pro" ? "$49" : "$149"}
                            <span className="text-base font-medium text-slate-400"> / month</span>
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {user.plan === "free"
                              ? "Perfect for getting started."
                              : user.plan === "pro"
                              ? "Everything in Free, plus priority support and more."
                              : "Everything in Pro, plus a dedicated success manager."}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <ActionButton>
                            {user.plan === "free" ? "Upgrade to Pro" : user.plan === "pro" ? "Upgrade to Business" : "Manage plan"}
                          </ActionButton>
                          {user.plan !== "free" && (
                            <ActionButton variant="ghost">Cancel subscription</ActionButton>
                          )}
                        </div>
                      </div>
                    </SectionCard>

                    <SectionCard
                      title="Payment methods"
                      desc="Cards and methods saved to your account."
                      action={
                        <ActionButton variant="ghost" onClick={() => setShowPmForm(!showPmForm)}>
                          <Plus className="h-4 w-4" /> {showPmForm ? "Close" : "Add method"}
                        </ActionButton>
                      }
                    >
                      {showPmForm && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const res = addPaymentMethod(pmForm);
                            if (res.success) {
                              setShowPmForm(false);
                              setPmForm({ brand: "Visa", number: "", expMonth: "12", expYear: "2028", holder: user?.name || "" });
                            }
                          }}
                          className="mb-5 grid gap-4 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 sm:grid-cols-2"
                        >
                          <Field label="Brand" value={pmForm.brand} onChange={(v) => setPmForm({ ...pmForm, brand: v })} />
                          <Field label="Card number" value={pmForm.number} onChange={(v) => setPmForm({ ...pmForm, number: v })} placeholder="4242 4242 4242 4242" />
                          <Field label="Exp month" value={pmForm.expMonth} onChange={(v) => setPmForm({ ...pmForm, expMonth: v })} />
                          <Field label="Exp year" value={pmForm.expYear} onChange={(v) => setPmForm({ ...pmForm, expYear: v })} />
                          <div className="sm:col-span-2">
                            <Field label="Cardholder name" value={pmForm.holder} onChange={(v) => setPmForm({ ...pmForm, holder: v })} />
                          </div>
                          <div className="sm:col-span-2">
                            <ActionButton type="submit">
                              <Plus className="h-4 w-4" /> Save payment method
                            </ActionButton>
                          </div>
                        </form>
                      )}

                      {!user.paymentMethods.length && !showPmForm && (
                        <p className="rounded-2xl border border-dashed border-brand-200 bg-brand-50/30 p-6 text-center text-sm text-slate-500">
                          No payment method on file yet. Add one to speed up checkout.
                        </p>
                      )}

                      <div className="space-y-3">
                        {user.paymentMethods.map((pm) => (
                          <div
                            key={pm.last4}
                            className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-brand-50/40 p-5 sm:flex-row sm:items-center"
                          >
                            <div className="flex items-center gap-4">
                              <span className="flex h-11 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-500 text-white">
                                <CreditCard className="h-5 w-5" />
                              </span>
                              <div>
                                <p className="font-semibold text-slate-800">•••• •••• •••• {pm.last4}</p>
                                <p className="text-xs text-slate-500">
                                  {pm.brand} · {pm.holder} · expires {pm.expMonth}/{pm.expYear}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removePaymentMethod(pm.last4)}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </SectionCard>

                    <SectionCard title="Invoices" desc="Download your latest invoices.">
                      <ul className="divide-y divide-brand-50">
                        {[
                          { id: "INV-2026-014", date: "Feb 01, 2026", amount: "$49.00", status: "Paid" },
                          { id: "INV-2026-007", date: "Jan 01, 2026", amount: "$49.00", status: "Paid" },
                          { id: "INV-2025-119", date: "Dec 01, 2025", amount: "$49.00", status: "Paid" },
                        ].map((inv) => (
                          <li key={inv.id} className="flex items-center gap-4 py-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                              <Download className="h-4 w-4" />
                            </span>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-slate-800">{inv.id}</p>
                              <p className="text-xs text-slate-400">{inv.date}</p>
                            </div>
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-600 uppercase">
                              {inv.status}
                            </span>
                            <p className="font-display text-sm font-bold text-slate-900">{inv.amount}</p>
                          </li>
                        ))}
                      </ul>
                    </SectionCard>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
