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
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex justify-center lg:justify-start order-2 lg:order-1">
            {imageUrl ? (
              <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <Image
                  src={imageUrl}
                  alt={imageAlt || heading || defaultHeading}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full max-w-sm aspect-square rounded-2xl bg-slate-50 border border-gray-200 flex items-center justify-center">
                <span className="text-[12px] text-gray-400">Add image in Studio</span>
              </div>
            )}
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-bold text-[24px] sm:text-[30px] text-slate-900 tracking-[-0.02em] mb-8">
              {heading || defaultHeading}
            </h2>
            <ul className="space-y-4">
              {items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-md bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={13} className="text-cyan-600" strokeWidth={2.5} />
                  </div>
                  <p className="text-[14.5px] text-slate-700 leading-relaxed">
                    <span className="font-semibold text-slate-900">{item.title}:</span>
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
