"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AppComponentProps } from "@/components/Desktop/types";

type Line =
  | { kind: "command"; text: string }
  | { kind: "output"; text: string }
  | { kind: "error"; text: string }
  | { kind: "ascii"; text: string };

const PROMPT_USER = "ryan";
const PROMPT_HOST = "berkepro";
const PROMPT_PATH = "~";

const banner = `welcome to berkepro v1.0.0
type 'help' to list commands, 'about' to learn more, or 'open <app>' to launch.`;

const fileSystem: Record<string, string> = {
  "about.md": `ryan berke — IT professional and aspiring cloud engineer.
based in tampa, fl. background in psychology and neuroscience.
currently focused on cloud infrastructure and security.
breaks his homelab in creative ways.`,
  "skills.md": `system administration: active directory, intune, ninjarmm, linux
languages: html/css, python, next.js, lua, bash
learning: aws, snowflake, kubernetes, git, docker`,
  "contact.md": `web      berke.pro/#contact
github   github.com/3urkii
linkedin linkedin.com/in/ryan-berke-b093152a7
location tampa, fl`,
  "homelab.txt": `two proxmox nodes, unifi stack, custom-built nas.
runs plex, nextcloud, game servers, and various experiments.
see github.com/3urkii/homelab`,
};

const projects = [
  "homelab           proxmox cluster + nas",
  "portfolio-site    this site (next.js)",
  "latiarch          arch + hyprland dotfiles",
];

const appAliases: Record<string, string> = {
  about: "welcome",
  welcome: "welcome",
  home: "welcome",
  skills: "skills",
  projects: "projects",
  contact: "contact",
  terminal: "terminal",
  term: "terminal",
  notes: "notes",
  note: "notes",
};

const commandList = [
  "help          show this list",
  "whoami        print current user",
  "about         short bio",
  "ls [dir]      list files",
  "cat <file>    print file contents",
  "projects      list projects",
  "skills        list skills",
  "contact       print contact info",
  "open <app>    open a window: about|skills|projects|contact|notes",
  "neofetch      system summary",
  "uptime        how long this session has been up",
  "date          current date and time",
  "pwd           print working directory",
  "echo <text>   print text",
  "clear         clear the screen",
];

const neofetchArt = `       /\\
      /  \\        ${PROMPT_USER}@${PROMPT_HOST}
     /    \\       ----------
    /  /\\  \\      os      berkepro
   /  /  \\  \\     host    portfolio.next.js
  /  /----\\  \\    shell   /bin/sh
 /  /------\\  \\   wm      browser
/__/        \\__\\  theme   dracula
                  uptime  ${Math.floor(Math.random() * 99) + 1}d ${Math.floor(Math.random() * 24)}h`;

function tokenize(input: string): string[] {
  return input.trim().split(/\s+/).filter(Boolean);
}

const startTime = Date.now();

function formatUptime(): string {
  const secs = Math.floor((Date.now() - startTime) / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export function Terminal({ openWindow }: AppComponentProps) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "ascii", text: banner },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    focusInput();
  }, [focusInput]);

  const run = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      const echo: Line = { kind: "command", text: trimmed };
      const next: Line[] = [echo];

      if (!trimmed) {
        setLines((prev) => [...prev, echo]);
        return;
      }

      const [cmd, ...args] = tokenize(trimmed);

      const out = (text: string) => next.push({ kind: "output", text });
      const err = (text: string) => next.push({ kind: "error", text });

      switch (cmd) {
        case "help":
          out(commandList.join("\n"));
          break;
        case "whoami":
          out(PROMPT_USER);
          break;
        case "about":
          out(fileSystem["about.md"]);
          break;
        case "ls": {
          const dir = args[0];
          if (!dir || dir === "." || dir === PROMPT_PATH) {
            out(
              [
                "about.md",
                "skills.md",
                "contact.md",
                "homelab.txt",
                "projects/",
              ].join("  "),
            );
          } else if (dir === "projects" || dir === "projects/") {
            out(projects.join("\n"));
          } else {
            err(`ls: ${dir}: no such directory`);
          }
          break;
        }
        case "cat": {
          if (!args[0]) {
            err("cat: missing file operand");
            break;
          }
          const file = args[0].replace(/^\.\//, "");
          const content = fileSystem[file];
          if (content) out(content);
          else err(`cat: ${file}: no such file`);
          break;
        }
        case "projects":
          out(projects.join("\n"));
          break;
        case "skills":
          out(fileSystem["skills.md"]);
          break;
        case "contact":
          out(fileSystem["contact.md"]);
          break;
        case "open": {
          const target = args[0]?.toLowerCase();
          const appId = target ? appAliases[target] : null;
          if (!appId) {
            err(`open: unknown app '${target ?? ""}'`);
          } else {
            out(`opening ${appId}…`);
            setTimeout(() => openWindow(appId), 120);
          }
          break;
        }
        case "neofetch":
          next.push({ kind: "ascii", text: neofetchArt });
          break;
        case "uptime":
          out(formatUptime());
          break;
        case "date":
          out(new Date().toString());
          break;
        case "pwd":
          out("/home/ryan");
          break;
        case "echo":
          out(args.join(" "));
          break;
        case "clear":
          setLines([]);
          return;
        case "sudo":
          err("sudo: ryan is not in the sudoers file. this incident will be reported.");
          break;
        case "ssh": {
          const host = args[0];
          if (host === "homelab") {
            out(
              [
                "connecting to homelab.lan…",
                "the authenticity of host 'homelab' cannot be established.",
                "permission denied (publickey). nice try.",
              ].join("\n"),
            );
          } else {
            err(`ssh: could not resolve hostname ${host ?? ""}`);
          }
          break;
        }
        case "coffee":
          next.push({
            kind: "ascii",
            text: "      )))\n     (((\n   .---.\n   |   |~\n   `---'\n   brewing…",
          });
          break;
        case "exit":
        case "quit":
          out("nice try. close the window with the red light.");
          break;
        default:
          err(`${cmd}: command not found. type 'help' for a list.`);
      }

      setLines((prev) => [...prev, ...next]);
    },
    [openWindow],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    run(input);
    if (input.trim()) {
      setHistory((prev) => [...prev, input.trim()]);
    }
    setInput("");
    setHistoryIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setInput(history[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setInput("");
      } else {
        setHistoryIndex(next);
        setInput(history[next] ?? "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [partial] = tokenize(input);
      if (!partial) return;
      const commands = [
        "help",
        "whoami",
        "about",
        "ls",
        "cat",
        "projects",
        "skills",
        "contact",
        "open",
        "neofetch",
        "uptime",
        "date",
        "pwd",
        "echo",
        "clear",
        "ssh",
      ];
      const matches = commands.filter((c) => c.startsWith(partial));
      if (matches.length === 1) {
        setInput(matches[0] + " ");
      }
    } else if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      className="flex h-full flex-col font-mono text-[0.78rem] leading-relaxed"
      onClick={focusInput}
      style={{ color: "#f8f8f2" }}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto pr-1">
        {lines.map((line, idx) => {
          if (line.kind === "command") {
            return (
              <div key={idx} className="flex gap-1.5">
                <Prompt />
                <span className="whitespace-pre-wrap break-words">{line.text}</span>
              </div>
            );
          }
          if (line.kind === "error") {
            return (
              <div key={idx} className="whitespace-pre-wrap break-words text-red">
                {line.text}
              </div>
            );
          }
          if (line.kind === "ascii") {
            return (
              <pre key={idx} className="whitespace-pre text-cyan">
                {line.text}
              </pre>
            );
          }
          return (
            <div key={idx} className="whitespace-pre-wrap break-words text-foreground/90">
              {line.text}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-1.5 pt-1.5">
        <Prompt />
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          aria-label="terminal input"
          className="flex-1 bg-transparent outline-none placeholder:text-muted"
          placeholder=""
        />
      </form>
    </div>
  );
}

function Prompt() {
  return (
    <span className="select-none">
      <span className="text-green">{PROMPT_USER}@{PROMPT_HOST}</span>
      <span className="text-foreground/60">:</span>
      <span className="text-cyan">{PROMPT_PATH}</span>
      <span className="text-foreground/60">$ </span>
    </span>
  );
}
