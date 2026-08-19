"use client";

import { useEffect, useRef, useState } from "react";
import { useTrust } from "@/lib/trust-provider";
import { dwellPhrase } from "@/lib/trust";
import { spell } from "@/lib/copy";

/**
 * Level 5.
 *
 * No animation, no transition, no costume. System font, white background,
 * black text. A few honest sentences, then nothing loads after it.
 *
 * On the way in, this page wipes everything — so if the visitor reloads, the
 * site is exactly as it was at Level 0 and does not remember them. That is the
 * last joke, it is the only cruel one, and it is allowed.
 */
export default function TrustPage() {
  const { counters, dwellMs, memory, conclude } = useTrust();
  const [snapshot] = useState(() => ({
    cancels: counters["cancel"] ?? 0,
    denials: counters["deny"] ?? 0,
    toggles: counters["toggle"] ?? 0,
    deletes: counters["delete-attempt"] ?? 0,
    dwell: dwellMs,
    lines: memory.length,
  }));
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    document.title = "Trust";
    conclude();
  }, [conclude]);

  const acts =
    snapshot.cancels + snapshot.denials + snapshot.toggles + snapshot.deletes;

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#ffffff",
        color: "#111111",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
        display: "grid",
        placeItems: "center",
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "34rem", fontSize: "1.0625rem", lineHeight: 1.75 }}>
        <p>Okay.</p>

        <p style={{ marginTop: "1.5rem" }}>
          That&rsquo;s the whole joke.
        </p>

        <p style={{ marginTop: "1.5rem" }}>
          For about {dwellPhrase(snapshot.dwell)}, every control on this site was polite,
          well-designed, and did something other than what it said. The toggles came back
          on. The Cancel buttons cancelled nothing. The dialog that asked whether you were
          sure asked six more times and then kept your account.
        </p>

        {acts > 0 && (
          <p style={{ marginTop: "1.5rem" }}>
            You tried to turn something off, decline something, or delete something{" "}
            {acts < 13 ? spell(acts) : acts} times. None of it worked, and you kept going
            anyway. That part isn&rsquo;t a criticism. It&rsquo;s the thing the site was
            built to show you.
          </p>
        )}

        <p style={{ marginTop: "1.5rem" }}>
          Real products do this in smaller doses — one toggle that doesn&rsquo;t stick, one
          unsubscribe link that takes four screens, one cheerful confirmation for a thing
          you didn&rsquo;t agree to. Individually each one is too small to be worth the
          argument. That&rsquo;s exactly why they work.
        </p>

        <p style={{ marginTop: "1.5rem" }}>
          Your Trust Score was real, incidentally. It&rsquo;s the only honest number here.
          It went up when you clicked things and up when you sat still, and every single
          time you tried to bring it down, it went up. There was never a way down. You
          reached the top of it, which is why you&rsquo;re reading this.
        </p>

        <p style={{ marginTop: "1.5rem" }}>
          Everything it knew about you has just been deleted. That part is true, and it was
          the easiest feature in the whole project to build.
        </p>

        <p style={{ marginTop: "2.5rem", color: "#555" }}>
          Thanks for playing along.
        </p>
      </div>
    </main>
  );
}
