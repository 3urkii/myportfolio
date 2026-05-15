import { ContactSection } from "@/components/ContactSection";
import { HeroSection } from "@/components/HeroSection";
import { NotesApp } from "@/components/NotesApp";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";
import { Terminal } from "@/components/Terminal";
import {
  AboutIcon,
  ContactIcon,
  NotesIcon,
  ProjectsIcon,
  SkillsIcon,
  TerminalIcon,
} from "@/components/Desktop/icons";
import type { AppDefinition } from "@/components/Desktop/types";

export const applications: AppDefinition[] = [
  {
    id: "welcome",
    title: "About — Ryan Berke",
    subtitle: "~/about",
    badge: "Home",
    defaultSize: { width: 760, height: 620 },
    defaultPosition: { x: 80, y: 96 },
    Icon: AboutIcon,
    pinned: true,
    shortcut: "⌘1",
    component: ({ openWindow }) => <HeroSection openWindow={openWindow} />,
  },
  {
    id: "skills",
    title: "Skills",
    subtitle: "~/skills",
    defaultSize: { width: 560, height: 460 },
    defaultPosition: { x: 180, y: 160 },
    Icon: SkillsIcon,
    pinned: true,
    shortcut: "⌘2",
    component: () => <SkillsSection />,
  },
  {
    id: "projects",
    title: "Projects",
    subtitle: "~/projects",
    defaultSize: { width: 620, height: 560 },
    defaultPosition: { x: 140, y: 140 },
    Icon: ProjectsIcon,
    pinned: true,
    shortcut: "⌘3",
    component: ({ payload }) => (
      <ProjectsSection
        focus={typeof payload?.focus === "string" ? payload.focus : undefined}
      />
    ),
  },
  {
    id: "contact",
    title: "Contact",
    subtitle: "~/contact",
    badge: "Available",
    defaultSize: { width: 600, height: 520 },
    defaultPosition: { x: 220, y: 120 },
    Icon: ContactIcon,
    pinned: true,
    shortcut: "⌘4",
    component: () => <ContactSection />,
  },
  {
    id: "terminal",
    title: "Terminal — ryan@berkepro",
    subtitle: "/bin/sh",
    defaultSize: { width: 640, height: 420 },
    defaultPosition: { x: 200, y: 180 },
    Icon: TerminalIcon,
    pinned: true,
    shortcut: "⌘5",
    component: ({ openWindow }) => <Terminal openWindow={openWindow} />,
  },
  {
    id: "notes",
    title: "Notes",
    subtitle: "~/notes",
    defaultSize: { width: 700, height: 520 },
    defaultPosition: { x: 240, y: 200 },
    Icon: NotesIcon,
    pinned: true,
    shortcut: "⌘6",
    component: ({ payload, openWindow }) => (
      <NotesApp openWindow={openWindow} payload={payload} />
    ),
  },
];

export const appById = new Map(applications.map((a) => [a.id, a]));
