import { useCallback, useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileHandle } from "@/components/Landing/Turnstile";
import {
  validate,
  submitContact,
  type ContactFormValues,
  type FieldErrors,
  type SubmitErrorKind,
} from "@/lib/contactForm";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY_VALUES: ContactFormValues = {
  name: "",
  email: "",
  message: "",
  company: "",
};

const ERROR_COPY: Record<SubmitErrorKind, string> = {
  validation:
    "Something looks off with the form. Please check your entries and try again.",
  turnstile: "The spam check didn't pass. Please complete it and try again.",
  spam: "The spam check didn't pass. Please complete it and try again.",
  "rate-limited": "Just a moment — try again shortly.",
  server: "Something went wrong on my end. Please try again in a bit.",
  network: "Couldn't reach the server. Check your connection and try again.",
};

const labelClass =
  "block text-[10.5px] font-normal uppercase tracking-[0.14em] text-foreground/45";

// Base field styling. Border colour + interaction states are appended per
// field by fieldClassName so the invalid state can be expressed deterministically.
const fieldBase =
  "mt-2 w-full rounded-md border bg-white/[0.02] px-3.5 py-2.5 text-[14px] font-light text-foreground placeholder:text-foreground/35 transition-colors focus:bg-white/[0.035] disabled:cursor-not-allowed disabled:opacity-50";

function fieldClassName(invalid: boolean): string {
  return `${fieldBase} ${
    invalid
      ? "border-red/50 focus:border-red/60"
      : "border-white/[0.09] enabled:hover:border-white/[0.16] focus:border-white/[0.30]"
  }`;
}

const errorClass = "mt-1.5 text-[12px] text-red";

export function ContactForm() {
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? "";
  const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT ?? "";

  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorKind, setErrorKind] = useState<SubmitErrorKind>("server");
  const [token, setToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);
  const successRef = useRef<HTMLParagraphElement>(null);

  const handleToken = useCallback((t: string) => setToken(t), []);
  const handleTurnstileError = useCallback(() => setToken(""), []);

  function update<K extends keyof ContactFormValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
    if (key !== "company") {
      setErrors((e) => ({ ...e, [key]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (status === "submitting" || !token) return;
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.values(fieldErrors).some(Boolean)) return;

    setStatus("submitting");
    const result = await submitContact(values, token, endpoint);
    if (result.status === "success") {
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
      return;
    }
    setErrorKind(result.kind);
    setStatus("error");
    setToken("");
    turnstileRef.current?.reset();
  }

  if (status === "success") {
    return (
      <p
        ref={successRef}
        tabIndex={-1}
        className="animate-contact-reveal font-serif text-[22px] font-extralight leading-[1.3] tracking-[-0.01em] text-foreground"
      >
        Thanks — I'll get back to you within a day or two
        <span className="text-red">.</span>
      </p>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor="cf-name" className={labelClass}>
          Name
        </label>
        <input
          id="cf-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          disabled={submitting}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "cf-name-error" : undefined}
          className={fieldClassName(Boolean(errors.name))}
        />
        {errors.name && (
          <p id="cf-name-error" className={errorClass}>
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cf-email" className={labelClass}>
          Email
        </label>
        <input
          id="cf-email"
          name="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          disabled={submitting}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "cf-email-error" : undefined}
          className={fieldClassName(Boolean(errors.email))}
        />
        {errors.email && (
          <p id="cf-email-error" className={errorClass}>
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="cf-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="cf-message"
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          disabled={submitting}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
          className={`${fieldClassName(Boolean(errors.message))} resize-y`}
        />
        {errors.message && (
          <p id="cf-message-error" className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — visually hidden, off-screen, not focusable. Real users never fill this. */}
      <div
        aria-hidden
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="cf-company">Company</label>
        <input
          id="cf-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </div>

      <div className="flex justify-center">
        <Turnstile
          siteKey={siteKey}
          onToken={handleToken}
          onError={handleTurnstileError}
          ref={turnstileRef}
        />
      </div>

      {/* Status region + submit grouped so the live region never reserves
          empty space — it only pushes the button when a message is present. */}
      <div className="flex flex-col items-center">
        <div aria-live="polite" className="text-center">
          {submitting && (
            <span className="sr-only">Sending your message…</span>
          )}
          {status === "error" && (
            <p
              role="alert"
              className="mb-3 text-[12px] leading-[1.6] text-red"
            >
              {ERROR_COPY[errorKind]}{" "}
              <a
                href="https://www.linkedin.com/in/ryan-berke/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                or reach me on LinkedIn ↗
              </a>
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting || !token}
          className="inline-flex w-fit items-center rounded-md border border-white/[0.14] px-5 py-2.5 text-[11px] font-normal uppercase tracking-[0.14em] text-foreground/70 transition-colors enabled:hover:border-red/40 enabled:hover:text-red enabled:active:border-red/55 enabled:active:bg-red/[0.06] enabled:active:text-red disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
