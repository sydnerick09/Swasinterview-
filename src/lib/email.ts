import type { Application } from "./types";
import { formatFee } from "./pricing";

// Email is stubbed for the client-side demo: messages are logged and recorded to
// localStorage (viewable in the admin panel). Swap this module for a real provider
// (Resend, SendGrid, Nodemailer) behind the same interface for production.

export interface EmailMessage {
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}

const OUTBOX_KEY = "swastask:outbox";

export function getOutbox(): EmailMessage[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(OUTBOX_KEY) || "[]");
  } catch {
    return [];
  }
}

export async function sendEmail(message: Omit<EmailMessage, "sentAt">): Promise<void> {
  const full: EmailMessage = { ...message, sentAt: new Date().toISOString() };
  // eslint-disable-next-line no-console
  console.info("[SWASTASK][email] →", full.to, "|", full.subject, "\n", full.body);
  if (typeof window !== "undefined") {
    const outbox = getOutbox();
    outbox.unshift(full);
    window.localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox.slice(0, 100)));
  }
}

export async function sendConfirmationEmail(app: Application): Promise<void> {
  const name = app.personal.fullName || app.account.fullName || "Applicant";
  await sendEmail({
    to: app.account.email || app.personal.email,
    subject: `SWASTASK Application Received — ${app.applicationId}`,
    body: [
      `Dear ${name},`,
      "",
      `Thank you for applying to work on the SWASTASK platform.`,
      "",
      `Your Application ID is: ${app.applicationId}`,
      `Country: ${app.account.country || app.personal.country}`,
      `Application Fee: ${formatFee(app.payment.amount)}`,
      `Payment Status: ${app.payment.paid ? "Paid" : "Awaiting payment"}`,
      "",
      `Your uploaded documents will be reviewed by our recruitment team.`,
      `Any further communication regarding your application will be sent to this email address.`,
      "",
      `Please keep your Application ID safe — you can use it to check your status.`,
      "",
      `Warm regards,`,
      `The SWASTASK Recruitment Team`,
    ].join("\n"),
  });
}

export async function sendDecisionEmail(
  app: Application,
  decision: "approved" | "rejected",
): Promise<void> {
  const name = app.personal.fullName || app.account.fullName || "Applicant";
  const approved = decision === "approved";
  await sendEmail({
    to: app.account.email || app.personal.email,
    subject: `SWASTASK Application ${approved ? "Approved" : "Update"} — ${app.applicationId}`,
    body: [
      `Dear ${name},`,
      "",
      approved
        ? `Congratulations! Your application (${app.applicationId}) has been approved. Our team will contact you shortly with onboarding details.`
        : `Thank you for your interest in SWASTASK. After careful review, we are unable to proceed with your application (${app.applicationId}) at this time.`,
      "",
      `Warm regards,`,
      `The SWASTASK Recruitment Team`,
    ].join("\n"),
  });
}
