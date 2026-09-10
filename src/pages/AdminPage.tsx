import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ShoppingBag, Users, Package, Layers, Palette, LogOut, Search,
  Plus, Pencil, Trash2, KeyRound, Ban, CheckCircle2, RotateCcw, CreditCard,
  TrendingUp, DollarSign, Eye, ShieldCheck, Save, ArrowUpRight, ArrowLeft,
  Star, Undo2, MousePointerClick, XCircle, CheckCheck, ExternalLink,
  Image as ImageIcon, Upload, RefreshCw, ChevronUp, ChevronDown as ChevronDownIcon, Mail,
} from "lucide-react";
import { useStore, DEFAULT_THEME, DEFAULT_STATS, FONT_OPTIONS, type Theme, type OrderStatus, type Review } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { loadUsers, saveUsers, obfuscate, ADMIN_EMAIL, type User, type UserPlan } from "../lib/users";
import {
  clearSentEmails,
  isEmailConfigured,
  loadEmailConfig,
  loadSentEmails,
  saveEmailConfig,
  sendTestEmail,
  WEBSITE_EMAIL,
  type EmailConfig,
} from "../lib/email";
import { GRADIENT_PRESETS } from "../context/presets";
import {
  AdminCard, AdminButton, AdminInput, AdminTextarea, AdminSelect, AdminToggle,
  ColorField, AdminBadge, StatCard, AdminModal, ConfirmDialog,
} from "../components/admin/ui";
import { ICON_NAMES } from "../lib/icons";
import { nameOfIcon } from "../lib/icons";
import { cn } from "../utils/cn";

type TabId = "dashboard" | "orders" | "accounts" | "products" | "services" | "reviews" | "images" | "theme";

const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ShoppingBag },
  { id: "accounts", label: "Accounts", icon: Users },
  { id: "products", label: "Products", icon: Package },
  { id: "services", label: "Services", icon: Layers },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "images", label: "Images & Assets", icon: ImageIcon },
  { id: "theme", label: "Theme & Brand", icon: Palette },
];

const statusTone: Record<OrderStatus, "brand" | "green" | "amber" | "rose" | "slate" | "violet"> = {
  pending: "amber",
  processing: "brand",
  completed: "green",
  cancelled: "slate",
  refunded: "violet",
};

const emptyProduct = {
  name: "", tagline: "", desc: "", longDesc: "", price: "$0", unit: "one-time",
  gradient: "from-brand-500 to-cyan-400", accent: "bg-brand-50 text-brand-700",
  popular: false, iconName: "Package",
  features: [{ title: "Feature one", desc: "Describe it." }],
  benefits: ["Benefit one"], faqs: [{ q: "Question?", a: "Answer." }],
  stats: [{ value: "100+", label: "Stat" }],
  plans: [{ name: "Starter", price: "$0", features: ["Feature"] }],
};

const emptyService = {
  title: "", tagline: "", desc: "", longDesc: "", number: "",
  tags: ["Tag"], gradient: "from-brand-600 to-sky-400", accent: "bg-brand-50 text-brand-700",
  iconName: "Zap", popular: false,
  features: [{ title: "Feature one", desc: "Describe it." }],
  process: [{ step: "01", title: "Discover", desc: "Audit & goals." }],
  benefits: ["Benefit one"], faqs: [{ q: "Question?", a: "Answer." }],
  stats: [{ value: "100+", label: "Stat" }], deliverables: ["Deliverable one"],
};

export default function AdminPage() {
  const store = useStore();
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<TabId>("dashboard");
  const [toast, setToast] = useState<{ ok: boolean; message: string } | null>(null);

  const flash = (ok: boolean, message: string) => {
    setToast({ ok, message });
    setTimeout(() => setToast(null), 3000);
  };

  const totalRevenue = store.orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + o.totalNumber, 0);

  return (
    <section className="relative min-h-screen overflow-hidden bg-navy-950 pt-28 pb-20 sm:pt-32">
      <div className="bg-grid-dark absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-brand-600/20 blur-[140px]" />
      <div className="absolute top-1/2 -right-40 h-96 w-96 rounded-full bg-cyan-accent/10 blur-[140px]" />

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-[110] max-w-sm"
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-2xl backdrop-blur-xl",
                toast.ok
                  ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
                  : "border-rose-400/30 bg-rose-500/15 text-rose-200"
              )}
            >
              {toast.ok ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <Ban className="h-5 w-5 shrink-0" />}
              <p className="text-sm font-semibold">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        {/* header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-4 py-1.5 text-[11px] font-bold tracking-wider text-brand-300 uppercase">
                <ShieldCheck className="h-3.5 w-3.5" /> Admin panel
              </span>
              <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Control center
              </h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Signed in as <span className="font-semibold text-brand-300">{user?.email}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-brand-400/60 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" /> View site
              </Link>
              <button
                onClick={() => {
                  logout();
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </motion.div>

        {/* tabs */}
        <div className="mt-8 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-2 backdrop-blur">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                tab === t.id
                  ? "bg-gradient-to-r from-brand-600 to-sky-500 text-white shadow-lg shadow-brand-500/25"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* panels */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {tab === "dashboard" && (
                <>
                  <EditModeControl flash={flash} />
                  <EmailVerifyCard flash={flash} />
                  <DashboardTab
                    revenue={totalRevenue}
                    orders={store.orders.length}
                    users={loadUsers().length}
                    products={store.products.length}
                    services={store.services.length}
                    onGo={setTab}
                  />
                </>
              )}
              {tab === "orders" && <OrdersTab flash={flash} />}
              {tab === "accounts" && <AccountsTab flash={flash} />}
              {tab === "products" && <ProductsTab flash={flash} />}
              {tab === "services" && <ServicesTab flash={flash} />}
              {tab === "reviews" && <ReviewsTab flash={flash} />}
              {tab === "images" && <ImagesTab flash={flash} />}
              {tab === "theme" && <ThemeTab flash={flash} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ============================== Dashboard ============================== */

/* ============ Admin email verification + mail log (dashboard) ============ */
function EmailVerifyCard({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const {
    adminEmailVerified,
    requestAdminEmailVerify,
    verifyAdminEmail,
    resetAdminEmailVerification,
  } = useStore();
  const [config, setConfig] = useState<EmailConfig>(() => loadEmailConfig());
  const [mode, setMode] = useState<"idle" | "sending" | "sent" | "done">(
    adminEmailVerified ? "done" : "idle"
  );
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [previewCode, setPreviewCode] = useState("");
  const [testing, setTesting] = useState(false);
  const [mailRevision, setMailRevision] = useState(0);

  const saveConfig = () => {
    saveEmailConfig(config);
    resetAdminEmailVerification();
    setMode("idle");
    flash(
      true,
      isEmailConfigured(config)
        ? "EmailJS settings saved. Send a test email next."
        : "Settings saved, but all three EmailJS IDs are required."
    );
  };

  const testConnection = async () => {
    saveEmailConfig(config);
    resetAdminEmailVerification();
    setMode("idle");
    setTesting(true);
    setErr(null);
    const result = await sendTestEmail(WEBSITE_EMAIL);
    setTesting(false);
    setMailRevision((value) => value + 1);
    if (result.success) {
      flash(true, `Real test email accepted for delivery to ${WEBSITE_EMAIL}.`);
    } else {
      setErr(result.error || "Email test failed.");
      flash(false, "Email test failed. Check the provider settings.");
    }
  };

  const request = async () => {
    saveEmailConfig(config);
    setMode("sending");
    setErr(null);
    const result = await requestAdminEmailVerify();
    setMailRevision((value) => value + 1);
    if (result.success) {
      setPreviewCode(result.previewCode || "");
      setMode("sent");
      flash(true, `Verification email sent to ${WEBSITE_EMAIL}.`);
    } else {
      setMode("idle");
      setErr(result.error || "Verification email failed.");
      flash(false, "Verification email was not delivered.");
    }
  };

  const verify = () => {
    if (verifyAdminEmail(code)) {
      setMode("done");
      setErr(null);
      flash(true, "Email verified — admin email confirmed working.");
    } else {
      setErr("Incorrect or expired code. Try again or request a new one.");
    }
  };

  /* Re-read on every local panel update so order/status emails appear instantly. */
  void mailRevision;
  const sentEmails = loadSentEmails();

  const kindTone: Record<string, "brand" | "green" | "amber" | "rose" | "violet" | "slate"> = {
    verify_signup: "brand",
    admin_verify: "violet",
    order_received: "amber",
    order_accepted: "green",
    order_cancelled: "rose",
    password_reset: "brand",
    test: "slate",
  };

  return (
    <div className="mb-6 space-y-6">
      <AdminCard
        title="Email delivery setup"
        desc="Connect devzardpk@gmail.com through EmailJS. This enables real signup codes and order status emails without storing your Gmail password."
        action={
          <AdminBadge tone={isEmailConfigured(config) ? "green" : "amber"}>
            {isEmailConfigured(config) ? "Configured" : "Setup required"}
          </AdminBadge>
        }
      >
        <div className="grid gap-4 lg:grid-cols-3">
          <AdminInput
            label="EmailJS service ID"
            value={config.serviceId}
            onChange={(value) => setConfig({ ...config, serviceId: value })}
            placeholder="service_xxxxxxx"
            hint="EmailJS > Email Services"
          />
          <AdminInput
            label="EmailJS template ID"
            value={config.templateId}
            onChange={(value) => setConfig({ ...config, templateId: value })}
            placeholder="template_xxxxxxx"
            hint="One dynamic template for all emails"
          />
          <AdminInput
            label="EmailJS public key"
            value={config.publicKey}
            onChange={(value) => setConfig({ ...config, publicKey: value })}
            placeholder="Your public browser key"
            hint="EmailJS > Account > API Keys"
          />
          <AdminInput
            label="Sender name"
            value={config.fromName}
            onChange={(value) => setConfig({ ...config, fromName: value })}
            placeholder="DEVZARD"
          />
          <AdminInput
            label="Reply-to email"
            value={config.replyTo}
            onChange={(value) => setConfig({ ...config, replyTo: value })}
            placeholder={WEBSITE_EMAIL}
          />
          <AdminToggle
            label="Preview verification codes"
            desc="Testing only. Keep off on the live site."
            checked={config.previewCodes}
            onChange={(value) => setConfig({ ...config, previewCodes: value })}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-brand-400/20 bg-brand-500/10 p-4 text-xs leading-relaxed text-brand-100">
          Connect <strong>{WEBSITE_EMAIL}</strong> as a Gmail service in EmailJS. In the template,
          set <strong>To Email</strong> to <code>{"{{to_email}}"}</code>, subject to
          <code> {"{{subject}}"}</code>, and content to <code>{"{{message}}"}</code>. Also add
          <code> {"{{verification_code}}"}</code> where you want the six-digit code displayed.
          EmailJS public keys are designed for browser use; your Gmail password is never saved here.
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <AdminButton onClick={saveConfig}>
            <Save className="h-4 w-4" /> Save email settings
          </AdminButton>
          <AdminButton
            variant="ghost"
            onClick={() => void testConnection()}
            disabled={testing || !isEmailConfigured(config)}
          >
            <Mail className="h-4 w-4" /> {testing ? "Sending test…" : "Send real test email"}
          </AdminButton>
          <a
            href="https://dashboard.emailjs.com/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-brand-400/60 hover:text-white"
          >
            Open EmailJS <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        {err && <p className="mt-3 text-xs font-semibold text-rose-300">{err}</p>}
      </AdminCard>

      <AdminCard
        title="Email verification"
        desc="A successful provider test is followed by a code sent to the actual admin inbox. Entering that code proves delivery end-to-end."
        action={
          mode === "done" ? (
            <AdminBadge tone="green">
              <CheckCircle2 className="mr-1 h-3 w-3" /> Verified
            </AdminBadge>
          ) : (
            <AdminButton
              onClick={() => void request()}
              disabled={mode === "sending" || !isEmailConfigured(config)}
            >
              <Mail className="h-4 w-4" /> {mode === "sending" ? "Sending…" : mode === "sent" ? "Resend code" : "Send verification code"}
            </AdminButton>
          )
        }
      >
        {mode === "done" ? (
          <div className="flex items-center gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-5">
            <CheckCircle2 className="h-8 w-8 shrink-0 text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-200">Email verified</p>
              <p className="mt-0.5 text-sm text-emerald-300/80">
                A real email reached {WEBSITE_EMAIL} and its code was confirmed. Delivery is connected.
              </p>
            </div>
          </div>
        ) : mode === "sent" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-brand-400/25 bg-brand-500/10 p-5">
              <p className="text-sm font-semibold text-brand-200">
                Code sent to {WEBSITE_EMAIL}
                {previewCode && (
                  <span className="ml-3 rounded-lg bg-white/10 px-2.5 py-1 font-display text-lg font-bold tracking-[0.3em] text-white">
                    {previewCode}
                  </span>
                )}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-white/70">
                Check the inbox and spam folder, then enter the six-digit code below.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-center font-display text-lg font-bold tracking-[0.5em] text-white outline-none focus:border-brand-400/60"
              />
              <AdminButton onClick={verify}>
                <CheckCircle2 className="h-4 w-4" /> Verify
              </AdminButton>
            </div>
            {err && <p className="text-xs font-semibold text-rose-400">{err}</p>}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-400">
            Save valid EmailJS settings first, then send a verification code to prove real delivery works.
          </p>
        )}
      </AdminCard>

      <AdminCard
        title={`Email delivery log (${sentEmails.length})`}
        desc="Every attempted email is logged with a real delivery status. A log entry alone does not mean it was delivered."
        action={
          sentEmails.length ? (
            <AdminButton
              size="sm"
              variant="ghost"
              onClick={() => {
                clearSentEmails();
                setMailRevision((value) => value + 1);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear log
            </AdminButton>
          ) : null
        }
      >
        {sentEmails.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            No emails sent yet. When someone signs up or places an order, it shows up here.
          </p>
        ) : (
          <div className="space-y-2.5">
            {sentEmails.slice(0, 30).map((em) => (
              <div key={em.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{em.subject}</p>
                      <p className="text-[11px] text-slate-500">
                        to <span className="font-semibold text-slate-300">{em.to}</span> · {new Date(em.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <AdminBadge tone={kindTone[em.kind] ?? "slate"}>{em.kind.replace(/_/g, " ")}</AdminBadge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <AdminBadge
                    tone={
                      em.status === "sent"
                        ? "green"
                        : em.status === "failed"
                        ? "rose"
                        : em.status === "not_configured"
                        ? "amber"
                        : "brand"
                    }
                  >
                    {em.status.replace(/_/g, " ")}
                  </AdminBadge>
                  {em.error && <span className="text-[11px] text-rose-300">{em.error}</span>}
                </div>
                <p className="mt-2.5 rounded-xl bg-white/[0.04] px-3.5 py-2.5 text-xs leading-relaxed text-slate-300">
                  {em.body}
                </p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

/* ============ Site edit-mode control (dashboard) ============ */
function EditModeControl({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { editMode, setEditMode, undoTextEdit, canUndo, undoCount, clearTextOverrides } = useStore();

  return (
    <AdminCard className="mb-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            className={cn(
              "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border",
              editMode
                ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
                : "border-brand-400/40 bg-brand-500/15 text-brand-300"
            )}
          >
            <MousePointerClick className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-white">Site text edit mode</h3>
            <p className="mt-1 max-w-xl text-sm text-slate-400">
              Turn this on, browse the website, and <span className="font-semibold text-white">click any highlighted text to rewrite it</span> —
              headlines, paragraphs, buttons, section titles… everything updates live and persists.
              Come back here (or use the floating bar) to switch it off. Every change can be undone.
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> {undoCount} change{undoCount === 1 ? "" : "s"} made
              </span>
              <span className="inline-flex items-center gap-1">
                <Undo2 className="h-3.5 w-3.5 text-brand-300" /> Undo available {canUndo ? "✓" : "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <AdminButton variant="ghost" onClick={() => { if (undoTextEdit()) flash(true, "Last text edit undone."); }}>
            <Undo2 className="h-4 w-4" /> Undo {canUndo ? `(${undoCount})` : ""}
          </AdminButton>
          <AdminButton
            variant="ghost"
            onClick={() => { clearTextOverrides(); flash(true, "All custom text edits cleared."); }}
          >
            <RotateCcw className="h-4 w-4" /> Reset all text
          </AdminButton>
          <Link to="/">
            <AdminButton className="w-full">
              <ExternalLink className="h-4 w-4" /> Open site {editMode && "(editing)"}
            </AdminButton>
          </Link>
          {editMode ? (
            <AdminButton variant="success" onClick={() => { setEditMode(false); flash(true, "Edit mode turned OFF. Changes are live."); }}>
              <CheckCheck className="h-4 w-4" /> Turn off
            </AdminButton>
          ) : (
            <AdminButton onClick={() => { setEditMode(true); flash(true, "Edit mode ON — go to any page and click text to edit."); }}>
              <MousePointerClick className="h-4 w-4" /> Turn on edit mode
            </AdminButton>
          )}
        </div>
      </div>
    </AdminCard>
  );
}

/* ============ Reviews (moderation) ============ */
function ReviewsTab({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { reviews, deleteReview } = useStore();
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Review | null>(null);

  const filtered = reviews.filter((r) => {
    const q = query.toLowerCase();
    return (
      !q ||
      r.authorName.toLowerCase().includes(q) ||
      (r.authorEmail || "").toLowerCase().includes(q) ||
      (r.service || "").toLowerCase().includes(q) ||
      r.text.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <AdminCard
        title={`Client reviews (${filtered.length})`}
        desc="Reviews submitted by registered users appear here and on the public reviews page."
        action={
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reviews…"
              className="w-56 rounded-xl border border-white/10 bg-white/5 py-2 pr-3 pl-9 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/60"
            />
          </div>
        }
      >
        {!filtered.length ? (
          <p className="py-10 text-center text-sm text-slate-500">
            No user reviews yet. When a registered user leaves a review on the site it will show up here.
          </p>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-sky-400 text-xs font-bold text-white">
                    {r.authorName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-white">{r.authorName}</p>
                      <span className="flex text-amber-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "" : "opacity-25")} fill="currentColor" />
                        ))}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {r.authorEmail} {r.service && <>· {r.service}</>} · {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">“{r.text}”</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1.5 sm:flex-col">
                  <AdminButton size="sm" variant="ghost" onClick={() => setPreview(r)}>
                    <Eye className="h-3.5 w-3.5" /> View
                  </AdminButton>
                  <AdminButton size="sm" variant="danger" onClick={() => setConfirmId(r.id)}>
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <AdminModal open={!!preview} onClose={() => setPreview(null)} title="Review" desc={preview?.authorEmail}>
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-white">{preview.authorName}</p>
              <span className="flex text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < preview.rating ? "" : "opacity-25")} fill="currentColor" />
                ))}
              </span>
            </div>
            {preview.service && <AdminBadge tone="brand">{preview.service}</AdminBadge>}
            <p className="text-sm leading-relaxed text-slate-300">“{preview.text}”</p>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) {
            deleteReview(confirmId);
            flash(true, "Review deleted.");
          }
        }}
        title="Delete review?"
        message="This permanently removes the review from the site."
      />
    </div>
  );
}

/* ============================== Dashboard ============================== */

function DashboardTab({
  revenue, orders, users, products, services, onGo,
}: {
  revenue: number; orders: number; users: number; products: number; services: number;
  onGo: (t: TabId) => void;
}) {
  const { orders: allOrders } = useStore();
  const recent = allOrders.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        <StatCard icon={DollarSign} label="Revenue" value={`$${revenue.toLocaleString()}`} sub="completed orders" gradient="from-emerald-500 to-teal-400" />
        <StatCard icon={ShoppingBag} label="Orders" value={String(orders)} sub="all time" gradient="from-brand-600 to-sky-400" />
        <StatCard icon={Users} label="Accounts" value={String(users)} sub="registered" gradient="from-violet-600 to-indigo-400" />
        <StatCard icon={Package} label="Products" value={String(products)} sub="live on site" gradient="from-amber-500 to-orange-400" />
        <StatCard icon={Layers} label="Services" value={String(services)} sub="live on site" gradient="from-rose-500 to-pink-400" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard title="Quick actions" desc="Jump into the most common tasks." className="lg:col-span-1">
          <div className="space-y-2.5">
            {[
              { label: "Manage orders", tab: "orders" as TabId, icon: ShoppingBag },
              { label: "Manage accounts", tab: "accounts" as TabId, icon: Users },
              { label: "Edit products & prices", tab: "products" as TabId, icon: Package },
              { label: "Edit services", tab: "services" as TabId, icon: Layers },
              { label: "Change theme & logo", tab: "theme" as TabId, icon: Palette },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => onGo(a.tab)}
                className="group flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-brand-400/40 hover:bg-white/[0.06]"
              >
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-300">
                    <a.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold text-white">{a.label}</span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            ))}
          </div>
        </AdminCard>

        <AdminCard title="Recent orders" desc="Latest 5 orders across the store." className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  <th className="pb-3">Reference</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map((o) => (
                  <tr key={o.id}>
                    <td className="py-3 font-mono text-xs text-brand-300">{o.reference}</td>
                    <td className="py-3">
                      <p className="font-semibold text-white">{o.customerName}</p>
                      <p className="text-[11px] text-slate-500">{o.customerEmail}</p>
                    </td>
                    <td className="py-3 font-bold text-white">{o.total}</td>
                    <td className="py-3"><AdminBadge tone={statusTone[o.status]}>{o.status}</AdminBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      <AdminCard title="Storefront preview" desc="Live counts reflecting your current catalog.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Products live</p>
            <ul className="mt-3 space-y-2">
              {useStore().products.slice(0, 4).map((p) => (
                <li key={p.slug} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{p.name}</span>
                  <span className="font-bold text-brand-300">{p.price}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Services live</p>
            <ul className="mt-3 space-y-2">
              {useStore().services.slice(0, 4).map((s) => (
                <li key={s.slug} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{s.title}</span>
                  <span className="text-[11px] text-slate-500">#{s.number || "—"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}

/* ============================== Orders ============================== */

function OrdersTab({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { orders, updateOrder, deleteOrder, resetOrders } = useStore();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [view, setView] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        const q = query.toLowerCase();
        const matchQ =
          !q ||
          o.reference.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q);
        const matchS = statusFilter === "all" || o.status === statusFilter;
        return matchQ && matchS;
      }),
    [orders, query, statusFilter]
  );

  const viewed = orders.find((o) => o.id === view);

  return (
    <div className="space-y-5">
      <AdminCard
        title={`Orders (${filtered.length})`}
        desc="Track, update and manage every order."
        action={
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search orders…"
                className="w-48 rounded-xl border border-white/10 bg-white/5 py-2 pr-3 pl-9 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/60"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400/60"
            >
              {["all", "pending", "processing", "completed", "cancelled", "refunded"].map((s) => (
                <option key={s} value={s} className="bg-navy-900">{s}</option>
              ))}
            </select>
            <AdminButton variant="ghost" size="sm" onClick={() => { resetOrders(); flash(true, "Orders reset to defaults."); }}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </AdminButton>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                <th className="pb-3">Reference</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Items</th>
                <th className="pb-3">Total</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((o) => (
                <tr key={o.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="py-3 font-mono text-xs text-brand-300">{o.reference}</td>
                  <td className="py-3">
                    <p className="font-semibold text-white">{o.customerName}</p>
                    <p className="text-[11px] text-slate-500">{o.customerEmail}</p>
                  </td>
                  <td className="py-3 text-slate-400">{o.items.length} item{o.items.length !== 1 ? "s" : ""}</td>
                  <td className="py-3 font-bold text-white">{o.total}</td>
                  <td className="py-3 text-xs text-slate-400">{o.paymentMethod}</td>
                  <td className="py-3">
                    <select
                      value={o.status}
                      onChange={(e) => {
                        updateOrder(o.id, { status: e.target.value as OrderStatus });
                        flash(true, `Order ${o.reference} marked ${e.target.value}.`);
                      }}
                      className={cn(
                        "appearance-none rounded-full border bg-transparent px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase outline-none",
                        o.status === "completed" && "border-emerald-400/30 text-emerald-300",
                        o.status === "pending" && "border-amber-400/30 text-amber-300",
                        o.status === "processing" && "border-brand-400/30 text-brand-300",
                        o.status === "cancelled" && "border-white/15 text-slate-400",
                        o.status === "refunded" && "border-violet-400/30 text-violet-300"
                      )}
                    >
                      {["pending", "processing", "completed", "cancelled", "refunded"].map((s) => (
                        <option key={s} value={s} className="bg-navy-900">{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {o.status === "pending" && (
                        <>
                          <button
                            onClick={() => { updateOrder(o.id, { status: "processing" }); flash(true, `Order ${o.reference} accepted → processing.`); }}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-2 text-[11px] font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                            title="Accept order"
                          >
                            <CheckCheck className="h-3.5 w-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => { updateOrder(o.id, { status: "cancelled" }); flash(true, `Order ${o.reference} declined → cancelled.`); }}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-400/30 bg-rose-500/10 px-2.5 py-2 text-[11px] font-bold text-rose-300 transition-colors hover:bg-rose-500/20"
                            title="Decline order"
                          >
                            <XCircle className="h-3.5 w-3.5" /> Decline
                          </button>
                        </>
                      )}
                      <button onClick={() => setView(o.id)} className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:text-white" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setConfirmId(o.id)} className="rounded-lg border border-rose-400/20 p-2 text-rose-400 transition-colors hover:bg-rose-500/10" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <p className="py-10 text-center text-sm text-slate-500">No orders match your filters.</p>
          )}
        </div>
      </AdminCard>

      {/* order detail */}
      <AdminModal open={!!viewed} onClose={() => setView(null)} title={`Order ${viewed?.reference ?? ""}`} desc={viewed?.customerEmail} wide>
        {viewed && (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Total</p>
                <p className="font-display mt-1 text-xl font-bold text-white">{viewed.total}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Status</p>
                <div className="mt-1.5"><AdminBadge tone={statusTone[viewed.status]}>{viewed.status}</AdminBadge></div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Placed</p>
                <p className="mt-1 text-sm text-white">{new Date(viewed.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Items</p>
              <ul className="mt-3 divide-y divide-white/5">
                {viewed.items.map((i, idx) => (
                  <li key={idx} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="text-slate-300">{i.name} <span className="text-slate-500">× {i.qty}</span></span>
                    <span className="font-bold text-white">{i.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <AdminTextarea
              label="Internal notes"
              value={viewed.notes || ""}
              onChange={(v) => updateOrder(viewed.id, { notes: v })}
              placeholder="Add a note about this order…"
            />
            <AdminSelect
              label="Update status"
              value={viewed.status}
              onChange={(v) => updateOrder(viewed.id, { status: v as OrderStatus })}
              options={["pending", "processing", "completed", "cancelled", "refunded"].map((s) => ({ label: s, value: s }))}
            />
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) {
            deleteOrder(confirmId);
            flash(true, "Order deleted.");
          }
        }}
        title="Delete order?"
        message="This permanently removes the order from the store. This cannot be undone."
      />
    </div>
  );
}

/* ============================== Accounts ============================== */

function AccountsTab({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const [users, setUsers] = useState<User[]>(() => loadUsers());
  const [query, setQuery] = useState("");
  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [newPw, setNewPw] = useState("");
  const [pmTarget, setPmTarget] = useState<User | null>(null);
  const [pmForm, setPmForm] = useState({ brand: "Visa", number: "", expMonth: "12", expYear: "2028", holder: "" });
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const persistAll = (next: User[]) => {
    saveUsers(next);
    setUsers(next);
  };

  const filtered = users.filter((u) => {
    const q = query.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.company || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <AdminCard
        title={`Accounts (${filtered.length})`}
        desc="View emails, reset passwords and manage payment methods."
        action={
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search accounts…"
              className="w-56 rounded-xl border border-white/10 bg-white/5 py-2 pr-3 pl-9 text-sm text-white placeholder-slate-500 outline-none focus:border-brand-400/60"
            />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                <th className="pb-3">User</th>
                <th className="pb-3">Email</th>
                <th className="pb-3">Plan</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Payment method</th>
                <th className="pb-3">Joined</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u) => {
                const pm = u.paymentMethods[0];
                return (
                  <tr key={u.id} className="transition-colors hover:bg-white/[0.03]">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-[10px] font-bold text-white", u.avatarColor)}>
                          {u.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                        </span>
                        <div>
                          <p className="font-semibold text-white">{u.name}</p>
                          {u.company && <p className="text-[11px] text-slate-500">{u.company}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{u.email}</td>
                    <td className="py-3">
                      <select
                        value={u.plan}
                        onChange={(e) => {
                          persistAll(users.map((x) => (x.id === u.id ? { ...x, plan: e.target.value as UserPlan } : x)));
                          flash(true, `${u.name} moved to ${e.target.value}.`);
                        }}
                        className="appearance-none rounded-full border border-white/15 bg-transparent px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-300 uppercase outline-none"
                      >
                        {["free", "pro", "business"].map((p) => (
                          <option key={p} value={p} className="bg-navy-900">{p}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      {u.email === ADMIN_EMAIL || u.role === "admin" ? (
                        <AdminBadge tone="violet">admin</AdminBadge>
                      ) : (
                        <AdminBadge tone="slate">user</AdminBadge>
                      )}
                    </td>
                    <td className="py-3">
                      {pm ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                          <CreditCard className="h-3.5 w-3.5 text-brand-300" />
                          {pm.brand} ••{pm.last4}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-600">None</span>
                      )}
                    </td>
                    <td className="py-3 text-xs text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => { setResetTarget(u); setNewPw(""); }}
                          className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:text-brand-300"
                          title="Reset password"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => { setPmTarget(u); setPmForm({ brand: "Visa", number: "", expMonth: "12", expYear: "2028", holder: u.name }); }}
                          className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:text-brand-300"
                          title="Manage payment"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            persistAll(users.map((x) => (x.id === u.id ? { ...x, suspended: !x.suspended } : x)));
                            flash(true, `${u.name} ${u.suspended ? "reinstated" : "suspended"}.`);
                          }}
                          disabled={u.email === ADMIN_EMAIL}
                          className="rounded-lg border border-amber-400/20 p-2 text-amber-400 transition-colors hover:bg-amber-500/10 disabled:opacity-30"
                          title={u.suspended ? "Reinstate" : "Suspend"}
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(u)}
                          disabled={u.email === ADMIN_EMAIL}
                          className="rounded-lg border border-rose-400/20 p-2 text-rose-400 transition-colors hover:bg-rose-500/10 disabled:opacity-30"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>

      {/* reset password modal */}
      <AdminModal
        open={!!resetTarget}
        onClose={() => setResetTarget(null)}
        title="Reset password"
        desc={resetTarget ? `Set a new password for ${resetTarget.email}` : ""}
        submitLabel="Set new password"
        onSubmit={() => {
          if (!resetTarget) return;
          if (newPw.length < 6) return flash(false, "Password must be at least 6 characters.");
          persistAll(users.map((x) => (x.id === resetTarget.id ? { ...x, password: obfuscate(newPw) } : x)));
          flash(true, `Password reset for ${resetTarget.email}.`);
          setResetTarget(null);
        }}
      >
        <AdminInput label="Account email" value={resetTarget?.email || ""} onChange={() => {}} />
        <AdminInput label="New password" value={newPw} onChange={setNewPw} placeholder="At least 6 characters" required />
        <p className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
          The user will be able to sign in with this password immediately.
        </p>
      </AdminModal>

      {/* payment method modal */}
      <AdminModal
        open={!!pmTarget}
        onClose={() => setPmTarget(null)}
        title="Payment methods"
        desc={pmTarget ? `${pmTarget.name} · ${pmTarget.email}` : ""}
        wide
      >
        {pmTarget && (
          <div className="space-y-5">
            <div className="space-y-2">
              {pmTarget.paymentMethods.length === 0 && (
                <p className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-500">
                  No payment method on file.
                </p>
              )}
              {pmTarget.paymentMethods.map((pm) => (
                <div key={pm.last4} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-brand-700 to-brand-500 text-white">
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{pm.brand} •••• {pm.last4}</p>
                      <p className="text-[11px] text-slate-500">{pm.holder} · expires {pm.expMonth}/{pm.expYear}</p>
                    </div>
                  </div>
                  <AdminButton
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      const next = users.map((x) =>
                        x.id === pmTarget.id ? { ...x, paymentMethods: x.paymentMethods.filter((p) => p.last4 !== pm.last4) } : x
                      );
                      persistAll(next);
                      setPmTarget({ ...pmTarget, paymentMethods: pmTarget.paymentMethods.filter((p) => p.last4 !== pm.last4) });
                      flash(true, "Payment method removed.");
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </AdminButton>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Add payment method</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <AdminSelect
                  label="Brand"
                  value={pmForm.brand}
                  onChange={(v) => setPmForm({ ...pmForm, brand: v })}
                  options={["Visa", "Mastercard", "Amex", "PayPal", "Discover"].map((b) => ({ label: b, value: b }))}
                />
                <AdminInput label="Card number" value={pmForm.number} onChange={(v) => setPmForm({ ...pmForm, number: v })} placeholder="4242 4242 4242 4242" />
                <AdminInput label="Exp month" value={pmForm.expMonth} onChange={(v) => setPmForm({ ...pmForm, expMonth: v })} placeholder="09" />
                <AdminInput label="Exp year" value={pmForm.expYear} onChange={(v) => setPmForm({ ...pmForm, expYear: v })} placeholder="2028" />
                <div className="sm:col-span-2">
                  <AdminInput label="Cardholder name" value={pmForm.holder} onChange={(v) => setPmForm({ ...pmForm, holder: v })} />
                </div>
              </div>
              <AdminButton
                className="mt-4 w-full"
                onClick={() => {
                  const digits = pmForm.number.replace(/\D/g, "");
                  if (digits.length < 12) return flash(false, "Enter a valid card number.");
                  const next = users.map((x) =>
                    x.id === pmTarget.id
                      ? {
                          ...x,
                          paymentMethods: [
                            ...x.paymentMethods,
                            { brand: pmForm.brand, last4: digits.slice(-4), expMonth: pmForm.expMonth, expYear: pmForm.expYear, holder: pmForm.holder },
                          ],
                        }
                      : x
                  );
                  persistAll(next);
                  setPmTarget(next.find((x) => x.id === pmTarget.id) ?? null);
                  setPmForm({ brand: "Visa", number: "", expMonth: "12", expYear: "2028", holder: pmTarget.name });
                  flash(true, "Payment method added.");
                }}
              >
                <Plus className="h-4 w-4" /> Add method
              </AdminButton>
            </div>
          </div>
        )}
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            persistAll(users.filter((x) => x.id !== deleteTarget.id));
            flash(true, "Account deleted.");
          }
        }}
        title="Delete account?"
        message={`This permanently deletes ${deleteTarget?.email} and all their data. This cannot be undone.`}
      />
    </div>
  );
}

/* ============================== Products ============================== */

function ProductsTab({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { products, addProduct, updateProduct, deleteProduct, resetProducts } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [draft, setDraft] = useState<typeof emptyProduct & { slug?: string }>(emptyProduct);

  const openEdit = (slug: string) => {
    const p = products.find((x) => x.slug === slug);
    if (!p) return;
    setDraft({
      slug: p.slug, name: p.name, tagline: p.tagline, desc: p.desc, longDesc: p.longDesc,
      price: p.price, unit: p.unit, gradient: p.gradient, accent: p.accent, popular: p.popular,
      iconName: nameOfIcon(p.icon),
      features: p.features, benefits: p.benefits, faqs: p.faqs, stats: p.stats, plans: p.plans,
    });
    setEditing(slug);
  };

  const save = () => {
    if (!draft.name.trim()) return flash(false, "Product name is required.");
    if (editing) {
      updateProduct(editing, draft);
      flash(true, `${draft.name} updated.`);
      setEditing(null);
    } else {
      addProduct(draft);
      flash(true, `${draft.name} added.`);
      setCreating(false);
    }
    setDraft(emptyProduct);
  };

  return (
    <div className="space-y-5">
      <AdminCard
        title={`Products (${products.length})`}
        desc="Edit prices, add new products or remove them — changes go live instantly."
        action={
          <div className="flex gap-2">
            <AdminButton onClick={() => { setDraft(emptyProduct); setCreating(true); }}>
              <Plus className="h-4 w-4" /> Add product
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { resetProducts(); flash(true, "Products reset to defaults."); }}>
              <RotateCcw className="h-4 w-4" /> Reset
            </AdminButton>
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((p) => (
            <div key={p.slug} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all hover:border-brand-400/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={cn("flex h-11 w-11 items-center justify-center rotify-center rounded-xl bg-gradient-to-br text-white shadow-lg", p.gradient)}>
                    <p.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-display font-bold text-white">
                      {p.name}
                      {p.popular && <AdminBadge tone="green">popular</AdminBadge>}
                    </p>
                    <p className="font-display text-lg font-bold text-brand-300">{p.price}<span className="text-xs font-medium text-slate-500"> {p.unit}</span></p>
                  </div>
                </div>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-slate-400">{p.tagline}</p>
              <div className="mt-4 flex gap-2">
                <AdminButton size="sm" onClick={() => openEdit(p.slug)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </AdminButton>
                <AdminButton size="sm" variant="danger" onClick={() => setConfirmId(p.slug)}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </AdminButton>
                <Link to={`/products/${p.slug}`} className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white">
                  <Eye className="h-3.5 w-3.5" /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminModal
        open={creating || !!editing}
        onClose={() => { setCreating(false); setEditing(null); }}
        title={editing ? "Edit product" : "Add product"}
        desc="Changes apply to the live storefront immediately."
        submitLabel={editing ? "Save changes" : "Create product"}
        onSubmit={save}
        wide
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="Name" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} required />
          <AdminInput label="Tagline" value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} />
          <AdminInput label="Price" value={draft.price} onChange={(v) => setDraft({ ...draft, price: v })} placeholder="$29" required />
          <AdminInput label="Price unit" value={draft.unit} onChange={(v) => setDraft({ ...draft, unit: v })} placeholder="one-time / /mo" />
        </div>
        <AdminInput label="Short description" value={draft.desc} onChange={(v) => setDraft({ ...draft, desc: v })} />
        <AdminTextarea label="Long description" value={draft.longDesc} onChange={(v) => setDraft({ ...draft, longDesc: v })} rows={3} />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSelect
            label="Icon gradient"
            value={draft.gradient}
            onChange={(v) => setDraft({ ...draft, gradient: v })}
            options={GRADIENT_PRESETS.map((g) => ({ label: g.label, value: g.value }))}
          />
          <AdminSelect
            label="Icon"
            value={draft.iconName}
            onChange={(v) => setDraft({ ...draft, iconName: v })}
            options={ICON_NAMES.map((n) => ({ label: n, value: n }))}
          />
          <AdminToggle label="Mark as popular" checked={draft.popular} onChange={(v) => setDraft({ ...draft, popular: v })} />
        </div>

        {/* features */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Features</p>
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, features: [...draft.features, { title: "", desc: "" }] })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </AdminButton>
          </div>
          <div className="space-y-3">
            {draft.features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input value={f.title} onChange={(e) => { const n = [...draft.features]; n[i] = { ...f, title: e.target.value }; setDraft({ ...draft, features: n }); }} placeholder="Title" className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <input value={f.desc} onChange={(e) => { const n = [...draft.features]; n[i] = { ...f, desc: e.target.value }; setDraft({ ...draft, features: n }); }} placeholder="Description" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <button onClick={() => setDraft({ ...draft, features: draft.features.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* pricing plans */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Pricing tiers</p>
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, plans: [...draft.plans, { name: "", price: "$0", features: [""] }] })}>
              <Plus className="h-3.5 w-3.5" /> Add tier
            </AdminButton>
          </div>
          <div className="space-y-3">
            {draft.plans.map((pl, i) => (
              <div key={i} className="rounded-xl border border-white/10 p-3">
                <div className="flex gap-2">
                  <input value={pl.name} onChange={(e) => { const n = [...draft.plans]; n[i] = { ...pl, name: e.target.value }; setDraft({ ...draft, plans: n }); }} placeholder="Tier name" className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <input value={pl.price} onChange={(e) => { const n = [...draft.plans]; n[i] = { ...pl, price: e.target.value }; setDraft({ ...draft, plans: n }); }} placeholder="$29" className="w-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <input value={pl.features.join(", ")} onChange={(e) => { const n = [...draft.plans]; n[i] = { ...pl, features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }; setDraft({ ...draft, plans: n }); }} placeholder="Features (comma separated)" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <button onClick={() => setDraft({ ...draft, plans: draft.plans.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* stats / numbers */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Stats & numbers</p>
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, stats: [...draft.stats, { value: "", label: "" }] })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </AdminButton>
          </div>
          <div className="space-y-3">
            {draft.stats.map((st, i) => (
              <div key={i} className="flex gap-2">
                <input value={st.value} onChange={(e) => { const n = [...draft.stats]; n[i] = { ...st, value: e.target.value }; setDraft({ ...draft, stats: n }); }} placeholder="99.9%" className="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <input value={st.label} onChange={(e) => { const n = [...draft.stats]; n[i] = { ...st, label: e.target.value }; setDraft({ ...draft, stats: n }); }} placeholder="Uptime" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <button onClick={() => setDraft({ ...draft, stats: draft.stats.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* benefits */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Benefits</p>
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, benefits: [...draft.benefits, ""] })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </AdminButton>
          </div>
          <div className="space-y-2">
            {draft.benefits.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input value={b} onChange={(e) => { const n = [...draft.benefits]; n[i] = e.target.value; setDraft({ ...draft, benefits: n }); }} placeholder="A benefit customers get" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <button onClick={() => setDraft({ ...draft, benefits: draft.benefits.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">FAQs</p>
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, faqs: [...draft.faqs, { q: "", a: "" }] })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </AdminButton>
          </div>
          <div className="space-y-3">
            {draft.faqs.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input value={f.q} onChange={(e) => { const n = [...draft.faqs]; n[i] = { ...f, q: e.target.value }; setDraft({ ...draft, faqs: n }); }} placeholder="Question" className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <input value={f.a} onChange={(e) => { const n = [...draft.faqs]; n[i] = { ...f, a: e.target.value }; setDraft({ ...draft, faqs: n }); }} placeholder="Answer" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <button onClick={() => setDraft({ ...draft, faqs: draft.faqs.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </AdminModal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) {
            const p = products.find((x) => x.slug === confirmId);
            deleteProduct(confirmId);
            flash(true, `${p?.name ?? "Product"} deleted.`);
          }
        }}
        title="Delete product?"
        message="This removes the product from the storefront permanently."
      />
    </div>
  );
}

/* ============================== Services ============================== */

function ServicesTab({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { services, addService, updateService, deleteService, resetServices } = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [draft, setDraft] = useState<typeof emptyService & { slug?: string }>(emptyService);

  const openEdit = (slug: string) => {
    const s = services.find((x) => x.slug === slug);
    if (!s) return;
    setDraft({
      slug: s.slug, title: s.title, tagline: s.tagline, desc: s.desc, longDesc: s.longDesc,
      number: s.number, tags: s.tags, gradient: s.gradient, accent: s.accent,
      iconName: nameOfIcon(s.icon), popular: !!s.popular,
      features: s.features, process: s.process, benefits: s.benefits, faqs: s.faqs,
      stats: s.stats, deliverables: s.deliverables,
    });
    setEditing(slug);
  };

  const save = () => {
    if (!draft.title.trim()) return flash(false, "Service title is required.");
    if (editing) {
      updateService(editing, draft);
      flash(true, `${draft.title} updated.`);
      setEditing(null);
    } else {
      addService({ ...draft, number: draft.number || String(services.length + 1).padStart(2, "0") });
      flash(true, `${draft.title} added.`);
      setCreating(false);
    }
    setDraft(emptyService);
  };

  return (
    <div className="space-y-5">
      <AdminCard
        title={`Services (${services.length})`}
        desc="Add, edit or delete services. Order number controls display position."
        action={
          <div className="flex gap-2">
            <AdminButton onClick={() => { setDraft({ ...emptyService, number: String(services.length + 1).padStart(2, "0") }); setCreating(true); }}>
              <Plus className="h-4 w-4" /> Add service
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { resetServices(); flash(true, "Services reset to defaults."); }}>
              <RotateCcw className="h-4 w-4" /> Reset
            </AdminButton>
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                <th className="pb-3">#</th>
                <th className="pb-3">Service</th>
                <th className="pb-3">Tagline</th>
                <th className="pb-3">Tags</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {services.map((s) => (
                <tr key={s.slug} className="transition-colors hover:bg-white/[0.03]">
                  <td className="py-3 font-display font-bold text-slate-500">{s.number}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white", s.gradient)}>
                        <s.icon className="h-4 w-4" />
                      </span>
                      <span className="font-semibold text-white">{s.title}</span>
                    </div>
                  </td>
                  <td className="py-3 max-w-xs truncate text-slate-400">{s.tagline}</td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {s.tags.slice(0, 2).map((t) => (
                        <AdminBadge key={t} tone="slate">{t}</AdminBadge>
                      ))}
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-1.5">
                      <AdminButton size="sm" onClick={() => openEdit(s.slug)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </AdminButton>
                      <AdminButton size="sm" variant="danger" onClick={() => setConfirmId(s.slug)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </AdminButton>
                      <Link to={`/services/${s.slug}`} className="inline-flex items-center rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:text-white">
                        <Eye className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminCard>

      <AdminModal
        open={creating || !!editing}
        onClose={() => { setCreating(false); setEditing(null); }}
        title={editing ? "Edit service" : "Add service"}
        desc="Changes apply to the live storefront immediately."
        submitLabel={editing ? "Save changes" : "Create service"}
        onSubmit={save}
        wide
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <AdminInput label="Title" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} required />
          </div>
          <AdminInput label="Order #" value={draft.number} onChange={(v) => setDraft({ ...draft, number: v })} placeholder="11" />
        </div>
        <AdminInput label="Tagline" value={draft.tagline} onChange={(v) => setDraft({ ...draft, tagline: v })} />
        <AdminInput label="Short description" value={draft.desc} onChange={(v) => setDraft({ ...draft, desc: v })} />
        <AdminTextarea label="Long description" value={draft.longDesc} onChange={(v) => setDraft({ ...draft, longDesc: v })} rows={3} />
        <AdminInput label="Tags (comma separated)" value={draft.tags.join(", ")} onChange={(v) => setDraft({ ...draft, tags: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSelect
            label="Icon"
            value={draft.iconName}
            onChange={(v) => setDraft({ ...draft, iconName: v })}
            options={ICON_NAMES.map((n) => ({ label: n, value: n }))}
          />
          <AdminSelect
            label="Icon gradient"
            value={draft.gradient}
            onChange={(v) => setDraft({ ...draft, gradient: v })}
            options={GRADIENT_PRESETS.map((g) => ({ label: g.label, value: g.value }))}
          />
        </div>
        <AdminToggle label="Mark as popular" desc="Shows a Popular badge on the service card" checked={!!draft.popular} onChange={(v) => setDraft({ ...draft, popular: v })} />

        {/* stats / numbers */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Stats & numbers</p>
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, stats: [...draft.stats, { value: "", label: "" }] })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </AdminButton>
          </div>
          <div className="space-y-3">
            {draft.stats.map((st, i) => (
              <div key={i} className="flex gap-2">
                <input value={st.value} onChange={(e) => { const n = [...draft.stats]; n[i] = { ...st, value: e.target.value }; setDraft({ ...draft, stats: n }); }} placeholder="+312%" className="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <input value={st.label} onChange={(e) => { const n = [...draft.stats]; n[i] = { ...st, label: e.target.value }; setDraft({ ...draft, stats: n }); }} placeholder="Conversion lift" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <button onClick={() => setDraft({ ...draft, stats: draft.stats.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">FAQs</p>
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, faqs: [...draft.faqs, { q: "", a: "" }] })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </AdminButton>
          </div>
          <div className="space-y-3">
            {draft.faqs.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input value={f.q} onChange={(e) => { const n = [...draft.faqs]; n[i] = { ...f, q: e.target.value }; setDraft({ ...draft, faqs: n }); }} placeholder="Question" className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <input value={f.a} onChange={(e) => { const n = [...draft.faqs]; n[i] = { ...f, a: e.target.value }; setDraft({ ...draft, faqs: n }); }} placeholder="Answer" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <button onClick={() => setDraft({ ...draft, faqs: draft.faqs.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* process steps */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">Process steps</p>
            <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, process: [...draft.process, { step: `0${draft.process.length + 1}`, title: "", desc: "" }] })}>
              <Plus className="h-3.5 w-3.5" /> Add
            </AdminButton>
          </div>
          <div className="space-y-3">
            {draft.process.map((p, i) => (
              <div key={i} className="flex gap-2">
                <input value={p.step} onChange={(e) => { const n = [...draft.process]; n[i] = { ...p, step: e.target.value }; setDraft({ ...draft, process: n }); }} placeholder="01" className="w-16 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <input value={p.title} onChange={(e) => { const n = [...draft.process]; n[i] = { ...p, title: e.target.value }; setDraft({ ...draft, process: n }); }} placeholder="Step title" className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <input value={p.desc} onChange={(e) => { const n = [...draft.process]; n[i] = { ...p, desc: e.target.value }; setDraft({ ...draft, process: n }); }} placeholder="Description" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none" />
                <button onClick={() => setDraft({ ...draft, process: draft.process.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* list editors */}
        {([
          { key: "features", label: "Features", fields: ["title", "desc"] },
        ] as const).map((grp) => (
          <div key={grp.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{grp.label}</p>
              <AdminButton size="sm" variant="ghost" onClick={() => setDraft({ ...draft, features: [...draft.features, { title: "", desc: "" }] })}>
                <Plus className="h-3.5 w-3.5" /> Add
              </AdminButton>
            </div>
            <div className="space-y-2">
              {draft.features.map((f, i) => (
                <div key={i} className="flex gap-2">
                  <input value={f.title} onChange={(e) => { const n = [...draft.features]; n[i] = { ...f, title: e.target.value }; setDraft({ ...draft, features: n }); }} placeholder="Title" className="w-1/3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <input value={f.desc} onChange={(e) => { const n = [...draft.features]; n[i] = { ...f, desc: e.target.value }; setDraft({ ...draft, features: n }); }} placeholder="Description" className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <button onClick={() => setDraft({ ...draft, features: draft.features.filter((_, x) => x !== i) })} className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {([
          { key: "benefits", label: "Benefits", list: draft.benefits },
          { key: "deliverables", label: "Deliverables", list: draft.deliverables },
        ] as const).map((grp) => (
          <div key={grp.key} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{grp.label}</p>
              <AdminButton
                size="sm" variant="ghost"
                onClick={() => setDraft({ ...draft, [grp.key]: [...grp.list, ""] } as typeof draft)}
              >
                <Plus className="h-3.5 w-3.5" /> Add
              </AdminButton>
            </div>
            <div className="space-y-2">
              {grp.list.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => {
                      const n = [...grp.list];
                      n[i] = e.target.value;
                      setDraft({ ...draft, [grp.key]: n } as typeof draft);
                    }}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none"
                  />
                  <button
                    onClick={() => setDraft({ ...draft, [grp.key]: grp.list.filter((_, x) => x !== i) } as typeof draft)}
                    className="rounded-xl border border-rose-400/20 px-2.5 text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </AdminModal>

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => {
          if (confirmId) {
            const s = services.find((x) => x.slug === confirmId);
            deleteService(confirmId);
            flash(true, `${s?.title ?? "Service"} deleted.`);
          }
        }}
        title="Delete service?"
        message="This removes the service and its page from the storefront permanently."
      />
    </div>
  );
}

/* ============================== Theme ============================== */

const THEMES: { label: string; primary: string; accent: string; dark: string }[] = [
  { label: "Ocean Blue (default)", primary: "#2563eb", accent: "#22d3ee", dark: "#060d20" },
  { label: "Royal Indigo", primary: "#4f46e5", accent: "#a78bfa", dark: "#0a0a1f" },
  { label: "Teal Fresh", primary: "#0d9488", accent: "#2dd4bf", dark: "#04201c" },
  { label: "Sunset Orange", primary: "#ea580c", accent: "#fb923c", dark: "#1c0a04" },
  { label: "Rose Bold", primary: "#e11d48", accent: "#fb7185", dark: "#1f0509" },
  { label: "Emerald Deep", primary: "#059669", accent: "#34d399", dark: "#03170f" },
  { label: "Violet Night", primary: "#7c3aed", accent: "#c084fc", dark: "#0d0618" },
  { label: "Cyan Electric", primary: "#0891b2", accent: "#22d3ee", dark: "#04141c" },
];

/* ============ Team & Skills ============ */
function TeamTab({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const {
    team, addTeamMember, updateTeamMember, deleteTeamMember, moveTeamMember, resetTeam,
    skills, addSkill, updateSkill, deleteSkill, resetSkills,
  } = useStore();

  const [editingMember, setEditingMember] = useState<string | null>(null);
  const [memberDraft, setMemberDraft] = useState({ name: "", role: "", initials: "", gradient: GRADIENT_PRESETS[0].value, photoUrl: "" });
  const [creatingMember, setCreatingMember] = useState(false);
  const [deleteMemberId, setDeleteMemberId] = useState<string | null>(null);

  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [skillDraft, setSkillDraft] = useState({ name: "", level: 90, gradient: GRADIENT_PRESETS[0].value, iconName: "Zap" });
  const [creatingSkill, setCreatingSkill] = useState(false);
  const [deleteSkillId, setDeleteSkillId] = useState<string | null>(null);

  const openEditMember = (id: string) => {
    const m = team.find((x) => x.id === id);
    if (!m) return;
    setMemberDraft({ name: m.name, role: m.role, initials: m.initials, gradient: m.gradient, photoUrl: m.photoUrl });
    setEditingMember(id);
  };

  const saveMember = () => {
    if (!memberDraft.name.trim()) return flash(false, "Member name is required.");
    const payload = {
      ...memberDraft,
      name: memberDraft.name.trim(),
      role: memberDraft.role.trim() || "Team Member",
      initials: memberDraft.initials.trim() || memberDraft.name.trim().split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase(),
    };
    if (editingMember) {
      updateTeamMember(editingMember, payload);
      flash(true, `${payload.name} updated everywhere on the site.`);
      setEditingMember(null);
    } else {
      addTeamMember(payload);
      flash(true, `${payload.name} added to the team.`);
      setCreatingMember(false);
    }
    setMemberDraft({ name: "", role: "", initials: "", gradient: GRADIENT_PRESETS[0].value, photoUrl: "" });
  };

  const openEditSkill = (id: string) => {
    const s = skills.find((x) => x.id === id);
    if (!s) return;
    setSkillDraft({ name: s.name, level: s.level, gradient: s.gradient, iconName: s.iconName });
    setEditingSkill(id);
  };

  const saveSkill = () => {
    if (!skillDraft.name.trim()) return flash(false, "Skill name is required.");
    const payload = { ...skillDraft, name: skillDraft.name.trim(), level: Math.max(1, Math.min(100, skillDraft.level)) };
    if (editingSkill) {
      updateSkill(editingSkill, payload);
      flash(true, `${payload.name} updated.`);
      setEditingSkill(null);
    } else {
      addSkill(payload);
      flash(true, `${payload.name} added.`);
      setCreatingSkill(false);
    }
    setSkillDraft({ name: "", level: 90, gradient: GRADIENT_PRESETS[0].value, iconName: "Zap" });
  };

  return (
    <div className="space-y-5">
      {/* team members */}
      <AdminCard
        title={`Team members (${team.length})`}
        desc="Add, edit, reorder or remove members — the About page updates instantly."
        action={
          <div className="flex gap-2">
            <AdminButton onClick={() => { setMemberDraft({ name: "", role: "", initials: "", gradient: GRADIENT_PRESETS[0].value, photoUrl: "" }); setCreatingMember(true); }}>
              <Plus className="h-4 w-4" /> Add member
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { resetTeam(); flash(true, "Team reset to defaults."); }}>
              <RotateCcw className="h-4 w-4" /> Reset
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-3">
          {team.map((m, i) => (
            <div key={m.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600/20 to-sky-400/10">
                {m.photoUrl ? (
                  <img src={m.photoUrl} alt={m.name} className="h-full w-full object-cover" />
                ) : (
                  <span className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br font-display text-xl font-bold text-white", m.gradient)}>
                    {m.initials}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-white">{m.name}</p>
                <p className="truncate text-xs text-slate-400">{m.role}</p>
              </div>
              <span className="hidden text-[11px] font-bold text-slate-500 sm:inline">#{i + 1}</span>
              <div className="flex gap-1.5">
                <button onClick={() => moveTeamMember(m.id, -1)} disabled={i === 0} className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:text-white disabled:opacity-30" title="Move up">
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => moveTeamMember(m.id, 1)} disabled={i === team.length - 1} className="rounded-lg border border-white/10 p-2 text-slate-400 transition-colors hover:text-white disabled:opacity-30" title="Move down">
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </button>
                <AdminButton size="sm" onClick={() => openEditMember(m.id)}>
                  <Pencil className="h-3.5 w-3.5" />
                </AdminButton>
                <AdminButton size="sm" variant="danger" onClick={() => setDeleteMemberId(m.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* skills */}
      <AdminCard
        title={`Skills (${skills.length})`}
        desc="Edit skill names, levels, icons and colors — About page bars update live."
        action={
          <div className="flex gap-2">
            <AdminButton onClick={() => { setSkillDraft({ name: "", level: 90, gradient: GRADIENT_PRESETS[0].value, iconName: "Zap" }); setCreatingSkill(true); }}>
              <Plus className="h-4 w-4" /> Add skill
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { resetSkills(); flash(true, "Skills reset to defaults."); }}>
              <RotateCcw className="h-4 w-4" /> Reset
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-3">
          {skills.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-bold text-white">{s.name}</p>
                  <p className="font-display text-sm font-bold text-brand-300">{s.level}%</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className={cn("h-full rounded-full bg-gradient-to-r", s.gradient)} style={{ width: `${s.level}%` }} />
                </div>
              </div>
              <div className="flex gap-1.5">
                <AdminButton size="sm" onClick={() => openEditSkill(s.id)}>
                  <Pencil className="h-3.5 w-3.5" />
                </AdminButton>
                <AdminButton size="sm" variant="danger" onClick={() => setDeleteSkillId(s.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* member modal */}
      <AdminModal
        open={creatingMember || !!editingMember}
        onClose={() => { setCreatingMember(false); setEditingMember(null); }}
        title={editingMember ? "Edit team member" : "Add team member"}
        desc="Shows on the About page immediately after saving."
        submitLabel={editingMember ? "Save changes" : "Add member"}
        onSubmit={saveMember}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="Name" value={memberDraft.name} onChange={(v) => setMemberDraft({ ...memberDraft, name: v })} placeholder="e.g. Hadi" required />
          <AdminInput label="Role" value={memberDraft.role} onChange={(v) => setMemberDraft({ ...memberDraft, role: v })} placeholder="e.g. Founder / CEO" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminInput label="Initials" value={memberDraft.initials} onChange={(v) => setMemberDraft({ ...memberDraft, initials: v })} placeholder="Auto from name" hint="Shown when no photo is set" />
          <AdminSelect label="Card gradient" value={memberDraft.gradient} onChange={(v) => setMemberDraft({ ...memberDraft, gradient: v })} options={GRADIENT_PRESETS.map((g) => ({ label: g.label, value: g.value }))} />
        </div>
        <AdminInput label="Photo URL" value={memberDraft.photoUrl} onChange={(v) => setMemberDraft({ ...memberDraft, photoUrl: v })} placeholder="https://… or upload below" hint="Leave empty to show initials avatar" />
        <div>
          <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">Or upload photo</span>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:border-brand-400/60 hover:text-white">
            <Upload className="h-4 w-4" /> Choose image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (f) {
                  try {
                    const dataUrl = await fileToDataUrl(f);
                    setMemberDraft({ ...memberDraft, photoUrl: dataUrl });
                    flash(true, "Photo attached — save to publish.");
                  } catch { /* ignore */ }
                }
                e.target.value = "";
              }}
            />
          </label>
          {memberDraft.photoUrl && (
            <div className="mt-3 h-28 w-28 overflow-hidden rounded-2xl border border-white/10">
              <img src={memberDraft.photoUrl} alt="preview" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </AdminModal>

      {/* skill modal */}
      <AdminModal
        open={creatingSkill || !!editingSkill}
        onClose={() => { setCreatingSkill(false); setEditingSkill(null); }}
        title={editingSkill ? "Edit skill" : "Add skill"}
        desc="Shows on the About page skills grid."
        submitLabel={editingSkill ? "Save changes" : "Add skill"}
        onSubmit={saveSkill}
      >
        <AdminInput label="Skill name" value={skillDraft.name} onChange={(v) => setSkillDraft({ ...skillDraft, name: v })} placeholder="e.g. Motion Design" required />
        <div>
          <span className="mb-1.5 block text-[11px] font-bold tracking-wider text-slate-400 uppercase">Level: {skillDraft.level}%</span>
          <input
            type="range" min={1} max={100} value={skillDraft.level}
            onChange={(e) => setSkillDraft({ ...skillDraft, level: Number(e.target.value) })}
            className="w-full accent-sky-400"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <AdminSelect label="Icon" value={skillDraft.iconName} onChange={(v) => setSkillDraft({ ...skillDraft, iconName: v })} options={ICON_NAMES.map((n) => ({ label: n, value: n }))} />
          <AdminSelect label="Bar gradient" value={skillDraft.gradient} onChange={(v) => setSkillDraft({ ...skillDraft, gradient: v })} options={GRADIENT_PRESETS.map((g) => ({ label: g.label, value: g.value }))} />
        </div>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteMemberId}
        onClose={() => setDeleteMemberId(null)}
        onConfirm={() => {
          if (deleteMemberId) {
            const m = team.find((x) => x.id === deleteMemberId);
            deleteTeamMember(deleteMemberId);
            flash(true, `${m?.name ?? "Member"} removed from the team.`);
          }
        }}
        title="Remove team member?"
        message="This removes them from the About page immediately."
      />
      <ConfirmDialog
        open={!!deleteSkillId}
        onClose={() => setDeleteSkillId(null)}
        onConfirm={() => {
          if (deleteSkillId) {
            const s = skills.find((x) => x.id === deleteSkillId);
            deleteSkill(deleteSkillId);
            flash(true, `${s?.name ?? "Skill"} removed.`);
          }
        }}
        title="Remove skill?"
        message="This removes the skill from the About page."
      />
    </div>
  );
}

/* ============ Images & Assets ============ */
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function AssetField({
  label, hint, value, onChange, onUpload, tall = false,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  onUpload: (file: File) => void;
  tall?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-white">{label}</p>
          <p className="mt-0.5 text-[11px] text-slate-500">{hint}</p>
        </div>
        <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-slate-300 transition-colors hover:border-brand-400/60 hover:text-white">
          <Upload className="h-3.5 w-3.5" /> Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) {
                try {
                  const dataUrl = await fileToDataUrl(f);
                  onChange(dataUrl);
                  onUpload(f);
                } catch {
                  /* ignore */
                }
              }
              e.target.value = "";
            }}
          />
        </label>
      </div>
      <div className="mt-3 flex gap-2">
        <div className={cn("relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5", tall ? "h-28 w-44" : "h-16 w-24")}>
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-600">
              <ImageIcon className="h-5 w-5" />
            </div>
          )}
        </div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste image URL…"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-400/60"
        />
      </div>
      {value && (
        <button
          onClick={() => onChange("")}
          className="mt-2 text-[11px] font-semibold text-rose-400 hover:text-rose-300"
        >
          Clear image
        </button>
      )}
    </div>
  );
}

function StatsEditor({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { stats, setStats, resetStats } = useStore();
  const [draft, setDraft] = useState(stats);

  const save = () => {
    setStats(draft);
    flash(true, "Numbers updated across the whole website.");
  };

  return (
    <AdminCard
      title="Numbers & texts"
      desc="Edit once here — every number updates everywhere on the website instantly: homepage, services, products and about pages."
      action={
        <div className="flex gap-2">
          <AdminButton onClick={save}>
            <Save className="h-4 w-4" /> Save numbers
          </AdminButton>
          <AdminButton variant="ghost" onClick={() => { resetStats(); setDraft(DEFAULT_STATS); flash(true, "Numbers reset to defaults."); }}>
            <RefreshCw className="h-4 w-4" /> Reset
          </AdminButton>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminInput label="Trust badge text" value={draft.trustCount} onChange={(v) => setDraft({ ...draft, trustCount: v })} hint='e.g. "120+ clients"' />
        <AdminInput label="Rating text" value={draft.ratingText} onChange={(v) => setDraft({ ...draft, ratingText: v })} hint='e.g. "4.9/5 average rating"' />
      </div>

      {(
        [
          { key: "hero" as const, label: "Homepage hero stats strip", where: "Home page bottom strip" },
          { key: "services" as const, label: "Services page stats", where: "Services overview hero" },
          { key: "products" as const, label: "Products page stats", where: "Products overview hero" },
          { key: "about" as const, label: "About page stats", where: "About story cards" },
        ]
      ).map((grp) => (
        <div key={grp.key} className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">{grp.label}</p>
            <span className="text-[10px] text-slate-500">{grp.where}</span>
          </div>
          <div className="space-y-3">
            {draft[grp.key].map((s, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={s.value}
                  onChange={(e) => {
                    const n = [...draft[grp.key]];
                    n[i] = { ...s, value: e.target.value };
                    setDraft({ ...draft, [grp.key]: n });
                  }}
                  placeholder="250+"
                  className="w-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400/60"
                />
                <input
                  value={s.label}
                  onChange={(e) => {
                    const n = [...draft[grp.key]];
                    n[i] = { ...s, label: e.target.value };
                    setDraft({ ...draft, [grp.key]: n });
                  }}
                  placeholder="Projects delivered"
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-brand-400/60"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </AdminCard>
  );
}

function ImagesTab({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { assets, setAssets, resetAssets, team, updateTeamMember } = useStore();
  const [draft, setDraft] = useState(assets);

  const update = (patch: Partial<typeof assets>) => {
    const next = { ...draft, ...patch };
    setDraft(next);
    setAssets(patch);
  };
  /* legacy keys map to team members so both stay in sync */
  const LEGACY_TO_MEMBER: Record<string, string> = { founder: "Hadi", cofounder: "Talha", ceo: "Faizan" };
  const updateTeam = (key: keyof typeof assets.teamImages, value: string) => {
    const teamImages = { ...draft.teamImages, [key]: value };
    const next = { ...draft, teamImages };
    setDraft(next);
    setAssets({ teamImages });
    const memberName = LEGACY_TO_MEMBER[key];
    const member = team.find((m) => m.name.toLowerCase() === memberName.toLowerCase());
    if (member) updateTeamMember(member.id, { photoUrl: value });
  };

  return (
    <div className="space-y-5">
      <AdminCard
        title="Images & assets"
        desc="Upload files or paste URLs — changes apply across the whole site instantly. Uploaded images are embedded and never expire."
        action={
          <div className="flex gap-2">
            <AdminButton
              variant="ghost"
              onClick={() => {
                resetAssets();
                setDraft(assets);
                flash(true, "Assets reset to defaults.");
              }}
            >
              <RefreshCw className="h-4 w-4" /> Reset
            </AdminButton>
            <Link to="/">
              <AdminButton>
                <ExternalLink className="h-4 w-4" /> View site
              </AdminButton>
            </Link>
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <AssetField
            label="Favicon"
            hint="Browser tab icon (square, PNG/SVG)"
            value={draft.faviconUrl}
            onChange={(v) => { update({ faviconUrl: v }); flash(true, "Favicon updated."); }}
            onUpload={() => flash(true, "Favicon uploaded.")}
          />
          <AssetField
            label="Social share image"
            hint="Shown when the site is shared (OG image)"
            value={draft.ogImageUrl}
            onChange={(v) => { update({ ogImageUrl: v }); flash(true, "OG image updated."); }}
            onUpload={() => flash(true, "OG image uploaded.")}
            tall
          />
          <AssetField
            label="Hero image"
            hint="Replaces the dashboard graphic on the homepage"
            value={draft.heroImageUrl}
            onChange={(v) => { update({ heroImageUrl: v }); flash(true, "Hero image updated."); }}
            onUpload={() => flash(true, "Hero image uploaded.")}
            tall
          />
          <AssetField
            label="About story image"
            hint="Shown on the About page next to our story"
            value={draft.aboutStoryUrl}
            onChange={(v) => { update({ aboutStoryUrl: v }); flash(true, "Story image updated."); }}
            onUpload={() => flash(true, "Story image uploaded.")}
            tall
          />
        </div>

        <div className="mt-6">
          <p className="mb-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Team member photos</p>
          <div className="grid gap-4 lg:grid-cols-3">
            <AssetField
              label="Hadi — Founder / CEO"
              hint="About page team card"
              value={draft.teamImages.founder}
              onChange={(v) => { updateTeam("founder", v); flash(true, "Founder photo updated."); }}
              onUpload={() => flash(true, "Founder photo uploaded.")}
              tall
            />
            <AssetField
              label="Talha — Co-Founder"
              hint="About page team card"
              value={draft.teamImages.cofounder}
              onChange={(v) => { updateTeam("cofounder", v); flash(true, "Co-founder photo updated."); }}
              onUpload={() => flash(true, "Co-founder photo uploaded.")}
              tall
            />
            <AssetField
              label="Faizan — Co-Founder"
              hint="About page team card"
              value={draft.teamImages.ceo}
              onChange={(v) => { updateTeam("ceo", v); flash(true, "Co-founder photo updated."); }}
              onUpload={() => flash(true, "Co-founder photo uploaded.")}
              tall
            />
          </div>
        </div>
      </AdminCard>

      <StatsEditor flash={flash} />
      <HeroVisualEditor flash={flash} />
      <TeamTab flash={flash} />
    </div>
  );
}

/* ============ Hero visual numbers (floating cards + dashboard) ============ */
function HeroVisualEditor({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { stats, setStats } = useStore();
  const [draft, setDraft] = useState(stats.heroVisual);

  const save = () => {
    setStats({ heroVisual: draft });
    flash(true, "Hero visual numbers updated on the homepage.");
  };

  const setCard = (card: "roas" | "youtube" | "videoEdit", patch: Partial<typeof draft.roas>) =>
    setDraft({ ...draft, [card]: { ...draft[card], ...patch } });

  return (
    <AdminCard
      title="Hero visual numbers"
      desc="Customize the floating cards (Ad ROAS, YouTube Growth, Video Edit) and the dashboard revenue shown on the homepage hero."
      action={
        <AdminButton onClick={save}>
          <Save className="h-4 w-4" /> Save hero visuals
        </AdminButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <AdminInput label="Revenue label" value={draft.revenueLabel} onChange={(v) => setDraft({ ...draft, revenueLabel: v })} hint='e.g. "Total Revenue"' />
        <AdminInput label="Revenue value" value={draft.revenueValue} onChange={(v) => setDraft({ ...draft, revenueValue: v })} hint='e.g. "$48,920"' />
        <AdminInput label="Revenue change" value={draft.revenueChange} onChange={(v) => setDraft({ ...draft, revenueChange: v })} hint='e.g. "+212%"' />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {(
          [
            { key: "roas" as const, title: "Ad ROAS card", tone: "border-emerald-400/25" },
            { key: "youtube" as const, title: "YouTube Growth card", tone: "border-rose-400/25" },
            { key: "videoEdit" as const, title: "Video Edit card", tone: "border-brand-400/25" },
          ]
        ).map((c) => (
          <div key={c.key} className={cn("rounded-2xl border bg-white/[0.03] p-4", c.tone)}>
            <p className="mb-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">{c.title}</p>
            <div className="space-y-3">
              <AdminInput label="Title" value={draft[c.key].label} onChange={(v) => setCard(c.key, { label: v })} />
              <AdminInput label="Value" value={draft[c.key].value} onChange={(v) => setCard(c.key, { value: v })} hint='e.g. "+312%"' />
              <AdminInput label="Sub text" value={draft[c.key].sub} onChange={(v) => setCard(c.key, { sub: v })} hint='e.g. "this month"' />
            </div>
          </div>
        ))}
      </div>
    </AdminCard>
  );
}

function ThemeTab({ flash }: { flash: (ok: boolean, m: string) => void }) {
  const { theme, setTheme, resetTheme } = useStore();
  const [draft, setDraft] = useState<Theme>(theme);
  const [saved, setSaved] = useState(true);

  const update = <K extends keyof Theme>(key: K, value: Theme[K]) => {
    setDraft({ ...draft, [key]: value });
    setSaved(false);
  };

  const applyPreset = (p: (typeof THEMES)[number]) => {
    setDraft({ ...draft, primary: p.primary, accent: p.accent, dark: p.dark });
    setSaved(false);
  };

  const save = () => {
    setTheme(draft);
    setSaved(true);
    flash(true, "Theme applied across the whole site.");
  };

  return (
    <div className="space-y-5">
      <AdminCard
        title="Theme & branding"
        desc="Change colors, logo, fonts and contact info. Everything updates live."
        action={
          <div className="flex gap-2">
            <AdminButton onClick={save} className={cn(!saved && "animate-pulse")}>
              <Save className="h-4 w-4" /> {saved ? "Saved" : "Apply theme"}
            </AdminButton>
            <AdminButton variant="ghost" onClick={() => { setDraft(DEFAULT_THEME); resetTheme(); setSaved(true); flash(true, "Theme reset to default."); }}>
              <RotateCcw className="h-4 w-4" /> Reset
            </AdminButton>
          </div>
        }
      >
        <div className="space-y-6">
          {/* presets */}
          <div>
            <p className="mb-3 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Color presets</p>
            <div className="grid gap-3 sm:grid-cols-4">
              {THEMES.map((p) => {
                const active = draft.primary.toLowerCase() === p.primary.toLowerCase();
                return (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p)}
                    className={cn(
                      "rounded-2xl border p-3 text-left transition-all",
                      active ? "border-brand-400/60 bg-brand-500/10" : "border-white/10 hover:border-white/25"
                    )}
                  >
                    <span className="flex gap-1.5">
                      <span className="h-6 flex-1 rounded-md" style={{ background: p.primary }} />
                      <span className="h-6 flex-1 rounded-md" style={{ background: p.accent }} />
                      <span className="h-6 flex-1 rounded-md" style={{ background: p.dark }} />
                    </span>
                    <p className="mt-2 text-[11px] font-semibold text-slate-300">{p.label}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* colors */}
          <div className="grid gap-5 sm:grid-cols-3">
            <ColorField label="Primary color" value={draft.primary} onChange={(v) => update("primary", v)} hint="Drives buttons, links, accents" />
            <ColorField label="Accent color" value={draft.accent} onChange={(v) => update("accent", v)} hint="Glows & secondary highlights" />
            <ColorField label="Dark section color" value={draft.dark} onChange={(v) => update("dark", v)} hint="Background of dark bands" />
          </div>

          {/* logo */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="mb-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">Logo</p>
            <div className="grid gap-5 sm:grid-cols-[auto_1fr]">
              {/* live preview */}
              <div className="flex h-28 w-44 items-center justify-center rounded-2xl border border-white/10 bg-white">
                <div className="flex items-center gap-2.5">
                  {draft.logoImageUrl ? (
                    <img src={draft.logoImageUrl} alt="logo" className="h-10 w-10 rounded-xl object-cover" />
                  ) : (
                    <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg", draft.logoGradient)}>
                      {draft.logoIcon}
                    </span>
                  )}
                  <span className="font-display text-lg font-bold tracking-tight" style={{ color: "#0f172a" }}>
                    {draft.siteName}<span style={{ color: draft.primary }}>{draft.siteNameAccent}</span>
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <AdminInput label="Brand name (first part)" value={draft.siteName} onChange={(v) => update("siteName", v)} placeholder="DEV" />
                <AdminInput label="Brand name (accent part)" value={draft.siteNameAccent} onChange={(v) => update("siteNameAccent", v)} placeholder="ZARD" />
                <AdminInput label="Logo emoji / symbol" value={draft.logoIcon} onChange={(v) => update("logoIcon", v)} placeholder="⚡" hint="Used when no image URL is set" />
                <AdminInput label="Logo image URL" value={draft.logoImageUrl} onChange={(v) => update("logoImageUrl", v)} placeholder="https://…" hint="Overrides the emoji" />
                <div className="sm:col-span-2">
                  <AdminSelect
                    label="Logo background gradient"
                    value={draft.logoGradient}
                    onChange={(v) => update("logoGradient", v)}
                    options={GRADIENT_PRESETS.map((g) => ({ label: g.label, value: g.value }))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* typography */}
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminSelect label="Heading font" value={draft.fontDisplay} onChange={(v) => update("fontDisplay", v)} options={FONT_OPTIONS.map((f) => ({ label: f.label, value: f.value }))} />
            <AdminSelect label="Body font" value={draft.fontBody} onChange={(v) => update("fontBody", v)} options={FONT_OPTIONS.map((f) => ({ label: f.label, value: f.value }))} />
          </div>

          {/* site copy */}
          <div className="grid gap-5 sm:grid-cols-2">
            <AdminTextarea label="Footer tagline" value={draft.tagline} onChange={(v) => update("tagline", v)} rows={3} />
            <div className="space-y-4">
              <AdminInput label="Support email" value={draft.supportEmail} onChange={(v) => update("supportEmail", v)} />
              <AdminInput label="Support phone" value={draft.supportPhone} onChange={(v) => update("supportPhone", v)} />
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard title="Live preview" desc="A snapshot of how your theme looks right now.">
        <div className="rounded-3xl bg-white p-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-xl shadow-lg", draft.logoGradient)}>
              {draft.logoIcon}
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-slate-900">
              {draft.siteName}<span style={{ color: draft.primary }}>{draft.siteNameAccent}</span>
            </span>
            <span className="ml-auto inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg" style={{ background: draft.primary }}>
              Get started <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <h3 className="font-display mt-8 text-4xl font-bold tracking-tight" style={{ color: draft.primary }}>
            Gradient headline preview
          </h3>
          <p className="mt-3 max-w-lg text-sm text-slate-500" style={{ fontFamily: draft.fontBody }}>
            This paragraph uses your selected body font. The heading above uses your display font
            and primary color. Adjust anything and hit <strong>Apply theme</strong>.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {draft.logoGradient && <span className={cn("rounded-full bg-gradient-to-r px-4 py-2 text-xs font-bold text-white", draft.logoGradient)}>gradient pill</span>}
            <span className="rounded-full border px-4 py-2 text-xs font-bold" style={{ borderColor: draft.accent, color: draft.primary }}>outline pill</span>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
