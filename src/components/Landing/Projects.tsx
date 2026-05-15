import { SectionHeading } from "@/components/Landing/SectionHeading";

type ProjectLink = {
  label: string;
  href: string;
};

type Project = {
  name: string;
  line: string;
  links: ProjectLink[];
};

const projects: Project[] = [
  {
    name: "berke.pro",
    line: "This site. Vite + React on S3 behind CloudFront, deployed by GitHub Actions over OIDC — no AWS keys in the repo.",
    links: [
      { label: "Live", href: "https://berke.pro" },
      { label: "Source", href: "https://github.com/3urkii/myportfolio" },
    ],
  },
  {
    name: "Homelab",
    line: "Two Proxmox nodes and a self-built TrueNAS box. Where I break things before production has to.",
    links: [{ label: "Source", href: "https://github.com/3urkii/homelab" }],
  },
  {
    name: "LatiArch",
    line: "Arch + Hyprland setup forked from Omarchy. One command from a clean install to a working desktop.",
    links: [{ label: "Source", href: "https://github.com/3urkii/latiarch" }],
  },
];

export function Projects() {
  return (
    <section id="projects" className="border-t border-white/[0.09]">
      <div className="mx-auto max-w-[680px] px-6 py-[60px] sm:px-8">
        <SectionHeading title="Projects" />
        <div>
          {projects.map((project) => (
            <article
              key={project.name}
              className="border-t border-white/[0.09] py-[22px] first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline gap-3">
                <h3 className="font-serif text-[18px] font-normal tracking-[-0.01em] text-foreground">
                  {project.name}
                </h3>
                <div className="ml-auto flex gap-4">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-light text-foreground/50 transition-colors hover:text-red"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <p className="mt-1.5 max-w-[480px] text-[13.5px] font-light leading-[1.6] text-foreground/60">
                {project.line}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
