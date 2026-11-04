import React, { useEffect, useState, useRef } from "react";
import {
  FiZap,
  FiUsers,
  FiShield,
  FiCode,
  FiActivity,
} from "react-icons/fi";
import "./ImpactMetrics.css";

interface MetricItem {
  id: string;
  targetValue: number;
  suffix: string;
  prefix?: string;
  label: string;
  description: string;
  pill: string;
  theme: "purple" | "green" | "cyan" | "amber";
  icon: React.ReactNode;
}

const metricsData: MetricItem[] = [
  {
    id: "latency",
    targetValue: 36,
    suffix: "%",
    label: "API Latency Reduction",
    description: "Achieved via in-memory Redis caching, SQL index tuning & REST payload optimization.",
    pill: "Performance",
    theme: "green",
    icon: <FiZap />,
  },
  {
    id: "users",
    targetValue: 1000,
    suffix: "+",
    label: "Active SaaS Users",
    description: "Supported concurrently across production manufacturing & enterprise CRM workflows.",
    pill: "Production Scale",
    theme: "purple",
    icon: <FiUsers />,
  },
  {
    id: "apis",
    targetValue: 30,
    suffix: "+",
    label: "Production REST APIs",
    description: "Designed with NestJS, JWT authentication, granular RBAC & token bucket rate limiting.",
    pill: "Backend & Security",
    theme: "cyan",
    icon: <FiShield />,
  },
  {
    id: "leetcode",
    targetValue: 180,
    suffix: "+",
    label: "LeetCode Problems Solved",
    description: "Strong algorithmic foundation across dynamic programming, graphs & trees (Consistency Badge).",
    pill: "Algorithms & DSA",
    theme: "amber",
    icon: <FiCode />,
  },
];

export const ImpactMetrics: React.FC = () => {
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1600; // ms
          const startTime = performance.now();

          const animateCounts = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const nextCounts = metricsData.map((item) =>
              Math.floor(easeOut * item.targetValue)
            );
            setCounts(nextCounts);

            if (progress < 1) {
              requestAnimationFrame(animateCounts);
            } else {
              setCounts(metricsData.map((m) => m.targetValue));
            }
          };

          requestAnimationFrame(animateCounts);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  return (
    <section className="impact-section" ref={sectionRef} id="impact">
      <div className="impact-container">
        {/* Section Header */}
        <div className="impact-header">
          <div className="impact-title-group">
            <span className="impact-tag">
              <FiActivity /> Quantified Impact
            </span>
            <h2>
              Engineering <span>By The Numbers</span>
            </h2>
          </div>
          <p className="impact-subtitle">
            Measurable results from shipped production features, scalable backend
            systems, and algorithmic problem solving.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="impact-grid">
          {metricsData.map((metric, idx) => {
            const formattedValue =
              metric.targetValue >= 1000 && counts[idx] >= 1000
                ? "1,000"
                : counts[idx];

            return (
              <div key={metric.id} className="impact-card">
                <div>
                  <div className="impact-card-top">
                    <div className={`impact-icon-badge ${metric.theme}`}>
                      {metric.icon}
                    </div>
                    <span className="impact-pill">{metric.pill}</span>
                  </div>

                  <div className="impact-number-wrap">
                    <div className={`impact-number ${metric.theme}`}>
                      {metric.prefix}
                      {formattedValue}
                      <span className="impact-unit">{metric.suffix}</span>
                    </div>
                  </div>

                  <h3 className="impact-label">{metric.label}</h3>
                </div>

                <p className="impact-desc">{metric.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactMetrics;
