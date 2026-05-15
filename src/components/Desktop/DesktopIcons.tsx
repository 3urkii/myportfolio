"use client";

import { useCallback, useEffect, useState } from "react";
import { FileIcon, FolderIcon, LinkIcon } from "@/components/Desktop/icons";
import type { WindowPayload } from "@/components/Desktop/types";

type Shortcut = {
  id: string;
  label: string;
  kind: "file" | "folder" | "link";
  badge?: string;
  action:
    | { type: "open"; appId: string; payload?: WindowPayload }
    | { type: "external"; href: string };
};

const shortcuts: Shortcut[] = [
  {
    id: "readme",
    label: "README.md",
    kind: "file",
    badge: "MD",
    action: { type: "open", appId: "notes", payload: { file: "about-this-site" } },
  },
  {
    id: "resume",
    label: "Resume.pdf",
    kind: "file",
    badge: "PDF",
    action: { type: "external", href: "/resume.pdf" },
  },
  {
    id: "homelab",
    label: "Homelab",
    kind: "folder",
    action: { type: "open", appId: "projects", payload: { focus: "homelab" } },
  },
  {
    id: "github",
    label: "GitHub.url",
    kind: "link",
    action: { type: "external", href: "https://github.com/3urkii" },
  },
];

type DesktopIconsProps = {
  onOpen: (id: string, payload?: WindowPayload) => void;
};

export function DesktopIcons({ onOpen }: DesktopIconsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const launch = useCallback(
    (shortcut: Shortcut) => {
      if (shortcut.action.type === "open") {
        onOpen(shortcut.action.appId, shortcut.action.payload);
      } else {
        window.open(shortcut.action.href, "_blank", "noopener,noreferrer");
      }
    },
    [onOpen],
  );

  useEffect(() => {
    if (!selectedId) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        const s = shortcuts.find((sc) => sc.id === selectedId);
        if (s) launch(s);
      } else if (e.key === "Escape") {
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedId, launch]);

  return (
    <div
      className="pointer-events-none absolute right-6 top-24 z-10 flex flex-col gap-2"
      onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedId(null);
      }}
    >
      {shortcuts.map((shortcut) => {
        const isSelected = shortcut.id === selectedId;
        return (
          <button
            key={shortcut.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(shortcut.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              launch(shortcut);
            }}
            className={`pointer-events-auto flex w-20 flex-col items-center gap-1 rounded-lg px-1.5 py-2 transition-colors ${
              isSelected
                ? "bg-purple/16 ring-1 ring-purple/40"
                : "hover:bg-white/4"
            }`}
            aria-label={`${shortcut.label} — double-click to open`}
          >
            <div className="pointer-events-none">
              {shortcut.kind === "file" && (
                <FileIcon size={42} label={shortcut.badge ?? ""} />
              )}
              {shortcut.kind === "folder" && <FolderIcon size={42} />}
              {shortcut.kind === "link" && <LinkIcon size={42} />}
            </div>
            <span
              className={`text-center font-mono text-[0.65rem] leading-tight ${
                isSelected ? "text-foreground" : "text-foreground/85"
              }`}
            >
              {shortcut.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
