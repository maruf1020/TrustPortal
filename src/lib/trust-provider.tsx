"use client";

import {
  Fragment,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LEVEL_THRESHOLDS,
  NAME_POOL,
  TRUST_AWARDS,
  type MemoryEntry,
  type MemoryKind,
  type TrustLevel,
  type TrustReason,
  type TrustState,
  forgetEverything,
  initialState,
  levelFor,
  loadState,
  progressToNextLevel,
  saveState,
  trustingHoursMultiplier,
} from "./trust";
import { markHydrated, pick } from "./rng";
import { IDLE_CHECK_IN, IDLE_SATISFIED } from "./timing";

interface TrustContextValue extends TrustState {
  level: TrustLevel;
  progress: number;
  ready: boolean;
  sincere: boolean;
  displayName: string;
  dwellMs: number;
  /** The only verb. Everything raises the score. */
  trust: (reason: TrustReason, note?: string) => void;
  remember: (kind: MemoryKind, detail: string) => void;
  bump: (counter: string, by?: number) => number;
  countOf: (counter: string) => number;
  recall: (kind: MemoryKind) => MemoryEntry[];
  setLoggedIn: (v: boolean) => void;
  conclude: () => void;
  /** Ambient nudge banner, rendered by the shell. */
  ambient: string | null;
  say: (message: string, ms?: number) => void;
}

const TrustContext = createContext<TrustContextValue | null>(null);

export function useTrust() {
  const ctx = useContext(TrustContext);
  if (!ctx) throw new Error("useTrust must be used inside <TrustProvider>. We already knew that.");
  return ctx;
}

export function TrustProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TrustState>(initialState);
  const [ready, setReady] = useState(false);
  const [sincere, setSincere] = useState(false);
  const [ambient, setAmbient] = useState<string | null>(null);
  const [dwellMs, setDwellMs] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const concludedRef = useRef(false);

  /* --------------------------------------------------------------- boot -- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isSincere = params.get("sincere") === "1";
    setSincere(isSincere);
    document.body.dataset.sincere = String(isSincere);

    markHydrated();
    const loaded = loadState();
    if (!loaded.name && loaded.score >= LEVEL_THRESHOLDS[1]) {
      loaded.name = pick("visitor-name", NAME_POOL);
    }
    setState(loaded);
    setReady(true);
  }, []);

  useEffect(() => {
    // Once the ending has run, nothing is written back. The wipe has to stick.
    if (ready && !state.concluded) saveState(state);
  }, [state, ready]);

  /* ------------------------------------------------------------- verbs -- */
  const trust = useCallback((reason: TrustReason, note?: string) => {
    setState((s) => {
      const award = TRUST_AWARDS[reason] * trustingHoursMultiplier();
      const score = s.score + award;
      const level = levelFor(score);
      const name =
        s.name ?? (level >= 1 ? pick("visitor-name", NAME_POOL) : null);
      const seenLevels = s.seenLevels.includes(level)
        ? s.seenLevels
        : [...s.seenLevels, level];
      const memory =
        note !== undefined
          ? [...s.memory, { t: Date.now(), kind: "page" as MemoryKind, detail: note }].slice(-160)
          : s.memory;
      return { ...s, score, name, seenLevels, memory };
    });
  }, []);

  const remember = useCallback((kind: MemoryKind, detail: string) => {
    setState((s) => ({
      ...s,
      memory: [...s.memory, { t: Date.now(), kind, detail }].slice(-160),
      counters: { ...s.counters, [kind]: (s.counters[kind] ?? 0) + 1 },
    }));
  }, []);

  const bump = useCallback((counter: string, by = 1) => {
    let next = 0;
    setState((s) => {
      next = (s.counters[counter] ?? 0) + by;
      return { ...s, counters: { ...s.counters, [counter]: next } };
    });
    return next;
  }, []);

  const countOf = useCallback(
    (counter: string) => state.counters[counter] ?? 0,
    [state.counters],
  );

  const recall = useCallback(
    (kind: MemoryKind) => state.memory.filter((m) => m.kind === kind),
    [state.memory],
  );

  const setLoggedIn = useCallback((v: boolean) => {
    setState((s) => ({ ...s, loggedIn: v }));
  }, []);

  const conclude = useCallback(() => {
    concludedRef.current = true;
    setState((s) => ({ ...s, concluded: true }));
    forgetEverything();
  }, []);

  const say = useCallback((message: string, ms = 4200) => {
    setAmbient(message);
    window.setTimeout(() => setAmbient((cur) => (cur === message ? null : cur)), ms);
  }, []);

  /* ------------------------------------------------- ambient behaviours -- */

  // Sitting still is also trusting.
  useEffect(() => {
    if (!ready || sincere) return;
    const id = window.setInterval(() => trust("idle"), 30_000);
    return () => window.clearInterval(id);
  }, [ready, sincere, trust]);

  // Dwell clock, for the footer's increasingly personal remarks.
  useEffect(() => {
    if (!ready) return;
    const id = window.setInterval(() => setDwellMs(Date.now() - state.startedAt), 1000);
    return () => window.clearInterval(id);
  }, [ready, state.startedAt]);

  // "Still there?" ... "Good."
  useEffect(() => {
    if (!ready || sincere) return;
    let checkIn: number, satisfied: number;
    const reset = () => {
      window.clearTimeout(checkIn);
      window.clearTimeout(satisfied);
      checkIn = window.setTimeout(() => {
        setAmbient("Still there?");
        satisfied = window.setTimeout(() => setAmbient("Good."), IDLE_SATISFIED);
        window.setTimeout(() => setAmbient(null), IDLE_SATISFIED + 3000);
      }, IDLE_CHECK_IN);
    };
    const events = ["mousemove", "keydown", "scroll", "click"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      window.clearTimeout(checkIn);
      window.clearTimeout(satisfied);
    };
  }, [ready, sincere]);

  // Every navigation is a small act of faith.
  useEffect(() => {
    if (!ready || sincere) return;
    trust("navigate");
  }, [pathname, ready, sincere, trust]);

  // Level 5: the costume comes off. One navigation, no transition.
  const level = levelFor(state.score);
  useEffect(() => {
    if (!ready || sincere || state.concluded) return;
    if (level === 5 && pathname !== "/trust") {
      const id = window.setTimeout(() => router.push("/trust"), 1200);
      return () => window.clearTimeout(id);
    }
  }, [level, pathname, ready, router, sincere, state.concluded]);

  const displayName = state.name ?? "there";

  const value = useMemo<TrustContextValue>(
    () => ({
      ...state,
      level,
      progress: progressToNextLevel(state.score),
      ready,
      sincere,
      displayName,
      dwellMs,
      trust,
      remember,
      bump,
      countOf,
      recall,
      setLoggedIn,
      conclude,
      ambient,
      say,
    }),
    [
      state, level, ready, sincere, displayName, dwellMs,
      trust, remember, bump, countOf, recall, setLoggedIn, conclude, ambient, say,
    ],
  );

  // One keyed remount after hydration lets the visitor's own seed take over the
  // hand-drawn jitter without ever mismatching the server's HTML.
  return (
    <TrustContext.Provider value={value}>
      <Fragment key={ready ? "hydrated" : "server"}>{children}</Fragment>
    </TrustContext.Provider>
  );
}
