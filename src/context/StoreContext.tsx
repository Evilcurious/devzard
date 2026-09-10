import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from "react";
import { services as defaultServices, type Service } from "../data/services";
import { products as defaultProducts, type Product } from "../data/products";
import { generateShades, isValidHex } from "../lib/colors";
import { uid, isLegacyDemoEmail } from "../lib/users";
import { nameOfIcon, getIcon } from "../lib/icons";
import {
  genCode, codeExpiry, sendOrderReceived, sendOrderAccepted, sendOrderCancelled, sendAdminVerify,
  type DeliveryResult,
} from "../lib/email";

/** Make items localStorage-safe by swapping icon components for string keys. */
function toStorable<T extends { icon?: unknown }>(list: T[]) {
  return list.map((item) => ({ ...item, icon: nameOfIcon(item.icon) }));
}

/** Rehydrate icon components from their string keys. */
function fromStorable<T extends { icon?: unknown; slug?: string }>(list: T[]): T[] {
  return list
    .filter((i) => i && typeof i === "object")
    .map((item) => ({ ...item, icon: getIcon(String(item.icon ?? "Package")) })) as T[];
}

/* ============================== Types ============================== */

export type Theme = {
  primary: string;      // hex, becomes brand-600
  accent: string;       // hex, becomes cyan-accent
  dark: string;         // hex, becomes navy-950
  siteName: string;     // "DEV"
  siteNameAccent: string; // "ZARD"
  logoIcon: string;     // emoji
  logoImageUrl: string; // optional image url
  logoGradient: string; // tailwind gradient classes
  fontDisplay: string;  // css family
  fontBody: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
};

export const FONT_OPTIONS = [
  { label: "Space Grotesk", value: '"Space Grotesk", ui-sans-serif, sans-serif' },
  { label: "Poppins", value: '"Poppins", ui-sans-serif, sans-serif' },
  { label: "Sora", value: '"Sora", ui-sans-serif, sans-serif' },
  { label: "Outfit", value: '"Outfit", ui-sans-serif, sans-serif' },
  { label: "Plus Jakarta", value: '"Plus Jakarta Sans", ui-sans-serif, sans-serif' },
];

export const DEFAULT_THEME: Theme = {
  primary: "#2563eb",
  accent: "#22d3ee",
  dark: "#060d20",
  siteName: "DEV",
  siteNameAccent: "ZARD",
  logoIcon: "⚡",
  logoImageUrl: "",
  logoGradient: "from-brand-600 to-sky-400",
  fontDisplay: '"Space Grotesk", ui-sans-serif, sans-serif',
  fontBody: '"Inter", ui-sans-serif, sans-serif',
  tagline: "Full-stack digital agency crafting websites, apps, ad campaigns and content that turn attention into revenue.",
  supportEmail: "devzardpk@gmail.com",
  supportPhone: "03174541414",
};

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "refunded";

export type Order = {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  items: { name: string; qty: number; price: string }[];
  total: string;
  totalNumber: number;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  notes?: string;
};

export type OrderResult = {
  reference: string;
  emailSent: boolean;
  emailError?: string;
};

/* ============================== Storage keys ============================== */

export type Review = {
  id: string;
  authorName: string;
  authorEmail?: string;
  rating: number; // 1..5
  text: string;
  service?: string;
  createdAt: string;
};

export type EditState = {
  overrides: Record<string, string>;
  undoStack: { key: string; previous: string | null }[];
};

export type SiteMode = "light" | "dark";

export type SiteAssets = {
  faviconUrl: string;
  ogImageUrl: string;
  heroImageUrl: string;
  aboutStoryUrl: string;
  teamImages: { founder: string; cofounder: string; ceo: string };
};

export const DEFAULT_ASSETS: SiteAssets = {
  faviconUrl: "",
  ogImageUrl: "",
  heroImageUrl: "",
  aboutStoryUrl: "",
  teamImages: { founder: "", cofounder: "", ceo: "" },
};

export type SiteStat = { value: string; label: string };

export type FloatingCard = { label: string; value: string; sub: string };

export type SiteStats = {
  trustCount: string;      // "120+ clients"
  ratingText: string;      // "4.9/5 average rating"
  hero: SiteStat[];        // homepage bottom strip
  services: SiteStat[];    // services overview hero strip
  products: SiteStat[];    // products overview hero strip
  about: SiteStat[];       // about story cards
  heroVisual: {
    revenueLabel: string;   // "Total Revenue"
    revenueValue: string;   // "$48,920"
    revenueChange: string;  // "+212%"
    roas: FloatingCard;
    youtube: FloatingCard;
    videoEdit: FloatingCard;
  };
};

export const DEFAULT_STATS: SiteStats = {
  trustCount: "120+ clients",
  ratingText: "4.9/5 average rating",
  hero: [
    { value: "250+", label: "Projects delivered" },
    { value: "120+", label: "Happy clients" },
    { value: "15+", label: "Countries served" },
    { value: "98%", label: "Client retention" },
  ],
  services: [
    { value: "10", label: "Services" },
    { value: "250+", label: "Projects shipped" },
    { value: "120+", label: "Happy clients" },
    { value: "15+", label: "Countries" },
  ],
  products: [
    { value: "8,500+", label: "Sites hosted" },
    { value: "12k+", label: "Templates sold" },
    { value: "850+", label: "Brand kits" },
    { value: "99.99%", label: "Uptime" },
  ],
  about: [
    { value: "250+", label: "Projects shipped" },
    { value: "120+", label: "Happy clients" },
    { value: "15+", label: "Countries" },
    { value: "98%", label: "Client retention" },
  ],
  heroVisual: {
    revenueLabel: "Total Revenue",
    revenueValue: "$48,920",
    revenueChange: "+212%",
    roas: { label: "Ad ROAS", value: "+312%", sub: "this month" },
    youtube: { label: "YouTube growth", value: "+1.2K", sub: "subs today" },
    videoEdit: { label: "Video edit", value: "4K render", sub: "complete ✓" },
  },
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  initials: string;
  gradient: string;
  photoUrl: string;
};

export const DEFAULT_TEAM: TeamMember[] = [
  { id: "tm-hadi", name: "Hadi", role: "Founder / CEO", initials: "H", gradient: "from-brand-600 to-sky-400", photoUrl: "" },
  { id: "tm-faizan", name: "Faizan", role: "Co-Founder", initials: "F", gradient: "from-violet-600 to-indigo-400", photoUrl: "" },
  { id: "tm-talha", name: "Talha", role: "Co-Founder", initials: "T", gradient: "from-rose-500 to-pink-400", photoUrl: "" },
];

export type Skill = {
  id: string;
  name: string;
  level: number;
  gradient: string;
  iconName: string;
};

export const DEFAULT_SKILLS: Skill[] = [
  { id: "sk-web", name: "Web Development", level: 95, gradient: "from-brand-600 to-sky-400", iconName: "Code2" },
  { id: "sk-app", name: "App Development", level: 90, gradient: "from-violet-600 to-indigo-400", iconName: "Smartphone" },
  { id: "sk-ui", name: "UI / UX Design", level: 92, gradient: "from-rose-500 to-pink-400", iconName: "Palette" },
  { id: "sk-video", name: "Video Editing", level: 88, gradient: "from-amber-500 to-orange-400", iconName: "Clapperboard" },
  { id: "sk-marketing", name: "Digital Marketing", level: 93, gradient: "from-emerald-500 to-teal-400", iconName: "Megaphone" },
  { id: "sk-seo", name: "SEO & Growth", level: 87, gradient: "from-sky-500 to-cyan-400", iconName: "Search" },
  { id: "sk-content", name: "Content Creation", level: 89, gradient: "from-fuchsia-500 to-purple-400", iconName: "PenTool" },
  { id: "sk-ai", name: "AI Solutions", level: 91, gradient: "from-slate-600 to-slate-400", iconName: "BrainCircuit" },
];

const THEME_KEY = "devzard_theme";
const SERVICES_KEY = "devzard_services";
const PRODUCTS_KEY = "devzard_products";
const ORDERS_KEY = "devzard_orders";
const REVIEWS_KEY = "devzard_reviews";
const EDITS_KEY = "devzard_text_edits";
const EDITMODE_KEY = "devzard_edit_mode";
const SITEMODE_KEY = "devzard_site_mode";
const ASSETS_KEY = "devzard_site_assets";
const STATS_KEY = "devzard_site_stats";
const TEAM_KEY = "devzard_team";
const SKILLS_KEY = "devzard_skills";
const ADMIN_VERIFY_KEY = "devzard_admin_email_verified";
const ADMIN_VERIFY_CODE_KEY = "devzard_admin_verify_code";
const ADMIN_VERIFY_VERSION_KEY = "devzard_admin_email_verify_version";

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

/* ============================== Context ============================== */

type StoreContextType = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resetTheme: () => void;

  services: Service[];
  addService: (s: Partial<Service> & { title: string }) => void;
  updateService: (slug: string, s: Partial<Service>) => void;
  deleteService: (slug: string) => void;
  resetServices: () => void;

  products: Product[];
  addProduct: (p: Partial<Product> & { name: string }) => void;
  updateProduct: (slug: string, p: Partial<Product>) => void;
  deleteProduct: (slug: string) => void;
  resetProducts: () => void;

  orders: Order[];
  addOrder: (o: Omit<Order, "id" | "reference" | "createdAt">) => Promise<OrderResult>;
  updateOrder: (id: string, o: Partial<Order>) => void;
  deleteOrder: (id: string) => void;
  resetOrders: () => void;

  /* admin email verification (proves the website email is real) */
  adminEmailVerified: boolean;
  requestAdminEmailVerify: () => Promise<DeliveryResult>;
  verifyAdminEmail: (code: string) => boolean;
  resetAdminEmailVerification: () => void;

  /* user-submitted reviews */
  reviews: Review[];
  addReview: (r: Omit<Review, "id" | "createdAt">) => Review;
  deleteReview: (id: string) => void;

  /* site-wide text edit mode */
  editMode: boolean;
  setEditMode: (on: boolean) => void;
  textOverrides: Record<string, string>;
  setTextOverride: (key: string, value: string) => void;
  undoTextEdit: () => boolean;
  canUndo: boolean;
  undoCount: number;
  clearTextOverrides: () => void;

  /* dark / light mode for all visitors */
  siteMode: SiteMode;
  setSiteMode: (m: SiteMode) => void;
  toggleSiteMode: () => void;

  /* site images & assets */
  assets: SiteAssets;
  setAssets: (a: Partial<SiteAssets>) => void;
  resetAssets: () => void;

  /* editable homepage stats */
  stats: SiteStats;
  setStats: (s: Partial<SiteStats>) => void;
  resetStats: () => void;

  /* team members (admin-managed) */
  team: TeamMember[];
  addTeamMember: (m: Omit<TeamMember, "id"> & { id?: string }) => void;
  updateTeamMember: (id: string, patch: Partial<TeamMember>) => void;
  deleteTeamMember: (id: string) => void;
  moveTeamMember: (id: string, dir: -1 | 1) => void;
  resetTeam: () => void;

  /* skills (admin-managed) */
  skills: Skill[];
  addSkill: (s: Omit<Skill, "id"> & { id?: string }) => void;
  updateSkill: (id: string, patch: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  resetSkills: () => void;
};

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = load<Partial<Theme>>(THEME_KEY, {});
    return {
      ...DEFAULT_THEME,
      ...stored,
      /* Never allow a saved empty logo segment to make the brand disappear. */
      siteName: stored.siteName?.trim() || DEFAULT_THEME.siteName,
      siteNameAccent:
        stored.siteNameAccent?.trim() || DEFAULT_THEME.siteNameAccent,
      /* Migrate the old placeholder contact details automatically. */
      supportEmail:
        !stored.supportEmail || stored.supportEmail === "hello@devzard.agency"
          ? DEFAULT_THEME.supportEmail
          : stored.supportEmail,
      supportPhone:
        !stored.supportPhone || stored.supportPhone.includes("555")
          ? DEFAULT_THEME.supportPhone
          : stored.supportPhone,
    };
  });
  const [services, setServices] = useState<Service[]>(() => {
    const stored = load<Service[]>(SERVICES_KEY, []);
    return stored.length ? fromStorable<Service>(stored) : defaultServices;
  });
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = load<Product[]>(PRODUCTS_KEY, []);
    return stored.length ? fromStorable<Product>(stored) : defaultProducts;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const existing = load<Order[]>(ORDERS_KEY, []);
    return existing.filter((order) => !isLegacyDemoEmail(order.customerEmail));
  });
  const [reviews, setReviews] = useState<Review[]>(() => load<Review[]>(REVIEWS_KEY, []));
  const [editMode, setEditModeState] = useState<boolean>(() => load<boolean>(EDITMODE_KEY, false));
  const [editState, setEditState] = useState<EditState>(() =>
    load<EditState>(EDITS_KEY, { overrides: {}, undoStack: [] })
  );
  const [siteMode, setSiteModeState] = useState<SiteMode>(() => load<SiteMode>(SITEMODE_KEY, "light"));
  const [assets, setAssetsState] = useState<SiteAssets>(() => ({ ...DEFAULT_ASSETS, ...load<Partial<SiteAssets>>(ASSETS_KEY, {}) }));
  const [stats, setStatsState] = useState<SiteStats>(() => {
    const stored = load<Partial<SiteStats>>(STATS_KEY, {});
    return {
      trustCount: stored.trustCount ?? DEFAULT_STATS.trustCount,
      ratingText: stored.ratingText ?? DEFAULT_STATS.ratingText,
      hero: stored.hero?.length ? stored.hero : DEFAULT_STATS.hero,
      services: stored.services?.length ? stored.services : DEFAULT_STATS.services,
      products: stored.products?.length ? stored.products : DEFAULT_STATS.products,
      about: stored.about?.length ? stored.about : DEFAULT_STATS.about,
      heroVisual: stored.heroVisual ?? DEFAULT_STATS.heroVisual,
    };
  });
  const [team, setTeam] = useState<TeamMember[]>(() => {
    const stored = load<TeamMember[]>(TEAM_KEY, []);
    return stored.length ? stored : DEFAULT_TEAM;
  });
  const [skills, setSkills] = useState<Skill[]>(() => {
    const stored = load<Skill[]>(SKILLS_KEY, []);
    return stored.length ? stored : DEFAULT_SKILLS;
  });

  /* ---- apply theme as CSS variables (Tailwind v4 utilities read these) ---- */
  useEffect(() => {
    const root = document.documentElement;
    const shades = generateShades(theme.primary);
    Object.entries(shades).forEach(([k, v]) => root.style.setProperty(`--color-brand-${k}`, v));
    root.style.setProperty("--color-cyan-accent", theme.accent);
    root.style.setProperty("--color-sky-accent", theme.accent);
    root.style.setProperty("--color-navy-950", theme.dark);
    root.style.setProperty("--color-navy-900", generateShades(theme.dark)["800"]);
    root.style.setProperty("--color-navy-800", generateShades(theme.dark)["700"]);
    root.style.setProperty("--font-display", theme.fontDisplay);
    root.style.setProperty("--font-sans", theme.fontBody);
    save(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => save(SERVICES_KEY, toStorable(services)), [services]);
  useEffect(() => save(PRODUCTS_KEY, toStorable(products)), [products]);
  useEffect(() => save(ORDERS_KEY, orders), [orders]);
  useEffect(() => save(REVIEWS_KEY, reviews), [reviews]);
  useEffect(() => save(EDITMODE_KEY, editMode), [editMode]);
  useEffect(() => save(EDITS_KEY, editState), [editState]);
  useEffect(() => save(SITEMODE_KEY, siteMode), [siteMode]);
  useEffect(() => save(ASSETS_KEY, assets), [assets]);
  useEffect(() => save(STATS_KEY, stats), [stats]);
  useEffect(() => save(TEAM_KEY, team), [team]);
  useEffect(() => save(SKILLS_KEY, skills), [skills]);

  /* ---- dark / light mode ---- */
  useEffect(() => {
    const root = document.documentElement;
    if (siteMode === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [siteMode]);

  /* ---- favicon & OG image ---- */
  useEffect(() => {
    const link = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (link) {
      if (assets.faviconUrl) link.href = assets.faviconUrl;
      else link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%232563eb'/%3E%3Cpath d='M18 18 L32 50 L46 18' stroke='white' stroke-width='6' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";
    }
    let og = document.querySelector('meta[property="og:image"]') as HTMLMetaElement | null;
    if (!og) {
      og = document.createElement("meta");
      og.setAttribute("property", "og:image");
      document.head.appendChild(og);
    }
    if (assets.ogImageUrl) og.setAttribute("content", assets.ogImageUrl);
    else og.removeAttribute("content");
  }, [assets.faviconUrl, assets.ogImageUrl]);

  const setTheme = (t: Theme) => setThemeState(t);
  const resetTheme = () => setThemeState(DEFAULT_THEME);

  const slugify = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  const addService: StoreContextType["addService"] = (s) => {
    const slug = s.slug || slugify(s.title) || uid("s");
    setServices((prev) => [...prev, { ...(s as Service), slug }]);
  };
  const updateService: StoreContextType["updateService"] = (slug, patch) =>
    setServices((prev) =>
      prev.map((s) => {
        if (s.slug !== slug) return s;
        const next = { ...s, ...patch } as Service;
        if (!next.icon || typeof next.icon !== "function") {
          next.icon = getIcon(String((patch as any).iconName ?? nameOfIcon(s.icon)));
        }
        return next;
      })
    );
  const deleteService: StoreContextType["deleteService"] = (slug) =>
    setServices((prev) => prev.filter((s) => s.slug !== slug));
  const resetServices = () => setServices(defaultServices);

  const addProduct: StoreContextType["addProduct"] = (p) => {
    const slug = p.slug || slugify(p.name) || uid("p");
    const existing = products.find((x) => x.slug === slug);
    const resolved = {
      ...existing,
      ...p,
      icon: getIcon(String((p as any).iconName ?? nameOfIcon(existing?.icon))),
    } as Product;
    setProducts((prev) => [...prev, { ...resolved, slug }]);
  };
  const updateProduct: StoreContextType["updateProduct"] = (slug, patch) =>
    setProducts((prev) => prev.map((p) => (p.slug === slug ? { ...p, ...patch } : p)));
  const deleteProduct: StoreContextType["deleteProduct"] = (slug) =>
    setProducts((prev) => prev.filter((p) => p.slug !== slug));
  const resetProducts = () => setProducts(defaultProducts);

  const addOrder: StoreContextType["addOrder"] = async (o) => {
    const ref = `DZ-${Math.floor(100000 + Math.random() * 899999)}`;
    setOrders((prev) => [{ ...o, id: uid("o"), reference: ref, createdAt: new Date().toISOString() }, ...prev]);
    /* email the customer their order confirmation */
    const delivery = await sendOrderReceived(
      o.customerEmail,
      o.customerName,
      ref,
      o.total ?? ""
    );
    return {
      reference: ref,
      emailSent: delivery.success,
      emailError: delivery.error,
    };
  };
  const updateOrder: StoreContextType["updateOrder"] = (id, patch) => {
    /* notify the customer if the order is being accepted or cancelled */
    if (patch.status) {
      const order = orders.find((o) => o.id === id);
      if (order && patch.status !== order.status) {
        if (patch.status === "completed" || patch.status === "processing")
          void sendOrderAccepted(order.customerEmail, order.customerName, order.reference);
        else if (patch.status === "cancelled")
          void sendOrderCancelled(order.customerEmail, order.customerName, order.reference);
      }
    }
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  };
  const deleteOrder: StoreContextType["deleteOrder"] = (id) =>
    setOrders((prev) => prev.filter((o) => o.id !== id));
  const resetOrders = () => setOrders([]);

  /* ---- admin email verification ---- */
  const [adminEmailVerified, setAdminEmailVerified] = useState<boolean>(() =>
    localStorage.getItem(ADMIN_VERIFY_VERSION_KEY) === "emailjs-v1" &&
    load<boolean>(ADMIN_VERIFY_KEY, false)
  );
  const requestAdminEmailVerify: StoreContextType["requestAdminEmailVerify"] = async () => {
    const code = genCode();
    localStorage.setItem(ADMIN_VERIFY_CODE_KEY, JSON.stringify({ code, expiresAt: codeExpiry() }));
    const result = await sendAdminVerify("devzardpk@gmail.com", code);
    if (!result.success) localStorage.removeItem(ADMIN_VERIFY_CODE_KEY);
    return result;
  };
  const verifyAdminEmail: StoreContextType["verifyAdminEmail"] = (code) => {
    try {
      const raw = localStorage.getItem(ADMIN_VERIFY_CODE_KEY);
      if (!raw) return false;
      const rec = JSON.parse(raw) as { code: string; expiresAt: number };
      if (Date.now() > rec.expiresAt) return false;
      if (rec.code !== code.trim()) return false;
      setAdminEmailVerified(true);
      localStorage.setItem(ADMIN_VERIFY_KEY, "true");
      localStorage.setItem(ADMIN_VERIFY_VERSION_KEY, "emailjs-v1");
      localStorage.removeItem(ADMIN_VERIFY_CODE_KEY);
      return true;
    } catch {
      return false;
    }
  };
  const resetAdminEmailVerification = () => {
    setAdminEmailVerified(false);
    localStorage.removeItem(ADMIN_VERIFY_KEY);
    localStorage.removeItem(ADMIN_VERIFY_VERSION_KEY);
    localStorage.removeItem(ADMIN_VERIFY_CODE_KEY);
  };

  /* ---- reviews ---- */
  const addReview: StoreContextType["addReview"] = (r) => {
    const review: Review = { ...r, id: uid("r"), createdAt: new Date().toISOString() };
    setReviews((prev) => [review, ...prev]);
    return review;
  };
  const deleteReview: StoreContextType["deleteReview"] = (id) =>
    setReviews((prev) => prev.filter((r) => r.id !== id));

  /* ---- text edit mode ---- */
  const setEditMode = (on: boolean) => setEditModeState(on);
  const setTextOverride: StoreContextType["setTextOverride"] = (key, value) => {
    setEditState((s) => {
      const previous = s.overrides[key] ?? null;
      if (previous === value) return s;
      return {
        overrides: { ...s.overrides, [key]: value },
        undoStack: [...s.undoStack, { key, previous }],
      };
    });
  };
  const undoTextEdit: StoreContextType["undoTextEdit"] = () => {
    let undone = false;
    setEditState((s) => {
      if (!s.undoStack.length) return s;
      undone = true;
      const last = s.undoStack[s.undoStack.length - 1];
      const overrides = { ...s.overrides };
      if (last.previous === null) delete overrides[last.key];
      else overrides[last.key] = last.previous;
      return { overrides, undoStack: s.undoStack.slice(0, -1) };
    });
    return undone;
  };
  const clearTextOverrides = () => setEditState({ overrides: {}, undoStack: [] });

  /* ---- site mode & assets ---- */
  const setSiteMode: StoreContextType["setSiteMode"] = (m) => setSiteModeState(m);
  const toggleSiteMode = () => setSiteModeState((m) => (m === "dark" ? "light" : "dark"));
  const setAssets: StoreContextType["setAssets"] = (patch) =>
    setAssetsState((prev) => ({ ...prev, ...patch }));
  const resetAssets = () => setAssetsState(DEFAULT_ASSETS);
  const setStats: StoreContextType["setStats"] = (patch) =>
    setStatsState((prev) => ({ ...prev, ...patch }));
  const resetStats = () => setStatsState(DEFAULT_STATS);

  /* ---- team members ---- */
  const addTeamMember: StoreContextType["addTeamMember"] = (m) =>
    setTeam((prev) => [...prev, { ...m, id: m.id || uid("tm") }]);
  const updateTeamMember: StoreContextType["updateTeamMember"] = (id, patch) =>
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  const deleteTeamMember: StoreContextType["deleteTeamMember"] = (id) =>
    setTeam((prev) => prev.filter((m) => m.id !== id));
  const moveTeamMember: StoreContextType["moveTeamMember"] = (id, dir) =>
    setTeam((prev) => {
      const i = prev.findIndex((m) => m.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const resetTeam = () => setTeam(DEFAULT_TEAM);

  /* ---- skills ---- */
  const addSkill: StoreContextType["addSkill"] = (s) =>
    setSkills((prev) => [...prev, { ...s, id: s.id || uid("sk") }]);
  const updateSkill: StoreContextType["updateSkill"] = (id, patch) =>
    setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const deleteSkill: StoreContextType["deleteSkill"] = (id) =>
    setSkills((prev) => prev.filter((s) => s.id !== id));
  const resetSkills = () => setSkills(DEFAULT_SKILLS);

  return (
    <StoreContext.Provider
      value={{
        theme: isValidHex(theme.primary) ? theme : DEFAULT_THEME,
        setTheme, resetTheme,
        services, addService, updateService, deleteService, resetServices,
        products, addProduct, updateProduct, deleteProduct, resetProducts,
        orders, addOrder, updateOrder, deleteOrder, resetOrders,

        reviews, addReview, deleteReview,

        editMode, setEditMode,
        textOverrides: editState.overrides,
        setTextOverride,
        undoTextEdit,
        canUndo: editState.undoStack.length > 0,
        undoCount: editState.undoStack.length,
        clearTextOverrides,

        siteMode, setSiteMode, toggleSiteMode,
        assets, setAssets, resetAssets,
        stats, setStats, resetStats,
        team, addTeamMember, updateTeamMember, deleteTeamMember, moveTeamMember, resetTeam,
        skills, addSkill, updateSkill, deleteSkill, resetSkills,
        adminEmailVerified,
        requestAdminEmailVerify,
        verifyAdminEmail,
        resetAdminEmailVerification,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): StoreContextType {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
