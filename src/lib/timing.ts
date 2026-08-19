/**
 * Comedy is timing. Timing is a constants file.
 * Named honestly so nobody has to guess why a number is 2200.
 */

/** The snap-back, the shake, the small denial. */
export const BEAT = 400;

/** Long enough to read, short enough to doubt. */
export const DOUBLE_TAKE = 900;

/** The pause that does the work. */
export const AWKWARD = 2200;

/** How long a modal waits before closing itself on your behalf. */
export const REGRET = 1000;

/** Trusty is typing... and typing... and typing. Then: "Nope." */
export const TRUSTY_TYPING = 45_000;

/** Shortened Trusty pause, used for follow-up messages so the bit stays a bit. */
export const TRUSTY_TYPING_SHORT = 2600;

/** How long "Sync Now" spins while you are looking directly at it. */
export const FOREVER = 86_400_000;

/** Idle before the site checks in on you. */
export const IDLE_CHECK_IN = 5 * 60_000;

/** ...and how long it waits before deciding "Good." */
export const IDLE_SATISFIED = 30_000;

/** The 1px cursor offset window. Maddening, never disabling. */
export const CURSOR_DRIFT = 10_000;

export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
