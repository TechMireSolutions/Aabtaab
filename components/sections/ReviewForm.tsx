"use client";

import { useState } from "react";
import Script from "next/script";
import { z } from "zod";
import { env } from "@/lib/env";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().optional(),
  quote: z.string().min(10, "Review must be at least 10 characters"),
  website: z.string().optional(),
});

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ReviewForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      quote: formData.get("quote") as string,
      website: (formData.get("website") as string) || "",
    };

    try {
      const validData = formSchema.parse(data);
      const turnstileToken =
        (formData.get("cf-turnstile-response") as string) || undefined;

      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: validData.name,
          role: validData.role,
          quote: validData.quote,
          website: validData.website,
          token: turnstileToken,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "Failed to submit review");
      }

      setStatus("success");
      form.reset();
      const turnstile = (
        window as unknown as { turnstile?: { reset: () => void } }
      ).turnstile;
      turnstile?.reset();
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof z.ZodError) {
        setErrorMessage(err.issues[0]?.message ?? "Invalid input.");
      } else if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong.");
      }
    }
  }

  return (
    <div className="card-surface relative overflow-hidden p-6 md:p-8">
      <div className="mb-8">
        <h3 className="heading-section text-xl sm:text-2xl">Submit a Review</h3>
        <p className="text-sm-plus text-slate-500 dark:text-slate-400 mt-2">
          Your feedback shapes our community. Share your experience with us.
        </p>
      </div>

      {status === "success" ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-brand-100 dark:border-brand-900/40 bg-brand-50/60 dark:bg-brand-950/30 p-8 text-center"
        >
          <p className="font-semibold text-slate-900 dark:text-white text-lg">
            Thank you!
          </p>
          <p className="text-sm-plus text-slate-600 dark:text-slate-400 mt-2">
            Your review is under review and will be published shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor="review-website">Website</label>
            <input
              id="review-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
          <div>
            <label
              htmlFor="review-name"
              className="mb-1.5 block text-caption font-semibold text-slate-700 dark:text-slate-300"
            >
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="review-name"
              name="name"
              required
              autoComplete="name"
              placeholder="e.g. Ali Raza"
              className="input-field"
              disabled={status === "loading"}
            />
          </div>
          <div>
            <label
              htmlFor="review-role"
              className="mb-1.5 block text-caption font-semibold text-slate-700 dark:text-slate-300"
            >
              Role / Location
            </label>
            <input
              type="text"
              id="review-role"
              name="role"
              placeholder="e.g. Student, UK"
              className="input-field"
              disabled={status === "loading"}
            />
          </div>
          <div>
            <label
              htmlFor="review-quote"
              className="mb-1.5 block text-caption font-semibold text-slate-700 dark:text-slate-300"
            >
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review-quote"
              name="quote"
              required
              rows={4}
              placeholder="Share your learning experience..."
              className="input-field resize-y"
              disabled={status === "loading"}
            />
          </div>

          {env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div className="flex justify-start py-1">
              <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                async
                defer
              />
              <div
                className="cf-turnstile"
                data-sitekey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                data-theme="light"
              />
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              aria-live="assertive"
              className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-950/30 p-4 text-sm-plus text-red-700 dark:text-red-400"
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            aria-busy={status === "loading"}
            className="btn-primary w-full justify-center disabled:opacity-70"
          >
            {status === "loading" ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}
