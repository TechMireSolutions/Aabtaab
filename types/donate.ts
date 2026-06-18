/** Donate page fields from `siteSettings` */
export interface DonatePageSettings {
  donateArabicVerse?: string;
  donateUrl?: string;
  donatePayOnlineLabel?: string;
  donateContactLabel?: string;
  donateClosingMessage?: string;
  donateHowToHeading?: string;
  donateHowToText?: string;
  donateCauses?: { title: string; description: string }[];
}
