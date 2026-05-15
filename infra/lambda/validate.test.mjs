import { describe, it, expect } from "vitest";
import {
  parseBody,
  isHoneypotFilled,
  validateFields,
  jsonResponse,
} from "./validate.mjs";

function event(bodyObj, { isBase64Encoded = false } = {}) {
  const body = typeof bodyObj === "string" ? bodyObj : JSON.stringify(bodyObj);
  return {
    body: isBase64Encoded ? Buffer.from(body).toString("base64") : body,
    isBase64Encoded,
  };
}

function fields(overrides = {}) {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Hello, I would like to get in touch about a role.",
    turnstileToken: "tok-123",
    company: "",
    ...overrides,
  };
}

describe("parseBody", () => {
  it("parses a well-formed JSON body into normalized string fields", () => {
    expect(parseBody(event(fields()))).toEqual(fields());
  });

  it("decodes a base64-encoded body", () => {
    expect(parseBody(event(fields(), { isBase64Encoded: true }))).toEqual(fields());
  });

  it("returns null for a malformed JSON body", () => {
    expect(parseBody(event("not json"))).toBeNull();
  });

  it("returns null for a non-object JSON body", () => {
    expect(parseBody(event("42"))).toBeNull();
  });

  it("coerces missing or non-string fields to empty strings", () => {
    expect(parseBody(event({ name: 5, email: null }))).toEqual({
      name: "",
      email: "",
      message: "",
      turnstileToken: "",
      company: "",
    });
  });

  it("returns null when event.body is undefined", () => {
    expect(parseBody({ isBase64Encoded: false })).toBeNull();
  });
});

describe("isHoneypotFilled", () => {
  it("is false when company is empty", () => {
    expect(isHoneypotFilled(fields({ company: "" }))).toBe(false);
  });

  it("is false when company is whitespace only", () => {
    expect(isHoneypotFilled(fields({ company: "   " }))).toBe(false);
  });

  it("is true when company has content", () => {
    expect(isHoneypotFilled(fields({ company: "Acme Corp" }))).toBe(true);
  });
});

describe("validateFields", () => {
  it("accepts valid fields", () => {
    expect(validateFields(fields())).toBe(true);
  });

  it("rejects a whitespace-only name", () => {
    expect(validateFields(fields({ name: "   " }))).toBe(false);
  });

  it("rejects a name longer than 100 characters", () => {
    expect(validateFields(fields({ name: "a".repeat(101) }))).toBe(false);
  });

  it("rejects a malformed email", () => {
    expect(validateFields(fields({ email: "not-an-email" }))).toBe(false);
  });

  it("rejects an email longer than 254 characters", () => {
    expect(validateFields(fields({ email: "a".repeat(250) + "@x.co" }))).toBe(false);
  });

  it("accepts an email of exactly 254 characters", () => {
    expect(validateFields(fields({ email: "a".repeat(249) + "@x.co" }))).toBe(true);
  });

  it("rejects a message shorter than 10 characters", () => {
    expect(validateFields(fields({ message: "hi" }))).toBe(false);
  });

  it("rejects a message longer than 2000 characters", () => {
    expect(validateFields(fields({ message: "a".repeat(2001) }))).toBe(false);
  });

  it("rejects a missing turnstile token", () => {
    expect(validateFields(fields({ turnstileToken: "" }))).toBe(false);
  });

  it("rejects a whitespace-only turnstile token", () => {
    expect(validateFields(fields({ turnstileToken: "   " }))).toBe(false);
  });
});

describe("jsonResponse", () => {
  it("builds a Function URL response with a JSON content type", () => {
    expect(jsonResponse(200, { ok: true })).toEqual({
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true }),
    });
  });
});
