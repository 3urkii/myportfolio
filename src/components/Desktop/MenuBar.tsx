"use client";

import { useEffect, useRef, useState } from "react";
import { applications } from "@/components/Desktop/apps";

type MenuBarProps = {
  onMenuSelect: (id: string) => void;
  time: string;
  date: string;
  activeId: string | null;
};

const navItems = [
  { label: "About", id: "welcome" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Contact", id: "contact" },
];

export function MenuBar({ onMenuSelect, time, date, activeId }: MenuBarProps) {
  const [systemMenuOpen, setSystemMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!systemMenuOpen) return;
    const handle = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setSystemMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [systemMenuOpen]);

  const activeApp = applications.find((a) => a.id === activeId);
  const activeTitle = activeApp ? activeApp.title.split(" — ")[0] : "Finder";

  return (
    <nav
      className="fixed inset-x-4 top-4 z-50 flex items-center justify-between gap-4 rounded-2xl border border-white/8 px-3 py-2 backdrop-blur-2xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]"
      style={{ backgroundColor: "rgba(40, 42, 54, 0.78)" }}
      aria-label="Application menu"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setSystemMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/8"
            aria-haspopup="menu"
            aria-expanded={systemMenuOpen}
          >
            <div className="relative h-5 w-5">
              <img
                src="/logo-nobg.png"
                alt=""
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
            <span className="hidden text-xs font-semibold tracking-tight text-foreground sm:inline">
              {activeTitle}
            </span>
          </button>
          {systemMenuOpen && (
            <div
              className="absolute left-0 top-full mt-2 min-w-[200px] rounded-xl border border-white/10 p-1.5 backdrop-blur-2xl shadow-[0_16px_40px_-12px_rgba(0,0,0,0.6)]"
              style={{ backgroundColor: "rgba(33, 34, 44, 0.95)" }}
              role="menu"
            >
              <MenuRow
                onClick={() => {
                  setSystemMenuOpen(false);
                  onMenuSelect("welcome");
                }}
              >
                <span>About berke.pro</span>
              </MenuRow>
              <MenuRow
                onClick={() => {
                  setSystemMenuOpen(false);
                  onMenuSelect("terminal");
                }}
              >
                <span>Open Terminal</span>
                <kbd className="font-mono text-[0.6rem] text-muted">⌘5</kbd>
              </MenuRow>
              <a
                href="https://github.com/3urkii/myportfolio"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-md px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:bg-purple-soft hover:text-purple"
                role="menuitem"
                onClick={() => setSystemMenuOpen(false)}
              >
                <span>View source</span>
                <span aria-hidden className="text-muted">↗</span>
              </a>
              <div className="my-1 h-px bg-white/8" />
              <div className="px-3 py-1 font-mono text-[0.6rem] text-muted">
                berke.pro · v1.0
              </div>
            </div>
          )}
        </div>

        <div className="hidden h-4 w-px bg-white/10 sm:block" />
        <div className="hidden gap-1 sm:flex">
          {navItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onMenuSelect(item.id)}
                className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-purple-soft text-purple"
                    : "text-foreground/75 hover:bg-white/5 hover:text-foreground"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2.5 text-xs flex-shrink-0">
        <WifiIcon />
        <BatteryIcon />
        <div className="hidden h-4 w-px bg-white/10 sm:block" />
        <span
          className="h-1.5 w-1.5 rounded-full bg-green animate-pulse"
          aria-hidden
        />
        <div className="hidden flex-col items-end leading-none sm:flex">
          <span className="font-mono text-[0.65rem] text-muted">{date}</span>
          <span className="font-mono text-xs tabular-nums text-muted-strong">
            {time}
          </span>
        </div>
        <span className="font-mono text-xs tabular-nums text-muted-strong sm:hidden">
          {time}
        </span>
      </div>
    </nav>
  );
}

function MenuRow({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-1.5 text-xs text-foreground/85 transition-colors hover:bg-purple-soft hover:text-purple"
    >
      {children}
    </button>
  );
}

function WifiIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 text-muted-strong"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-label="Wi-Fi"
    >
      <path d="M2.5 6.5C4 5 6 4 8 4s4 1 5.5 2.5" />
      <path d="M4.5 9C5.5 8 6.7 7.5 8 7.5s2.5 0.5 3.5 1.5" />
      <path d="M6.5 11.5C7 11 7.5 10.8 8 10.8s1 0.2 1.5 0.7" />
      <circle cx="8" cy="13" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      viewBox="0 0 24 14"
      className="h-3.5 w-5 text-muted-strong"
      fill="none"
      aria-label="Battery"
    >
      <rect
        x="1"
        y="1.5"
        width="19"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect x="21" y="5" width="2" height="4" rx="0.5" fill="currentColor" />
      <rect x="2.5" y="3" width="13" height="8" rx="1" fill="#50fa7b" />
    </svg>
  );
}
