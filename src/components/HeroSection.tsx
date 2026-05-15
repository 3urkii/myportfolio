"use client";


type HeroSectionProps = {
  openWindow?: (id: string) => void;
};

const timeline = [
  {
    year: "2025",
    title: "Technical Support Engineer",
    detail: "Production systems, identity, endpoint, and incident response.",
  },
  {
    year: "2024",
    title: "IT Help Desk Technician",
    detail: "Supported complex environments end-to-end across users and systems.",
  },
  {
    year: "2019",
    title: "B.S. Psychology & Neuroscience",
    detail: "Florida State University — academic background before moving to IT.",
  },
];

export function HeroSection({ openWindow }: HeroSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-5">
          <div className="space-y-2">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-muted">
              Hi, I&rsquo;m
            </p>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
              Ryan Berke.
            </h1>
            <p className="text-base text-cyan">
              IT professional and aspiring cloud engineer.
            </p>
          </div>

          <p className="max-w-prose text-[0.92rem] leading-relaxed text-foreground/85">
            Two years in IT, currently sharpening my focus on cloud
            infrastructure and security. Comfortable across identity, endpoint
            management, Linux, and networking — and building hands-on
            experience with AWS, Kubernetes, and infrastructure-as-code in a
            multi-node homelab.
          </p>

          <p className="max-w-prose text-[0.92rem] leading-relaxed text-foreground/65">
            Background in psychology and neuroscience at Florida State before
            moving into IT. Based in Tampa, FL.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              onClick={() => openWindow?.("projects")}
              className="rounded-lg border border-purple-border bg-purple-soft px-4 py-2 text-sm font-medium text-purple transition-colors hover:bg-[rgba(189,147,249,0.24)]"
            >
              View projects
            </button>
            <button
              type="button"
              onClick={() => openWindow?.("contact")}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:border-white/20 hover:bg-white/8 hover:text-foreground"
            >
              Get in touch
            </button>
          </div>
        </div>

        <div className="flex flex-row gap-3 lg:w-72 lg:flex-col">
          <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/8">
            <img
              src="/profile-photo.webp"
              alt="Ryan Berke"
              loading="eager"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </figure>
          <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/8">
            <img
              src="/about.webp"
              alt="A moment from outside of work"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </figure>
        </div>
      </div>

      <section aria-labelledby="journey-heading" className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2
            id="journey-heading"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-strong"
          >
            The journey
          </h2>
          <div className="h-px flex-1 bg-white/8" />
        </div>
        <ol className="relative space-y-3">
          {timeline.map((entry) => (
            <li
              key={entry.year}
              className="flex gap-4 rounded-xl border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-white/12 hover:bg-white/[0.05]"
            >
              <div className="flex h-12 w-14 flex-shrink-0 flex-col items-center justify-center rounded-lg border border-purple-border bg-purple-soft">
                <span className="font-mono text-sm font-semibold text-purple tabular-nums">
                  {entry.year}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {entry.title}
                </p>
                <p className="text-[0.82rem] text-foreground/60">
                  {entry.detail}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
