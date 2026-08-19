/**
 * The Trust Engine.
 *
 * One monotonic score. It rises when you interact, and when you don't.
 * Every attempt to lower it raises it. There is no path down.
 * Level thresholds change the site's entire personality; the user is never told.
 */

export type TrustLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type MemoryKind =
  | "cancel"
  | "deny"
  | "search"
  | "toggle"
  | "delete-attempt"
  | "modal-dismiss"
  | "page"
  | "download"
  | "logout"
  | "feedback";

export interface MemoryEntry {
  t: number;
  kind: MemoryKind;
  detail: string;
}

export interface TrustState {
  score: number;
  seenLevels: TrustLevel[];
  name: string | null;
  memory: MemoryEntry[];
  counters: Record<string, number>;
  startedAt: number;
  visits: number;
  loggedIn: boolean;
  concluded: boolean;
}

export const LEVEL_THRESHOLDS: Record<TrustLevel, number> = {
  0: 0,
  1: 20,
  2: 60,
  3: 130,
  4: 225,
  5: 340,
};

export const LEVEL_NAMES: Record<TrustLevel, string> = {
  0: "Prospect",
  1: "Verified",
  2: "Valued",
  3: "Family",
  4: "Custodian",
  5: "Trust",
};

/** What the site is willing to say about itself at each level. Never accurate. */
export const LEVEL_BLURB: Record<TrustLevel, string> = {
  0: "Standard account. Nothing to worry about.",
  1: "Verified. We know who you are now.",
  2: "Valued. We've started keeping notes.",
  3: "Family. You're one of us. You always were.",
  4: "Custodian. Others depend on you now.",
  5: "Trust.",
};

export function levelFor(score: number): TrustLevel {
  const levels: TrustLevel[] = [5, 4, 3, 2, 1, 0];
  for (const l of levels) if (score >= LEVEL_THRESHOLDS[l]) return l;
  return 0;
}

export function progressToNextLevel(score: number) {
  const level = levelFor(score);
  if (level === 5) return 1;
  const from = LEVEL_THRESHOLDS[level];
  const to = LEVEL_THRESHOLDS[(level + 1) as TrustLevel];
  return Math.min(1, (score - from) / (to - from));
}

/** The scoring table, straight from the spec. All increments. Never decrements. */
export const TRUST_AWARDS = {
  interact: 1,
  optOut: 2,
  legalRead: 3,
  caughtTheButton: 5,
  idle: 1,
  modalDismiss: 8,
  navigate: 2,
} as const;

export type TrustReason = keyof typeof TRUST_AWARDS;

/** The trusting hours. Everything counts double between 1am and 4am, local. */
export function trustingHoursMultiplier(now = new Date()) {
  const h = now.getHours();
  return h >= 1 && h < 4 ? 2 : 1;
}

export const NAME_POOL = [
  "Deborah",
  "Deborah",
  "Deborah",
  "Gerald",
  "Marlene",
  "Bartholomew",
  "Susan (Legal)",
  "Deborah",
] as const;

export const STORAGE_KEY = "trust.state.v1";

export function initialState(): TrustState {
  return {
    score: 0,
    seenLevels: [0],
    name: null,
    memory: [],
    counters: {},
    startedAt: Date.now(),
    visits: 1,
    loggedIn: false,
    concluded: false,
  };
}

export function loadState(): TrustState {
  if (typeof window === "undefined") return initialState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState();
    const parsed = JSON.parse(raw) as Partial<TrustState>;
    return { ...initialState(), ...parsed, visits: (parsed.visits ?? 0) + 1 };
  } catch {
    return initialState();
  }
}

export function saveState(state: TrustState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* Your data is eternal. Just not right now. */
  }
}

/** Wipes everything, including the seed. Used exactly once, by the ending. */
export function forgetEverything() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem("trust.seed");
    window.sessionStorage.clear();
  } catch {
    /* ignore */
  }
}

/** How long you've been here, phrased the way the footer phrases it. */
export function dwellPhrase(ms: number) {
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "less than a minute";
  if (mins === 1) return "a minute";
  if (mins < 60) return `${mins} minutes`;
  const hrs = Math.floor(mins / 60);
  return hrs === 1 ? "an hour" : `${hrs} hours`;
}
