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
    <label className="text-caption mb-1.5 block font-semibold text-slate-700">
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
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
          website: getValue("website"),
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
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FormLabel required>First Name</FormLabel>
          <input
            name="firstName"
            required
            className="input-field"
            placeholder="Your first name"
          />
        </div>
        <div>
          <FormLabel>Last Name</FormLabel>
          <input
            name="lastName"
            className="input-field"
            placeholder="Your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FormLabel required>Email</FormLabel>
          <input
            name="email"
            type="email"
            required
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <FormLabel required>Phone</FormLabel>
          <input
            name="phone"
            type="tel"
            required
            className="input-field"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FormLabel required>Country</FormLabel>
          <input
            name="country"
            required
            className="input-field"
            placeholder="Your country"
          />
        </div>
        <div>
          <FormLabel required>City</FormLabel>
          <input
            name="city"
            required
            className="input-field"
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
              className={`rounded-xl border px-3 py-2.5 text-sm-plus font-medium transition-colors ${
                purpose === value
                  ? "border-brand-600 bg-brand-50 text-brand-800"
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
            className="input-field bg-white"
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
          className="input-field resize-y"
          placeholder="How can we help you?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>

      {status === "success" && (
        <p className="text-sm-plus font-medium text-green-700">
          Thank you! Your message has been sent successfully.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm-plus font-medium text-red-600">
          Something went wrong. Please try again or email us directly.
        </p>
      )}
    </form>
  );
}
