import type { Metadata } from "next";
import { LegalPage, LegalSection, LegalList } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — SWASTASK",
  description: "How the SWASTASK Application Portal collects, uses and protects your information.",
};

const CONTACT_EMAIL = "support@swastask.com";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="26 July 2026"
      intro="This Privacy Policy explains how the SWASTASK Application Portal collects, uses, stores and protects your personal information when you use our services. By using the Platform, you consent to the practices described below."
    >
      <LegalSection n={1} title="Information We Collect">
        <LegalList
          items={[
            "Account details: full name, email, phone number, username and country.",
            "Personal information: date of birth, gender, nationality, address and national ID or passport number.",
            "Application data: skills, experience, equipment, availability, assessment answers and references.",
            "Documents you upload, such as your ID, CV and certificates.",
            "Payment information processed by our payment provider (we do not store card details).",
          ]}
        />
      </LegalSection>

      <LegalSection n={2} title="How We Use Your Information">
        <LegalList
          items={[
            "To review, assess and process your application.",
            "To calculate and collect the applicable application fee.",
            "To communicate with you about your application status and outcome by email.",
            "To detect and prevent fraud and to keep the Platform secure.",
            "To comply with legal and regulatory obligations.",
          ]}
        />
      </LegalSection>

      <LegalSection n={3} title="Data Security">
        <p>
          We take reasonable technical and organisational measures to protect your information
          against unauthorised access, loss or misuse. Payments are handled securely by Safaricom
          M-Pesa. However, no method of transmission or storage is completely secure, and we cannot
          guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection n={4} title="Cookies and Tracking Technologies">
        <p>
          We use local browser storage and similar technologies to save your application progress,
          remember your preferences (such as light or dark mode) and keep the Platform working
          correctly. You can clear this data through your browser settings, though doing so may erase
          any unsaved application progress.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Third-Party Services">
        <p>
          We rely on trusted third-party services to operate the Platform, including our payment
          provider (Safaricom M-Pesa) and hosting infrastructure. These providers process your information
          only as needed to deliver their services and are bound by their own privacy and security
          obligations.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Your Rights">
        <LegalList
          items={[
            "Access the personal information we hold about you.",
            "Request correction of inaccurate or incomplete information.",
            "Request deletion of your information, subject to legal requirements.",
            "Object to or restrict certain processing of your information.",
            "Withdraw consent where processing is based on consent.",
          ]}
        />
      </LegalSection>

      <LegalSection n={7} title="Data Retention">
        <p>
          We retain your information for as long as necessary to review your application, provide our
          services, and comply with legal, accounting or reporting obligations. When information is no
          longer required, we take reasonable steps to delete or anonymise it.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Children's Privacy">
        <p>
          The Platform is not intended for anyone under the age of 18. We do not knowingly collect
          personal information from children. If we become aware that we have collected information
          from a child, we will delete it promptly.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Policy Updates">
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page
          with a revised “Last updated” date. We encourage you to review this policy periodically.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Contact Information">
        <p>
          If you have any questions about this Privacy Policy or how your information is handled,
          please contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
