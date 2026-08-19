"use client";

import { useEffect, useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { INVOICE_LINES } from "@/lib/copy";
import { DOUBLE_TAKE } from "@/lib/timing";
import { downloadFile } from "@/lib/utils";
import {
  Circled,
  SketchButton,
  SketchCard,
  SketchDialogContent,
  SketchDialogRoot,
  SketchFrame,
  SketchHeading,
  SketchInput,
  SketchRule,
  SketchTooltip,
  StickyNote,
} from "@/components/sketch";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    features: ["Trust", "More Trust", "Unlimited Trust", "Priority Trust", "Trust API", "Dedicated Trust"],
  },
  {
    name: "Pro",
    price: "$49",
    features: ["Trust", "More Trust", "Unlimited Trust"],
  },
  {
    name: "Business",
    price: "$249",
    features: ["Trust", "More Trust"],
  },
  {
    name: "Enterprise",
    price: "???",
    features: ["Trust"],
  },
];

const GUILT = [
  { emoji: "🐕", line: "Bartholomew will be told." },
  { emoji: "📉", line: "Our Q3 was going so well." },
  { emoji: "🕯️", line: "We lit a candle for your account." },
  { emoji: "🫂", line: "We're not angry. We're something else." },
  { emoji: "🙂", line: "Okay. Go on then." },
];

export default function BillingPage() {
  const { trust, remember, bump } = useTrust();
  const [days, setDays] = useState(14);
  const [promo, setPromo] = useState("");
  const [promoNote, setPromoNote] = useState<string | null>(null);
  const [contact, setContact] = useState<string | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [guilt, setGuilt] = useState(0);
  const [cancelled, setCancelled] = useState(false);
  const [downgraded, setDowngraded] = useState(false);

  // The trial countdown resets to 14 days every time you check it.
  useEffect(() => {
    setDays(14);
    const id = window.setInterval(() => setDays((d) => Math.max(13, d - 1)), 9000);
    return () => window.clearInterval(id);
  }, []);

  const total = INVOICE_LINES.reduce((s, l) => s + l.amount, 0);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Billing</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Free trial: {days} days remaining. Resets when checked.
      </p>

      {/* ---------------------------------------------------------- plans */}
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => (
          <SketchCard key={p.name} sketchId={`plan-${p.name}`} className="flex flex-col">
            <p className="font-display text-2xl">{p.name}</p>
            {p.price === "???" ? (
              <SketchTooltip content="If you have to ask, you can.">
                <p className="font-display text-4xl">{p.price}</p>
              </SketchTooltip>
            ) : (
              <p className="font-display text-4xl">
                {p.price}
                <span className="font-note text-sm text-graphite-faint">/mo</span>
              </p>
            )}
            <SketchRule className="my-3" />
            <ul className="flex-1 space-y-1">
              {p.features.map((f) => (
                <li key={f} className="font-hand text-[15px]">
                  <span className="text-greenpencil">✓</span> {f}
                </li>
              ))}
            </ul>
            <SketchButton
              className="mt-4 w-full"
              variant={p.name === "Pro" ? "primary" : "default"}
              sketchId={`choose-${p.name}`}
              onClick={() => {
                setContact(p.name);
                trust("interact");
              }}
            >
              Choose {p.name}
            </SketchButton>
          </SketchCard>
        ))}
      </div>
      <p className="mt-2 font-note text-xs text-graphite-faint">
        Prices in Trust Coins (non-transferable, non-existent). 1 Trust Coin = 1 Trust Coin.
      </p>

      {/* -------------------------------------------------------- invoices */}
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <SketchCard sketchId="invoice-card">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-2xl">Invoice history</p>
            <SketchButton
              size="sm"
              variant="quiet"
              sketchId="download-invoice"
              onClick={() => {
                downloadFile(
                  "invoice-DRAFT-FINAL.txt",
                  "TRUSTPORTAL — INVOICE\n\nWATERMARK: DRAFT — FINAL\n\n" +
                    INVOICE_LINES.map((l) => `${l.label}  $${l.amount.toFixed(2)}`).join("\n") +
                    `\n\nTotal  $${total.toFixed(2)}\n\nSent to an address that isn't yours, for your records.\n`,
                );
                remember("download", "downloaded an invoice");
                trust("interact");
              }}
            >
              Download PDF
            </SketchButton>
          </div>
          <SketchRule className="mb-3" />
          <div className="space-y-1.5">
            {INVOICE_LINES.map((l, i) => (
              <div key={i} className="flex items-baseline justify-between gap-4 font-hand text-[15px]">
                <span>{l.label}</span>
                <span className="font-typed text-sm">${l.amount.toFixed(2)}</span>
              </div>
            ))}
            <p className="font-note text-xs text-graphite-faint">
              &ldquo;Rounding (in our favor)&rdquo; appears a further 39 times.
            </p>
          </div>
          <SketchRule className="my-3" />
          <div className="flex items-baseline justify-between font-display text-2xl">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <p className="mt-1 font-note text-xs text-graphite-faint">
            Receipts sent to b.trust@trustportal.example, for your records.
          </p>
        </SketchCard>

        <div className="space-y-5">
          <SketchCard sketchId="payment-card">
            <p className="font-display text-2xl">Payment method</p>
            <SketchRule className="mb-3" />
            {["Card", "Bank transfer", "Handshake (preferred)"].map((m, i) => (
              <label key={m} className="flex items-center gap-3 py-1.5">
                <span className="relative grid h-5 w-5 place-content-center">
                  <SketchFrame id={`pay-${i}`} variant="circle" strokeWidth={1.4} />
                  {i === 2 && (
                    <span className="relative z-10 block h-2.5 w-2.5 rounded-full bg-graphite" />
                  )}
                </span>
                <span className="font-hand text-[15px]">{m}</span>
              </label>
            ))}
            <p className="mt-2 font-note text-xs text-graphite-faint">
              No card fields here. There never were any.
            </p>
          </SketchCard>

          <SketchCard sketchId="promo-card">
            <p className="font-display text-2xl">Promo code</p>
            <SketchRule className="mb-3" />
            <div className="flex gap-2">
              <SketchInput
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                placeholder="TRUST20"
                aria-label="Promo code"
                sketchId="promo-input"
              />
              <SketchButton
                size="sm"
                sketchId="promo-apply"
                onClick={() => {
                  setPromoNote("Discount applied: 0%.");
                  trust("interact");
                }}
              >
                Apply
              </SketchButton>
            </div>
            {promoNote && <p className="mt-2 font-hand text-[15px] highlighted">{promoNote}</p>}
          </SketchCard>

          <SketchCard sketchId="subscription-card">
            <p className="font-display text-2xl">Subscription</p>
            <SketchRule className="mb-3" />
            <div className="flex flex-wrap gap-2">
              <SketchButton
                size="sm"
                sketchId="downgrade"
                onClick={() => {
                  setDowngraded(true);
                  trust("optOut");
                  remember("deny", "tried to downgrade");
                }}
              >
                Downgrade
              </SketchButton>
              <SketchButton
                size="sm"
                variant="danger"
                sketchId="cancel-sub"
                onClick={() => {
                  setCancelOpen(true);
                  setGuilt(0);
                  setCancelled(false);
                  trust("optOut");
                  remember("cancel", "opened the cancellation flow");
                }}
              >
                Cancel subscription
              </SketchButton>
            </div>
            {downgraded && (
              <p className="mt-2 font-hand text-[15px]">
                Upgraded to Business. Thank you for downgrading.
              </p>
            )}
          </SketchCard>
        </div>
      </div>

      <StickyNote tone="yellow" className="mt-6 max-w-sm">
        <p className="font-hand text-[15px]">
          Nothing on this page charges anything. There is no payment processor. There is
          no money. There is only Trust.
        </p>
      </StickyNote>

      {/* --------------------------------------------------- contact sales */}
      <SketchDialogRoot open={!!contact} onOpenChange={(o) => !o && setContact(null)}>
        <SketchDialogContent
          title="Contact Sales"
          description={`The ${contact ?? ""} plan is available through our sales team.`}
        >
          <p className="font-hand text-[15px]">
            Every plan is available through our sales team. Including Free.
          </p>
          <p className="mt-2 font-note text-sm text-graphite-faint">
            Our sales team is currently on lunch. Our sales team is Trusty.
          </p>
          <SketchButton
            className="mt-4"
            size="sm"
            sketchId="contact-ok"
            onClick={() => setContact(null)}
          >
            Understood
          </SketchButton>
        </SketchDialogContent>
      </SketchDialogRoot>

      {/* ------------------------------------------------- the guilt slides */}
      <SketchDialogRoot open={cancelOpen} onOpenChange={setCancelOpen}>
        <SketchDialogContent
          title={cancelled ? "Cancelled." : "Before you go"}
          description={cancelled ? undefined : `${guilt + 1} of ${GUILT.length}`}
        >
          {cancelled ? (
            <div>
              <p className="font-hand text-lg">
                <Circled>See you next month.</Circled>
              </p>
              <SketchButton
                className="mt-4"
                size="sm"
                sketchId="cancel-done"
                onClick={() => setCancelOpen(false)}
              >
                Close
              </SketchButton>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-6xl">{GUILT[guilt].emoji}</p>
              <p className="mt-3 font-hand text-lg">{GUILT[guilt].line}</p>
              <div className="mt-5 flex justify-center gap-2">
                <SketchButton
                  size="sm"
                  sketchId={`guilt-${guilt}`}
                  onClick={() => {
                    if (guilt === GUILT.length - 1) {
                      setCancelled(true);
                      bump("cancellations");
                      remember("cancel", "cancelled their subscription");
                    } else {
                      setGuilt((g) => g + 1);
                    }
                    trust("optOut");
                  }}
                >
                  {guilt === GUILT.length - 1 ? "Cancel anyway" : "Continue"}
                </SketchButton>
                <SketchButton
                  size="sm"
                  variant="quiet"
                  sketchId={`guilt-stay-${guilt}`}
                  onClick={() => setCancelOpen(false)}
                >
                  Stay
                </SketchButton>
              </div>
            </div>
          )}
        </SketchDialogContent>
      </SketchDialogRoot>
    </div>
  );
}
