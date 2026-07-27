"use client";

import { useState } from "react";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  role: z.string().optional(),
  quote: z.string().min(10, "Review must be at least 10 characters"),
});

export default function ReviewForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
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
    } catch (err: any) {
      setStatus("error");
      if (err instanceof z.ZodError) {
        setErrorMessage((err as any).errors[0].message);
      } else {
        setErrorMessage(err.message || "Something went wrong.");
      }
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-slate-900/60 p-6 md:p-8 shadow-2xl shadow-slate-200/40 dark:shadow-none backdrop-blur-2xl border border-white dark:border-slate-700/50">
      {/* Decorative top border */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-linear-to-r from-brand-400 via-brand-500 to-brand-600" />
      
      {/* Subtle inner glow */}
      <div className="absolute inset-0 bg-linear-to-b from-white/40 to-transparent dark:from-slate-800/20 pointer-events-none" />

      <div className="relative z-10 mb-8">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Submit a Review</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">
          Your feedback shapes our community. Share your experience with us.
        </p>
      </div>

      {status === "success" ? (
        <div className="relative z-10 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-8 text-center border border-brand-100 dark:border-brand-500/20 shadow-inner">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-brand-400 to-brand-500 shadow-lg shadow-brand-500/30 mb-5">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="font-extrabold text-slate-900 dark:text-white text-xl">Thank You!</p>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-2">
            Your review is under review and will be published shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Your Name <span className="text-brand-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="e.g. Ali Raza"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-950/40 px-5 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400/80 shadow-inner focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
            />
          </div>
          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Role / Location
            </label>
            <input
              type="text"
              id="role"
              name="role"
              placeholder="e.g. Student, UK"
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-950/40 px-5 py-3.5 text-slate-900 dark:text-white placeholder:text-slate-400/80 shadow-inner focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium"
            />
          </div>
          <div>
            <label htmlFor="quote" className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
              Your Review <span className="text-brand-500">*</span>
            </label>
            <textarea
              id="quote"
              name="quote"
              required
              rows={4}
              placeholder="Share your learning experience..."
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-slate-950/40 px-5 py-4 text-slate-900 dark:text-white placeholder:text-slate-400/80 shadow-inner focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-medium resize-y"
            ></textarea>
          </div>
          
          {status === "error" && (
            <div className="rounded-2xl bg-red-50/80 dark:bg-red-500/10 backdrop-blur-sm p-4 text-sm font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 flex items-start gap-3">
              <svg className="h-5 w-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="group relative w-full overflow-hidden rounded-2xl bg-slate-900 dark:bg-white px-6 py-4 font-bold text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-0.5 hover:shadow-2xl disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <div className="absolute inset-0 bg-linear-to-r from-brand-500 to-brand-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-brand-400 dark:to-brand-500" />
            <div className="relative z-10 flex items-center justify-center gap-2 group-hover:text-white">
              {status === "loading" ? (
                <>
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                "Submit Review"
              )}
            </div>
          </button>
        </form>
      )}
    </div>
  );
}
