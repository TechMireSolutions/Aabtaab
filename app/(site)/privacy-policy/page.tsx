import LegalPageShell, {
  LegalSection,
  legalSiteName,
} from "@/components/layout/LegalPageShell";
import { DEFAULT_SITE_NAME } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy Policy for ${DEFAULT_SITE_NAME}`,
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  const site = legalSiteName();

  return (
    <LegalPageShell
      title="Privacy Policy"
      subtitle="How we handle and protect your data"
    >
      <p className="text-base-plus leading-relaxed text-slate-600 dark:text-slate-400">
        At {site}, we are committed to protecting your privacy and ensuring the
        security of your personal information. This Privacy Policy outlines our
        practices regarding data collection, usage, and protection.
      </p>

      <LegalSection heading="Information We Collect">
        When you use our services, register for courses, or contact us, we may
        collect information such as your name, email address, phone number, and
        other relevant details required for specific religious or educational
        services.
      </LegalSection>

      <LegalSection heading="How We Use Your Information">
        The information collected is strictly used to provide, maintain, and
        improve our services, process your requests (e.g., Zakat, Khums, Niyabat
        Ziarat), and communicate with you effectively. We do not sell or rent
        your personal information to third parties.
      </LegalSection>

      <LegalSection heading="Data Security">
        We implement reasonable security measures and follow industry best
        practices to protect your personal data against unauthorized access,
        alteration, disclosure, or destruction.
      </LegalSection>

      <LegalSection heading="Changes to this Policy">
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page, and we encourage you to review it periodically.
      </LegalSection>

      <LegalSection heading="Contact Us">
        If you have any questions or concerns about this Privacy Policy, please
        contact us via our Contact page or email us directly.
      </LegalSection>
    </LegalPageShell>
  );
}
