import * as Sentry from "@sentry/nextjs";
import { env } from "@/lib/env";
import type { ContactEmailFields } from "./email-html";
import { buildContactNotificationHtml } from "./email-html";

interface NotifyOptions {
  subject: string;
  fields: ContactEmailFields;
}

async function sendViaResend(
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return false;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const from = env.EMAIL_FROM || "Aabtaab Contact <onboarding@resend.dev>";

  const { error } = await resend.emails.send({ from, to, subject, html });
  if (error) {
    console.error("Resend email failed:", error);
    Sentry.captureException(
      error instanceof Error ? error : new Error(String(error)),
      { tags: { category: "contact_email", channel: "resend" } },
    );
    return false;
  }
  return true;
}

async function sendViaSmtp(
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  const user = env.EMAIL_USER;
  const pass = env.EMAIL_PASS;
  if (!user || !pass) return false;

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Aabtaab Contact" <${user}>`,
    to,
    subject,
    html,
  });
  return true;
}

/**
 * Prefer Resend; fall back to SMTP.
 * Returns true only when a channel accepted the message.
 * Returns false (without throwing) when EMAIL_TO is unset or all channels fail.
 */
export async function sendContactNotification({
  subject,
  fields,
}: NotifyOptions): Promise<boolean> {
  const to = env.EMAIL_TO;
  if (!to) {
    Sentry.captureMessage("Contact notification skipped: EMAIL_TO unset", {
      level: "warning",
      tags: { category: "contact_email" },
    });
    return false;
  }

  const html = buildContactNotificationHtml(fields);

  try {
    if (await sendViaResend(to, subject, html)) return true;
  } catch (error) {
    console.error("Resend threw:", error);
    Sentry.captureException(error, {
      tags: { category: "contact_email", channel: "resend" },
    });
  }

  try {
    if (await sendViaSmtp(to, subject, html)) return true;
  } catch (error) {
    console.error("SMTP threw:", error);
    Sentry.captureException(error, {
      tags: { category: "contact_email", channel: "smtp" },
    });
  }

  Sentry.captureMessage("Contact notification failed on all channels", {
    level: "error",
    tags: { category: "contact_email" },
  });
  return false;
}
