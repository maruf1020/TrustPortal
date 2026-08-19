"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bell, Search } from "lucide-react";
import { useTrust } from "@/lib/trust-provider";
import { BRAND } from "@/lib/copy";
import { LEVEL_NAMES } from "@/lib/trust";
import { cn } from "@/lib/utils";
import {
  SketchFrame,
  SketchTooltip,
  SketchPopoverContent,
  SketchPopoverRoot,
  SketchPopoverTrigger,
  SketchRule,
} from "@/components/sketch";
import { Padlock } from "./padlock";

const NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/analytics", label: "Analytics" },
  { href: "/integrations", label: "Integrations" },
  { href: "/team", label: "Team" },
  { href: "/billing", label: "Billing" },
  { href: "/support", label: "Support" },
];

export function TopNav() {
  const { level, score, displayName, trust, bump, countOf } = useTrust();
  const pathname = usePathname();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [notches, setNotches] = useState(0);

  // The lock tightens on every interaction, anywhere.
  useEffect(() => {
    const onAny = () => setNotches((n) => (n + 1) % 40);
    window.addEventListener("click", onAny);
    return () => window.removeEventListener("click", onAny);
  }, []);

  const greeting =
    level >= 3 ? `Hello again, ${displayName}.` : level >= 1 ? `Hi, ${displayName}.` : "Hi there.";

  return (
    <header className="relative z-30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-5 py-4">
        <Link href="/dashboard" className="group flex items-center gap-2.5">
          <Padlock notches={notches} className="text-graphite" />
          <span className="font-display text-3xl leading-none">{BRAND.name}</span>
          <sup className="hidden font-note text-[10px] text-graphite-faint sm:inline">™</sup>
        </Link>

        <nav className="order-3 flex flex-1 flex-wrap items-center gap-1 md:order-none md:justify-center">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-3 py-1.5 font-hand text-[15px] transition-colors hover:text-redpencil",
                  active ? "text-graphite" : "text-graphite-soft",
                )}
              >
                {active && <SketchFrame id={`nav-${item.href}`} variant="underline" strokeWidth={1.4} />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form
          className="relative order-4 hidden items-center md:order-none md:flex"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${encodeURIComponent(q || "trust")}`);
          }}
        >
          <SketchFrame id="nav-search" variant="box" strokeWidth={1.3} roughness={2} />
          <Search className="relative z-10 ml-3 h-4 w-4 text-graphite-faint" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search everything…"
            aria-label="Search"
            className="relative z-10 w-36 bg-transparent px-2 py-1.5 font-hand text-sm outline-none placeholder:text-graphite-ghost lg:w-48"
          />
        </form>

        <div className="order-2 ml-auto flex items-center gap-3 md:order-none md:ml-0">
          <SketchTooltip content="Calculated fairly.">
            <Link
              href="/methodology"
              className="relative px-3 py-1.5 font-note text-sm"
              onClick={() => trust("interact")}
            >
              <SketchFrame id="nav-score" variant="box" strokeWidth={1.3} roughness={2.2} />
              <span className="relative z-10">
                Trust <b>{score}</b>
                <span className="ml-1 text-graphite-faint">· {LEVEL_NAMES[level]}</span>
              </span>
            </Link>
          </SketchTooltip>

          <Link
            href="/notifications"
            className="relative grid h-10 w-10 place-content-center"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 grid h-6 w-6 place-content-center font-note text-[11px] text-redpencil">
              <SketchFrame id="nav-badge" variant="circle" stroke="#b4392f" strokeWidth={1.3} />
              <span className="relative z-10">2.5</span>
            </span>
          </Link>

          <SketchPopoverRoot>
            <SketchPopoverTrigger asChild>
              <button
                className="relative grid h-10 w-10 place-content-center"
                aria-label="Account"
                onClick={() => bump("avatar-clicks")}
              >
                <SketchFrame id="nav-avatar" variant="circle" strokeWidth={1.5} />
                <Padlock size={20} notches={countOf("avatar-clicks")} className="relative z-10" />
              </button>
            </SketchPopoverTrigger>
            <SketchPopoverContent>
              <p className="font-display text-xl">{greeting}</p>
              <p className="mt-0.5 font-note text-xs text-graphite-faint">
                {LEVEL_NAMES[level]} account · Trust {score}
              </p>
              <SketchRule className="my-2" />
              <div className="grid gap-1 font-hand">
                <Link href="/settings" className="hover:text-redpencil">Settings</Link>
                <Link href="/notifications" className="hover:text-redpencil">Notifications</Link>
                <Link href="/trust-center" className="hover:text-redpencil">Trust Center</Link>
                <Link href="/accessibility" className="hover:text-redpencil">Accessibility</Link>
                <Link href="/logout" className="text-redpencil hover:underline">Log out</Link>
              </div>
            </SketchPopoverContent>
          </SketchPopoverRoot>
        </div>
      </div>

      <div className="relative mx-auto h-3 max-w-7xl px-5">
        <SketchFrame id="nav-rule" variant="underline" strokeWidth={1.3} roughness={2.6} />
      </div>
    </header>
  );
}
