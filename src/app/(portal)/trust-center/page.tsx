"use client";

import { useTrust } from "@/lib/trust-provider";
import { CHANGELOG, INCIDENTS } from "@/lib/copy";
import { downloadFile } from "@/lib/utils";
import {
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchRule,
  StickyNote,
} from "@/components/sketch";

const BADGES = ["SOC 2", "ISO 27001", "HIPPO", "PCI-DSSS", "GDPR-ish", "Certified by TrustPortal"];

const ROADMAP = {
  Shipped: ["Trust", "More Trust", "The dog"],
  Shipping: ["Trust (again)", "Deborah", "Nothing"],
  "Shipped Already": ["Everything on this board", "This board"],
};

const BOUNTY = [
  { severity: "Critical", payout: "500 Trust Coins" },
  { severity: "High", payout: "50 Trust Coins" },
  { severity: "Medium", payout: "5 Trust Coins" },
  { severity: "Low", payout: "Our thanks" },
  { severity: "Informational", payout: "Our silence" },
];

export default function TrustCenterPage() {
  const { trust, remember } = useTrust();

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Trust Center</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Security, compliance, and status. All of it green.
      </p>

      {/* --------------------------------------------------------- badges */}
      <div className="mt-7 flex flex-wrap gap-3">
        {BADGES.map((b) => (
          <div key={b} className="relative px-4 py-2.5">
            <SketchFrame id={`badge-${b}`} variant="box" strokeWidth={1.4} roughness={2.2} />
            <span className="relative z-10 font-note text-sm">🛡️ {b}</span>
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_1fr]">
        {/* --------------------------------------------------------- status */}
        <SketchCard sketchId="status-card">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-2xl">Status</p>
            <span className="font-display text-3xl text-greenpencil">100% uptime</span>
          </div>
          <p className="font-note text-xs text-graphite-faint">All time. Every service.</p>
          <SketchRule className="my-3" />
          <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
            Incident history (200)
          </p>
          <div className="mt-1 space-y-1">
            {INCIDENTS.map((i, idx) => (
              <div key={idx} className="flex items-baseline justify-between gap-3">
                <span className="font-hand text-[15px]">
                  <span className="text-graphite-faint">{i.date}</span> — {i.title}
                </span>
                <span className="shrink-0 font-note text-xs text-graphite-faint">{i.status}</span>
              </div>
            ))}
            <p className="font-note text-xs text-graphite-faint">
              …and 194 further incidents, all resolved, during 100% uptime.
            </p>
          </div>
        </SketchCard>

        {/* ------------------------------------------------------ changelog */}
        <SketchCard sketchId="changelog-card">
          <p id="changelog" className="font-display text-2xl">
            Changelog
          </p>
          <SketchRule className="my-3" />
          <div className="space-y-1.5">
            {CHANGELOG.map((c) => (
              <div key={c.v} className="flex items-baseline gap-3">
                <span className="shrink-0 font-typed text-xs text-redpencil">{c.v}</span>
                <span className="font-hand text-[15px]">{c.note}</span>
              </div>
            ))}
          </div>
        </SketchCard>
      </div>

      {/* -------------------------------------------------------- roadmap */}
      <SketchCard sketchId="roadmap-card" className="mt-5">
        <p className="font-display text-2xl">Public roadmap</p>
        <SketchRule className="my-3" />
        <div className="grid gap-5 md:grid-cols-3">
          {Object.entries(ROADMAP).map(([col, items]) => (
            <div key={col}>
              <p className="font-note text-xs uppercase tracking-widest text-graphite-faint">
                {col}
              </p>
              <ul className="mt-2 space-y-1.5">
                {items.map((i) => (
                  <li key={i} className="relative px-3 py-1.5 font-hand text-[15px]">
                    <SketchFrame
                      id={`rm-${col}-${i}`}
                      variant="box"
                      strokeWidth={1.1}
                      roughness={2.5}
                    />
                    <span className="relative z-10">{i}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SketchCard>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <SketchCard sketchId="whitepaper-card">
          <p className="font-display text-2xl">Security whitepaper</p>
          <SketchRule className="my-3" />
          <p className="font-hand text-[15px]">
            Our complete security posture, documented in full.
          </p>
          <SketchButton
            size="sm"
            className="mt-3"
            sketchId="whitepaper-dl"
            onClick={() => {
              downloadFile(
                "trustportal-security-whitepaper.txt",
                "TRUSTPORTAL — SECURITY WHITEPAPER\nPage 1 of 1\n\nIt's fine.\n",
              );
              remember("download", "downloaded the one-sentence security whitepaper");
              trust("interact");
            }}
          >
            Download (1 page)
          </SketchButton>
        </SketchCard>

        <SketchCard sketchId="bounty-card">
          <p className="font-display text-2xl">Bug bounty</p>
          <SketchRule className="my-3" />
          {BOUNTY.map((b) => (
            <div key={b.severity} className="flex items-baseline justify-between gap-3 py-0.5">
              <span className="font-hand text-[15px]">{b.severity}</span>
              <span className="font-typed text-sm">{b.payout}</span>
            </div>
          ))}
          <p className="mt-2 font-note text-xs text-graphite-faint">
            Trust Coins are non-transferable and non-existent.
          </p>
        </SketchCard>
      </div>

      <StickyNote tone="blue" className="mt-6 max-w-md">
        <p className="font-hand text-[15px]">
          Two of those compliance badges are not real certifications. We will not be saying
          which two.
        </p>
      </StickyNote>
    </div>
  );
}
