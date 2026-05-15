export type ContactFormValues = {
  name: string;
  email: string;
  message: string;
  company: string; // honeypot — always empty for real users
};

export type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export type SubmitErrorKind =
  | "validation"
  | "turnstile"
  | "spam"
  | "rate-limited"
  | "server"
  | "network";

export type SubmitResult =
  | { status: "success" }
  | { status: "error"; kind: SubmitErrorKind };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validate(values: ContactFormValues): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();

  if (name.length < 1) {
    errors.name = "Please enter your name.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  if (email.length < 1) {
    errors.email = "Please enter your email.";
  } else if (email.length > 254 || !EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  return errors;
}

export async function submitContact(
  values: ContactFormValues,
  turnstileToken: string,
  endpoint: string,
): Promise<SubmitResult> {
  // Honeypot tripped: pretend success, send nothing.
  if (values.company.trim() !== "") {
    return { status: "success" };
  }

  // No endpoint configured yet (frontend-only phase): resolve to an error.
  if (!endpoint) {
    return { status: "error", kind: "server" };
  }

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: values.name.trim(),
        email: values.email.trim(),
        message: values.message.trim(),
        turnstileToken,
        company: values.company,
      }),
    });
  } catch {
    return { status: "error", kind: "network" };
  }

  if (response.status === 200) {
    return { status: "success" };
  }
  if (response.status === 429) {
    return { status: "error", kind: "rate-limited" };
  }
  if (response.status === 400) {
    let kind: SubmitErrorKind = "validation";
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error === "turnstile" || body.error === "spam") {
        kind = body.error;
      }
    } catch {
      // Non-JSON body — keep the default "validation" kind.
    }
    return { status: "error", kind };
  }
  return { status: "error", kind: "server" };
}
