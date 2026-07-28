/** Soft defaults only — prefer CMS `donateCauses` when configured. */
export const DEFAULT_DONATE_CAUSES = [
  {
    title: "General Donation",
    description: "Support Aabtaab’s educational and community mission",
  },
  {
    title: "Education Programs",
    description: "Help sustain online courses and learning resources",
  },
  {
    title: "Community Programs",
    description: "Support majalis, gatherings, and outreach",
  },
] as const;
