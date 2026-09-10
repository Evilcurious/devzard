import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  loadUsers, saveUsers, getSessionId, setSessionId, clearSession,
  loadResetRecord, saveResetRecord, clearResetRecord,
  obfuscate, verify, uid, seedUsers,
  ADMIN_EMAIL, type User, type PaymentMethod,
} from "../lib/users";
import {
  genCode,
  codeExpiry,
  sendSignupVerify,
  sendPasswordReset,
  loadEmailConfig,
} from "../lib/email";
import { AVATAR_COLORS } from "./presets";

type AuthResult = { success: boolean; error?: string };

type PendingSignup = {
  name: string;
  email: string;
  passwordHash: string;
  code: string;
  expiresAt: number;
};

export type CodeToast = {
  title: string;
  message: string;
  code?: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => AuthResult;
  requestSignup: (name: string, email: string, password: string) => Promise<AuthResult>;
  verifySignup: (email: string, code: string) => AuthResult;
  resendSignupCode: (email: string) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (updates: Partial<Pick<User, "name" | "email" | "avatarColor" | "phone" | "company" | "country">>) => AuthResult;
  changePassword: (current: string, next: string) => AuthResult;
  requestReset: (email: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  resetPassword: (email: string, code: string, next: string) => AuthResult;
  updateNotifications: (updates: Partial<User["notifications"]>) => void;
  addPaymentMethod: (pm: Omit<PaymentMethod, "last4"> & { number: string }) => AuthResult;
  removePaymentMethod: (last4: string) => void;
  deleteAccount: () => void;
  isAdmin: boolean;
  /* persistent code toast (stays until dismissed) */
  toast: CodeToast | null;
  dismissToast: () => void;
};

const SIGNUP_KEY = "devzard_signup_pending";

function loadPendingSignup(): PendingSignup | null {
  try {
    const raw = localStorage.getItem(SIGNUP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePendingSignup(p: PendingSignup | null) {
  if (!p) localStorage.removeItem(SIGNUP_KEY);
  else localStorage.setItem(SIGNUP_KEY, JSON.stringify(p));
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    seedUsers();
    const id = getSessionId();
    if (!id) return;
    const found = loadUsers().find((u) => u.id === id);
    if (found) {
      if (found.suspended) {
        clearSession();
        return;
      }
      const updated = { ...found, lastLogin: new Date().toISOString() };
      saveUsers(loadUsers().map((u) => (u.id === found.id ? updated : u)));
      setUser(updated);
    } else {
      clearSession();
    }
  }, []);

  const login: AuthContextType["login"] = (email, password) => {
    const normalized = email.trim().toLowerCase();
    const found = loadUsers().find((u) => u.email === normalized);
    if (!found) return { success: false, error: "No account found with that email." };
    if (found.suspended) return { success: false, error: "This account has been suspended. Contact support." };
    if (!verify(password, found.password)) return { success: false, error: "Incorrect password. Please try again." };
    const updated = { ...found, lastLogin: new Date().toISOString() };
    saveUsers(loadUsers().map((u) => (u.id === found.id ? updated : u)));
    setSessionId(found.id);
    setUser(updated);
    return { success: true };
  };

  const [toast, setToast] = useState<CodeToast | null>(null);
  const dismissToast = () => setToast(null);

  /* ---------- signup with email verification ---------- */
  const requestSignup: AuthContextType["requestSignup"] = async (
    name,
    email,
    password
  ) => {
    const normalized = email.trim().toLowerCase();
    if (loadUsers().some((u) => u.email === normalized))
      return { success: false, error: "An account with this email already exists. Please sign in." };
    const code = genCode();
    const pending = {
      name: name.trim(),
      email: normalized,
      passwordHash: obfuscate(password),
      code,
      expiresAt: codeExpiry(),
    };
    savePendingSignup(pending);
    const delivery = await sendSignupVerify(normalized, name.trim(), code);
    if (!delivery.success) {
      savePendingSignup(null);
      return {
        success: false,
        error:
          delivery.error ||
          "We could not send the verification email. Please try again.",
      };
    }
    setToast({
      title: "Verification email sent",
      message: `A 6-digit code was sent to ${normalized} from the DEVZARD email service. Check your inbox and spam folder.`,
      code: delivery.previewCode,
      email: normalized,
    });
    return { success: true };
  };

  const verifySignup: AuthContextType["verifySignup"] = (email, code) => {
    const normalized = email.trim().toLowerCase();
    const pending = loadPendingSignup();
    if (!pending || pending.email !== normalized)
      return { success: false, error: "No pending signup for that email. Start over." };
    if (Date.now() > pending.expiresAt) return { success: false, error: "The code has expired. Request a new one." };
    if (pending.code !== code.trim()) return { success: false, error: "Incorrect code — check your email and try again." };

    const users = loadUsers();
    if (users.some((u) => u.email === normalized))
      return { success: false, error: "An account with this email already exists. Please sign in." };

    const newUser: User = {
      id: uid(),
      name: pending.name,
      email: normalized,
      password: pending.passwordHash,
      avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      plan: "free",
      role: "user",
      phone: "",
      company: "",
      country: "",
      paymentMethods: [],
      notifications: { product: true, marketing: false, security: true },
    };
    saveUsers([...users, newUser]);
    savePendingSignup(null);
    setSessionId(newUser.id);
    setUser(newUser);
    setToast(null);
    return { success: true };
  };

  const resendSignupCode: AuthContextType["resendSignupCode"] = async (email) => {
    const normalized = email.trim().toLowerCase();
    const pending = loadPendingSignup();
    if (!pending || pending.email !== normalized)
      return { success: false, error: "No pending signup for that email." };
    const code = genCode();
    const refreshed = { ...pending, code, expiresAt: codeExpiry() };
    savePendingSignup(refreshed);
    const delivery = await sendSignupVerify(normalized, pending.name, code);
    if (!delivery.success) {
      return {
        success: false,
        error: delivery.error || "We could not resend the code.",
      };
    }
    setToast({
      title: "New code sent",
      message: `A fresh 6-digit code was sent to ${normalized}.`,
      code: delivery.previewCode,
      email: normalized,
    });
    return { success: true };
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const persist = (updated: User) => {
    saveUsers(loadUsers().map((u) => (u.id === updated.id ? updated : u)));
    setUser(updated);
  };

  const updateProfile: AuthContextType["updateProfile"] = (updates) => {
    if (!user) return { success: false, error: "Not signed in." };
    const next = { ...user, ...updates };
    if (updates.email !== undefined) {
      const normalized = updates.email.trim().toLowerCase();
      if (loadUsers().some((u) => u.email === normalized && u.id !== user.id))
        return { success: false, error: "That email is already in use by another account." };
      next.email = normalized;
    }
    persist(next);
    return { success: true };
  };

  const changePassword: AuthContextType["changePassword"] = (current, next) => {
    if (!user) return { success: false, error: "Not signed in." };
    if (!verify(current, user.password)) return { success: false, error: "Your current password is incorrect." };
    persist({ ...user, password: obfuscate(next) });
    return { success: true };
  };

  const requestReset: AuthContextType["requestReset"] = async (email) => {
    const normalized = email.trim().toLowerCase();
    const found = loadUsers().find((u) => u.email === normalized);
    if (!found) return { success: false, error: "No account found with that email." };
    const code = genCode();
    saveResetRecord({ email: normalized, code, expiresAt: Date.now() + 15 * 60 * 1000 });
    const delivery = await sendPasswordReset(normalized, found.name, code);
    if (!delivery.success) {
      clearResetRecord();
      return {
        success: false,
        error: delivery.error || "We could not send the reset email.",
      };
    }
    return {
      success: true,
      code: loadEmailConfig().previewCodes ? code : undefined,
    };
  };

  const resetPassword: AuthContextType["resetPassword"] = (email, code, next) => {
    const normalized = email.trim().toLowerCase();
    const rec = loadResetRecord();
    if (!rec) return { success: false, error: "No reset request found. Please request a new code." };
    if (rec.email !== normalized) return { success: false, error: "This code was not requested for that email." };
    if (Date.now() > rec.expiresAt) return { success: false, error: "This code has expired. Please request a new one." };
    if (rec.code !== code.trim()) return { success: false, error: "Incorrect reset code. Please check and try again." };
    const found = loadUsers().find((u) => u.email === normalized);
    if (!found) return { success: false, error: "No account found with that email." };
    persist({ ...found, password: obfuscate(next) });
    clearResetRecord();
    return { success: true };
  };

  const updateNotifications: AuthContextType["updateNotifications"] = (updates) => {
    if (!user) return;
    persist({ ...user, notifications: { ...user.notifications, ...updates } });
  };

  const addPaymentMethod: AuthContextType["addPaymentMethod"] = (pm) => {
    if (!user) return { success: false, error: "Not signed in." };
    const digits = pm.number.replace(/\D/g, "");
    if (digits.length < 12) return { success: false, error: "Please enter a valid card number." };
    const method: PaymentMethod = {
      brand: pm.brand,
      last4: digits.slice(-4),
      expMonth: pm.expMonth,
      expYear: pm.expYear,
      holder: pm.holder,
    };
    persist({ ...user, paymentMethods: [...user.paymentMethods, method] });
    return { success: true };
  };

  const removePaymentMethod: AuthContextType["removePaymentMethod"] = (last4) => {
    if (!user) return;
    persist({ ...user, paymentMethods: user.paymentMethods.filter((p) => p.last4 !== last4) });
  };

  const deleteAccount = () => {
    if (!user) return;
    saveUsers(loadUsers().filter((u) => u.id !== user.id));
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, login,
        requestSignup, verifySignup, resendSignupCode,
        logout, updateProfile, changePassword,
        requestReset, resetPassword, updateNotifications,
        addPaymentMethod, removePaymentMethod, deleteAccount,
        isAdmin: user?.email === ADMIN_EMAIL || user?.role === "admin",
        toast, dismissToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AVATAR_COLORS } from "./presets";

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
