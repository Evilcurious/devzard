/*
 * Browser email delivery through EmailJS's official REST API.
 *
 * EmailJS uses a public browser key, service ID, and template ID. The Gmail
 * account itself is connected inside EmailJS, so no Gmail password is ever
 * stored in this app. Configure and test the connection from Admin > Dashboard.
 *
 * Required EmailJS template variables:
 *   {{to_email}}, {{to_name}}, {{subject}}, {{message}}, {{reply_to}},
 *   {{from_name}}, {{verification_code}}
 */

export type EmailKind =
  | "verify_signup"
  | "password_reset"
  | "order_received"
  | "order_accepted"
  | "order_cancelled"
  | "admin_verify"
  | "test";

export type DeliveryStatus = "sending" | "sent" | "failed" | "not_configured";

export type SentEmail = {
  id: string;
  to: string;
  toName?: string;
  subject: string;
  body: string;
  kind: EmailKind;
  code?: string;
  createdAt: string;
  status: DeliveryStatus;
  error?: string;
};

export type EmailConfig = {
  serviceId: string;
  templateId: string;
  publicKey: string;
  fromName: string;
  replyTo: string;
  previewCodes: boolean;
};

export type DeliveryResult = {
  success: boolean;
  configured: boolean;
  error?: string;
  previewCode?: string;
};

const SENT_KEY = "devzard_sent_emails";
const CONFIG_KEY = "devzard_email_config";

export const WEBSITE_EMAIL = "devzardpk@gmail.com";
export const WEBSITE_PHONE = "03174541414";

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  serviceId: "",
  templateId: "",
  publicKey: "",
  fromName: "DEVZARD",
  replyTo: WEBSITE_EMAIL,
  previewCodes: false,
};

export function genCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function codeExpiry(): number {
  return Date.now() + 10 * 60 * 1000;
}

export function loadEmailConfig(): EmailConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    return raw
      ? { ...DEFAULT_EMAIL_CONFIG, ...(JSON.parse(raw) as Partial<EmailConfig>) }
      : DEFAULT_EMAIL_CONFIG;
  } catch {
    return DEFAULT_EMAIL_CONFIG;
  }
}

export function saveEmailConfig(config: EmailConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

export function isEmailConfigured(config = loadEmailConfig()): boolean {
  return Boolean(
    config.serviceId.trim() &&
      config.templateId.trim() &&
      config.publicKey.trim()
  );
}

export function loadSentEmails(): SentEmail[] {
  try {
    const raw = localStorage.getItem(SENT_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as SentEmail[]).map((email) => ({
      ...email,
      status: email.status ?? "sent",
    }));
  } catch {
    return [];
  }
}

export function saveSentEmails(list: SentEmail[]): void {
  localStorage.setItem(SENT_KEY, JSON.stringify(list.slice(0, 200)));
}

export function clearSentEmails(): void {
  localStorage.removeItem(SENT_KEY);
}

function updateLoggedEmail(id: string, patch: Partial<SentEmail>): void {
  saveSentEmails(
    loadSentEmails().map((email) =>
      email.id === id ? { ...email, ...patch } : email
    )
  );
}

function readableError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Email provider rejected the request.";
}

async function deliver(
  input: Omit<SentEmail, "id" | "createdAt" | "status" | "error">
): Promise<DeliveryResult> {
  const config = loadEmailConfig();
  const email: SentEmail = {
    ...input,
    id: `em_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: isEmailConfigured(config) ? "sending" : "not_configured",
  };
  saveSentEmails([email, ...loadSentEmails()]);

  if (!isEmailConfigured(config)) {
    const error =
      "Email delivery is not configured. Add the EmailJS service ID, template ID, and public key in the admin panel.";
    updateLoggedEmail(email.id, { status: "not_configured", error });
    return {
      success: false,
      configured: false,
      error,
      previewCode: config.previewCodes ? input.code : undefined,
    };
  }

  try {
    const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: config.serviceId.trim(),
        template_id: config.templateId.trim(),
        user_id: config.publicKey.trim(),
        template_params: {
          to_email: input.to,
          to_name: input.toName || input.to,
          subject: input.subject,
          message: input.body,
          reply_to: config.replyTo || WEBSITE_EMAIL,
          from_name: config.fromName || "DEVZARD",
          verification_code: input.code || "",
          email_kind: input.kind,
        },
      }),
    });

    if (!response.ok) {
      const detail = (await response.text()).trim();
      throw new Error(detail || `EmailJS returned ${response.status}.`);
    }

    updateLoggedEmail(email.id, { status: "sent", error: undefined });
    return {
      success: true,
      configured: true,
      previewCode: config.previewCodes ? input.code : undefined,
    };
  } catch (error) {
    const message = readableError(error);
    updateLoggedEmail(email.id, { status: "failed", error: message });
    return {
      success: false,
      configured: true,
      error: message,
      previewCode: config.previewCodes ? input.code : undefined,
    };
  }
}

export function sendSignupVerify(to: string, name: string, code: string) {
  return deliver({
    to,
    toName: name,
    subject: "Your DEVZARD verification code",
    body: `Hi ${name}, your DEVZARD verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`,
    kind: "verify_signup",
    code,
  });
}

export function sendPasswordReset(to: string, name: string, code: string) {
  return deliver({
    to,
    toName: name,
    subject: "Reset your DEVZARD password",
    body: `Hi ${name}, your password reset code is ${code}. It expires in 15 minutes. If you did not request this, ignore this email.`,
    kind: "password_reset",
    code,
  });
}

export function sendAdminVerify(to: string, code: string) {
  return deliver({
    to,
    toName: "DEVZARD Admin",
    subject: "DEVZARD email delivery verification",
    body: `Your DEVZARD email verification code is ${code}. Enter it in the admin panel within 10 minutes.`,
    kind: "admin_verify",
    code,
  });
}

export function sendTestEmail(to = WEBSITE_EMAIL) {
  return deliver({
    to,
    toName: "DEVZARD Admin",
    subject: "DEVZARD test email",
    body: "Email delivery is configured correctly. Signup and order notifications can now be sent through this provider.",
    kind: "test",
  });
}

export function sendOrderReceived(
  to: string,
  name: string,
  reference: string,
  total: string
) {
  return deliver({
    to,
    toName: name,
    subject: `Order received · ${reference}`,
    body: `Thanks ${name}! We received your order ${reference} (${total}). Our team will review it shortly and you will receive another email when it is accepted or cancelled.`,
    kind: "order_received",
  });
}

export function sendOrderAccepted(to: string, name: string, reference: string) {
  return deliver({
    to,
    toName: name,
    subject: `Order accepted · ${reference}`,
    body: `Great news ${name}! Your order ${reference} has been accepted and is now in progress. We will keep you updated.`,
    kind: "order_accepted",
  });
}

export function sendOrderCancelled(to: string, name: string, reference: string) {
  return deliver({
    to,
    toName: name,
    subject: `Order cancelled · ${reference}`,
    body: `Hi ${name}, your order ${reference} has been cancelled. Contact ${WEBSITE_EMAIL} or ${WEBSITE_PHONE} if you need help.`,
    kind: "order_cancelled",
  });
}