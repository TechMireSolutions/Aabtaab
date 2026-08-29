"use client";

import { useId, useState } from "react";
import { publicEnv } from "@/lib/env";
import type { ContactFormOption, ContactPurpose } from "@/types/contact";
import TurnstileWidget, { resetTurnstile } from "@/components/ui/TurnstileWidget";
import ContactFormFields from "./ContactFormFields";

interface ContactFormProps {
  submitLabel: string;
  courses: ContactFormOption[];
  services: ContactFormOption[];
}

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactForm({
  submitLabel,
  courses,
  services,
}: ContactFormProps) {
  const formId = useId();
  const [purpose, setPurpose] = useState<ContactPurpose>("general");
  const [appliedFor, setAppliedFor] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const fieldIds = {
    firstName: `${formId}-firstName`,
    lastName: `${formId}-lastName`,
    email: `${formId}-email`,
    phone: `${formId}-phone`,
    country: `${formId}-country`,
    city: `${formId}-city`,
    appliedFor: `${formId}-appliedFor`,
    message: `${formId}-message`,
    purpose: `${formId}-purpose`,
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

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
      const token = publicEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        ? getValue("cf-turnstile-response")
        : undefined;

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
          token,
        }),
      });

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error || "Failed to send message");
      }

      setStatus("success");
      form.reset();
      setPurpose("general");
      setAppliedFor("");
    } catch (err: unknown) {
      setStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Something went wrong. Please try again or email us directly.");
      }
    } finally {
      resetTurnstile();
    }
  }

  const options = purpose === "course" ? courses : services;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <ContactFormFields
        fieldIds={fieldIds}
        purpose={purpose}
        setPurpose={setPurpose}
        appliedFor={appliedFor}
        setAppliedFor={setAppliedFor}
        options={options}
      />

      <TurnstileWidget />

      <button
        type="submit"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
        className="btn-primary w-full justify-center disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Sending…" : submitLabel}
      </button>

      {status === "success" && (
        <p
          role="status"
          aria-live="polite"
          className="text-sm-plus font-medium text-green-700 dark:text-green-400"
        >
          Thank you! Your message has been sent successfully.
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          aria-live="assertive"
          className="text-sm-plus font-medium text-red-600 dark:text-red-400"
        >
          {errorMessage || "Something went wrong. Please try again or email us directly."}
        </p>
      )}
    </form>
  );
}
