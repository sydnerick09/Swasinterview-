import type { Metadata } from "next";
import { LegalPage, LegalSection, LegalList } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions — SWASTASK",
  description: "The terms and conditions governing use of the SWASTASK Application Portal.",
};

const CONTACT_EMAIL = "support@swastask.com";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="26 July 2026"
      intro="These Terms & Conditions govern your access to and use of the SWASTASK Application Portal (the “Platform”). By registering for an account or submitting an application, you agree to be bound by these terms. Please read them carefully."
    >
      <LegalSection n={1} title="User Eligibility">
        <p>
          You must be at least 18 years old (or the age of majority in your country of residence)
          and legally able to enter into a binding contract to use the Platform. By applying, you
          confirm that the information you provide is true, accurate and complete, and that you are
          applying on your own behalf.
        </p>
      </LegalSection>

      <LegalSection n={2} title="Account Registration">
        <p>
          To apply you must create an account with accurate details. You are responsible for
          keeping your login credentials confidential and for all activity that occurs under your
          account. Notify us immediately of any unauthorised use. We may refuse, suspend or remove
          accounts that contain false, duplicate or misleading information.
        </p>
      </LegalSection>

      <LegalSection n={3} title="User Responsibilities">
        <LegalList
          items={[
            "Provide truthful, current and complete information in your application.",
            "Upload only documents that you are authorised to share and that belong to you.",
            "Use the Platform lawfully and refrain from any activity that harms SWASTASK or other users.",
            "Not attempt to interfere with, disrupt or gain unauthorised access to the Platform.",
          ]}
        />
      </LegalSection>

      <LegalSection n={4} title="Task Completion Requirements">
        <p>
          Where you are accepted to work on the SWASTASK platform, you agree to complete assigned
          tasks accurately, honestly and within any stated deadlines. Work must be your own and must
          meet the quality standards communicated to you. Repeated poor quality, missed deadlines or
          dishonest submissions may affect your eligibility for future tasks and payments.
        </p>
      </LegalSection>

      <LegalSection n={5} title="Payment and Withdrawal Policies">
        <p>
          A one-time application fee is charged based on your country of residence and is displayed
          in your local currency before payment. Fees are processed securely through our payment
          provider (Paystack). Application fees are generally non-refundable except where required by
          law. Any rewards or earnings for completed work are paid according to the schedule and
          withdrawal methods communicated to approved applicants.
        </p>
      </LegalSection>

      <LegalSection n={6} title="Fraud Prevention">
        <p>
          We actively monitor for fraudulent activity, including fake identities, duplicate
          accounts, forged documents, chargeback abuse and manipulation of tasks or payments. Any
          suspected fraud may result in immediate suspension, forfeiture of pending rewards and
          referral to the relevant authorities.
        </p>
      </LegalSection>

      <LegalSection n={7} title="Account Suspension and Termination">
        <p>
          We may suspend or terminate your account at any time, with or without notice, if you breach
          these terms, provide false information, engage in fraud, or misuse the Platform. You may
          request closure of your account at any time by contacting us.
        </p>
      </LegalSection>

      <LegalSection n={8} title="Intellectual Property">
        <p>
          All content on the Platform — including the SWASTASK name, logo, text, graphics and
          software — is owned by or licensed to SWASTASK and is protected by intellectual property
          laws. You may not copy, reproduce or distribute any part of the Platform without our prior
          written consent. You retain ownership of the documents you upload but grant us a licence to
          process them for the purpose of reviewing your application.
        </p>
      </LegalSection>

      <LegalSection n={9} title="Limitation of Liability">
        <p>
          The Platform is provided on an “as is” and “as available” basis. To the maximum extent
          permitted by law, SWASTASK is not liable for any indirect, incidental or consequential
          damages, or for any loss of data, profits or opportunity arising from your use of, or
          inability to use, the Platform.
        </p>
      </LegalSection>

      <LegalSection n={10} title="Changes to the Platform">
        <p>
          We may modify, suspend or discontinue any part of the Platform, and may update these terms
          from time to time. Material changes will be posted on this page with a revised “Last
          updated” date. Your continued use of the Platform after changes take effect constitutes
          acceptance of the updated terms.
        </p>
      </LegalSection>

      <LegalSection n={11} title="Governing Law">
        <p>
          These terms are governed by and construed in accordance with the laws of the Republic of
          Kenya, without regard to its conflict-of-law principles. Any disputes shall be subject to
          the exclusive jurisdiction of the courts of Kenya.
        </p>
      </LegalSection>

      <LegalSection n={12} title="Contact Information">
        <p>
          If you have any questions about these Terms & Conditions, please contact us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand-600 hover:underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
