import type { EmailType } from "@/app/api/send-email/route";

interface SendEmailOptions {
  type: EmailType;
  to: string;
  name: string;
  orderId?: string;
  items?: number;
  total?: string;
}

/**
 * Send a transactional email via the /api/send-email route.
 * Fails silently — never throws, so UI never breaks if email fails.
 */
export async function sendEmail(opts: SendEmailOptions): Promise<void> {
  try {
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    });
  } catch (err) {
    console.warn("[email] Failed to send email:", err);
  }
}
