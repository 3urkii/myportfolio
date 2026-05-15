"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { AppComponentProps } from "@/components/Desktop/types";

type Note = {
  id: string;
  title: string;
  updated: string;
  tag: string;
  body: string;
};

const notes: Note[] = [
  {
    id: "about-this-site",
    title: "about this site",
    updated: "2026-05-13",
    tag: "meta",
    body: `# about this site

a portfolio styled as a small desktop OS, inspired by posthog's wizardo OS.

## stack
- next.js 15 with the app router and turbopack
- react 19, tailwind 4
- resend for the contact form
- static export, deployed manually

## why
i wanted a portfolio that felt like a thing you could use, not a brochure. the
window manager, dock, and terminal are all written from scratch (no third-party
WM library). it's a work in progress.

## what's here
- About — bio + timeline
- Skills — current tools + what i'm studying
- Projects — homelab, this site, latiarch
- Contact — form (Resend) + direct links
- Terminal — interactive shell, try \`help\`
- Notes — what you're reading right now

## what's next
- theme switcher (dracula → tokyo night → catppuccin)
- live homelab status widget
- spotlight / cmd-k command palette
- snap-to-edge window tiling`,
  },
  {
    id: "homelab-notes",
    title: "homelab notes",
    updated: "2026-04-22",
    tag: "infra",
    body: `# homelab notes

an ongoing brain dump of what's running and why.

## hardware
- two proxmox nodes (mini PCs, nothing fancy)
- custom NAS — old desktop case, TrueNAS Scale
- unifi stack: USG, switch, two APs

## services
- plex + arr stack
- nextcloud (mostly photos)
- pi-hole on a tiny LXC
- a couple of game servers (rotate based on what friends are playing)

## things i broke this quarter
- swapped a ZFS pool to mirror without enough free space, recovered with a USB
  drive shuffle. lesson: snapshot before topology changes.
- accidentally locked myself out of pfsense after a rule import. console cable
  saved the day.

## what i want next
- proper backup target offsite (probably backblaze b2)
- terraform module for proxmox VM provisioning
- decent monitoring — i keep saying "i'll set up grafana" and then don't`,
  },
  {
    id: "learning-aws",
    title: "learning aws",
    updated: "2026-05-02",
    tag: "study",
    body: `# learning aws

notes from working toward the SAA-C03.

## current focus
- IAM: policies, roles, STS, identity vs resource policies. the diff between
  inline and managed policies bit me on a practice question.
- VPC: route tables, NACLs vs security groups. NACLs are stateless, SGs are
  stateful. flow logs to cloudwatch.

## upcoming
- s3 storage classes + lifecycle rules
- rds vs aurora vs dynamodb decision matrix
- well-architected framework pillars

## resources i'm using
- stephane maarek's udemy course (the classic)
- tutorialsdojo practice exams
- aws skill builder for the free labs

## habit
~45 minutes most weekdays. weekend deep-dive when i can.`,
  },
];

function renderMarkdown(body: string) {
  const lines = body.split("\n");
  const nodes: { kind: string; content: string }[] = [];
  let inCode = false;
  let codeBuf: string[] = [];

  for (const line of lines) {
    if (line.startsWith("```")) {
      if (inCode) {
        nodes.push({ kind: "code", content: codeBuf.join("\n") });
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      continue;
    }
    if (line.startsWith("# ")) nodes.push({ kind: "h1", content: line.slice(2) });
    else if (line.startsWith("## ")) nodes.push({ kind: "h2", content: line.slice(3) });
    else if (line.startsWith("### ")) nodes.push({ kind: "h3", content: line.slice(4) });
    else if (line.startsWith("- ")) nodes.push({ kind: "li", content: line.slice(2) });
    else if (line.trim() === "") nodes.push({ kind: "br", content: "" });
    else nodes.push({ kind: "p", content: line });
  }

  if (inCode && codeBuf.length) {
    nodes.push({ kind: "code", content: codeBuf.join("\n") });
  }

  return nodes;
}

function NoteBody({ body }: { body: string }) {
  const nodes = useMemo(() => renderMarkdown(body), [body]);
  const elements: React.ReactNode[] = [];
  let listBuf: string[] = [];

  const flushList = (key: number) => {
    if (listBuf.length === 0) return;
    elements.push(
      <ul
        key={`list-${key}`}
        className="mb-3 ml-4 list-disc space-y-1 text-sm text-foreground/80 marker:text-purple/70"
      >
        {listBuf.map((item, idx) => (
          <li key={idx}>{renderInline(item)}</li>
        ))}
      </ul>,
    );
    listBuf = [];
  };

  nodes.forEach((node, idx) => {
    if (node.kind === "li") {
      listBuf.push(node.content);
      return;
    }
    flushList(idx);
    switch (node.kind) {
      case "h1":
        elements.push(
          <h2 key={idx} className="mb-3 text-xl font-semibold tracking-tight text-foreground">
            {node.content}
          </h2>,
        );
        break;
      case "h2":
        elements.push(
          <h3
            key={idx}
            className="mb-2 mt-5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-purple"
          >
            {node.content}
          </h3>,
        );
        break;
      case "h3":
        elements.push(
          <h4 key={idx} className="mb-1.5 mt-3 text-sm font-semibold text-foreground/90">
            {node.content}
          </h4>,
        );
        break;
      case "code":
        elements.push(
          <pre
            key={idx}
            className="mb-3 overflow-auto rounded-lg border border-white/8 bg-surface-sunken/80 p-3 text-[0.78rem] text-cyan"
          >
            {node.content}
          </pre>,
        );
        break;
      case "p":
        elements.push(
          <p key={idx} className="mb-3 text-sm leading-relaxed text-foreground/80">
            {renderInline(node.content)}
          </p>,
        );
        break;
      case "br":
        break;
    }
  });
  flushList(nodes.length);

  return <div>{elements}</div>;
}

function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith("`")) {
      parts.push(
        <code
          key={key++}
          className="rounded bg-surface-sunken/80 px-1 py-0.5 font-mono text-[0.78rem] text-cyan"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

export function NotesApp({ payload }: AppComponentProps) {
  const requested =
    typeof payload?.file === "string" ? (payload.file as string) : null;
  const [activeId, setActiveId] = useState<string>(
    requested && notes.some((n) => n.id === requested) ? requested : notes[0].id,
  );
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (requested && notes.some((n) => n.id === requested)) {
      setActiveId(requested);
    }
  }, [requested]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0;
  }, [activeId]);

  const active = notes.find((n) => n.id === activeId) ?? notes[0];

  return (
    <div className="flex h-full min-h-0 gap-3 -mt-1">
      <aside className="hidden w-44 flex-col gap-1 border-r border-white/5 pr-3 sm:flex">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted">
          notes
        </p>
        <ul className="mt-1 space-y-0.5">
          {notes.map((note) => {
            const isActive = note.id === active.id;
            return (
              <li key={note.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(note.id)}
                  className={`flex w-full flex-col items-start gap-0.5 rounded-md px-2 py-1.5 text-left transition-colors ${
                    isActive
                      ? "bg-purple-soft text-purple"
                      : "text-foreground/75 hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <span className="text-xs font-medium leading-tight">{note.title}</span>
                  <span className="font-mono text-[0.6rem] text-muted">
                    {note.tag} · {note.updated}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex w-full min-w-0 flex-col">
        <div className="flex gap-1 overflow-x-auto sm:hidden">
          {notes.map((note) => {
            const isActive = note.id === active.id;
            return (
              <button
                key={note.id}
                type="button"
                onClick={() => setActiveId(note.id)}
                className={`flex-shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-purple-soft text-purple"
                    : "text-foreground/70 hover:bg-white/5"
                }`}
              >
                {note.title}
              </button>
            );
          })}
        </div>
        <div ref={bodyRef} className="mt-1 flex-1 overflow-auto pr-1">
          <NoteBody body={active.body} />
        </div>
      </div>
    </div>
  );
}
