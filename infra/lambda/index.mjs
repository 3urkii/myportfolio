import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";
import {
  parseBody,
  isHoneypotFilled,
  validateFields,
  jsonResponse,
} from "./validate.mjs";

const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const sns = new SNSClient({});
const ssm = new SSMClient({});

// Cached across warm invocations so the SSM read happens once per container.
let cachedSecret = null;

async function getTurnstileSecret() {
  if (cachedSecret) return cachedSecret;
  const out = await ssm.send(
    new GetParameterCommand({
      Name: process.env.TURNSTILE_SECRET_PARAM,
      WithDecryption: true,
    }),
  );
  cachedSecret = out.Parameter.Value;
  return cachedSecret;
}

async function verifyTurnstile(token) {
  const secret = await getTurnstileSecret();
  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  });
  const data = await res.json();
  return data.success === true;
}

async function publishSubmission(fields) {
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();
  await sns.send(
    new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: "New contact form submission — berke.pro",
      Message: `New contact form submission\n\nName: ${name}\nEmail: ${email}\n\n${message}\n`,
    }),
  );
}

/**
 * Lambda Function URL handler. Cheapest checks first: parse, honeypot, field
 * validation, then the one external call (Turnstile), then SNS publish.
 * Reserved concurrency on the function makes the Function URL emit 429 on
 * saturation — no rate-limiting logic is needed here.
 */
export async function handler(event) {
  const fields = parseBody(event);
  if (fields === null) {
    return jsonResponse(400, { ok: false, error: "validation" });
  }
  if (isHoneypotFilled(fields)) {
    return jsonResponse(400, { ok: false, error: "spam" });
  }
  if (!validateFields(fields)) {
    return jsonResponse(400, { ok: false, error: "validation" });
  }

  try {
    const passed = await verifyTurnstile(fields.turnstileToken);
    if (!passed) {
      return jsonResponse(400, { ok: false, error: "turnstile" });
    }
    await publishSubmission(fields);
    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error("contact handler error:", err);
    return jsonResponse(500, { ok: false, error: "server" });
  }
}
