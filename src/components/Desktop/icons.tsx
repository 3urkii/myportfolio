import type { ReactNode } from "react";

type IconProps = { size?: number; className?: string };

function Tile({
  size = 44,
  className = "",
  gradient,
  children,
}: {
  size?: number;
  className?: string;
  gradient: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-[22%] shadow-[0_4px_12px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.18)] ${className}`}
      style={{ width: size, height: size, background: gradient }}
    >
      {children}
    </div>
  );
}

export function AboutIcon({ size = 44, className = "" }: IconProps) {
  return (
    <Tile
      size={size}
      className={className}
      gradient="linear-gradient(135deg, #bd93f9 0%, #ff79c6 100%)"
    >
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2 text-white" fill="none">
        <circle cx="12" cy="8.5" r="3.4" fill="currentColor" />
        <path
          d="M4.5 19.5c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </Tile>
  );
}

export function SkillsIcon({ size = 44, className = "" }: IconProps) {
  return (
    <Tile
      size={size}
      className={className}
      gradient="linear-gradient(135deg, #8be9fd 0%, #bd93f9 100%)"
    >
      <svg viewBox="0 0 24 24" className="h-2/3 w-2/3 text-white" fill="none">
        <line x1="5" y1="7" x2="19" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="15" cy="7" r="2.3" fill="#1e2030" stroke="currentColor" strokeWidth="1.8" />
        <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="9" cy="12" r="2.3" fill="#1e2030" stroke="currentColor" strokeWidth="1.8" />
        <line x1="5" y1="17" x2="19" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="13" cy="17" r="2.3" fill="#1e2030" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    </Tile>
  );
}

export function ProjectsIcon({ size = 44, className = "" }: IconProps) {
  return (
    <Tile
      size={size}
      className={className}
      gradient="linear-gradient(135deg, #50fa7b 0%, #8be9fd 100%)"
    >
      <svg viewBox="0 0 24 24" className="h-2/3 w-2/3" fill="none">
        <path
          d="M3.5 7.5c0-1.1.9-2 2-2h3.3c.5 0 1 .2 1.4.6l1.4 1.4h7c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H5.5c-1.1 0-2-.9-2-2v-10z"
          fill="#1e2030"
          stroke="white"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </Tile>
  );
}

export function ContactIcon({ size = 44, className = "" }: IconProps) {
  return (
    <Tile
      size={size}
      className={className}
      gradient="linear-gradient(135deg, #ffb86c 0%, #ff79c6 100%)"
    >
      <svg viewBox="0 0 24 24" className="h-2/3 w-2/3" fill="none">
        <rect
          x="3.5"
          y="6"
          width="17"
          height="12"
          rx="2.2"
          fill="#1e2030"
          stroke="white"
          strokeWidth="1.6"
        />
        <path
          d="M4.5 7.5l7.5 5.5 7.5-5.5"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Tile>
  );
}

export function TerminalIcon({ size = 44, className = "" }: IconProps) {
  return (
    <Tile
      size={size}
      className={className}
      gradient="linear-gradient(135deg, #21222c 0%, #44475a 100%)"
    >
      <svg viewBox="0 0 24 24" className="h-2/3 w-2/3" fill="none">
        <path
          d="M5 9l3.5 3L5 15"
          stroke="#50fa7b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="11"
          y1="16"
          x2="18"
          y2="16"
          stroke="#f8f8f2"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </Tile>
  );
}

export function NotesIcon({ size = 44, className = "" }: IconProps) {
  return (
    <Tile
      size={size}
      className={className}
      gradient="linear-gradient(135deg, #f1fa8c 0%, #ffb86c 100%)"
    >
      <svg viewBox="0 0 24 24" className="h-2/3 w-2/3" fill="none">
        <rect
          x="5"
          y="3.5"
          width="14"
          height="17"
          rx="1.6"
          fill="#1e2030"
          stroke="white"
          strokeWidth="1.6"
        />
        <line x1="8" y1="8" x2="16" y2="8" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="8" y1="11.5" x2="16" y2="11.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="8" y1="15" x2="13" y2="15" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </Tile>
  );
}

export function FileIcon({
  size = 44,
  label,
  className = "",
}: IconProps & { label: string }) {
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 40 48" className="h-full w-full">
        <path
          d="M4 4 h24 l8 8 v32 a0 0 0 0 1 0 0 h-32 a0 0 0 0 1 0 0 v-40 a0 0 0 0 1 0 0 z"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M28 4 v8 h8"
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
      <span
        className="absolute bottom-1.5 left-1/2 -translate-x-1/2 rounded-sm bg-purple px-1 font-mono text-[0.55rem] font-semibold uppercase tracking-wider text-[#1e2030]"
      >
        {label}
      </span>
    </div>
  );
}

export function FolderIcon({ size = 44, className = "" }: IconProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 40" className="h-full w-full">
        <path
          d="M3 8c0-2.2 1.8-4 4-4h11l4 4h19c2.2 0 4 1.8 4 4v20c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4V8z"
          fill="url(#folder-grad)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="folder-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#bd93f9" />
            <stop offset="100%" stopColor="#6272a4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function LinkIcon({ size = 44, className = "" }: IconProps) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 48" className="h-full w-full">
        <path
          d="M4 4 h24 l8 8 v32 a0 0 0 0 1 0 0 h-32 a0 0 0 0 1 0 0 v-40 a0 0 0 0 1 0 0 z"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M28 4 v8 h8"
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M14 24 L26 24 M22 20 L26 24 L22 28"
          stroke="#8be9fd"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
