
/* ============================== Types ============================== */

export type UserPlan = "free" | "pro" | "business";
export type StaffRole = "creator" | "it_ceo" | "bd_ceo" | "hr" | "it_staff" | "bd_staff" | "staff" | "admin" | "user";
export type Department = "IT" | "BD" | "HR" | "ALL" | "GENERAL";
export type UserRole = StaffRole;

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
  department?: Department;
  staffId?: string;
  jobTitle?: string;
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
    role: (raw.role ?? "user") as UserRole,
    department: raw.department ?? "ALL",
    staffId: raw.staffId ?? "",
    jobTitle: raw.jobTitle ?? "",
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

/* ======== Staff roles helpers ======== */

export const STAFF_ROLES: { value: StaffRole; label: string; desc: string }[] = [
  { value: "creator", label: "Creator (Owner)", desc: "Full control — can make anyone CEO/HR" },
  { value: "it_ceo", label: "IT CEO", desc: "Manages IT team + assigns IT work" },
  { value: "bd_ceo", label: "BD CEO", desc: "Manages BD team + assigns BD work" },
  { value: "hr", label: "HR Manager", desc: "Punishments, policy & leave approvals" },
  { value: "it_staff", label: "IT Staff", desc: "IT team member" },
  { value: "bd_staff", label: "BD Staff", desc: "BD team member" },
  { value: "staff", label: "Staff", desc: "General staff (no team)" },
  { value: "admin", label: "Admin", desc: "Legacy admin (same as creator)" },
  { value: "user", label: "User", desc: "Website client (no staff access)" },
];

export function isCreator(user: User | null): boolean {
  return !!user && (user.role === "creator" || user.email === ADMIN_EMAIL);
}
export function isITCEO(user: User | null): boolean {
  return !!user && (user.role === "it_ceo" || isCreator(user));
}
export function isBDCEO(user: User | null): boolean {
  return !!user && (user.role === "bd_ceo" || isCreator(user));
}
export function isHR(user: User | null): boolean {
  return !!user && (user.role === "hr" || isCreator(user));
}
export function isStaffMember(user: User | null): boolean {
  if (!user) return false;
  return ["creator","it_ceo","bd_ceo","hr","it_staff","bd_staff","staff","admin"].includes(user.role);
}
export function canManageRole(actor: User | null, targetRole: StaffRole): boolean {
  if (!actor) return false;
  if (isCreator(actor)) return true;
  if (actor.role === "it_ceo" && (targetRole === "it_staff" || targetRole === "staff")) return true;
  if (actor.role === "bd_ceo" && (targetRole === "bd_staff" || targetRole === "staff")) return true;
  if (actor.role === "hr" && targetRole === "staff") return false;
  return false;
}
export function roleLabel(role: StaffRole): string {
  return STAFF_ROLES.find(r=>r.value===role)?.label || role;
}
export function roleDepartment(role: StaffRole): Department {
  if (role === "it_ceo" || role === "it_staff") return "IT";
  if (role === "bd_ceo" || role === "bd_staff") return "BD";
  if (role === "hr") return "HR";
  return "ALL";
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
    name: previousAdmin?.name ?? "DEVZARD Creator",
    email: ADMIN_EMAIL,
    password:
      previousAdmin && credentialMigrated
        ? previousAdmin.password
        : obfuscate(ADMIN_DEFAULT_PASSWORD),
    avatarColor: previousAdmin?.avatarColor ?? "from-zinc-900 to-zinc-700",
    createdAt: previousAdmin?.createdAt ?? daysAgo(400),
    lastLogin: previousAdmin?.lastLogin ?? new Date().toISOString(),
    plan: "business",
    role: (previousAdmin?.role as UserRole) ?? "creator",
    department: previousAdmin?.department ?? "ALL",
    staffId: previousAdmin?.staffId ?? "DZ-001",
    jobTitle: previousAdmin?.jobTitle ?? "Founder & CEO",
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
