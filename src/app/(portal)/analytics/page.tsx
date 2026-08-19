"use client";

import { useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import {
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchRule,
  StickyNote,
} from "@/components/sketch";
import { SketchLineChart } from "@/components/sketch/art";

const RANGES = ["Last 7 days", "Last 30 days", "All of it", "Before you"];
const DIMENSIONS = ["by time", "by vibe", "by you"];

const COHORTS = ["Week 0", "Week 1", "Week 2", "Week 3", "Week 4", "Week 5"];

export default function AnalyticsPage() {
  const { trust, remember } = useTrust();
  const [range, setRange] = useState(RANGES[1]);
  const [dimension, setDimension] = useState(DIMENSIONS[0]);
  const [zoom, setZoom] = useState(1);
  const [exported, setExported] = useState(false);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Analytics</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        One metric. Three dimensions. No conclusions.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <SketchButton
            key={r}
            size="sm"
            variant={r === range ? "primary" : "quiet"}
            sketchId={`range-${r}`}
            onClick={() => {
              setRange(r);
              trust("interact");
            }}
          >
            {r}
          </SketchButton>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <SketchCard sketchId="report-builder">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-display text-2xl">Trust, {dimension}</p>
            <div className="flex gap-1">
              {DIMENSIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => {
                    setDimension(d);
                    trust("interact");
                  }}
                  className={
                    d === dimension
                      ? "font-hand text-[15px] text-graphite sketch-underline"
                      : "font-hand text-[15px] text-graphite-faint hover:text-graphite"
                  }
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <SketchLineChart
            points={[14, 22, 19, 31, 28, 40, 37, 49, 46, 58, 63, 61, 74]}
            seed={`analytics-${dimension}`}
            height={200}
          />
          <p className="text-right font-note text-xs text-graphite-faint">
            Range: {range}. Metric: Trust. Comparison: none available.
          </p>
        </SketchCard>

        <div className="space-y-5">
          <SketchCard sketchId="drilldown">
            <p className="font-display text-2xl">Drill down</p>
            <SketchRule className="mb-3" />
            <div className="relative grid h-36 place-content-center overflow-hidden bg-paper-deep/40">
              <SketchFrame id="drill-box" variant="box" strokeWidth={1.3} />
              <span
                className="relative z-10 block bg-bluepencil transition-all duration-500"
                style={{ width: 4 * zoom, height: 4 * zoom }}
              />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <SketchButton
                size="sm"
                sketchId="drill-in"
                onClick={() => {
                  setZoom((z) => Math.min(z * 2, 32));
                  trust("interact");
                }}
              >
                Drill down
              </SketchButton>
              <p className="font-note text-xs text-graphite-faint">
                Depth {Math.log2(zoom) + 1} · still blue
              </p>
            </div>
          </SketchCard>

          <SketchCard sketchId="scheduled">
            <p className="font-display text-2xl">Scheduled reports</p>
            <SketchRule className="mb-3" />
            {["Weekly Trust summary", "Monthly Trust summary", "Daily Trust summary"].map((s) => (
              <div key={s} className="flex items-baseline justify-between gap-3 py-1">
                <span className="font-hand text-[15px]">{s}</span>
                <span className="font-note text-xs text-greenpencil">Already sent</span>
              </div>
            ))}
            <SketchButton
              size="sm"
              className="mt-3"
              sketchId="export-analytics"
              onClick={() => {
                setExported(true);
                remember("download", "exported a report that never arrived");
                trust("interact");
              }}
            >
              Export
            </SketchButton>
            {exported && (
              <div className="mt-2">
                <p className="font-hand text-[15px] highlighted">Exported.</p>
                <p className="font-note text-xs text-graphite-faint">
                  Check your email. There is no email.
                </p>
              </div>
            )}
          </SketchCard>
        </div>
      </div>

      <SketchCard sketchId="cohort-card" className="mt-5">
        <p className="font-display text-2xl">Cohort retention</p>
        <SketchRule className="mb-3" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse">
            <thead>
              <tr>
                <th className="pb-2 text-left font-note text-xs uppercase tracking-widest text-graphite-faint">
                  Cohort
                </th>
                {COHORTS.map((c) => (
                  <th
                    key={c}
                    className="pb-2 text-center font-note text-xs uppercase tracking-widest text-graphite-faint"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["January", "February", "March", "April"].map((m) => (
                <tr key={m}>
                  <td className="py-1 font-hand text-[15px]">{m}</td>
                  {COHORTS.map((c, i) => (
                    <td key={c} className="py-1 text-center font-typed text-sm">
                      {i === 0 ? "100%" : "101%"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 font-note text-xs text-graphite-faint">
          Retention above 100% is expected and has been signed off.
        </p>
      </SketchCard>

      <StickyNote tone="pink" className="mt-6 max-w-md">
        <p className="font-hand text-[15px]">
          There is no data behind any of this. The line goes up because lines go up.
        </p>
      </StickyNote>
    </div>
  );
}
