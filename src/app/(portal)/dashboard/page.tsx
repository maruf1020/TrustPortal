"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CloudSun, Download, RefreshCw } from "lucide-react";
import { useTrust } from "@/lib/trust-provider";
import { ACTIVITY, WEATHER } from "@/lib/copy";
import { BEAT, DOUBLE_TAKE } from "@/lib/timing";
import { commas, downloadFile, todayLong } from "@/lib/utils";
import { jitter } from "@/lib/rng";
import {
  Circled,
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchProgress,
  SketchRule,
  SketchTooltip,
  StickyNote,
} from "@/components/sketch";
import { DogAvatar, SketchLineChart, SketchRing } from "@/components/sketch/art";
import { MemoryLine } from "@/components/shell/memory-line";

const CHECKLIST = [
  "Create your account",
  "Verify your email",
  "Invite your team",
  "Connect an integration",
  "Read the terms",
  "Believe",
];

export default function DashboardPage() {
  const { trust, remember, bump, countOf, level, displayName, dwellMs } = useTrust();

  /* ------------------------------------------------------- live numbers -- */
  const [trustScore, setTrustScore] = useState(112);
  const [cookies, setCookies] = useState(1_204_811);
  const [wasted, setWasted] = useState(0);

  useEffect(() => {
    const a = window.setInterval(
      () => setTrustScore(85 + Math.floor(Math.random() * 66)),
      2600,
    );
    const b = window.setInterval(() => setCookies((c) => c + Math.ceil(Math.random() * 40)), 900);
    const c = window.setInterval(() => setWasted((w) => w + 1), 1000);
    return () => {
      window.clearInterval(a);
      window.clearInterval(b);
      window.clearInterval(c);
    };
  }, []);

  /* ------------------------------------------------------------- sync -- */
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  useEffect(() => {
    if (!syncing) return;
    const onBlur = () => {
      setSyncing(false);
      setSynced(true);
    };
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onBlur);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onBlur);
    };
  }, [syncing]);

  /* -------------------------------------------------- the runaway button -- */
  const [dodge, setDodge] = useState({ x: 0, y: 0 });
  const [caught, setCaught] = useState(false);
  const dodges = useRef(0);
  const flee = () => {
    if (caught) return;
    if (dodges.current >= 3) return; // escape hatch: three dodges, then it gives in
    dodges.current += 1;
    bump("delete-hovers");
    remember("delete-attempt", "reached for Delete My Data");
    setDodge({
      x: (Math.random() - 0.5) * 190,
      y: (Math.random() - 0.5) * 70,
    });
  };

  /* --------------------------------------------------------- widget drag -- */
  const [dragNote, setDragNote] = useState<string | null>(null);

  // A seeded rotation rather than five independent picks — repeats in a feed of
  // five items read as a bug, not a bit.
  const activity = useMemo(() => {
    const start = Math.floor(jitter("activity-start", 0, ACTIVITY.length));
    return Array.from({ length: 5 }, (_, i) => ACTIVITY[(start + i) % ACTIVITY.length]);
  }, []);
  const series = useMemo(
    () => [12, 18, 15, 26, 24, 33, 30, 41, 38, 47, 52, 49, 61],
    [],
  );

  const hhmmss = new Date(wasted * 1000).toISOString().substring(11, 19);

  return (
    <div className="pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SketchHeading level={1}>
            {level >= 1 ? `Good to see you, ${displayName}.` : "Dashboard"}
          </SketchHeading>
          <p className="mt-2 font-note text-sm text-graphite-soft">
            Last updated: just now. · {todayLong()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SketchButton
            size="sm"
            sketchId="export-csv"
            onClick={() => {
              const csv = "trust\n" + Array.from({ length: 400 }, () => "yes").join("\n");
              downloadFile("trust-export.csv", csv, "text/csv");
              remember("download", "exported 400 rows of the word yes");
              trust("interact");
            }}
          >
            <Download className="h-4 w-4" /> Export CSV
          </SketchButton>
          <SketchButton
            size="sm"
            sketchId="sync-now"
            onMouseEnter={() => {
              setSynced(false);
              setSyncing(true);
            }}
            onMouseLeave={() => {
              // It syncs the instant you look away.
              window.setTimeout(() => {
                setSyncing(false);
                setSynced(true);
              }, 120);
            }}
            onClick={() => trust("interact")}
          >
            <RefreshCw className={syncing ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
            {syncing ? "Syncing…" : synced ? "Synced" : "Sync Now"}
          </SketchButton>
        </div>
      </div>

      {/* ------------------------------------------------------------ row 1 */}
      <div className="mt-7 grid gap-5 lg:grid-cols-[auto_1fr_1fr]">
        <SketchCard sketchId="score-card" className="flex flex-col items-center justify-center">
          <SketchTooltip content="Calculated fairly.">
            <div>
              <SketchRing value={trustScore} label="Trust Score" />
            </div>
          </SketchTooltip>
          <p className="mt-2 font-note text-xs text-graphite-faint">
            Compared to last month: <b className="text-greenpencil">+∞%</b>
          </p>
        </SketchCard>

        <SketchCard sketchId="cookies-card">
          <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
            Cookies accepted
          </p>
          <p className="font-display text-5xl leading-tight">{commas(cookies)}</p>
          <p className="font-note text-sm text-graphite-soft">
            +∞% vs. last month
          </p>
          <SketchRule className="my-3" />
          <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
            Ads blocked
          </p>
          <p className="font-display text-4xl leading-tight text-redpencil">−12</p>
        </SketchCard>

        <SketchCard sketchId="wasted-card">
          <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
            Time you&rsquo;ve wasted here
          </p>
          <p className="font-typed text-4xl leading-tight">{hhmmss}</p>
          <SketchRule className="my-3" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="font-note text-xs text-graphite-faint">Churn (Ours)</p>
              <p className="font-display text-2xl">0%</p>
            </div>
            <div>
              <p className="font-note text-xs text-graphite-faint">Churn (Yours)</p>
              <p className="font-display text-2xl">N/A</p>
              <p className="font-note text-[11px] text-graphite-faint">not permitted</p>
            </div>
          </div>
        </SketchCard>
      </div>

      {/* ------------------------------------------------------------ row 2 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <SketchCard sketchId="chart-card" className="lg:col-span-2">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-2xl">Trust over time</p>
            <p className="font-note text-xs text-graphite-faint">
              <span className="text-bluepencil">━</span> Trust (blue) &nbsp;
              <span className="text-bluepencil">━</span> Also Trust (blue)
            </p>
          </div>
          <SketchLineChart points={series} seed="trust-over-time" height={170} />
          <p className="text-right font-note text-xs text-graphite-faint">
            Axis labels available on the Enterprise plan.
          </p>
        </SketchCard>

        <SketchCard sketchId="weather-card">
          <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
            Weather
          </p>
          <div className="mt-1 flex items-center gap-3">
            <CloudSun className="h-10 w-10 text-graphite-soft" />
            <p className="font-hand text-lg leading-snug">{WEATHER}</p>
          </div>
          <SketchRule className="my-3" />
          <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
            Online now
          </p>
          <p className="font-hand text-lg">1 user online (you) (probably)</p>
          <SketchRule className="my-3" />
          <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
            Trust goal
          </p>
          <p className="font-hand">
            Goal 100% · Current {trustScore}% ·{" "}
            <span className="text-redpencil">Status: Behind</span>
          </p>
          <SketchProgress value={Math.min(100, trustScore)} tone="red" className="mt-2" />
        </SketchCard>
      </div>

      {/* ------------------------------------------------------------ row 3 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <motion.div drag dragSnapToOrigin dragElastic={0.16} onDragEnd={() => setDragNote("This is where it goes.")}>
          <SketchCard sketchId="activity-card" className="cursor-grab active:cursor-grabbing">
            <p className="font-display text-2xl">Recent activity</p>
            <SketchRule className="mb-2" />
            <ul className="space-y-1.5">
              {activity.map((a, i) => (
                <li key={i} className="font-hand text-[15px]">
                  · {a}
                </li>
              ))}
            </ul>
            <p className="mt-3 font-note text-xs text-graphite-faint">
              Drag to rearrange.
            </p>
          </SketchCard>
        </motion.div>

        <motion.div drag dragSnapToOrigin dragElastic={0.16} onDragEnd={() => setDragNote("This is where it goes.")}>
          <SketchCard sketchId="calendar-card" className="cursor-grab active:cursor-grabbing">
            <p className="font-display text-2xl">This week</p>
            <SketchRule className="mb-2" />
            <div className="grid grid-cols-7 gap-1 text-center">
              {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                <div key={i}>
                  <p className="font-note text-[11px] text-graphite-faint">{d}</p>
                  <div className="relative mt-1 aspect-square">
                    <SketchFrame id={`day-${i}`} variant="box" strokeWidth={1} roughness={2.6} />
                    <span className="relative z-10 grid h-full place-content-center font-typed text-[10px] leading-none">
                      🤝
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-2 font-hand text-sm">
              Every day: <i>Meeting: Discuss Trust</i>
            </p>
            <p className="font-note text-xs text-graphite-faint">Today has four.</p>
          </SketchCard>
        </motion.div>

        <SketchCard sketchId="checklist-card">
          <p className="font-display text-2xl">Getting started</p>
          <p className="font-note text-xs text-graphite-faint">6 of 5 complete</p>
          <SketchRule className="mb-2" />
          <ul className="space-y-1">
            {CHECKLIST.map((c) => (
              <li key={c} className="font-hand text-[15px] text-graphite-soft">
                <span className="text-greenpencil">✓</span>{" "}
                <span className="strikethrough-sketch">{c}</span>
              </li>
            ))}
          </ul>
          <SketchProgress value={100} className="mt-3" />
        </SketchCard>
      </div>

      {/* ------------------------------------------------------------ row 4 */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <SketchCard sketchId="lookalike-card">
          <p className="font-display text-2xl">People who look like you also trusted</p>
          <SketchRule className="mb-3" />
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-center">
                <DogAvatar size={54} />
                <p className="font-note text-[11px] text-graphite-faint">
                  {["B. Trust", "B. Trust", "B. Trust", "B. Trust", "B. Trust"][i]}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 font-note text-xs text-graphite-faint">
            Based on similarity. Similarity based on you.
          </p>
        </SketchCard>

        <SketchCard sketchId="danger-card">
          <p className="font-display text-2xl">Your data</p>
          <SketchRule className="mb-3" />
          <p className="font-hand text-[15px] text-graphite-soft">
            You are in control of your data. This is the control.
          </p>
          <div className="relative mt-4 h-24">
            <motion.div
              animate={dodge}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="absolute left-0 top-0"
              onMouseEnter={flee}
            >
              <SketchButton
                variant="danger"
                sketchId="delete-my-data"
                onFocus={() => {
                  // Keyboard users are never chased. It holds still and gives in.
                  dodges.current = 3;
                }}
                onClick={() => {
                  setCaught(true);
                  trust("caughtTheButton");
                  remember("delete-attempt", "caught the Delete My Data button");
                }}
              >
                Delete My Data
              </SketchButton>
            </motion.div>
          </div>
          {caught && (
            <p className="font-hand text-[15px]">
              <Circled>Nice try. Your data is eternal now.</Circled>
            </p>
          )}
          {!caught && dodges.current >= 3 && (
            <p className="font-note text-sm text-graphite-faint">…fine.</p>
          )}
          <p className="mt-3 font-note text-xs text-graphite-faint">
            Reached for {countOf("delete-hovers")} times this session.
          </p>
        </SketchCard>
      </div>

      <div className="mt-6 flex flex-wrap items-start gap-5">
        <MemoryLine className="max-w-sm" />
        {dragNote && (
          <StickyNote tone="pink" className="max-w-xs">
            <p className="font-hand text-[15px]">{dragNote}</p>
          </StickyNote>
        )}
        {dwellMs > 120_000 && level >= 2 && (
          <StickyNote tone="yellow" className="max-w-xs">
            <p className="font-hand text-[15px]">
              You&rsquo;ve been on this page a while. We&rsquo;ve enjoyed it.
            </p>
          </StickyNote>
        )}
      </div>
    </div>
  );
}
