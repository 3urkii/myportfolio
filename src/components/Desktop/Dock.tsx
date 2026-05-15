"use client";

import { useState } from "react";
import { applications } from "@/components/Desktop/apps";

type DockProps = {
  openIds: string[];
  minimizedIds: string[];
  activeId: string | null;
  onLaunch: (id: string) => void;
};

export function Dock({ openIds, minimizedIds, activeId, onLaunch }: DockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const items = applications.filter((app) => app.pinned);

  return (
    <div
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 select-none"
      role="toolbar"
      aria-label="Dock"
    >
      <div
        className="flex items-end gap-1.5 rounded-2xl border border-white/10 px-2.5 py-2 backdrop-blur-2xl shadow-[0_16px_50px_-12px_rgba(0,0,0,0.6)]"
        style={{ backgroundColor: "rgba(33, 34, 44, 0.75)" }}
        onMouseLeave={() => setHoveredId(null)}
      >
        {items.map((app) => {
          const isOpen = openIds.includes(app.id);
          const isMinimized = minimizedIds.includes(app.id);
          const isActive = app.id === activeId;
          const isHovered = hoveredId === app.id;
          const scale = isHovered ? 1.18 : 1;

          return (
            <button
              key={app.id}
              type="button"
              onClick={() => onLaunch(app.id)}
              onMouseEnter={() => setHoveredId(app.id)}
              className="group relative flex flex-col items-center transition-transform"
              aria-label={`${app.title}${isOpen ? " (open)" : ""}`}
            >
              <div
                className="origin-bottom transition-transform duration-150"
                style={{ transform: `scale(${scale})` }}
              >
                <app.Icon size={42} />
              </div>
              {isOpen && (
                <span
                  className={`absolute -bottom-1 h-1 w-1 rounded-full transition-colors ${
                    isActive && !isMinimized
                      ? "bg-purple"
                      : "bg-white/50"
                  }`}
                  aria-hidden
                />
              )}
              {isHovered && (
                <span
                  className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-white/10 px-2 py-1 text-[0.65rem] font-medium text-foreground backdrop-blur-xl"
                  style={{ backgroundColor: "rgba(33, 34, 44, 0.95)" }}
                >
                  {app.title.split(" — ")[0]}
                  {app.shortcut && (
                    <span className="ml-1.5 font-mono text-muted">{app.shortcut}</span>
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
