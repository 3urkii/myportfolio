"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { applications, appById } from "@/components/Desktop/apps";
import { DesktopIcons } from "@/components/Desktop/DesktopIcons";
import { Dock } from "@/components/Desktop/Dock";
import { MenuBar } from "@/components/Desktop/MenuBar";
import { MobileShell } from "@/components/Desktop/MobileShell";
import { WindowFrame } from "@/components/WindowFrame";
import type {
  PersistedWindow,
  WindowInstance,
  WindowPayload,
} from "@/components/Desktop/types";

const MENU_HEIGHT = 56;
const DOCK_HEIGHT = 84;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 260;
const MIN_X = 16;
const STAGGER = 32;
const STORAGE_KEY = "berkepro.windows.v1";

type StackedWindow = WindowInstance & { zIndex: number };

function clampPosition(x: number, y: number, w: number) {
  if (typeof window === "undefined") return { x, y };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxX = Math.max(MIN_X, vw - Math.min(w, vw - MIN_X * 2));
  const maxY = Math.max(MENU_HEIGHT + 16, vh - DOCK_HEIGHT - 16);
  return {
    x: Math.min(Math.max(MIN_X, x), maxX),
    y: Math.min(Math.max(MENU_HEIGHT + 16, y), maxY),
  };
}

type DesktopWindowProps = {
  win: StackedWindow;
  isFocused: boolean;
  openWindow: (id: string, payload?: WindowPayload) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onToggleMaximize: (id: string) => void;
  onFocus: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
  onSizeChange: (id: string, w: number, h: number) => void;
};

function DesktopWindow({
  win,
  isFocused,
  openWindow,
  onClose,
  onMinimize,
  onToggleMaximize,
  onFocus,
  onPositionChange,
  onSizeChange,
}: DesktopWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const def = appById.get(win.id);
  if (!def) return null;

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (win.maximized) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startLeft = win.position.x;
    const startTop = win.position.y;

    const onMove = (moveEvent: PointerEvent) => {
      if (ref.current) {
        const next = clampPosition(
          startLeft + moveEvent.clientX - startX,
          startTop + moveEvent.clientY - startY,
          win.size.width,
        );
        ref.current.style.left = `${next.x}px`;
        ref.current.style.top = `${next.y}px`;
      }
    };

    const onUp = (upEvent: PointerEvent) => {
      const next = clampPosition(
        startLeft + upEvent.clientX - startX,
        startTop + upEvent.clientY - startY,
        win.size.width,
      );
      onPositionChange(win.id, next.x, next.y);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleResizeStart = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (win.maximized) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.size.width;
    const startH = win.size.height;

    const onMove = (moveEvent: PointerEvent) => {
      if (ref.current) {
        const newWidth = Math.max(MIN_WIDTH, startW + moveEvent.clientX - startX);
        const newHeight = Math.max(MIN_HEIGHT, startH + moveEvent.clientY - startY);
        ref.current.style.width = `${newWidth}px`;
        ref.current.style.height = `${newHeight}px`;
      }
    };

    const onUp = (upEvent: PointerEvent) => {
      const newWidth = Math.max(MIN_WIDTH, startW + upEvent.clientX - startX);
      const newHeight = Math.max(MIN_HEIGHT, startH + upEvent.clientY - startY);
      onSizeChange(win.id, newWidth, newHeight);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const left = win.maximized ? MIN_X : win.position.x;
  const top = win.maximized ? MENU_HEIGHT + 16 : win.position.y;
  const width = win.maximized
    ? typeof window !== "undefined"
      ? window.innerWidth - MIN_X * 2
      : win.size.width
    : win.size.width;
  const height = win.maximized
    ? typeof window !== "undefined"
      ? window.innerHeight - MENU_HEIGHT - DOCK_HEIGHT - 24
      : win.size.height
    : win.size.height;

  return (
    <div
      ref={ref}
      onMouseDown={() => onFocus(win.id)}
      className="absolute animate-window-open transition-[left,top,width,height] duration-200 ease-out"
      style={{ left, top, width, height, zIndex: win.zIndex }}
    >
      <WindowFrame
        title={def.title}
        subtitle={def.subtitle}
        badge={def.badge}
        isFocused={isFocused}
        isMaximized={win.maximized}
        className="h-full flex flex-col"
        onDragStart={handleDragStart}
        onTitleBarDoubleClick={() => onToggleMaximize(win.id)}
        onClose={() => onClose(win.id)}
        onMinimize={() => onMinimize(win.id)}
        onMaximize={() => onToggleMaximize(win.id)}
      >
        <div className="flex-1 overflow-auto min-h-0 -mx-1 px-1">
          {def.component({ openWindow, payload: win.payload })}
        </div>
      </WindowFrame>

      {!win.maximized && (
        <div
          onPointerDown={handleResizeStart}
          className="absolute bottom-1 right-1 h-4 w-4 cursor-se-resize opacity-40 hover:opacity-90 transition-opacity"
          aria-label="Resize window"
          role="separator"
        >
          <svg viewBox="0 0 16 16" className="h-full w-full text-muted-strong">
            <path
              d="M14 6 L6 14 M14 10 L10 14 M14 14 L14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

function loadPersisted(): PersistedWindow[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedWindow[];
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function savePersisted(windows: StackedWindow[]) {
  if (typeof window === "undefined") return;
  try {
    const data: PersistedWindow[] = windows.map((w) => ({
      id: w.id,
      position: w.position,
      size: w.size,
      minimized: w.minimized,
      maximized: w.maximized,
      prevPosition: w.prevPosition,
      prevSize: w.prevSize,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota errors */
  }
}

function initialWindows(): StackedWindow[] {
  const persisted = loadPersisted();
  if (persisted && persisted.length > 0) {
    let z = 1000;
    return persisted
      .filter((w) => appById.has(w.id))
      .map((w) => ({
        id: w.id,
        position: w.position,
        size: w.size,
        minimized: w.minimized,
        maximized: w.maximized,
        prevPosition: w.prevPosition,
        prevSize: w.prevSize,
        zIndex: ++z,
        payload: undefined,
      }));
  }
  const def = applications[0];
  return [
    {
      id: def.id,
      position: def.defaultPosition,
      size: def.defaultSize,
      minimized: false,
      maximized: false,
      zIndex: 1000,
      payload: undefined,
    },
  ];
}

export function DesktopLayout() {
  const [windows, setWindows] = useState<StackedWindow[]>(() => {
    if (typeof window === "undefined") {
      const def = applications[0];
      return [
        {
          id: def.id,
          position: def.defaultPosition,
          size: def.defaultSize,
          minimized: false,
          maximized: false,
          zIndex: 1000,
          payload: undefined,
        },
      ];
    }
    return initialWindows();
  });

  const [currentTime, setCurrentTime] = useState(() => new Date());
  const [isMobile, setIsMobile] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    savePersisted(windows);
  }, [windows, hydrated]);

  const timeString = useMemo(
    () =>
      currentTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [currentTime],
  );

  const dateString = useMemo(
    () =>
      currentTime.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    [currentTime],
  );

  const activeWindowId = useMemo(() => {
    const visible = windows.filter((w) => !w.minimized);
    if (visible.length === 0) return null;
    return visible.reduce((top, w) => (w.zIndex > top.zIndex ? w : top)).id;
  }, [windows]);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const highestZ = Math.max(...prev.map((w) => w.zIndex), 1000);
      const target = prev.find((w) => w.id === id);
      if (!target) return prev;
      if (target.zIndex === highestZ && !target.minimized) return prev;
      return prev.map((w) =>
        w.id === id ? { ...w, zIndex: highestZ + 1, minimized: false } : w,
      );
    });
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized) {
          return {
            ...w,
            maximized: false,
            position: w.prevPosition ?? w.position,
            size: w.prevSize ?? w.size,
            prevPosition: undefined,
            prevSize: undefined,
          };
        }
        return {
          ...w,
          maximized: true,
          prevPosition: w.position,
          prevSize: w.size,
        };
      }),
    );
  }, []);

  const openWindow = useCallback(
    (appId: string, payload?: WindowPayload) => {
      setWindows((prev) => {
        const existing = prev.find((w) => w.id === appId);
        const highestZ = Math.max(...prev.map((w) => w.zIndex), 1000);
        if (existing) {
          return prev.map((w) =>
            w.id === appId
              ? {
                  ...w,
                  zIndex: highestZ + 1,
                  minimized: false,
                  payload: payload ?? w.payload,
                }
              : w,
          );
        }

        const def = appById.get(appId);
        if (!def) return prev;

        const stackCount = prev.length;
        const offset = stackCount * STAGGER;
        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        const baseX = Math.max(
          MIN_X,
          Math.min(
            def.defaultPosition.x + offset,
            vw - Math.min(def.defaultSize.width, vw - MIN_X * 2),
          ),
        );
        const baseY = Math.max(
          MENU_HEIGHT + 16,
          Math.min(def.defaultPosition.y + offset, vh - DOCK_HEIGHT - 80),
        );

        return [
          ...prev,
          {
            id: def.id,
            position: { x: baseX, y: baseY },
            size: def.defaultSize,
            minimized: false,
            maximized: false,
            zIndex: highestZ + 1,
            payload,
          },
        ];
      });
    },
    [],
  );

  const launchFromDock = useCallback(
    (appId: string) => {
      const existing = windows.find((w) => w.id === appId);
      if (existing && !existing.minimized && existing.id === activeWindowId) {
        minimizeWindow(appId);
      } else {
        openWindow(appId);
      }
    },
    [windows, activeWindowId, minimizeWindow, openWindow],
  );

  const updateWindowPosition = useCallback(
    (id: string, x: number, y: number) => {
      setWindows((prev) =>
        prev.map((w) => (w.id === id ? { ...w, position: { x, y } } : w)),
      );
    },
    [],
  );

  const updateWindowSize = useCallback(
    (id: string, width: number, height: number) => {
      setWindows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, size: { width, height } } : w,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && !inField) {
        const num = parseInt(e.key, 10);
        if (!Number.isNaN(num) && num >= 1 && num <= applications.length) {
          e.preventDefault();
          openWindow(applications[num - 1].id);
          return;
        }
        if (e.key === "w" && activeWindowId) {
          e.preventDefault();
          closeWindow(activeWindowId);
          return;
        }
        if (e.key === "m" && activeWindowId) {
          e.preventDefault();
          minimizeWindow(activeWindowId);
          return;
        }
      }
      if (e.key === "Escape" && activeWindowId && windows.length > 1 && !inField) {
        closeWindow(activeWindowId);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [
    activeWindowId,
    closeWindow,
    minimizeWindow,
    openWindow,
    windows.length,
  ]);

  if (!hydrated) {
    return <div className="min-h-screen" />;
  }

  if (isMobile) {
    return <MobileShell time={timeString} date={dateString} />;
  }

  const openIds = windows.map((w) => w.id);
  const minimizedIds = windows.filter((w) => w.minimized).map((w) => w.id);
  const visibleWindows = windows.filter((w) => !w.minimized);

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      <MenuBar
        onMenuSelect={openWindow}
        time={timeString}
        date={dateString}
        activeId={activeWindowId}
      />

      <DesktopIcons onOpen={openWindow} />

      <div className="relative z-10 pt-20">
        <div className="relative min-h-[calc(100vh-160px)] px-4">
          {visibleWindows.map((win) => (
            <DesktopWindow
              key={win.id}
              win={win}
              isFocused={win.id === activeWindowId}
              openWindow={openWindow}
              onClose={closeWindow}
              onMinimize={minimizeWindow}
              onToggleMaximize={toggleMaximize}
              onFocus={focusWindow}
              onPositionChange={updateWindowPosition}
              onSizeChange={updateWindowSize}
            />
          ))}

          {visibleWindows.length === 0 && (
            <div className="flex h-[60vh] items-center justify-center">
              <div className="text-center">
                <p className="text-sm text-muted">No windows open</p>
                <button
                  type="button"
                  onClick={() => openWindow("welcome")}
                  className="mt-3 rounded-lg border border-purple-border bg-purple-soft px-4 py-2 text-sm font-medium text-purple transition-colors hover:bg-purple/20"
                >
                  Open About
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dock
        openIds={openIds}
        minimizedIds={minimizedIds}
        activeId={activeWindowId}
        onLaunch={launchFromDock}
      />
    </div>
  );
}
