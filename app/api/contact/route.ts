import { createClient } from "@sanity/client";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: "2024-01-01",
  useCdn: false,
});

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const purposeLabel: Record<string, string> = {
  general: "General Inquiry",
  course: "Course Enrollment",
  service: "Service Request",
  other: "Other",
};

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      purpose,
      appliedFor,
      message,
    } = await req.json();

    if (!firstName || !email || !phone || !country || !city || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const fullName = [firstName, lastName].filter(Boolean).join(" ");
    const purposeText = purposeLabel[purpose] || purpose || "General Inquiry";

    // 1. Save to Sanity
    await sanity.create({
      _type: "contactSubmission",
      firstName,
      lastName: lastName || undefined,
      email,
      phone,
      country,
      city,
      purpose: purpose || "general",
      appliedFor: appliedFor || undefined,
      message,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    // 2. Send email notification
    if (
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_TO
    ) {
      await transporter.sendMail({
        from: `"Aabtaab Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        subject: `New ${purposeText}${appliedFor ? ` — ${appliedFor}` : ""} from ${fullName}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
            <div style="background:#0e7490;padding:24px 28px;border-radius:10px 10px 0 0">
              <h2 style="margin:0;color:#fff;font-size:18px">New Contact Form Submission</h2>
            </div>
            <div style="background:#f8fafc;padding:24px 28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px">
              <table style="width:100%;border-collapse:collapse;font-size:14px">
                <tr><td style="padding:8px 0;color:#64748b;width:130px">Name</td>      <td style="padding:8px 0;font-weight:600">${fullName}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">Email</td>     <td style="padding:8px 0"><a href="mailto:${email}" style="color:#0e7490">${email}</a></td></tr>
                <tr><td style="padding:8px 0;color:#64748b">Phone</td>     <td style="padding:8px 0">${phone}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">Country</td>   <td style="padding:8px 0">${country}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">City</td>      <td style="padding:8px 0">${city}</td></tr>
                <tr><td style="padding:8px 0;color:#64748b">Purpose</td>   <td style="padding:8px 0">${purposeText}</td></tr>
                ${appliedFor ? `<tr><td style="padding:8px 0;color:#64748b">Applied For</td><td style="padding:8px 0;font-weight:600;color:#0e7490">${appliedFor}</td></tr>` : ""}
              </table>
              <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e2e8f0;border-radius:8px">
                <p style="margin:0 0 6px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.05em">Message</p>
                <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</p>
              </div>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 },
    );
  }
}
