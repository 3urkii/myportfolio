import { SectionHeading } from "@/components/Landing/SectionHeading";

type Cert = {
  name: string;
  issuer: string;
  date?: string;
  badge?: string;
  code?: string;
  verifyUrl?: string;
  inProgress?: boolean;
};

const certs: Cert[] = [
  {
    name: "Solutions Architect – Associate",
    issuer: "Amazon Web Services",
    date: "Mar 2026",
    badge: "/aws-saa-badge.png",
    verifyUrl:
      "https://www.credly.com/badges/1b2a71d3-22b4-44e2-a821-10eac6cb8e90/linked_in_profile",
  },
  {
    name: "Azure Administrator Associate",
    issuer: "Microsoft",
    code: "AZ-104",
    inProgress: true,
  },
];

export function Certifications() {
  return (
    <section id="certifications" className="border-t border-white/[0.09]">
      <div className="mx-auto max-w-[680px] px-6 py-[60px] sm:px-8">
        <SectionHeading title="Certifications" />
        <div className="grid gap-4 sm:grid-cols-2">
          {certs.map((cert) => (
            <div
              key={cert.name}
              className={[
                "flex flex-col items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.02] px-6 py-7 text-center transition-colors",
                cert.inProgress ? "" : "hover:border-white/[0.16]",
              ].join(" ")}
            >
              {cert.badge ? (
                <img
                  src={cert.badge}
                  alt={`${cert.issuer} ${cert.name} badge`}
                  className="h-36 w-36"
                />
              ) : (
                <div
                  role="img"
                  aria-label={cert.name}
                  className="flex h-36 w-36 items-center justify-center rounded-xl border border-dashed border-white/[0.18]"
                >
                  <span
                    aria-hidden
                    className="font-mono text-[15px] tracking-[0.12em] text-foreground/35"
                  >
                    {cert.code}
                  </span>
                </div>
              )}
              {cert.inProgress ? (
                <span className="mt-5 inline-block rounded-full border border-white/[0.14] px-2 py-[3px] text-[10px] font-normal uppercase tracking-[0.12em] text-foreground/45">
                  In Progress
                </span>
              ) : (
                <div className="mt-5 flex flex-col items-center gap-2">
                  {cert.date ? (
                    <div className="text-[10px] font-normal uppercase tracking-[0.12em] text-foreground/40">
                      {cert.date}
                    </div>
                  ) : null}
                  {cert.verifyUrl ? (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-normal uppercase tracking-[0.12em] text-red/85 transition-colors hover:text-red"
                    >
                      Verify
                      <span aria-hidden>↗</span>
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
