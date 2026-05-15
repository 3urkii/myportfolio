import type { ReactNode } from "react";

export type WindowPayload = Record<string, unknown> | undefined;

export type AppComponentProps = {
  openWindow: (id: string, payload?: WindowPayload) => void;
  payload?: WindowPayload;
};

export type AppDefinition = {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  Icon: (props: { size?: number; className?: string }) => ReactNode;
  pinned?: boolean;
  shortcut?: string;
  component: (props: AppComponentProps) => ReactNode;
};

export type WindowInstance = {
  id: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevPosition?: { x: number; y: number };
  prevSize?: { width: number; height: number };
  payload?: WindowPayload;
};

export type PersistedWindow = Pick<
  WindowInstance,
  "id" | "position" | "size" | "minimized" | "maximized" | "prevPosition" | "prevSize"
>;
