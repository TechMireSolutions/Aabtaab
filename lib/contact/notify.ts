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

  await resend.emails.send({ from, to, subject, html });
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

/** Resend API preferred; falls back to Gmail SMTP. No-op if EMAIL_TO unset. */
export async function sendContactNotification({
  subject,
  fields,
}: NotifyOptions): Promise<void> {
  const to = env.EMAIL_TO;
  if (!to) return;

  const html = buildContactNotificationHtml(fields);

  if (await sendViaResend(to, subject, html)) return;
  await sendViaSmtp(to, subject, html);
}
