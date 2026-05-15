import { describe, it, expect, vi, afterEach } from "vitest";
import { validate, submitContact, type ContactFormValues } from "@/lib/contactForm";

function values(overrides: Partial<ContactFormValues> = {}): ContactFormValues {
  return {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Hello, I would like to get in touch about a role.",
    company: "",
    ...overrides,
  };
}

describe("validate", () => {
  it("returns no errors for valid input", () => {
    expect(validate(values())).toEqual({});
  });

  it("flags an empty (whitespace-only) name", () => {
    expect(validate(values({ name: "   " })).name).toBeTruthy();
  });

  it("flags a name longer than 100 characters", () => {
    expect(validate(values({ name: "a".repeat(101) })).name).toBeTruthy();
  });

  it("flags an empty email", () => {
    expect(validate(values({ email: "" })).email).toBeTruthy();
  });

  it("flags a malformed email", () => {
    expect(validate(values({ email: "not-an-email" })).email).toBeTruthy();
  });

  it("flags a message shorter than 10 characters", () => {
    expect(validate(values({ message: "hi" })).message).toBeTruthy();
  });

  it("flags a message longer than 2000 characters", () => {
    expect(validate(values({ message: "a".repeat(2001) })).message).toBeTruthy();
  });
});

describe("submitContact", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("short-circuits to success when the honeypot is filled, without calling fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await submitContact(
      values({ company: "Acme Corp" }),
      "token",
      "https://example.com/contact",
    );
    expect(result).toEqual({ status: "success" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns a server error when the endpoint is empty, without calling fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const result = await submitContact(values(), "token", "");
    expect(result).toEqual({ status: "error", kind: "server" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the expected JSON body and returns success on 200", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const result = await submitContact(
      values(),
      "tok-123",
      "https://example.com/contact",
    );
    expect(result).toEqual({ status: "success" });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://example.com/contact");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body)).toEqual({
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Hello, I would like to get in touch about a role.",
      turnstileToken: "tok-123",
      company: "",
    });
  });

  it("maps 429 to a rate-limited error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 429 })),
    );
    expect(
      await submitContact(values(), "t", "https://example.com/contact"),
    ).toEqual({ status: "error", kind: "rate-limited" });
  });

  it("maps 400 {error:'turnstile'} to a turnstile error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: false, error: "turnstile" }), {
          status: 400,
        }),
      ),
    );
    expect(
      await submitContact(values(), "t", "https://example.com/contact"),
    ).toEqual({ status: "error", kind: "turnstile" });
  });

  it("maps 400 {error:'spam'} to a spam error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: false, error: "spam" }), {
          status: 400,
        }),
      ),
    );
    expect(
      await submitContact(values(), "t", "https://example.com/contact"),
    ).toEqual({ status: "error", kind: "spam" });
  });

  it("maps a 400 with an unrecognized body to a validation error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("not json", { status: 400 })),
    );
    expect(
      await submitContact(values(), "t", "https://example.com/contact"),
    ).toEqual({ status: "error", kind: "validation" });
  });

  it("maps 500 to a server error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 500 })),
    );
    expect(
      await submitContact(values(), "t", "https://example.com/contact"),
    ).toEqual({ status: "error", kind: "server" });
  });

  it("maps a thrown fetch (network failure) to a network error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("failed")));
    expect(
      await submitContact(values(), "t", "https://example.com/contact"),
    ).toEqual({ status: "error", kind: "network" });
  });
});
