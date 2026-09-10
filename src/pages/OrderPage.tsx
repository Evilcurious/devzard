import { useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  Mail,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useStore } from "../context/StoreContext";
import { Reveal } from "../components/shared";
import { cn } from "../utils/cn";

function numberFromPrice(price: string): number {
  const value = Number(price.replace(/[^0-9.]/g, ""));
  return Number.isFinite(value) ? value : 0;
}

export default function OrderPage() {
  const { user } = useAuth();
  const { products, services, addOrder } = useStore();
  const [params] = useSearchParams();

  const initialProduct = params.get("product") || "";
  const initialService = params.get("service") || "";
  const initialPlan = params.get("plan") || "";

  const [kind, setKind] = useState<"product" | "service">(
    initialService ? "service" : "product"
  );
  const [productSlug, setProductSlug] = useState(
    initialProduct || products[0]?.slug || ""
  );
  const [serviceSlug, setServiceSlug] = useState(
    initialService || services[0]?.slug || ""
  );
  const [planName, setPlanName] = useState(initialPlan);
  const [paymentMethod, setPaymentMethod] = useState(
    user?.paymentMethods[0]
      ? `${user.paymentMethods[0].brand} •••• ${user.paymentMethods[0].last4}`
      : "Contact me for payment"
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    reference: string;
    emailSent: boolean;
    emailError?: string;
  } | null>(null);

  const product = products.find((item) => item.slug === productSlug);
  const service = services.find((item) => item.slug === serviceSlug);
  const selectedPlan =
    product?.plans.find((plan) => plan.name === planName) || product?.plans[0];

  const summary = useMemo(() => {
    if (kind === "service" && service) {
      return {
        name: service.title,
        detail: service.tagline,
        price: "Custom quote",
        totalNumber: 0,
      };
    }
    if (product) {
      const price = selectedPlan?.price || product.price;
      return {
        name: `${product.name}${selectedPlan ? ` — ${selectedPlan.name}` : ""}`,
        detail: product.tagline,
        price,
        totalNumber: numberFromPrice(price),
      };
    }
    return { name: "Select an item", detail: "", price: "$0", totalNumber: 0 };
  }, [kind, product, selectedPlan, service]);

  if (!user) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const orderResult = await addOrder({
      customerName: user.name,
      customerEmail: user.email,
      items: [{ name: summary.name, qty: 1, price: summary.price }],
      total: summary.price,
      totalNumber: summary.totalNumber,
      status: "pending",
      paymentMethod,
      notes,
    });
    setLoading(false);
    setResult(orderResult);
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36">
      <div className="bg-grid-light absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-400/20 blur-[130px]" />
      <div className="absolute top-0 -right-32 h-96 w-96 rounded-full bg-cyan-accent/15 blur-[130px]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-semibold tracking-wider text-brand-600 uppercase">
              <ShoppingBag className="h-3.5 w-3.5" /> Place an order
            </span>
            <h1 className="font-display mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Start your <span className="text-gradient-blue">next project.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Review the details below. Your order appears in your account immediately,
              and confirmation is sent to {user.email}.
            </p>
          </div>
        </Reveal>

        {result ? (
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-3xl border border-brand-100 bg-white p-8 text-center shadow-xl shadow-brand-900/5 sm:p-12">
              <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </span>
              <h2 className="font-display mt-6 text-3xl font-bold text-slate-900">
                Order received
              </h2>
              <p className="mt-2 text-slate-500">
                Reference <span className="font-mono font-bold text-brand-600">{result.reference}</span>
              </p>
              <div
                className={cn(
                  "mt-6 rounded-2xl border px-5 py-4 text-sm",
                  result.emailSent
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-amber-200 bg-amber-50 text-amber-700"
                )}
              >
                <Mail className="mx-auto mb-2 h-5 w-5" />
                {result.emailSent
                  ? `Confirmation was sent to ${user.email}.`
                  : `The order was saved, but the email could not be sent. ${result.emailError || "Contact support if you need confirmation."}`}
              </div>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  to="/account"
                  className="btn-shine inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg"
                >
                  View my orders <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center rounded-xl border border-brand-200 px-7 py-3.5 text-sm font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-600"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal>
              <form
                onSubmit={submit}
                className="rounded-3xl border border-brand-100 bg-white p-7 shadow-xl shadow-brand-900/5 sm:p-9"
              >
                <h2 className="font-display text-xl font-bold text-slate-900">Order details</h2>
                <p className="mt-1 text-sm text-slate-500">Choose a product or request a service quote.</p>

                <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-brand-50/60 p-1.5">
                  {(["product", "service"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setKind(option)}
                      className={cn(
                        "rounded-xl px-4 py-3 text-sm font-semibold capitalize transition-all",
                        kind === option
                          ? "bg-white text-brand-700 shadow-sm"
                          : "text-slate-500 hover:text-brand-600"
                      )}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-5">
                  {kind === "product" ? (
                    <>
                      <label className="block">
                        <span className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">Product</span>
                        <select
                          value={productSlug}
                          onChange={(event) => {
                            setProductSlug(event.target.value);
                            setPlanName("");
                          }}
                          className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                        >
                          {products.map((item) => (
                            <option key={item.slug} value={item.slug}>{item.name}</option>
                          ))}
                        </select>
                      </label>
                      {product?.plans.length ? (
                        <label className="block">
                          <span className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">Plan</span>
                          <select
                            value={selectedPlan?.name || ""}
                            onChange={(event) => setPlanName(event.target.value)}
                            className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                          >
                            {product.plans.map((plan) => (
                              <option key={plan.name} value={plan.name}>{plan.name} · {plan.price}</option>
                            ))}
                          </select>
                        </label>
                      ) : null}
                    </>
                  ) : (
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">Service</span>
                      <select
                        value={serviceSlug}
                        onChange={(event) => setServiceSlug(event.target.value)}
                        className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                      >
                        {services.map((item) => (
                          <option key={item.slug} value={item.slug}>{item.title}</option>
                        ))}
                      </select>
                    </label>
                  )}

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">Payment method</span>
                    <select
                      value={paymentMethod}
                      onChange={(event) => setPaymentMethod(event.target.value)}
                      className="w-full rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                    >
                      {user.paymentMethods.map((method) => (
                        <option key={method.last4} value={`${method.brand} •••• ${method.last4}`}>
                          {method.brand} •••• {method.last4}
                        </option>
                      ))}
                      <option value="Contact me for payment">Contact me for payment</option>
                      <option value="Bank transfer">Bank transfer</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold tracking-wider text-slate-500 uppercase">Notes (optional)</span>
                    <textarea
                      rows={4}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Tell us about your goals, timeline, or special requirements…"
                      className="w-full resize-none rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3.5 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-shine mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-700 via-brand-600 to-sky-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand-500/30 disabled:opacity-60"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {loading ? "Placing order…" : "Place order"}
                </button>
              </form>
            </Reveal>

            <Reveal delay={0.1}>
              <aside className="rounded-3xl border border-brand-100 bg-white p-7 shadow-xl shadow-brand-900/5 sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-sky-400 text-white shadow-lg">
                  {kind === "product" ? <Package className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
                </span>
                <p className="mt-5 text-xs font-semibold tracking-wider text-slate-400 uppercase">Order summary</p>
                <h3 className="font-display mt-2 text-2xl font-bold text-slate-900">{summary.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{summary.detail}</p>
                <div className="mt-6 flex items-center justify-between border-t border-brand-100 pt-5">
                  <span className="text-sm font-semibold text-slate-500">Total</span>
                  <span className="font-display text-2xl font-bold text-gradient-blue">{summary.price}</span>
                </div>
                <div className="mt-6 space-y-3 rounded-2xl bg-brand-50/60 p-5">
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="h-4 w-4 text-brand-500" /> Confirmation to {user.email}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <CreditCard className="h-4 w-4 text-brand-500" /> {paymentMethod}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-brand-500" /> Admin review before processing
                  </p>
                </div>
              </aside>
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}