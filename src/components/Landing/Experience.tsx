import { SectionHeading } from "@/components/Landing/SectionHeading";

type Entry = {
  date: string;
  title: string;
  org: string;
  line: string;
  current?: boolean;
};

const entries: Entry[] = [
  {
    date: "Mar 2025 — Now",
    title: "L1 Support Engineer",
    org: "LocalStack · Remote",
    line: "LocalStack is a local sandbox to develop and break cloud infrastructure before it goes live. Here, I work with customers to triage and debug their issues with LocalStack to provide an ideal environment for testing their infrastructure.",
    current: true,
  },
  {
    date: "Jan 2025 — Now",
    title: "IT Technician",
    org: "Basis Practice Solutions · Remote",
    line: "Side hustle contract work including incident response and after-hours on-call rotations for a myriad of healthcare clients across the US.",
    current: true,
  },
  {
    date: "Feb 2024 — Mar 2025",
    title: "IT Helpdesk Technician I",
    org: "Big Bend Hospice · Tallahassee, FL",
    line: "The beginning of my IT journey. Provisioned and managed users and endpoints in a Microsoft 365 environment. Participated in a biweekly on-call rotation for 24/7 support. Planned and executed an on-prem AD to AzureAD migration, resulting in about $50K/year saved on physical infrastructure.",
  },
  {
    date: "May 2021 — Feb 2024",
    title: "Office Assistant",
    org: "KD Process · Tallahassee, FL",
    line: "Coordinated service of process nationwide and handled all accounts payable inquiries. Configured an online payment portal for clients to securely submit payment via credit/debit card and ACH.",
  },
  {
    date: "2019 — 2023",
    title: "B.S. Psychology, Minor in Business",
    org: "Florida State University",
    line: "During my studies, I worked in social psychology lab studying threat and emotion perception. Later, I moved into a behavioral neuroscience lab where I contributed to addiction and eating behavior research with animal subjects.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="border-t border-white/[0.09]">
      <div className="mx-auto max-w-[680px] px-6 py-[60px] sm:px-8">
        <SectionHeading title="Experience" />
        <ol>
          {entries.map((entry, i) => {
            const isFirst = i === 0;
            const isLast = i === entries.length - 1;
            return (
              <li
                key={entry.title}
                className="grid grid-cols-[1px_1fr] gap-x-[26px] py-6 first:pt-0"
              >
                <div className="relative">
                  <div
                    aria-hidden
                    className={[
                      "absolute left-0 w-px bg-white/[0.12]",
                      isFirst ? "top-[6px]" : "-top-6",
                      isLast ? "h-[31px]" : "-bottom-6",
                    ].join(" ")}
                  />
                  <span
                    aria-hidden
                    className={
                      entry.current
                        ? "timeline-dot-current absolute left-0 top-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-red shadow-[0_0_0_4px_var(--background)]"
                        : "absolute left-0 top-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full border-[1.5px] border-white/30 bg-background shadow-[0_0_0_4px_var(--background)]"
                    }
                  />
                </div>
                <div>
                  <div className="text-[10.5px] font-normal uppercase tracking-[0.12em] text-foreground/40">
                    {entry.date}
                  </div>
                  <h3 className="mt-1.5 font-serif text-[18px] font-normal tracking-[-0.01em] text-foreground">
                    {entry.title}
                  </h3>
                  <div className="text-[12.5px] font-light text-foreground/50">
                    {entry.org}
                  </div>
                  <p className="mt-2 max-w-[440px] text-[13.5px] font-light leading-[1.65] text-foreground/60">
                    {entry.line}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
