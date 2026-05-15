// Pure, dependency-free contact-form logic. No AWS, no network — unit testable
// in isolation. Validation rules mirror the frontend's src/lib/contactForm.ts.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Build a Lambda Function URL response. CORS headers are intentionally NOT set
 * here — the Function URL's CORS configuration applies them to every response.
 */
export function jsonResponse(statusCode, body) {
  return {
    statusCode,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  };
}

/**
 * Parse a Function URL event body into normalized string fields.
 * Returns null when the body is not a JSON object.
 */
export function parseBody(event) {
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body ?? "", "base64").toString("utf8")
    : (event.body ?? "");

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return null;
  }

  const str = (v) => (typeof v === "string" ? v : "");
  return {
    name: str(data.name),
    email: str(data.email),
    message: str(data.message),
    turnstileToken: str(data.turnstileToken),
    company: str(data.company),
  };
}

/** Honeypot: real users never fill `company`. */
export function isHoneypotFilled(fields) {
  return fields.company.trim() !== "";
}

/** Server-side field validation — mirrors the frontend rules. */
export function validateFields(fields) {
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (name.length < 1 || name.length > 100) return false;
  if (email.length < 1 || email.length > 254 || !EMAIL_RE.test(email)) return false;
  if (message.length < 10 || message.length > 2000) return false;
  if (fields.turnstileToken.trim().length < 1) return false;

  return true;
}
