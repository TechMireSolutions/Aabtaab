import PageHeader from "@/components/layout/PageHeader";

export const metadata = {
  title: "Privacy Policy | Aabtaab",
  description: "Privacy Policy for Aabtaab",
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHeader
        maxWidth="md"
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How we handle and protect your data"
      />
      <div className="section-y bg-white dark:bg-slate-950">
        <div className="container-content max-w-3xl">
          <div className="space-y-6">
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              At Aabtaab, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices regarding data collection, usage, and protection.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Information We Collect</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              When you use our services, register for courses, or contact us, we may collect information such as your name, email address, phone number, and other relevant details required for specific religious or educational services.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              The information collected is strictly used to provide, maintain, and improve our services, process your requests (e.g., Zakat, Khums, Niyabat Ziarat), and communicate with you effectively. We do not sell or rent your personal information to third parties.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Data Security</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              We implement reasonable security measures and follow industry best practices to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Changes to this Policy</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review it periodically.
            </p>

            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              If you have any questions or concerns about this Privacy Policy, please contact us via our Contact page or email us directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
