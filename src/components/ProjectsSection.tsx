"use client";

import { useEffect, useRef } from "react";

type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  github: string;
  tags: string[];
};

const projects: Project[] = [
  {
    id: "berkepro",
    title: "berke.pro — Static site on AWS",
    description:
      "This site. Next.js static export deployed to S3, served by CloudFront, pushed by GitHub Actions over OIDC — no long-lived AWS keys in the repo.",
    image: "/port.webp",
    github: "https://github.com/3urkii/myportfolio",
    tags: ["Next.js", "S3", "CloudFront", "GitHub Actions"],
  },
  {
    id: "homelab",
    title: "Homelab",
    description:
      "Two-node Proxmox cluster, custom TrueNAS box, UniFi network. Hosts internal services on isolated VLANs with snapshot-based ZFS backups.",
    image: "/homelab.webp",
    github: "https://github.com/3urkii/homelab",
    tags: ["Proxmox", "TrueNAS", "UniFi", "Linux"],
  },
  {
    id: "latiarch",
    title: "LatiArch",
    description:
      "Arch Linux + Hyprland setup forked from Omarchy. Reproducible bootstrap script and templated dotfiles that work across machines.",
    image: "/latiarch.webp",
    github: "https://github.com/3urkii/latiarch",
    tags: ["Arch Linux", "Hyprland", "Bash"],
  },
];

type ProjectsSectionProps = {
  focus?: string;
};

export function ProjectsSection({ focus }: ProjectsSectionProps = {}) {
  const refs = useRef<Map<string, HTMLElement | null>>(new Map());

  useEffect(() => {
    if (!focus) return;
    const target = refs.current.get(focus);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("ring-2", "ring-purple", "ring-offset-2", "ring-offset-surface");
      const timer = setTimeout(() => {
        target.classList.remove("ring-2", "ring-purple", "ring-offset-2", "ring-offset-surface");
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [focus]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {projects.map((project) => (
        <article
          key={project.title}
          ref={(el) => {
            refs.current.set(project.id, el);
          }}
          className="group flex flex-col overflow-hidden rounded-xl border border-white/8 bg-white/[0.03] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/14 hover:bg-white/[0.05]"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-white/5">
            <img
              src={project.image}
              alt={`${project.title} preview`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-3 p-4">
            <div className="space-y-2">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground/70">
                {project.description}
              </p>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted-strong"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-foreground/80 transition-colors hover:border-purple-border hover:bg-purple-soft hover:text-purple"
            >
              <span>View source</span>
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 11 L11 5 M6 5 L11 5 L11 10" />
              </svg>
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}
