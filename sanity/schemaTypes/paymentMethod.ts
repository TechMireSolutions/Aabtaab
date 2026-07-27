import { defineField, defineType } from "sanity";
import { CreditCard } from "lucide-react";

export const paymentMethod = defineType({
  name: "paymentMethod",
  title: "Payment Methods",
  type: "document",
  icon: CreditCard,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title (e.g., EasyPaisa, Meezan Bank)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      type: "image",
      title: "Bank/App Logo",
      options: { hotspot: true },
    }),
    defineField({
      name: "accountTitle",
      type: "string",
      title: "Account Title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "accountNumber",
      type: "string",
      title: "Account/IBAN Number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bankName",
      type: "string",
      title: "Bank/App Name (Optional)",
      description: "Useful if the title is something generic like 'Bank Transfer'",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "accountNumber",
      media: "icon",
    },
  },
});
