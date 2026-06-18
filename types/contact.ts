export type ContactPurpose = "general" | "course" | "service" | "other";

export interface ContactFormOption {
  _id: string;
  title: string;
  parentTitle?: string;
}
