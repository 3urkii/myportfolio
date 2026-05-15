"use client";

const cards = [
  {
    label: "Message",
    value: "berke.pro/#contact",
    href: "/#contact",
    primary: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/ryan-berke-b093152a7",
    href: "https://www.linkedin.com/in/ryan-berke-b093152a7/",
    primary: false,
  },
  {
    label: "GitHub",
    value: "github.com/3urkii",
    href: "https://github.com/3urkii",
    primary: false,
  },
];

const labelClass = "font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted";

export function ContactSection() {
  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-prose text-[0.92rem] leading-relaxed text-foreground/75">
        The fastest way to reach me is the contact form — I respond within a day
        or two. Open to full-time roles in cloud infrastructure, security, or
        platform engineering.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            target={card.href.startsWith("http") ? "_blank" : undefined}
            rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`group flex flex-col gap-1.5 rounded-xl border p-4 transition-colors ${
              card.primary
                ? "border-purple-border bg-purple-soft hover:bg-[rgba(189,147,249,0.24)]"
                : "border-white/8 bg-white/[0.03] hover:border-white/16 hover:bg-white/[0.06]"
            }`}
          >
            <span
              className={`${labelClass} ${
                card.primary ? "text-purple" : ""
              }`}
            >
              {card.label}
            </span>
            <span
              className={`text-sm font-medium ${
                card.primary ? "text-purple" : "text-foreground"
              }`}
            >
              {card.value}
            </span>
            <span
              aria-hidden
              className={`mt-auto text-xs ${
                card.primary ? "text-purple/80" : "text-muted-strong"
              }`}
            >
              Open →
            </span>
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-white/8 bg-white/[0.03] p-4">
        <p className={labelClass}>Location</p>
        <p className="mt-1.5 text-sm text-foreground">Tampa, FL</p>
      </div>
    </div>
  );
}
