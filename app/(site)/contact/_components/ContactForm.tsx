"use client";

import { useState } from "react";
import type {
  ContactFormOption,
  ContactPurpose,
} from "@/types/contact";

interface ContactFormProps {
  submitLabel: string;
  courses: ContactFormOption[];
  services: ContactFormOption[];
}

type FormStatus = "idle" | "loading" | "success" | "error";

function formatOptionLabel(option: ContactFormOption) {
  return option.parentTitle
    ? `${option.parentTitle} — ${option.title}`
    : option.title;
}

function FormLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block text-[12px] font-semibold text-slate-700 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export default function ContactForm({
  submitLabel,
  courses,
  services,
}: ContactFormProps) {
  const [purpose, setPurpose] = useState<ContactPurpose>("general");
  const [appliedFor, setAppliedFor] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const getValue = (name: string) =>
      (
        form.elements.namedItem(name) as
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | null
      )?.value ?? "";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: getValue("firstName"),
          lastName: getValue("lastName"),
          email: getValue("email"),
          phone: getValue("phone"),
          country: getValue("country"),
          city: getValue("city"),
          purpose,
          appliedFor: appliedFor || undefined,
          message: getValue("message"),
        }),
      });

      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      form.reset();
      setPurpose("general");
      setAppliedFor("");
    } catch {
      setStatus("error");
    }
  }

  const options = purpose === "course" ? courses : services;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel required>First Name</FormLabel>
          <input
            name="firstName"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
            placeholder="Your first name"
          />
        </div>
        <div>
          <FormLabel>Last Name</FormLabel>
          <input
            name="lastName"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
            placeholder="Your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel required>Email</FormLabel>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <FormLabel required>Phone</FormLabel>
          <input
            name="phone"
            type="tel"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel required>Country</FormLabel>
          <input
            name="country"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
            placeholder="Your country"
          />
        </div>
        <div>
          <FormLabel required>City</FormLabel>
          <input
            name="city"
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
            placeholder="Your city"
          />
        </div>
      </div>

      <div>
        <FormLabel required>Purpose</FormLabel>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              ["general", "General Inquiry"],
              ["course", "Course Enrollment"],
              ["service", "Service Request"],
              ["other", "Other"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setPurpose(value);
                setAppliedFor("");
              }}
              className={`rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-colors ${
                purpose === value
                  ? "border-cyan-600 bg-cyan-50 text-cyan-800"
                  : "border-gray-200 text-slate-600 hover:border-gray-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(purpose === "course" || purpose === "service") && options.length > 0 && (
        <div>
          <FormLabel required>
            {purpose === "course" ? "Select Course" : "Select Service"}
          </FormLabel>
          <select
            value={appliedFor}
            onChange={(e) => setAppliedFor(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 bg-white"
          >
            <option value="">Choose one…</option>
            {options.map((option) => (
              <option key={option._id} value={formatOptionLabel(option)}>
                {formatOptionLabel(option)}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <FormLabel required>Message</FormLabel>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-[15px] text-slate-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 resize-y"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-cyan-700 hover:bg-cyan-800 disabled:opacity-60 text-white font-semibold text-[15px] px-8 py-3.5 transition-colors"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>

      {status === "success" && (
        <p className="text-[14px] text-green-700 font-medium">
          Thank you! Your message has been sent successfully.
        </p>
      )}
      {status === "error" && (
        <p className="text-[14px] text-red-600 font-medium">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
