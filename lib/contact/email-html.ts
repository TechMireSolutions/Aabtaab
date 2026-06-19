/** Escape user input before embedding in HTML email bodies */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface ContactEmailFields {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  purposeText: string;
  appliedFor?: string;
  message: string;
}

export function buildContactNotificationHtml(
  fields: ContactEmailFields,
): string {
  const {
    fullName,
    email,
    phone,
    country,
    city,
    purposeText,
    appliedFor,
    message,
  } = fields;

  const safeName = escapeHtml(fullName);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeCountry = escapeHtml(country);
  const safeCity = escapeHtml(city);
  const safePurpose = escapeHtml(purposeText);
  const safeAppliedFor = appliedFor ? escapeHtml(appliedFor) : "";
  const safeMessage = escapeHtml(message);

  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1e293b">
      <div style="background:#0e7490;padding:24px 28px;border-radius:10px 10px 0 0">
        <h2 style="margin:0;color:#fff;font-size:18px">New Contact Form Submission</h2>
      </div>
      <div style="background:#f8fafc;padding:24px 28px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 10px 10px">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#64748b;width:130px">Name</td>      <td style="padding:8px 0;font-weight:600">${safeName}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Email</td>     <td style="padding:8px 0"><a href="mailto:${safeEmail}" style="color:#0e7490">${safeEmail}</a></td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Phone</td>     <td style="padding:8px 0">${safePhone}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Country</td>   <td style="padding:8px 0">${safeCountry}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">City</td>      <td style="padding:8px 0">${safeCity}</td></tr>
          <tr><td style="padding:8px 0;color:#64748b">Purpose</td>   <td style="padding:8px 0">${safePurpose}</td></tr>
          ${safeAppliedFor ? `<tr><td style="padding:8px 0;color:#64748b">Applied For</td><td style="padding:8px 0;font-weight:600;color:#0e7490">${safeAppliedFor}</td></tr>` : ""}
        </table>
        <div style="margin-top:16px;padding:16px;background:#fff;border:1px solid #e2e8f0;border-radius:8px">
          <p style="margin:0 0 6px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:.05em">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">${safeMessage}</p>
        </div>
      </div>
    </div>
  `;
}
