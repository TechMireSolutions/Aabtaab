"use client";

import { useState } from "react";
import { Copy, Check, Building2, Wallet, Smartphone, CreditCard } from "lucide-react";

interface PaymentMethod {
  name: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  details: { label: string; value: string }[];
}

const METHODS: PaymentMethod[] = [
  {
    name: "SadaPay",
    icon: <CreditCard className="size-5" />,
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    details: [
      { label: "Account Title", value: "Aabtaab Foundation" },
      { label: "Card / IBAN", value: "XXXX-XXXX-XXXX-XXXX" },
    ],
  },
  {
    name: "EasyPaisa",
    icon: <Wallet className="size-5" />,
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    details: [
      { label: "Account Title", value: "Aabtaab Foundation" },
      { label: "Account Number", value: "03XX-XXXXXXX" },
    ],
  },
  {
    name: "JazzCash",
    icon: <Smartphone className="size-5" />,
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    details: [
      { label: "Account Title", value: "Aabtaab Foundation" },
      { label: "Account Number", value: "03XX-XXXXXXX" },
    ],
  },
  {
    name: "Bank Transfer",
    icon: <Building2 className="size-5" />,
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    details: [
      { label: "Account Title", value: "Aabtaab Foundation" },
      { label: "Bank Name", value: "Your Bank Name" },
      { label: "Account Number", value: "XXXXXXXXXXXX" },
      { label: "IBAN", value: "PKXX-XXXX-XXXXXXXXXXXX" },
    ],
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text.replace(/-/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${text}`}
      className="ml-1 inline-flex size-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-brand-600 cursor-pointer"
    >
      {copied ? (
        <Check className="size-3.5 text-green-600" />
      ) : (
        <Copy className="size-3.5" />
      )}
    </button>
  );
}

export default function PaymentMethods() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {METHODS.map((method) => (
        <div
          key={method.name}
          className="card-surface card-hover-lift p-5"
        >
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl border ${method.bg} ${method.color}`}
            >
              {method.icon}
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {method.name}
            </h3>
          </div>
          <dl className="space-y-2">
            {method.details.map((detail) => (
              <div key={detail.label} className="flex flex-col">
                <dt className="text-2xs font-medium uppercase tracking-kicker text-slate-400">
                  {detail.label}
                </dt>
                <dd className="mt-0.5 flex items-center text-sm-plus font-semibold text-slate-800">
                  {detail.value}
                  <CopyButton text={detail.value} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}
