"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { useTrust } from "@/lib/trust-provider";
import { FAQ, HELP_ARTICLES, flatten } from "@/lib/copy";
import {
  SketchButton,
  SketchCard,
  SketchFrame,
  SketchHeading,
  SketchInput,
  SketchRule,
  SketchTextarea,
  StickyNote,
} from "@/components/sketch";

const TICKETS = [
  { id: "TP-4411", subject: "Cannot uncheck Remember Me", status: "Understood" },
  { id: "TP-4409", subject: "Dark mode not dark", status: "Closed" },
  { id: "TP-4409", subject: "Dark mode not dark", status: "Open" },
  { id: "TP-3980", subject: "Who is Deborah", status: "In Progress" },
  { id: "TP-0001", subject: "What does this product do", status: "Escalated" },
];

export default function SupportPage() {
  const { trust, remember } = useTrust();
  const [q, setQ] = useState("");
  const [wait, setWait] = useState(2);
  const [sent, setSent] = useState(false);
  const [helpful, setHelpful] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  // Estimated wait time counts up.
  useEffect(() => {
    const id = window.setInterval(() => setWait((w) => w + 1), 4000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pb-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <SketchHeading level={1}>Help Center</SketchHeading>
          <p className="mt-2 font-note text-sm text-graphite-soft">
            Support hours: 24/7 (not including nights, weekends, or days).
          </p>
        </div>
        <div className="relative px-4 py-2">
          <SketchFrame id="status-chip" variant="box" strokeWidth={1.3} />
          <p className="relative z-10 flex items-center gap-2 font-hand text-[15px]">
            <span className="inline-block h-3 w-3 rounded-full bg-redpencil" />
            <span className="text-greenpencil">All systems operational</span>
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------ help search */}
      <SketchCard sketchId="help-search" className="mt-7">
        <div className="flex flex-wrap gap-2">
          <SketchInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the help center…"
            aria-label="Search help center"
            sketchId="help-input"
            wrapperClassName="flex-1 min-w-60"
          />
          <SketchButton
            sketchId="help-go"
            onClick={() => {
              trust("interact");
              remember("search", q || "everything");
            }}
          >
            Search
          </SketchButton>
        </div>
        <p className="mt-2 font-note text-xs text-graphite-faint">
          About 1 results (0.00 seconds)
        </p>
        <SketchRule className="my-3" />
        <div className="space-y-3">
          {HELP_ARTICLES.map((a) => (
            <div key={a.title}>
              <p className="font-hand text-[17px] text-bluepencil sketch-underline">{a.title}</p>
              <p className="font-note text-xs text-graphite-faint">{a.meta}</p>
            </div>
          ))}
          <div>
            <Link
              href="/help/why-is-everything-like-this"
              className="font-hand text-[17px] text-bluepencil sketch-underline"
            >
              Why is everything like this?
            </Link>
            <p className="font-note text-xs text-graphite-faint">Updated today · 2 min read</p>
          </div>
        </div>
        <SketchRule className="my-3" />
        <div className="flex flex-wrap items-center gap-3">
          <p className="font-note text-sm text-graphite-soft">Was this helpful?</p>
          <SketchButton size="sm" sketchId="helpful-yes" onClick={() => setHelpful("Recorded: Yes.")}>
            Yes
          </SketchButton>
          <SketchButton
            size="sm"
            sketchId="helpful-quiet"
            onClick={() => setHelpful("Recorded: Yes.")}
          >
            Yes, but quietly
          </SketchButton>
          {helpful && <span className="font-hand text-[15px] highlighted">{helpful}</span>}
        </div>
      </SketchCard>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
        {/* ---------------------------------------------------------- FAQ */}
        <SketchCard sketchId="faq-card">
          <p className="font-display text-2xl">Frequently asked</p>
          <SketchRule className="mb-2" />
          <Accordion.Root type="single" collapsible className="space-y-1">
            {FAQ.map((question) => (
              <Accordion.Item key={question} value={question} className="border-b border-dashed border-graphite-ghost">
                <Accordion.Trigger
                  className="group flex w-full items-center justify-between gap-3 py-2.5 text-left font-hand text-[16px]"
                  onClick={() => trust("interact")}
                >
                  {question}
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
                <Accordion.Content className="pb-3 font-hand text-[15px] text-graphite-soft">
                  {flatten(question)}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </SketchCard>

        <div className="space-y-5">
          {/* --------------------------------------------------- contact */}
          <SketchCard sketchId="contact-card">
            <p className="font-display text-2xl">Contact us</p>
            <SketchRule className="mb-3" />
            <SketchTextarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us everything."
              aria-label="Your message"
              sketchId="contact-message"
            />
            <div className="mt-3 flex items-center gap-3">
              {/* The send button has been disabled this whole time. */}
              <SketchButton size="sm" disabled sketchId="contact-send">
                Send message
              </SketchButton>
              <SketchButton
                size="sm"
                variant="quiet"
                bare
                sketchId="contact-fake"
                onClick={() => {
                  setSent(true);
                  setMessage("");
                  trust("interact");
                  remember("feedback", "sent a message that was never sent");
                }}
              >
                (or press here)
              </SketchButton>
            </div>
            {sent && (
              <p className="mt-2 font-hand text-[15px] highlighted">Message sent!</p>
            )}
            <p className="mt-2 font-note text-xs text-graphite-faint">
              Estimated wait time: {wait} minutes.
            </p>
          </SketchCard>

          <SketchCard sketchId="tickets-card">
            <p className="font-display text-2xl">Your tickets</p>
            <SketchRule className="mb-2" />
            {TICKETS.map((t, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3 py-1">
                <span className="font-hand text-[15px]">
                  <span className="font-typed text-xs text-redpencil">{t.id}</span> {t.subject}
                </span>
                <span className="shrink-0 font-note text-xs text-graphite-faint">{t.status}</span>
              </div>
            ))}
            <p className="mt-2 font-note text-xs text-graphite-faint">
              Lifecycle: Open → In Progress → Understood → Closed → Open.
            </p>
          </SketchCard>

          <StickyNote tone="blue">
            <p className="font-hand text-[15px]">
              Trusty is in the corner of every page. Trusty is always typing.
            </p>
          </StickyNote>
        </div>
      </div>
    </div>
  );
}
