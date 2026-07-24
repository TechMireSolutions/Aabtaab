"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy } from "lucide-react";
import type { PaymentMethod } from "@/types/sanity";
import { urlFor } from "@/sanity/lib/image";

interface DynamicPaymentMethodsProps {
    methods: PaymentMethod[];
}

function CopyButton({ textToCopy }: { textToCopy: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy to clipboard"
            className="absolute right-3 top-3 rounded-full p-2 text-slate-400 transition-all hover:scale-110 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
            {copied ? (
                <Check className="size-4 text-green-500" />
            ) : (
                <Copy className="size-4" />
            )}
        </button>
    );
}

export default function DynamicPaymentMethods({
    methods,
}: DynamicPaymentMethodsProps) {
    if (!methods.length) {
        return (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                No payment methods are currently configured. Please check back later.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {methods.map((method) => (
                <div
                    key={method._id}
                    className="card-surface relative overflow-hidden p-5"
                >
                    <div className="flex items-center gap-4">
                        {method.icon && (
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
                                <Image
                                    src={urlFor(method.icon).width(80).height(80).url()}
                                    alt={`${method.title} logo`}
                                    width={40}
                                    height={40}
                                    className="h-auto w-full object-contain"
                                />
                            </div>
                        )}
                        <div>
                            <h3 className="text-base-plus font-semibold text-slate-900 dark:text-white">
                                {method.title}
                            </h3>
                            {method.bankName && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {method.bankName}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                        <div className="relative">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Account Title
                            </p>
                            <p className="truncate pr-12 font-mono text-sm-plus font-medium text-slate-800 dark:text-slate-200">
                                {method.accountTitle}
                            </p>
                            <CopyButton textToCopy={method.accountTitle} />
                        </div>
                        <div className="relative">
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                Account Number / IBAN
                            </p>
                            <p className="truncate pr-12 font-mono text-sm-plus font-medium text-slate-800 dark:text-slate-200">
                                {method.accountNumber}
                            </p>
                            <CopyButton textToCopy={method.accountNumber} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}