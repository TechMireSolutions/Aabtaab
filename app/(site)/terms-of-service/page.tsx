import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Terms & Conditions | Aabtaab",
  description: "Terms and Conditions for using Aabtaab services",
};

export default function TermsOfServicePage() {
  return (
    <div>
      <PageHeader
        maxWidth="md"
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using our services"
      />
      <div className="section-y bg-white dark:bg-slate-950">
        <div className="container-content max-w-3xl">
          <div className="space-y-6">
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Welcome to Aabtaab. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              By using our educational platforms, requesting religious services, or participating in our community programs, you acknowledge that you have read, understood, and agreed to these terms.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">2. Religious Services</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Services such as Zakat, Khums, Niyabat Ziarat, and Aqiqa are fulfilled by qualified scholars and representatives with the utmost sincerity and adherence to Islamic jurisprudence (Fiqh). However, we act as facilitators in these spiritual matters.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">3. Educational Content</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              All courses, articles, and educational materials provided on Aabtaab are intended for the dissemination of knowledge in accordance with the teachings of Ahlul Bayt (A.S.). They may not be reproduced or distributed for commercial purposes without prior consent.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">4. User Conduct</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Users are expected to maintain respectful behavior when participating in courses, events, or communicating with scholars and other members of the community.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">5. Modifications</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Aabtaab reserves the right to modify or replace these Terms & Conditions at any time. Continued use of our services constitutes acceptance of the new terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
