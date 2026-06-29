import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { readSettings } from "@/lib/serverData";

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_FROM = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export type EmailType =
  | "welcome"
  | "login_success"
  | "order_confirmed"
  | "order_in_progress"
  | "order_completed"
  | "order_shipped"
  | "order_delivered";

interface EmailPayload {
  type: EmailType;
  to: string;
  name: string;
  orderId?: string;
  items?: number;
  total?: string;
}

function getEmailContent(payload: EmailPayload): { subject: string; html: string } {
  const { type, name, orderId, items, total } = payload;

  const base = (title: string, body: string, cta?: { text: string; href: string }) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f4;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#78350f;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#fef3c7;font-size:24px;font-weight:bold;letter-spacing:1px;">Paint by Mahi</h1>
            <p style="margin:6px 0 0;color:#fcd34d;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Fine Art Gallery</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 40px 32px;">
            <h2 style="margin:0 0 16px;color:#1c1917;font-size:22px;">${title}</h2>
            <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">Dear ${name},</p>
            ${body}
            ${cta ? `
            <div style="text-align:center;margin:32px 0;">
              <a href="${cta.href}" style="display:inline-block;background:#92400e;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:bold;">${cta.text}</a>
            </div>` : ""}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f5f5f4;padding:24px 40px;text-align:center;border-top:1px solid #e7e5e4;">
            <p style="margin:0;color:#a8a29e;font-size:13px;">Paint by Mahi · Lahore, Pakistan</p>
            <p style="margin:6px 0 0;color:#a8a29e;font-size:12px;">You received this email because you have an account with us.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  switch (type) {
    case "welcome":
      return {
        subject: "Welcome to Paint by Mahi!",
        html: base(
          "Welcome to Paint by Mahi!",
          `<p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            Thank you for creating an account. You now have access to your wishlist,
            order history, and a faster checkout experience.
          </p>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            Browse our gallery of original handmade paintings, Islamic calligraphy,
            custom portraits, and more — each crafted with passion.
          </p>`,
          { text: "Explore the Gallery", href: `${SITE}/gallery` }
        ),
      };

    case "login_success":
      return {
        subject: "Login Successful — Welcome Back!",
        html: base(
          "Login Successful",
          `<p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            Hi ${name},
          </p>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            You have successfully logged in to Paint by Mahi.
            You can continue browsing artwork, manage your wishlist, and place new orders.
          </p>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            If this wasn’t you, please contact us immediately.
          </p>`
        ),
      };

    case "order_confirmed":
      return {
        subject: `Order Confirmed – ${orderId}`,
        html: base(
          "Your Order is Confirmed!",
          `<p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            We have received your order and Mahi will begin working on it soon.
          </p>
          <table width="100%" style="background:#fef3c7;border-radius:8px;padding:16px;margin:16px 0;">
            <tr><td style="color:#92400e;font-size:14px;padding:4px 0;">
              <strong>Order ID:</strong> ${orderId}<br>
              <strong>Items:</strong> ${items}<br>
              <strong>Total:</strong> ${total}
            </td></tr>
          </table>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            You will receive updates as your order progresses. For any questions,
            reply to this email or contact us on WhatsApp.
          </p>`,
          { text: "View Your Order", href: `${SITE}/cart` }
        ),
      };

    case "order_in_progress":
      return {
        subject: `Your Artwork is Being Created – ${orderId}`,
        html: base(
          "Mahi is Working on Your Art!",
          `<p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            Great news! Your order <strong>${orderId}</strong> is now in progress.
            Mahi has started creating your artwork and is putting in every care and detail.
          </p>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            We will notify you again when it is ready for shipping.
          </p>`
        ),
      };

    case "order_completed":
      return {
        subject: `Your Artwork is Ready! – ${orderId}`,
        html: base(
          "Your Artwork is Complete!",
          `<p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            Your artwork for order <strong>${orderId}</strong> has been completed and
            is being carefully packaged for delivery.
          </p>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            It will be dispatched very soon. We will send you the tracking details
            once it is on its way.
          </p>`
        ),
      };

    case "order_shipped":
      return {
        subject: `Your Order is On Its Way! – ${orderId}`,
        html: base(
          "Your Order Has Been Shipped!",
          `<p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            Exciting news! Your order <strong>${orderId}</strong> has been dispatched
            and is on its way to you.
          </p>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            Please allow 3–7 business days for delivery within Pakistan.
            International orders may take longer.
          </p>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            If you have any questions, reply to this email or contact Mahi directly.
          </p>`
        ),
      };

    case "order_delivered":
      return {
        subject: `Order Delivered – We Hope You Love It! – ${orderId}`,
        html: base(
          "Your Artwork Has Been Delivered!",
          `<p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            Your order <strong>${orderId}</strong> has been marked as delivered.
            We hope you absolutely love your new artwork!
          </p>
          <p style="margin:0 0 12px;color:#57534e;font-size:15px;line-height:1.7;">
            If you are happy with your purchase, we would love if you shared a photo
            or left a review — it means the world to Mahi.
          </p>`,
          { text: "Browse More Art", href: `${SITE}/gallery` }
        ),
      };

    default:
      return { subject: "Update from Paint by Mahi", html: base("Update", "<p>Thank you.</p>") };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as EmailPayload;

    if (!body.to || !body.type || !body.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Don't crash if API key not set yet
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your_api_key_here") {
      console.warn("[Email] RESEND_API_KEY not configured — skipping send");
      return NextResponse.json({ ok: true, skipped: true });
    }

    const { subject, html } = getEmailContent(body);
    const settings = await readSettings();
    const fromAddress = settings.contactEmail || DEFAULT_FROM;
    const replyToAddress = settings.contactEmail || DEFAULT_FROM;

    const { error } = await resend.emails.send({
      from: `Paint by Mahi <${fromAddress}>`,
      to: body.to,
      replyTo: replyToAddress,
      subject,
      html,
    });

    if (error) {
      console.error("[Email] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[Email] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
