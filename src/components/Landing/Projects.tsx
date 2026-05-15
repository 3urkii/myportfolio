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
    line: "This website. Terraform IaC, S3/CloudFront, Lambda contact form (Turnstile, SSM, SNS), and OIDC CI deploy.",
    links: [{ label: "Source", href: "https://github.com/3urkii/myportfolio" }],
  },
  {
    name: "Homelab Monitoring Dashboard",
    line: "My custom build dashboard for monitoring my homelab, controlling smart lights, and a local LLM chat.",
    links: [{ label: "Source", href: "https://github.com/3urkii/homelab-monitoring" }],
  },
  {
    name: "LatiArch",
    line: "Arch + Hyprland setup inspired by Omarchy. One command from a clean install to a working desktop. I am currently working on my own setup from scratch.",
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
                      className="inline-flex items-center gap-1 text-[10px] font-normal uppercase tracking-[0.12em] text-red/85 transition-colors hover:text-red"
                    >
                      {link.label}
                      <span aria-hidden>↗</span>
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
