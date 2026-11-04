import React, { useState, useEffect, useRef } from "react";
import {
  FiZap,
  FiDatabase,
  FiServer,
  FiPlay,
  FiRefreshCw,
  FiClock,
  FiActivity,
  FiShield,
  FiCpu,
  FiCheckCircle,
  FiShare2,
} from "react-icons/fi";
import { SiRedis, SiMysql, SiNestjs, SiSocketdotio } from "react-icons/si";
import "./ArchitecturePlayground.css";

// Base62 helper implementation for realistic demonstration
const BASE62_CHARS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function toBase62(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  let num = Math.abs(hash);
  let result = "";
  while (num > 0 || result.length < 6) {
    result = BASE62_CHARS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result.slice(0, 7) || "x8K2qL";
}

interface LogEntry {
  time: string;
  type: "info" | "hit" | "miss" | "hash";
  msg: string;
}

export const ArchitecturePlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"url-shortener" | "synclab">("url-shortener");

  // URL Shortener State
  const [inputUrl, setInputUrl] = useState("https://github.com/Omfarakate/SyncLab");
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [shortUrlResult, setShortUrlResult] = useState<string | null>("https://om.dev/xK9d2A");
  const [lastLatency, setLastLatency] = useState<string>("2.1 ms");
  const [lastStatus, setLastStatus] = useState<"hit" | "miss">("hit");
  const [cacheMap, setCacheMap] = useState<Record<string, string>>({
    "https://github.com/Omfarakate/SyncLab": "xK9d2A",
  });
  const [cacheHits, setCacheHits] = useState(14);
  const [cacheMisses, setCacheMisses] = useState(2);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      time: "16:45:02",
      type: "info",
      msg: "System initialized. In-memory Redis store ready with warm cache.",
    },
    {
      time: "16:45:10",
      type: "hit",
      msg: "REDIS HIT: 'url:xK9d2A' resolved in 2.1ms (95% DB latency saved).",
    },
  ]);

  // SyncLab Collaborative State
  const [clientACode, setClientACode] = useState(
    '// SyncLab Real-time Collaboration\nfunction handleConflict(opA, opB) {\n  return OperationalTransform.resolve(opA, opB);\n}'
  );
  const [clientBCode, setClientBCode] = useState(
    '// SyncLab Real-time Collaboration\nfunction handleConflict(opA, opB) {\n  return OperationalTransform.resolve(opA, opB);\n}'
  );
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing">("synced");
  const [syncLatency, setSyncLatency] = useState("14ms");

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const addLog = (type: LogEntry["type"], msg: string) => {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [...prev.slice(-15), { time, type, msg }]);
  };

  // Simulate URL Shortener Request
  const handleSimulateRequest = async (overrideUrl?: string) => {
    if (isProcessing) return;
    const targetUrl = overrideUrl || inputUrl.trim();
    if (!targetUrl) return;

    setIsProcessing(true);
    addLog("info", `POST /api/v1/urls/shorten -> Payload: { url: "${targetUrl}" }`);

    // Step 1: Client -> API Gateway
    setActiveNode("client");
    await new Promise((r) => setTimeout(r, 260));

    // Step 2: NestJS Gateway & Rate Limiting
    setActiveNode("gateway");
    addLog("info", "NestJS Gateway: JWT verified. Token bucket rate-limiter OK.");
    await new Promise((r) => setTimeout(r, 280));

    // Check Cache
    setActiveNode("redis");
    const isCached = !!cacheMap[targetUrl];

    if (isCached) {
      // CACHE HIT
      const slug = cacheMap[targetUrl];
      setCacheHits((h) => h + 1);
      setLastStatus("hit");
      setLastLatency("1.9 ms");
      setShortUrlResult(`https://om.dev/${slug}`);
      addLog("hit", `REDIS HIT: Found key 'url:${targetUrl}' -> Slug: ${slug} [1.9ms]`);
      addLog("info", `Response 200 OK: { shortUrl: "https://om.dev/${slug}", cache: "HIT" }`);
      await new Promise((r) => setTimeout(r, 350));
      setActiveNode("cache-hit");
    } else {
      // CACHE MISS
      setCacheMisses((m) => m + 1);
      setLastStatus("miss");
      setLastLatency("38.4 ms");
      addLog("miss", `REDIS MISS: Key 'url:${targetUrl}' not in memory (nil) [1.1ms]`);

      // Step 3: MySQL & Base62 Generation
      setActiveNode("mysql");
      const generatedSlug = toBase62(targetUrl);
      addLog("hash", `Base62 Hash Engine: Generated 7-char slug '${generatedSlug}' from URL entropy.`);
      addLog("info", `MySQL: INSERT INTO urls (url, slug) VALUES ('${targetUrl}', '${generatedSlug}') [28.2ms]`);
      await new Promise((r) => setTimeout(r, 450));

      // Cache write-back
      setCacheMap((prev) => ({ ...prev, [targetUrl]: generatedSlug }));
      setShortUrlResult(`https://om.dev/${generatedSlug}`);
      addLog("info", `REDIS: SETEX 'url:${targetUrl}' 86400 '${generatedSlug}' (Write-Through) [1.2ms]`);
      addLog("info", `Response 201 Created: { shortUrl: "https://om.dev/${generatedSlug}", cache: "MISS" }`);
    }

    await new Promise((r) => setTimeout(r, 400));
    setActiveNode(null);
    setIsProcessing(false);
  };

  // Simulate SyncLab Collaborative Edit
  const handleSimulateSync = async (snippet: string) => {
    setSyncStatus("syncing");
    setClientACode(snippet);
    const simulatedLatency = Math.floor(Math.random() * 8 + 12);
    setSyncLatency(`${simulatedLatency}ms`);

    addLog("info", `WebSocket Frame -> Client A emitted 'editor:patch' (Length: ${snippet.length})`);
    addLog("hash", "OT Engine: Operational Transformation applied without conflict.");

    await new Promise((r) => setTimeout(r, 200));
    setClientBCode(snippet);
    setSyncStatus("synced");
    addLog("hit", `WebSocket Broadcast -> Client B synchronized across socket room [${simulatedLatency}ms]`);
  };

  const hitRatio = Math.round((cacheHits / (cacheHits + cacheMisses || 1)) * 100);

  return (
    <section className="arch-section" id="architecture">
      <div className="arch-container">
        {/* Header */}
        <div className="arch-header">
          <div className="arch-badge">
            <FiCpu /> System Architecture Playground
          </div>
          <h2>
            Interactive <span>Backend Engine</span>
          </h2>
          <p>
            Inspect the distributed systems I design. Trigger live simulations of
            in-memory caching, Base62 hashing, and WebSocket concurrency in real time.
          </p>
        </div>

        {/* System Switcher Tabs */}
        <div className="arch-tabs">
          <button
            className={`arch-tab-btn ${activeTab === "url-shortener" ? "active" : ""}`}
            onClick={() => setActiveTab("url-shortener")}
            data-cursor="disable"
          >
            <SiRedis style={{ color: "#ef4444" }} />
            <span>High-Throughput URL Shortener (Redis + Base62)</span>
          </button>
          <button
            className={`arch-tab-btn ${activeTab === "synclab" ? "active" : ""}`}
            onClick={() => setActiveTab("synclab")}
            data-cursor="disable"
          >
            <SiSocketdotio style={{ color: "#38bdf8" }} />
            <span>SyncLab: WebSocket Concurrency (OT Engine)</span>
          </button>
        </div>

        {/* Playground Card Shell */}
        <div className="arch-card">
          {/* Top Performance HUD */}
          <div className="arch-metrics-hud">
            {activeTab === "url-shortener" ? (
              <>
                <div className="arch-metric-box">
                  <div className="arch-metric-icon">
                    <FiClock />
                  </div>
                  <div className="arch-metric-data">
                    <span className="arch-metric-label">Last Response Time</span>
                    <span
                      className={`arch-metric-val ${
                        lastStatus === "hit" ? "green" : "purple"
                      }`}
                    >
                      {lastLatency}
                    </span>
                  </div>
                </div>

                <div className="arch-metric-box">
                  <div className="arch-metric-icon">
                    <FiZap />
                  </div>
                  <div className="arch-metric-data">
                    <span className="arch-metric-label">Cache Hit Ratio</span>
                    <span className="arch-metric-val green">{hitRatio}%</span>
                  </div>
                </div>

                <div className="arch-metric-box">
                  <div className="arch-metric-icon">
                    <FiDatabase />
                  </div>
                  <div className="arch-metric-data">
                    <span className="arch-metric-label">Database Offload</span>
                    <span className="arch-metric-val cyan">
                      {cacheHits} queries intercepted
                    </span>
                  </div>
                </div>

                <div className="arch-metric-box">
                  <div className="arch-metric-icon">
                    <FiShield />
                  </div>
                  <div className="arch-metric-data">
                    <span className="arch-metric-label">Throughput Tier</span>
                    <span className="arch-metric-val purple">12,500 req/sec</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="arch-metric-box">
                  <div className="arch-metric-icon">
                    <FiActivity />
                  </div>
                  <div className="arch-metric-data">
                    <span className="arch-metric-label">Socket RTT Latency</span>
                    <span className="arch-metric-val green">{syncLatency}</span>
                  </div>
                </div>

                <div className="arch-metric-box">
                  <div className="arch-metric-icon">
                    <FiCheckCircle />
                  </div>
                  <div className="arch-metric-data">
                    <span className="arch-metric-label">Concurrency State</span>
                    <span className="arch-metric-val purple">
                      {syncStatus === "synced" ? "Zero Conflicts" : "Transforming..."}
                    </span>
                  </div>
                </div>

                <div className="arch-metric-box">
                  <div className="arch-metric-icon">
                    <FiShare2 />
                  </div>
                  <div className="arch-metric-data">
                    <span className="arch-metric-label">Replication Protocol</span>
                    <span className="arch-metric-val cyan">OT / CRDT Vector</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Interactive Controls for URL Shortener */}
          {activeTab === "url-shortener" && (
            <>
              <div className="arch-control-bar">
                <div className="arch-input-group">
                  <span className="arch-input-icon">https://</span>
                  <input
                    type="text"
                    className="arch-input"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="Enter URL to shorten or simulate..."
                    data-cursor="disable"
                  />
                </div>

                <div className="arch-btn-group">
                  <button
                    className="arch-action-btn primary"
                    onClick={() => handleSimulateRequest()}
                    disabled={isProcessing}
                    data-cursor="disable"
                  >
                    <FiPlay />
                    <span>{isProcessing ? "Processing..." : "Run Request"}</span>
                  </button>

                  <button
                    className="arch-action-btn secondary"
                    onClick={() => {
                      setCacheMap({});
                      setCacheHits(0);
                      setCacheMisses(0);
                      addLog("miss", "Redis Cache flushed. Next request will force a CACHE MISS.");
                    }}
                    data-cursor="disable"
                  >
                    <FiRefreshCw />
                    <span>Flush Cache</span>
                  </button>
                </div>
              </div>

              {/* Preset quick test buttons */}
              <div className="arch-presets">
                <span>Quick Test Presets:</span>
                <span
                  className="arch-preset-pill"
                  onClick={() => {
                    setInputUrl("https://github.com/Omfarakate/SyncLab");
                    handleSimulateRequest("https://github.com/Omfarakate/SyncLab");
                  }}
                  data-cursor="disable"
                >
                  ⚡ Test Cache Hit (SyncLab Repo)
                </span>
                <span
                  className="arch-preset-pill"
                  onClick={() => {
                    const randomUrl = `https://news.ycombinator.com/item?id=${Math.floor(
                      Math.random() * 90000 + 10000
                    )}`;
                    setInputUrl(randomUrl);
                    handleSimulateRequest(randomUrl);
                  }}
                  data-cursor="disable"
                >
                  🔴 Test Cache Miss (Fresh URL)
                </span>
                {shortUrlResult && (
                  <span style={{ marginLeft: "auto", color: "#c2a4ff", fontWeight: 600 }}>
                    Result: <span style={{ color: "#fff" }}>{shortUrlResult}</span>
                  </span>
                )}
              </div>

              {/* System Architecture Node Diagram */}
              <div className="arch-canvas-stage">
                {/* Node 1: Client */}
                <div
                  className={`arch-node ${
                    activeNode === "client" ? "active-pulse" : ""
                  }`}
                >
                  <span className="arch-node-badge client">Origin</span>
                  <div className="arch-node-icon" style={{ color: "#38bdf8" }}>
                    <FiServer />
                  </div>
                  <div className="arch-node-name">Web Client</div>
                  <div className="arch-node-desc">Next.js / Browser</div>
                  <div className="arch-node-status">
                    <span className="arch-status-dot"></span> Active
                  </div>
                </div>

                {/* Connector 1 */}
                <div className="arch-connector">
                  <div
                    className={`arch-connector-line ${
                      activeNode === "client" || activeNode === "gateway"
                        ? "active"
                        : ""
                    }`}
                  ></div>
                  <span className="arch-connector-tag">REST / JSON</span>
                </div>

                {/* Node 2: NestJS Gateway */}
                <div
                  className={`arch-node ${
                    activeNode === "gateway" ? "active-pulse" : ""
                  }`}
                >
                  <span className="arch-node-badge gateway">API Gateway</span>
                  <div className="arch-node-icon" style={{ color: "#e11d48" }}>
                    <SiNestjs />
                  </div>
                  <div className="arch-node-name">NestJS Service</div>
                  <div className="arch-node-desc">Rate Limit & Auth</div>
                  <div className="arch-node-status">
                    <span className="arch-status-dot"></span> Healthy
                  </div>
                </div>

                {/* Connector 2 */}
                <div className="arch-connector">
                  <div
                    className={`arch-connector-line ${
                      activeNode === "redis" || activeNode === "cache-hit"
                        ? "active"
                        : ""
                    }`}
                  ></div>
                  <span className="arch-connector-tag">TCP / In-Memory</span>
                </div>

                {/* Node 3: Redis Cache */}
                <div
                  className={`arch-node ${
                    activeNode === "redis"
                      ? "active-pulse"
                      : activeNode === "cache-hit"
                      ? "cache-hit-pulse"
                      : ""
                  }`}
                >
                  <span className="arch-node-badge redis">In-Memory Cache</span>
                  <div className="arch-node-icon" style={{ color: "#ef4444" }}>
                    <SiRedis />
                  </div>
                  <div className="arch-node-name">Redis Store</div>
                  <div className="arch-node-desc">Key-Value TTL Caching</div>
                  <div className="arch-node-status">
                    <span className="arch-status-dot"></span> &lt; 2ms latency
                  </div>
                </div>

                {/* Connector 3 */}
                <div className="arch-connector">
                  <div
                    className={`arch-connector-line ${
                      activeNode === "mysql" ? "active" : ""
                    }`}
                  ></div>
                  <span className="arch-connector-tag">Fallback Tier</span>
                </div>

                {/* Node 4: MySQL Database */}
                <div
                  className={`arch-node ${
                    activeNode === "mysql" ? "cache-miss-pulse" : ""
                  }`}
                >
                  <span className="arch-node-badge mysql">Persistent DB</span>
                  <div className="arch-node-icon" style={{ color: "#3b82f6" }}>
                    <SiMysql />
                  </div>
                  <div className="arch-node-name">MySQL DB</div>
                  <div className="arch-node-desc">Base62 Relational Store</div>
                  <div className="arch-node-status">
                    <span className="arch-status-dot"></span> ACID Persistent
                  </div>
                </div>
              </div>
            </>
          )}

          {/* SyncLab Collaborative Mode */}
          {activeTab === "synclab" && (
            <div className="arch-synclab-grid">
              {/* Client A Window */}
              <div className="arch-editor-window">
                <div className="arch-editor-top">
                  <div className="arch-editor-dots">
                    <span className="arch-editor-dot"></span>
                    <span className="arch-editor-dot"></span>
                    <span className="arch-editor-dot"></span>
                  </div>
                  <span className="arch-editor-title">
                    Client A (Om - Mumbai)
                    <span className="arch-cursor-pill a">Om</span>
                  </span>
                </div>
                <div className="arch-editor-body">
                  <textarea
                    className="arch-editor-textarea"
                    rows={6}
                    value={clientACode}
                    onChange={(e) => handleSimulateSync(e.target.value)}
                    data-cursor="disable"
                  />
                </div>
              </div>

              {/* Central WebSocket Broker */}
              <div style={{ textAlign: "center", padding: "10px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    margin: "0 auto 8px",
                    borderRadius: "14px",
                    background: "rgba(56, 189, 248, 0.12)",
                    border: "1px solid rgba(56, 189, 248, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    color: "#38bdf8",
                  }}
                >
                  <SiSocketdotio />
                </div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>
                  WebSocket Broker
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)" }}>
                  Operational Transform
                </div>
                <div style={{ marginTop: "12px" }}>
                  <button
                    className="arch-preset-pill"
                    onClick={() =>
                      handleSimulateSync(
                        `// Live Update @ ${new Date().toLocaleTimeString()}\nconst socket = io("wss://synclab.omfarakate.dev");\nsocket.emit("join_room", { room: "production" });`
                      )
                    }
                    data-cursor="disable"
                  >
                    ⚡ Broadcast Edit
                  </button>
                </div>
              </div>

              {/* Client B Window */}
              <div className="arch-editor-window">
                <div className="arch-editor-top">
                  <div className="arch-editor-dots">
                    <span className="arch-editor-dot"></span>
                    <span className="arch-editor-dot"></span>
                    <span className="arch-editor-dot"></span>
                  </div>
                  <span className="arch-editor-title">
                    Client B (Peer - San Francisco)
                    <span className="arch-cursor-pill b">Peer</span>
                  </span>
                </div>
                <div className="arch-editor-body">
                  <textarea
                    className="arch-editor-textarea"
                    rows={6}
                    value={clientBCode}
                    readOnly
                    data-cursor="disable"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Real-Time Event Stream Log */}
          <div className="arch-console-drawer">
            <div className="arch-console-header">
              <div className="arch-console-title">
                <span className="arch-console-pulse"></span>
                <span>Live System Execution Logs (Distributed Stream)</span>
              </div>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                Streaming live metrics
              </span>
            </div>

            <div className="arch-console-logs">
              {logs.map((log, index) => (
                <div key={index} className="arch-log-line">
                  <span className="arch-log-time">[{log.time}]</span>
                  <span className={`arch-log-type ${log.type}`}>
                    {log.type.toUpperCase()}
                  </span>
                  <span className="arch-log-msg">{log.msg}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArchitecturePlayground;
