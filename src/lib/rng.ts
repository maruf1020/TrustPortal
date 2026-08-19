/**
 * Seeded randomness.
 *
 * A joke that changes on every re-render reads as a bug.
 * A joke that stays put all session reads as a decision.
 * So: never Math.random() in a render path. Draw from the visitor seed instead.
 */

const SEED_KEY = "trust.seed";

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic 32-bit hash of a string — the per-element seed source. */
export function hashString(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

let visitorSeed: number | null = null;
let hydrated = false;

/** The seed the server draws with, and the one the client's first paint must match. */
export const SSR_SEED = 20260820;

/**
 * Until the first client render has matched the server's HTML, everyone draws
 * from SSR_SEED. The provider flips this after mount and remounts the tree once,
 * so the visitor's own seed takes over without a hydration mismatch.
 */
export function markHydrated() {
  hydrated = true;
}

/** One seed per visitor, persisted. Everything "random" descends from this. */
export function getVisitorSeed(): number {
  if (!hydrated) return SSR_SEED;
  if (visitorSeed !== null) return visitorSeed;
  if (typeof window === "undefined") return SSR_SEED;
  try {
    const stored = window.localStorage.getItem(SEED_KEY);
    if (stored) {
      visitorSeed = Number(stored);
      return visitorSeed;
    }
    const fresh = Math.floor(Math.random() * 2 ** 31);
    window.localStorage.setItem(SEED_KEY, String(fresh));
    visitorSeed = fresh;
    return fresh;
  } catch {
    visitorSeed = 20260820;
    return visitorSeed;
  }
}

/** A stable PRNG for a named thing. Same name → same jitter, all session. */
export function seededRandom(key: string) {
  return mulberry32(hashString(key) ^ getVisitorSeed());
}

/** Stable float in [min, max) for a named thing. */
export function jitter(key: string, min: number, max: number) {
  return min + seededRandom(key)() * (max - min);
}

/** Stable pick from a list for a named thing. */
export function pick<T>(key: string, list: readonly T[]): T {
  return list[Math.floor(seededRandom(key)() * list.length) % list.length];
}

/** Rotating pick — same list, advances by index. Used by generators. */
export function pickAt<T>(key: string, list: readonly T[], index: number): T {
  const rnd = mulberry32(hashString(key + ":" + index) ^ getVisitorSeed());
  return list[Math.floor(rnd() * list.length) % list.length];
}
