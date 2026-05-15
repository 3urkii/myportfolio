"use client";

import { useCallback, useEffect, useState } from "react";
import { applications } from "@/components/Desktop/apps";
import type { WindowPayload } from "@/components/Desktop/types";

type MobileShellProps = {
  time: string;
  date: string;
};

export function MobileShell({ time, date }: MobileShellProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [payload, setPayload] = useState<WindowPayload>(undefined);

  const open = useCallback((id: string, nextPayload?: WindowPayload) => {
    setActiveId(id);
    setPayload(nextPayload);
  }, []);

  const close = useCallback(() => {
    setActiveId(null);
    setPayload(undefined);
  }, []);

  useEffect(() => {
    if (!activeId) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [activeId]);

  const activeApp = activeId ? applications.find((a) => a.id === activeId) : null;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <StatusBar time={time} />

      <div className="px-6 pb-32 pt-12">
        <div className="mb-8 space-y-1">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted">
            {date}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Ryan Berke</h1>
          <p className="text-sm text-foreground/70">
            IT professional, aspiring cloud engineer.
          </p>
        </div>

        <div className="grid grid-cols-4 gap-x-3 gap-y-5">
          {applications.map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => open(app.id)}
              className="flex flex-col items-center gap-1.5 transition-transform active:scale-95"
            >
              <app.Icon size={56} />
              <span className="line-clamp-1 text-center text-[0.7rem] text-foreground/90">
                {app.title.split(" — ")[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <HomeIndicator />

      {activeApp && (
        <div
          className="fixed inset-0 z-50 flex animate-mobile-sheet flex-col bg-background"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(189, 147, 249, 0.10), transparent 60%)",
          }}
        >
          <StatusBar time={time} dark />
          <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
            <button
              type="button"
              onClick={close}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-purple transition-colors hover:bg-purple-soft"
              aria-label="Back to home screen"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path
                  d="M15 6 L9 12 L15 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Home</span>
            </button>
            <p className="truncate text-sm font-semibold">
              {activeApp.title.split(" — ")[0]}
            </p>
            <div className="w-12" aria-hidden />
          </div>
          <div className="flex-1 overflow-auto px-4 py-5">
            {activeApp.component({ openWindow: open, payload })}
          </div>
          <HomeIndicator />
        </div>
      )}
    </div>
  );
}

function StatusBar({ time, dark = false }: { time: string; dark?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between px-5 pt-2.5 text-[0.7rem] font-medium tabular-nums ${
        dark ? "text-foreground" : "text-foreground/95"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <div className="relative h-4 w-4">
          <img src="/logo-nobg.png" alt="" decoding="async" className="absolute inset-0 h-full w-full object-contain" />
        </div>
        <span className="font-mono tabular-nums">{time}</span>
      </div>
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="currentColor">
          <rect x="0" y="8" width="2" height="4" rx="0.5" />
          <rect x="3.5" y="6" width="2" height="6" rx="0.5" />
          <rect x="7" y="3.5" width="2" height="8.5" rx="0.5" />
          <rect x="10.5" y="0.5" width="2" height="11.5" rx="0.5" />
        </svg>
        <svg viewBox="0 0 16 12" className="h-2.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 5 C4 2.5 12 2.5 15 5" strokeLinecap="round" />
          <path d="M3 7.5 C5 5.5 11 5.5 13 7.5" strokeLinecap="round" />
          <circle cx="8" cy="10" r="0.8" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 24 12" className="h-2.5 w-5" fill="none">
          <rect x="0.5" y="1" width="20" height="10" rx="2.4" stroke="currentColor" strokeWidth="1" />
          <rect x="21" y="4" width="2" height="4" rx="0.5" fill="currentColor" />
          <rect x="2" y="2.5" width="15" height="7" rx="1.4" fill="#50fa7b" />
        </svg>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-1.5 z-30 flex justify-center">
      <span className="h-1 w-28 rounded-full bg-foreground/40" />
    </div>
  );
}
