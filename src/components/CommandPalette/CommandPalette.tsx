import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  FiCommand,
  FiSearch,
  FiTerminal,
  FiUser,
  FiBriefcase,
  FiCode,
  FiMail,
  FiPhone,
  FiCopy,
  FiFileText,
  FiLayers,
  FiCpu,
  FiX,
  FiCheck,
  FiActivity,
} from "react-icons/fi";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";
import { smoother } from "../Navbar";
import "./CommandPalette.css";

export interface CommandItem {
  id: string;
  title: string;
  description?: string;
  category: "Navigation" | "Actions" | "Social" | "Terminal";
  icon: React.ReactNode;
  badge?: string;
  action: () => void;
  keywords?: string[];
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"commands" | "terminal">("commands");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string }>>([
    {
      cmd: "welcome",
      output:
        "Om Farakate — Interactive Dev Console v1.0\nType 'help', 'whoami', 'skills', or 'stats' to inspect.",
    },
  ]);
  const [terminalInput, setTerminalInput] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Audio feedback using Web Audio API (no external asset needed)
  const playClickSound = useCallback(() => {
    try {
      const windowWithAudio = window as unknown as {
        AudioContext?: typeof AudioContext;
        webkitAudioContext?: typeof AudioContext;
      };
      const AudioCtx = windowWithAudio.AudioContext || windowWithAudio.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(640, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio not permitted or supported; safe ignore
    }
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  }, []);

  const scrollToTarget = useCallback((targetSelector: string) => {
    setIsOpen(false);
    playClickSound();

    setTimeout(() => {
      const element = document.querySelector(targetSelector);
      if (!element) return;

      if (window.innerWidth > 1024 && smoother) {
        smoother.scrollTo(targetSelector, true, "top top");
      } else {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  }, [playClickSound]);

  const copyToClipboard = useCallback(async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`);
      playClickSound();
      setIsOpen(false);
    } catch {
      showToast(`Failed to copy to clipboard`);
    }
  }, [playClickSound, showToast]);

  // Available commands
  const commands: CommandItem[] = useMemo(
    () => [
      // Navigation
      {
        id: "nav-about",
        title: "About Me",
        description: "Background, technical focus & SaaS experience",
        category: "Navigation",
        icon: <FiUser />,
        badge: "Jump",
        action: () => scrollToTarget("#about"),
        keywords: ["about", "bio", "experience", "profile", "om"],
      },
      {
        id: "nav-impact",
        title: "Engineering By The Numbers (Metrics)",
        description: "36% latency cut, 1,000+ users, 30+ APIs, 180+ LeetCode",
        category: "Navigation",
        icon: <FiActivity />,
        badge: "Metrics",
        action: () => scrollToTarget("#impact"),
        keywords: ["metrics", "numbers", "stats", "impact", "users", "latency", "leetcode"],
      },
      {
        id: "nav-whatido",
        title: "What I Do",
        description: "Full-Stack, Backend Systems & Cloud AI tools",
        category: "Navigation",
        icon: <FiCpu />,
        badge: "Jump",
        action: () => scrollToTarget(".whatIDO"),
        keywords: ["what i do", "skills", "backend", "fullstack", "devops"],
      },
      {
        id: "nav-career",
        title: "Career & Experience",
        description: "Hidden Brains Infotech & academic background",
        category: "Navigation",
        icon: <FiBriefcase />,
        badge: "Jump",
        action: () => scrollToTarget(".career-section"),
        keywords: ["career", "experience", "jobs", "education", "dkte"],
      },
      {
        id: "nav-work",
        title: "Featured Projects",
        description: "SyncLab, Production Planning, CRM Engine & URL Shortener",
        category: "Navigation",
        icon: <FiCode />,
        badge: "Jump",
        action: () => scrollToTarget("#work"),
        keywords: ["work", "projects", "synclab", "saas", "portfolio"],
      },
      {
        id: "nav-arch",
        title: "System Architecture Playground",
        description: "Interactive Redis Caching, Base62 Hashing & WebSocket Simulator",
        category: "Navigation",
        icon: <FiCpu />,
        badge: "Interactive",
        action: () => scrollToTarget("#architecture"),
        keywords: ["architecture", "redis", "cache", "system", "design", "backend", "synclab", "shortener"],
      },
      {
        id: "nav-techstack",
        title: "Interactive Tech Stack",
        description: "Interactive 3D physics spheres of technologies",
        category: "Navigation",
        icon: <FiLayers />,
        badge: "Jump",
        action: () => scrollToTarget(".techstack"),
        keywords: ["tech", "stack", "threejs", "physics", "tools"],
      },
      {
        id: "nav-contact",
        title: "Contact Section",
        description: "Send a direct message or view contact details",
        category: "Navigation",
        icon: <FiMail />,
        badge: "Jump",
        action: () => scrollToTarget("#contact"),
        keywords: ["contact", "email", "message", "hire"],
      },

      // Actions
      {
        id: "act-email",
        title: "Copy Email Address",
        description: "omfarkate7515@gmail.com",
        category: "Actions",
        icon: <FiCopy />,
        badge: "Clipboard",
        action: () => copyToClipboard("omfarkate7515@gmail.com", "Email"),
        keywords: ["email", "copy", "mail", "gmail"],
      },
      {
        id: "act-phone",
        title: "Copy Phone Number",
        description: "(+91) 9156461153",
        category: "Actions",
        icon: <FiPhone />,
        badge: "Clipboard",
        action: () => copyToClipboard("+919156461153", "Phone number"),
        keywords: ["phone", "call", "mobile", "whatsapp"],
      },
      {
        id: "act-mailto",
        title: "Compose Direct Email",
        description: "Open your mail app with pre-filled recipient",
        category: "Actions",
        icon: <FiMail />,
        badge: "Mail",
        action: () => {
          window.location.href =
            "mailto:omfarkate7515@gmail.com?subject=Portfolio%20Inquiry";
          setIsOpen(false);
        },
        keywords: ["mail", "send", "compose", "inquiry"],
      },
      {
        id: "act-resume",
        title: "View / Download Resume",
        description: "Om Farakate's Software Engineer Resume (PDF)",
        category: "Actions",
        icon: <FiFileText />,
        badge: "Resume",
        action: () => {
          showToast("Opening Om's Resume...");
          window.open(
            "https://drive.google.com/file/d/1_resume_placeholder/view",
            "_blank"
          );
          setIsOpen(false);
        },
        keywords: ["resume", "cv", "pdf", "hire"],
      },

      // Social Links
      {
        id: "soc-github",
        title: "GitHub Profile",
        description: "github.com/Omfarakate — Repositories & Open Source",
        category: "Social",
        icon: <FaGithub />,
        badge: "External",
        action: () => {
          window.open("https://github.com/Omfarakate", "_blank");
          setIsOpen(false);
        },
        keywords: ["github", "code", "repo", "git"],
      },
      {
        id: "soc-linkedin",
        title: "LinkedIn Profile",
        description: "linkedin.com/in/omfarakate — Connect professionally",
        category: "Social",
        icon: <FaLinkedin />,
        badge: "External",
        action: () => {
          window.open("https://linkedin.com/in/omfarakate", "_blank");
          setIsOpen(false);
        },
        keywords: ["linkedin", "network", "connect"],
      },
      {
        id: "soc-leetcode",
        title: "LeetCode Profile",
        description: "leetcode.com/u/omsfarakate/ — 180+ problems solved",
        category: "Social",
        icon: <SiLeetcode />,
        badge: "External",
        action: () => {
          window.open("https://leetcode.com/u/omsfarakate/", "_blank");
          setIsOpen(false);
        },
        keywords: ["leetcode", "dsa", "algorithms", "problem solving"],
      },

      // Terminal Mode switcher
      {
        id: "cmd-terminal-switch",
        title: "Open Interactive Terminal CLI",
        description: "Execute bash-like commands (whoami, skills, stats, help)",
        category: "Terminal",
        icon: <FiTerminal />,
        badge: "CLI",
        action: () => {
          setActiveTab("terminal");
          setQuery("");
          setTimeout(() => terminalInputRef.current?.focus(), 50);
        },
        keywords: ["terminal", "cli", "bash", "shell", "console"],
      },
    ],
    [copyToClipboard, scrollToTarget, showToast]
  );

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return commands;
    const lower = query.toLowerCase().trim();
    return commands.filter((cmd) => {
      const matchTitle = cmd.title.toLowerCase().includes(lower);
      const matchDesc = cmd.description?.toLowerCase().includes(lower);
      const matchKeywords = cmd.keywords?.some((k) => k.toLowerCase().includes(lower));
      const matchCategory = cmd.category.toLowerCase().includes(lower);
      return matchTitle || matchDesc || matchKeywords || matchCategory;
    });
  }, [commands, query]);

  // Global Keyboard Listener for Cmd+K / Ctrl+K and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdK =
        (e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K");

      if (isCmdK) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        if (activeTab === "commands") {
          inputRef.current?.focus();
        } else {
          terminalInputRef.current?.focus();
        }
      }, 50);
    }
  }, [isOpen, activeTab]);

  // Keyboard navigation within list
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredCommands.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredCommands.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredCommands[selectedIndex];
      if (current) {
        current.action();
      }
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (resultsRef.current) {
      const activeEl = resultsRef.current.querySelector(".cmd-item.selected");
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  // Terminal command execution
  const executeTerminalCommand = (rawCommand: string) => {
    const trimmed = rawCommand.trim().toLowerCase();
    if (!trimmed) return;

    let response = "";
    switch (trimmed) {
      case "help":
        response =
          "Available commands:\n  whoami    - Developer identity & role\n  skills    - Core tech stack & tools\n  stats     - Quantified career metrics\n  projects  - Featured full-stack applications\n  contact   - Reach Om directly\n  clear     - Wipe terminal history\n  exit      - Close palette";
        break;
      case "whoami":
        response =
          "Om Farakate\nSoftware Engineer @ Hidden Brains Infotech\nB.Tech in Data Science & Computer Engineering (DKTE)\nPassionate about scalable backends, high concurrency & distributed systems.";
        break;
      case "skills":
        response =
          "• Languages: TypeScript, JavaScript, Python, C++, SQL\n• Backend & Cloud: NestJS, Node.js, Express, Docker, Kubernetes, Redis\n• Frontend: Next.js, React.js, Three.js, GSAP, HTML5/CSS3\n• Databases: MongoDB, MySQL, Redis\n• Architecture: REST APIs, Microservices, Operational Transformation, JWT/RBAC";
        break;
      case "stats":
        response =
          "⚡ Key Achievements:\n• 36% API latency reduction in production SaaS\n• 1,000+ active SaaS users served\n• 180+ problems solved on LeetCode (Consistency Badge)\n• 30+ enterprise REST APIs architected";
        break;
      case "projects":
        response =
          "1. SyncLab: Real-time code collaboration using WebSockets & OT\n2. Production Planning: Manufacturing SaaS platform with Redis rate-limiting\n3. Enterprise CRM Engine: Dynamic custom field engine across 20+ products\n4. URL Shortener Service: High-throughput Base62 microservice with Docker";
        break;
      case "contact":
        response =
          "• Email: omfarkate7515@gmail.com\n• Phone: (+91) 9156461153\n• GitHub: https://github.com/Omfarakate\n• LinkedIn: https://linkedin.com/in/omfarakate";
        break;
      case "clear":
        setTerminalHistory([]);
        setTerminalInput("");
        return;
      case "exit":
      case "quit":
        setIsOpen(false);
        return;
      default:
        response = `command not found: "${trimmed}". Type 'help' for available commands.`;
        break;
    }

    setTerminalHistory((prev) => [...prev, { cmd: trimmed, output: response }]);
    setTerminalInput("");
  };

  const isMac =
    typeof navigator !== "undefined" &&
    /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const shortcutLabel = isMac ? "⌘K" : "Ctrl+K";

  return (
    <>
      {/* Floating Corner Trigger Button */}
      <button
        className="cmd-floating-trigger"
        onClick={() => {
          playClickSound();
          setIsOpen(true);
        }}
        data-cursor="disable"
        title={`Open Command Palette (${shortcutLabel})`}
        aria-label="Open Command Palette"
      >
        <FiCommand />
        <span>Menu</span>
        <span className="cmd-nav-key-badge">{shortcutLabel}</span>
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="cmd-toast">
          <FiCheck style={{ color: "#a78bfa" }} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Command Modal Backdrop */}
      {isOpen && (
        <div
          className="cmd-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="cmd-dialog" role="dialog" aria-modal="true">
            {/* Search Bar */}
            <div className="cmd-search-bar">
              <FiSearch className="cmd-search-icon" />
              <input
                ref={inputRef}
                type="text"
                className="cmd-input"
                placeholder={
                  activeTab === "commands"
                    ? "Type a command or search (e.g. 'work', 'email', 'resume')..."
                    : "Type a bash command (e.g. 'whoami', 'skills', 'stats')..."
                }
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                data-cursor="disable"
              />
              <button
                className="cmd-esc-badge"
                onClick={() => setIsOpen(false)}
                data-cursor="disable"
                title="Close palette"
              >
                <span>ESC</span>
                <FiX />
              </button>
            </div>

            {/* View Tabs */}
            <div className="cmd-tabs">
              <button
                className={`cmd-tab-btn ${activeTab === "commands" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("commands");
                  playClickSound();
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                data-cursor="disable"
              >
                <FiCommand /> Commands & Quick Links
              </button>
              <button
                className={`cmd-tab-btn ${activeTab === "terminal" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("terminal");
                  playClickSound();
                  setTimeout(() => terminalInputRef.current?.focus(), 50);
                }}
                data-cursor="disable"
              >
                <FiTerminal /> Interactive CLI
              </button>
            </div>

            {/* Content: Commands List */}
            {activeTab === "commands" && (
              <div className="cmd-results" ref={resultsRef}>
                {filteredCommands.length === 0 ? (
                  <div className="cmd-no-results">
                    No commands matching "{query}". Try "whoami", "skills", or "work".
                  </div>
                ) : (
                  filteredCommands.map((cmd, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={cmd.id}
                        className={`cmd-item ${isSelected ? "selected" : ""}`}
                        onMouseEnter={() => setSelectedIndex(index)}
                        onClick={() => cmd.action()}
                        data-cursor="disable"
                      >
                        <div className="cmd-item-left">
                          <span className="cmd-item-icon">{cmd.icon}</span>
                          <div className="cmd-item-info">
                            <span className="cmd-item-title">{cmd.title}</span>
                            {cmd.description && (
                              <span className="cmd-item-desc">
                                {cmd.description}
                              </span>
                            )}
                          </div>
                        </div>
                        {cmd.badge && (
                          <span className="cmd-item-badge">{cmd.badge}</span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Content: Terminal CLI Mode */}
            {activeTab === "terminal" && (
              <div className="cmd-terminal-view">
                {terminalHistory.map((entry, idx) => (
                  <div key={idx} className="cmd-terminal-output">
                    <div className="cmd-terminal-prompt-line">
                      <span>om@portfolio:~$</span>
                      <span>{entry.cmd}</span>
                    </div>
                    <div>{entry.output}</div>
                  </div>
                ))}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeTerminalCommand(terminalInput);
                  }}
                  className="cmd-terminal-prompt-line"
                >
                  <span>om@portfolio:~$</span>
                  <input
                    ref={terminalInputRef}
                    type="text"
                    className="cmd-terminal-input"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="type command (e.g. whoami, skills, stats, help)..."
                    data-cursor="disable"
                    autoFocus
                  />
                </form>

                <div className="cmd-terminal-hints">
                  <span>Quick commands:</span>
                  {["whoami", "skills", "stats", "projects", "contact", "help", "clear"].map(
                    (cmd) => (
                      <span
                        key={cmd}
                        className="cmd-terminal-hint-chip"
                        onClick={() => executeTerminalCommand(cmd)}
                        data-cursor="disable"
                      >
                        {cmd}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer Instructions */}
            <div className="cmd-footer">
              <div className="cmd-shortcuts">
                <span className="cmd-shortcut-hint">
                  <kbd className="cmd-kbd">↑</kbd>
                  <kbd className="cmd-kbd">↓</kbd> Navigate
                </span>
                <span className="cmd-shortcut-hint">
                  <kbd className="cmd-kbd">↵</kbd> Select
                </span>
                <span className="cmd-shortcut-hint">
                  <kbd className="cmd-kbd">esc</kbd> Close
                </span>
              </div>
              <div className="cmd-powered-by">
                <span>⚡ Om Farakate Portfolio CLI</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CommandPalette;
