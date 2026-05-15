import { SectionHeading } from "@/components/Landing/SectionHeading";

type Row = {
  cat: string;
  items: string;
};

const rows: Row[] = [
  {
    cat: "Cloud & Infra",
    items:
      "AWS, Azure, Docker, Kubernetes, Linux, Terraform, Proxmox VE, TrueNAS, LocalStack, Snowflake",
  },
  {
    cat: "Identity & Endpoint",
    items:
      "Microsoft Entra, Active Directory, Intune, Apple Business Manager, Defender XDR, NinjaRMM",
  },
  {
    cat: "Frameworks & Compliance",
    items: "NIST, ISO 27001, HHS 405(d)",
  },
  {
    cat: "Automation & Code",
    items: "GitHub Actions, boto3, Bash, Python, TypeScript, YAML / JSON",
  },
];

export function Tools() {
  return (
    <section id="tools" className="border-t border-white/[0.09]">
      <div className="mx-auto max-w-[680px] px-6 py-[60px] sm:px-8">
        <SectionHeading title="Tools & Skills" />
        <div>
          {rows.map((row) => (
            <div
              key={row.cat}
              className="grid gap-2 border-t border-white/[0.09] py-4 first:border-t-0 first:pt-0 sm:grid-cols-[128px_1fr] sm:gap-8"
            >
              <div className="pt-[3px] text-[10.5px] font-normal uppercase tracking-[0.13em] text-foreground/40">
                {row.cat}
              </div>
              <div className="text-[14.5px] font-light leading-[1.65] text-foreground/70">
                {row.items}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
