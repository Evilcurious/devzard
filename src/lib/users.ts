
/* ============================== Types ============================== */

export type UserPlan = "free" | "pro" | "business";
export type UserRole = "user" | "admin";

export type PaymentMethod = {
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  holder: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarColor: string;
  createdAt: string;
  lastLogin: string;
  plan: UserPlan;
  role: UserRole;
  phone?: string;
  company?: string;
  country?: string;
  paymentMethods: PaymentMethod[];
  notifications: { product: boolean; marketing: boolean; security: boolean };
  suspended?: boolean;
};

export const ADMIN_EMAIL = "evilcurious6@gmail.com";
export const ADMIN_DEFAULT_PASSWORD = "evil123";

/* ============================== Storage ============================== */

const USERS_KEY = "devzard_users";
const SESSION_KEY = "devzard_session";
const RESET_KEY = "devzard_reset";
const ADMIN_CREDENTIAL_VERSION_KEY = "devzard_admin_credential_version";

const LEGACY_DEMO_EMAILS = new Set([
  "demo@devzard.agency",
  "sarah@glowhaven.com",
  "jake@creator.io",
  "amira@stackline.io",
  "david@fitloop.app",
  "maya@roamly.co",
]);

export function isLegacyDemoEmail(email: string): boolean {
  return LEGACY_DEMO_EMAILS.has(email.trim().toLowerCase());
}

export function obfuscate(pw: string): string {
  try {
    return btoa(unescape(encodeURIComponent(pw)));
  } catch {
    return pw;
  }
}

export function verify(pw: string, hash: string): boolean {
  return obfuscate(pw) === hash;
}

export function uid(prefix = "u"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Fill in any missing fields for users saved by older versions. */
function normalize(raw: any): User {
  return {
    id: raw.id ?? uid(),
    name: raw.name ?? "Unnamed",
    email: (raw.email ?? "").toLowerCase(),
    password: raw.password ?? obfuscate("changeme"),
    avatarColor: raw.avatarColor ?? "from-brand-600 to-sky-400",
    createdAt: raw.createdAt ?? new Date().toISOString(),
    lastLogin: raw.lastLogin ?? new Date().toISOString(),
    plan: raw.plan ?? "free",
    role: raw.role ?? "user",
    phone: raw.phone ?? "",
    company: raw.company ?? "",
    country: raw.country ?? "",
    paymentMethods: Array.isArray(raw.paymentMethods) ? raw.paymentMethods : [],
    notifications: raw.notifications ?? { product: true, marketing: false, security: true },
    suspended: raw.suspended ?? false,
  };
}

export function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as any[]).map(normalize);
  } catch {
    return [];
  }
}

export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSessionId(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function setSessionId(id: string) {
  localStorage.setItem(SESSION_KEY, id);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export type ResetRecord = { email: string; code: string; expiresAt: number };

export function loadResetRecord(): ResetRecord | null {
  try {
    const raw = localStorage.getItem(RESET_KEY);
    return raw ? (JSON.parse(raw) as ResetRecord) : null;
  } catch {
    return null;
  }
}

export function saveResetRecord(rec: ResetRecord) {
  localStorage.setItem(RESET_KEY, JSON.stringify(rec));
}

export function clearResetRecord() {
  localStorage.removeItem(RESET_KEY);
}

/* ============================== Seeding ============================== */

function daysAgo(n: number) {
  return new Date(Date.now() - n * 86400000).toISOString();
}

export function seedUsers(): User[] {
  /* Keep real registrations, purge all old seed accounts, and migrate the
     requested admin credentials exactly once so later password changes stick. */
  const existing = loadUsers();
  const realUsers = existing.filter(
    (u) => u.email !== ADMIN_EMAIL && !isLegacyDemoEmail(u.email)
  );
  const previousAdmin = existing.find((u) => u.email === ADMIN_EMAIL);
  const credentialMigrated =
    localStorage.getItem(ADMIN_CREDENTIAL_VERSION_KEY) === "evil123-v1";

  const admin: User = {
    id: previousAdmin?.id ?? uid("u"),
    name: previousAdmin?.name ?? "DEVZARD Admin",
    email: ADMIN_EMAIL,
    password:
      previousAdmin && credentialMigrated
        ? previousAdmin.password
        : obfuscate(ADMIN_DEFAULT_PASSWORD),
    avatarColor: previousAdmin?.avatarColor ?? "from-violet-600 to-indigo-400",
    createdAt: previousAdmin?.createdAt ?? daysAgo(400),
    lastLogin: previousAdmin?.lastLogin ?? new Date().toISOString(),
    plan: "business",
    role: "admin",
    company: "DEVZARD",
    country: previousAdmin?.country || "Pakistan",
    phone: "03174541414",
    paymentMethods: previousAdmin?.paymentMethods ?? [],
    notifications: previousAdmin?.notifications ?? {
      product: true,
      marketing: true,
      security: true,
    },
    suspended: false,
  };

  localStorage.setItem(ADMIN_CREDENTIAL_VERSION_KEY, "evil123-v1");
  const merged = [admin, ...realUsers];
  saveUsers(merged);
  return merged;
}
