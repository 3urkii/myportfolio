"use client";

import type { ReactNode, PointerEventHandler } from "react";

type WindowFrameProps = {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  actions?: ReactNode;
  onDragStart?: PointerEventHandler<HTMLDivElement>;
  onTitleBarDoubleClick?: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  onMaximize?: () => void;
  isFocused?: boolean;
  isMaximized?: boolean;
  children: ReactNode;
};

export function WindowFrame({
  title,
  subtitle,
  badge,
  className = "",
  actions,
  onDragStart,
  onTitleBarDoubleClick,
  onClose,
  onMinimize,
  onMaximize,
  isFocused = true,
  isMaximized = false,
  children,
}: WindowFrameProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border backdrop-blur-2xl transition-all duration-200 ${
        isFocused
          ? "border-white/10 shadow-[0_24px_80px_-12px_rgba(0,0,0,0.55)] opacity-100"
          : "border-white/5 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.4)] opacity-[0.94] saturate-[0.85]"
      } ${className}`}
      style={{ backgroundColor: "rgba(40, 42, 54, 0.92)" }}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b border-white/5 px-4 py-2.5 select-none flex-shrink-0 ${
          isMaximized ? "cursor-default" : "cursor-grab active:cursor-grabbing"
        }`}
        onPointerDown={isMaximized ? undefined : onDragStart}
        onDoubleClick={onTitleBarDoubleClick}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center gap-1.5 group/lights"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#282a36]"
              aria-label="Close window"
            >
              <svg
                viewBox="0 0 8 8"
                className="h-2 w-2 text-[#4d0000] opacity-0 group-hover/lights:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              >
                <line x1="1.5" y1="1.5" x2="6.5" y2="6.5" />
                <line x1="6.5" y1="1.5" x2="1.5" y2="6.5" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onMinimize}
              className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#282a36]"
              aria-label="Minimize window"
            >
              <svg
                viewBox="0 0 8 8"
                className="h-2 w-2 text-[#5c3a00] opacity-0 group-hover/lights:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              >
                <line x1="1" y1="4" x2="7" y2="4" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onMaximize}
              className="flex h-3 w-3 items-center justify-center rounded-full bg-[#28c840] transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-1 focus-visible:ring-offset-[#282a36]"
              aria-label="Maximize window"
            >
              <svg
                viewBox="0 0 8 8"
                className="h-2 w-2 text-[#0a3d11] opacity-0 group-hover/lights:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
                strokeLinecap="round"
              >
                <path d="M2 1 L1 1 L1 2 M6 1 L7 1 L7 2 M1 6 L1 7 L2 7 M7 6 L7 7 L6 7" />
              </svg>
            </button>
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground/95">
              {title}
            </p>
            {subtitle && (
              <p className="truncate text-[0.65rem] text-muted">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {badge && (
            <span className="rounded-md border border-purple-border bg-purple-soft px-2 py-0.5 text-[0.65rem] font-medium text-purple">
              {badge}
            </span>
          )}
          {actions && (
            <div onPointerDown={(event) => event.stopPropagation()}>
              {actions}
            </div>
          )}
        </div>
      </div>
      <div className="px-5 py-4 flex-1 flex flex-col min-h-0">{children}</div>
    </div>
  );
}
