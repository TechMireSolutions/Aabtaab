"use client";

import type { ContactFormOption, ContactPurpose } from "@/types/contact";
import { CONTACT_PURPOSE_LABELS } from "@/lib/constants";

function FormLabel({
  htmlFor,
  id,
  children,
  required,
}: {
  htmlFor?: string;
  id?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      id={id}
      className="text-caption mb-1.5 block font-semibold text-slate-700 dark:text-slate-300"
    >
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  );
}

function formatOptionLabel(option: ContactFormOption) {
  return option.parentTitle
    ? `${option.parentTitle} — ${option.title}`
    : option.title;
}

export interface ContactFormFieldsProps {
  fieldIds: Record<
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "country"
    | "city"
    | "appliedFor"
    | "message"
    | "purpose",
    string
  >;
  purpose: ContactPurpose;
  setPurpose: (value: ContactPurpose) => void;
  appliedFor: string;
  setAppliedFor: (value: string) => void;
  options: ContactFormOption[];
}

export default function ContactFormFields({
  fieldIds,
  purpose,
  setPurpose,
  appliedFor,
  setAppliedFor,
  options,
}: ContactFormFieldsProps) {
  return (
    <>
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
          <FormLabel htmlFor={fieldIds.firstName} required>
            First Name
          </FormLabel>
          <input
            id={fieldIds.firstName}
            name="firstName"
            required
            autoComplete="given-name"
            className="input-field"
            placeholder="Your first name"
          />
        </div>
        <div>
          <FormLabel htmlFor={fieldIds.lastName}>Last Name</FormLabel>
          <input
            id={fieldIds.lastName}
            name="lastName"
            autoComplete="family-name"
            className="input-field"
            placeholder="Your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FormLabel htmlFor={fieldIds.email} required>
            Email
          </FormLabel>
          <input
            id={fieldIds.email}
            name="email"
            type="email"
            required
            autoComplete="email"
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <FormLabel htmlFor={fieldIds.phone} required>
            Phone
          </FormLabel>
          <input
            id={fieldIds.phone}
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="input-field"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FormLabel htmlFor={fieldIds.country} required>
            Country
          </FormLabel>
          <input
            id={fieldIds.country}
            name="country"
            required
            autoComplete="country-name"
            className="input-field"
            placeholder="Your country"
          />
        </div>
        <div>
          <FormLabel htmlFor={fieldIds.city} required>
            City
          </FormLabel>
          <input
            id={fieldIds.city}
            name="city"
            required
            autoComplete="address-level2"
            className="input-field"
            placeholder="Your city"
          />
        </div>
      </div>

      <div>
        <FormLabel id={fieldIds.purpose} required>
          Purpose
        </FormLabel>
        <div
          role="radiogroup"
          aria-labelledby={fieldIds.purpose}
          onKeyDown={(e) => {
            const purposes = Object.keys(
              CONTACT_PURPOSE_LABELS,
            ) as ContactPurpose[];
            const idx = purposes.indexOf(purpose);
            let nextIdx = idx;
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              nextIdx = (idx + 1) % purposes.length;
            } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              nextIdx = (idx - 1 + purposes.length) % purposes.length;
            } else {
              return;
            }
            const nextVal = purposes[nextIdx];
            setPurpose(nextVal);
            setAppliedFor("");
            const btn = e.currentTarget.querySelectorAll("button")[nextIdx];
            btn?.focus();
          }}
          className="grid grid-cols-2 gap-2"
        >
          {(
            Object.entries(CONTACT_PURPOSE_LABELS) as Array<
              [ContactPurpose, string]
            >
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={purpose === value}
              tabIndex={purpose === value ? 0 : -1}
              onClick={() => {
                setPurpose(value);
                setAppliedFor("");
              }}
              className={`min-h-11 rounded-xl border px-3 py-2.5 text-sm-plus font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 ${
                purpose === value
                  ? "border-brand-600 bg-brand-50 dark:bg-brand-900/40 text-brand-800 dark:text-brand-400"
                  : "border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(purpose === "course" || purpose === "service") && options.length > 0 && (
        <div>
          <FormLabel htmlFor={fieldIds.appliedFor} required>
            {purpose === "course" ? "Select Course" : "Select Service"}
          </FormLabel>
          <select
            id={fieldIds.appliedFor}
            value={appliedFor}
            onChange={(e) => setAppliedFor(e.target.value)}
            required
            className="input-field"
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
        <FormLabel htmlFor={fieldIds.message} required>
          Message
        </FormLabel>
        <textarea
          id={fieldIds.message}
          name="message"
          required
          rows={5}
          className="input-field resize-y"
          placeholder="How can we help you?"
        />
      </div>
    </>
  );
}
