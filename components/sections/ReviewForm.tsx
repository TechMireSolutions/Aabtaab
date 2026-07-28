"use client";

import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().optional(),
  quote: z.string().min(10, "Review must be at least 10 characters"),
});

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ReviewForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      role: formData.get("role") as string,
      quote: formData.get("quote") as string,
    };

    try {
      const validData = formSchema.parse(data);
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      setStatus("success");
      (e.target as HTMLFormElement).reset();
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
