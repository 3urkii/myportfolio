import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { snsSend, ssmSend } = vi.hoisted(() => ({
  snsSend: vi.fn(),
  ssmSend: vi.fn(),
}));

// Mock factories use `function` (not arrow) syntax: these exports are used as
// constructors (`new SNSClient()`), and vitest 4 rejects arrow-function mocks
// in a constructor position. A constructor returning an object yields that object.
vi.mock("@aws-sdk/client-sns", () => ({
  SNSClient: vi.fn(function () {
    return { send: snsSend };
  }),
  PublishCommand: vi.fn(function (input) {
    return { __type: "Publish", input };
  }),
}));
vi.mock("@aws-sdk/client-ssm", () => ({
  SSMClient: vi.fn(function () {
    return { send: ssmSend };
  }),
  GetParameterCommand: vi.fn(function (input) {
    return { __type: "GetParameter", input };
  }),
}));

function event(bodyObj) {
  return {
    body: typeof bodyObj === "string" ? bodyObj : JSON.stringify(bodyObj),
    isBase64Encoded: false,
  };
}

function validBody(overrides = {}) {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Hello, I would like to get in touch about a role.",
    turnstileToken: "tok-123",
    company: "",
    ...overrides,
  };
}

function turnstileResult(success) {
  globalThis.fetch.mockResolvedValue(
    new Response(JSON.stringify({ success }), { status: 200 }),
  );
}

let handler;

beforeEach(async () => {
  vi.resetModules();
  snsSend.mockReset().mockResolvedValue({});
  ssmSend.mockReset().mockResolvedValue({ Parameter: { Value: "test-secret" } });
  vi.stubGlobal("fetch", vi.fn());
  process.env.SNS_TOPIC_ARN = "arn:aws:sns:us-east-1:111111111111:berkepro-contact";
  process.env.TURNSTILE_SECRET_PARAM = "/berkepro/turnstile-secret-key";
  ({ handler } = await import("./index.mjs"));
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("handler", () => {
  it("returns 400 validation for a malformed body, without calling fetch or SNS", async () => {
    const res = await handler(event("not json"));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body)).toEqual({ ok: false, error: "validation" });
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(snsSend).not.toHaveBeenCalled();
  });

  it("returns 400 spam for a filled honeypot, before any Turnstile or SNS call", async () => {
    const res = await handler(event(validBody({ company: "Acme" })));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body)).toEqual({ ok: false, error: "spam" });
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(snsSend).not.toHaveBeenCalled();
  });

  it("checks the honeypot before field validation (cheapest check first)", async () => {
    // Honeypot filled AND fields invalid -> spam wins.
    const res = await handler(event(validBody({ company: "Acme", message: "hi" })));
    expect(JSON.parse(res.body).error).toBe("spam");
  });

  it("returns 400 validation for invalid fields, without calling fetch or SNS", async () => {
    const res = await handler(event(validBody({ email: "nope" })));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body)).toEqual({ ok: false, error: "validation" });
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(snsSend).not.toHaveBeenCalled();
  });

  it("returns 400 turnstile when verification fails, without calling SNS", async () => {
    turnstileResult(false);
    const res = await handler(event(validBody()));
    expect(res.statusCode).toBe(400);
    expect(JSON.parse(res.body)).toEqual({ ok: false, error: "turnstile" });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(snsSend).not.toHaveBeenCalled();
  });

  it("publishes to SNS and returns 200 when Turnstile passes", async () => {
    turnstileResult(true);
    const res = await handler(event(validBody()));
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual({ ok: true });
    expect(snsSend).toHaveBeenCalledTimes(1);
    const cmd = snsSend.mock.calls[0][0];
    expect(cmd.input.TopicArn).toBe(process.env.SNS_TOPIC_ARN);
    expect(cmd.input.Message).toContain("ada@example.com");
    expect(cmd.input.Message).toContain("Ada Lovelace");
  });

  it("returns 500 server when SNS publish throws", async () => {
    turnstileResult(true);
    snsSend.mockRejectedValue(new Error("SNS down"));
    const res = await handler(event(validBody()));
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ ok: false, error: "server" });
  });

  it("reads the Turnstile secret from SSM with decryption", async () => {
    turnstileResult(true);
    await handler(event(validBody()));
    expect(ssmSend).toHaveBeenCalledTimes(1);
    expect(ssmSend.mock.calls[0][0].input).toEqual({
      Name: "/berkepro/turnstile-secret-key",
      WithDecryption: true,
    });
  });

  it("posts the secret and token to Cloudflare's siteverify endpoint", async () => {
    turnstileResult(true);
    await handler(event(validBody()));
    const [url, init] = globalThis.fetch.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(init.method).toBe("POST");
    const sent = new URLSearchParams(init.body);
    expect(sent.get("secret")).toBe("test-secret");
    expect(sent.get("response")).toBe("tok-123");
  });

  it("returns 500 server when the Turnstile request throws", async () => {
    globalThis.fetch.mockRejectedValue(new Error("network"));
    const res = await handler(event(validBody()));
    expect(res.statusCode).toBe(500);
    expect(JSON.parse(res.body)).toEqual({ ok: false, error: "server" });
    expect(snsSend).not.toHaveBeenCalled();
  });

  it("reads the Turnstile secret from SSM only once across warm invocations", async () => {
    globalThis.fetch.mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    await handler(event(validBody()));
    globalThis.fetch.mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    await handler(event(validBody()));
    expect(ssmSend).toHaveBeenCalledTimes(1);
    expect(snsSend).toHaveBeenCalledTimes(2);
  });
});
