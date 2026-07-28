import LegalPageShell, {
  LegalSection,
  legalSiteName,
} from "@/components/layout/LegalPageShell";
import { DEFAULT_SITE_NAME } from "@/lib/constants";

export const metadata = {
  title: "Terms & Conditions",
  description: `Terms and Conditions for using ${DEFAULT_SITE_NAME} services`,
};

export default function TermsOfServicePage() {
  const site = legalSiteName();

  return (
    <LegalPageShell
      title="Terms & Conditions"
      subtitle="Please read these terms carefully before using our services"
    >
      <p className="text-base-plus leading-relaxed text-slate-600 dark:text-slate-400">
        Welcome to {site}. By accessing our website and using our services, you
        agree to comply with and be bound by the following terms and conditions.
      </p>

      <LegalSection heading="1. Acceptance of Terms">
        By using our educational platforms, requesting religious services, or
        participating in our community programs, you acknowledge that you have
        read, understood, and agreed to these terms.
      </LegalSection>

      <LegalSection heading="2. Religious Services">
        Services such as Zakat, Khums, Niyabat Ziarat, and Aqiqa are fulfilled by
        qualified scholars and representatives with the utmost sincerity and
        adherence to Islamic jurisprudence (Fiqh). However, we act as
        facilitators in these spiritual matters.
      </LegalSection>

      <LegalSection heading="3. Educational Content">
        All courses, articles, and educational materials provided on {site} are
        intended for the dissemination of knowledge in accordance with the
        teachings of Ahlul Bayt (A.S.). They may not be reproduced or distributed
        for commercial purposes without prior consent.
      </LegalSection>

      <LegalSection heading="4. User Conduct">
        Users are expected to maintain respectful behavior when participating in
        courses, events, or communicating with scholars and other members of the
        community.
      </LegalSection>

      <LegalSection heading="5. Modifications">
        {site} reserves the right to modify or replace these Terms & Conditions
        at any time. Continued use of our services constitutes acceptance of the
        new terms.
      </LegalSection>
    </LegalPageShell>
  );
}
