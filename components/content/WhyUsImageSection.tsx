import Image from "next/image";
import { Check } from "lucide-react";
import type { LabeledDescription } from "@/types/course";

interface WhyUsImageSectionProps {
  heading?: string;
  items?: LabeledDescription[];
  imageUrl?: string | null;
  imageAlt?: string;
  defaultHeading?: string;
}

export default function WhyUsImageSection({
  heading,
  items = [],
  imageUrl,
  imageAlt,
  defaultHeading = "Why Use Our Platform?",
}: WhyUsImageSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="section-y bg-white">
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
            {imageUrl ? (
              <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <Image
                  src={imageUrl}
                  alt={imageAlt || heading || defaultHeading}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square w-full max-w-sm items-center justify-center rounded-2xl border border-gray-200 bg-slate-50">
                <span className="text-2xs text-gray-400">Add image in Studio</span>
              </div>
            )}
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="heading-section mb-8">
              {heading || defaultHeading}
            </h2>
            <ul className="space-y-4">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand-100 bg-brand-50">
                    <Check
                      size={13}
                      className="text-brand-600"
                      strokeWidth={2.5}
                    />
                  </div>
                  <p className="text-base-plus leading-relaxed text-slate-700">
                    <span className="font-semibold text-slate-900">
                      {item.title}:
                    </span>
                    {item.description && (
                      <span className="text-gray-600"> {item.description}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
