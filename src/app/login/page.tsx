"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useTrust } from "@/lib/trust-provider";
import { BRAND, DISCLAIMERS, LOGIN } from "@/lib/copy";
import { AWKWARD, BEAT, DOUBLE_TAKE, REGRET } from "@/lib/timing";
import { cn } from "@/lib/utils";
import {
  Circled,
  SketchButton,
  SketchCard,
  SketchCheckbox,
  SketchDialogContent,
  SketchDialogRoot,
  SketchFrame,
  SketchInput,
  SketchLabel,
  SketchRule,
  SketchTooltip,
  StickyNote,
} from "@/components/sketch";
import { Padlock } from "@/components/shell/padlock";

const CAPTCHA_TILES = Array.from({ length: 9 }, (_, i) => i);

export default function LoginPage() {
  const router = useRouter();
  const { trust, remember, bump, sincere } = useTrust();

  const [notches, setNotches] = useState(0);
  const [shakes, setShakes] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [email, setEmail] = useState("d.hargrove@enterpr");
  const [pwFocused, setPwFocused] = useState(false);
  const [pwRelented, setPwRelented] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [password, setPassword] = useState("");
  const [pet, setPet] = useState<string>(LOGIN.petOptions[0]);
  const [petOpen, setPetOpen] = useState(false);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpStarted, setOtpStarted] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [captchaOpen, setCaptchaOpen] = useState(false);
  const [captchaPicks, setCaptchaPicks] = useState<number[]>([]);
  const [captchaTries, setCaptchaTries] = useState(0);
  const [forgot, setForgot] = useState(false);
  const [expired, setExpired] = useState(false);
  const [signLabel, setSignLabel] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);
  const [disclaimer, setDisclaimer] = useState(0);
  const [quickReturn, setQuickReturn] = useState(false);
  const [googleShake, setGoogleShake] = useState(false);
  const signRef = useRef<HTMLButtonElement>(null);

  const tighten = useCallback(() => setNotches((n) => n + 1), []);

  /* ------------------------------------------------------------ arrival -- */
  useEffect(() => {
    const t = window.setTimeout(() => setExpired(true), 4000);
    const d = window.setInterval(() => setDisclaimer((i) => (i + 1) % DISCLAIMERS.length), 7000);
    try {
      const last = Number(window.localStorage.getItem("trust.lastLogout") ?? 0);
      if (last && Date.now() - last < 60_000) {
        setQuickReturn(true);
        setEmail(LOGIN.missYou);
      } else if (last) {
        setEmail(LOGIN.missYou);
      }
    } catch {
      /* ignore */
    }
    return () => {
      window.clearTimeout(t);
      window.clearInterval(d);
    };
  }, []);

  /* ---------------------------------------------- the field is finished -- */
  const nudgeEmail = () => {
    tighten();
    trust("interact");
    setShaking(true);
    window.setTimeout(() => setShaking(false), BEAT);
    const n = shakes + 1;
    setShakes(n);
    if (n === 3) {
      // It "helps" by finishing your email for you. It is almost right.
      window.setTimeout(() => setEmail("d.hargrove@enterprize.co"), DOUBLE_TAKE);
    }
  };

  /* --------------------------------------------------------- the 2FA bit -- */
  useEffect(() => {
    if (!otpStarted) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOtp((prev) => {
        const next = [...prev];
        next[i - 1] = String(Math.floor((i * 7 + 3) % 10));
        return next;
      });
      if (i === 5) {
        // "Verified" one digit early. Nobody mentions the sixth digit.
        setOtpVerified(true);
        window.clearInterval(id);
      }
    }, 4000);
    return () => window.clearInterval(id);
  }, [otpStarted]);

  /* --------------------------------- the button relabels as you approach -- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = signRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      setSignLabel(dist < 90 ? 2 : dist < 260 ? 1 : 0);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* -------------------------------------------------------------- enter -- */
  const enter = (via: string) => {
    remember("page", `signed in via ${via}`);
    trust("interact");
    setBusy(LOGIN.verifying);
    window.setTimeout(() => setBusy(LOGIN.verified), 1600);
    window.setTimeout(() => {
      try {
        window.localStorage.setItem("trust.loggedIn", "1");
      } catch {
        /* ignore */
      }
      router.push("/dashboard");
    }, 2900);
  };

  return (
    <div className="relative grid min-h-dvh place-items-center px-5 py-10">
      {/* margin doodles */}
      <p className="pointer-events-none absolute left-6 top-24 hidden rotate-[-8deg] font-display text-2xl text-graphite-ghost lg:block">
        ← this bit is important
      </p>
      <p className="pointer-events-none absolute bottom-24 right-10 hidden rotate-[6deg] font-display text-2xl text-graphite-ghost lg:block">
        (it isn&rsquo;t)
      </p>

      <div className="w-full max-w-lg">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Padlock notches={notches} size={52} />
          <h1 className="font-display text-5xl leading-none">{BRAND.name}</h1>
          <p className="font-note text-sm text-graphite-soft">{BRAND.tagline}</p>
        </div>

        <AnimatePresence>
          {expired && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-4 px-4 py-2"
            >
              <SketchFrame id="expired" variant="box" stroke="#b4392f" strokeWidth={1.3} />
              <p className="relative z-10 font-note text-sm text-redpencil">
                {LOGIN.sessionExpired}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {quickReturn && (
          <p className="mb-3 text-center font-hand text-lg">{LOGIN.quickReturn}</p>
        )}

        <motion.div animate={shaking ? { x: [0, -4, 4, -3, 2, 0], rotate: [0, -0.4, 0.4, 0] } : {}}>
          <SketchCard sketchId="login-card" tilt={false} className="px-7 py-7">
            <h2 className="font-display text-3xl">{LOGIN.title}</h2>
            <p className="font-note text-sm text-graphite-soft">{LOGIN.subtitle}</p>

            <div className="mt-5 space-y-4">
              {/* ---------------------------------------------------- email */}
              <div>
                <SketchLabel htmlFor="email">Work email</SketchLabel>
                <SketchTooltip
                  content={shakes > 0 ? LOGIN.emailShakes[Math.min(shakes - 1, 2)] : ""}
                  open={shakes > 0 && shaking}
                >
                  <div onClick={nudgeEmail} className="cursor-not-allowed">
                    <SketchInput
                      id="email"
                      value={email}
                      readOnly
                      onKeyDown={(e) => {
                        e.preventDefault();
                        nudgeEmail();
                      }}
                      sketchId="email-field"
                      className="cursor-not-allowed"
                      aria-describedby="email-help"
                    />
                  </div>
                </SketchTooltip>
                <p id="email-help" className="sr-only">
                  This field is pre-filled and cannot be edited.
                </p>
              </div>

              {/* ------------------------------------------------- password */}
              <div>
                <div className="flex items-baseline justify-between">
                  <SketchLabel htmlFor="password">Password</SketchLabel>
                  <span className="font-note text-xs text-graphite-faint">
                    {LOGIN.strength(password.length)}
                  </span>
                </div>
                <SketchTooltip
                  content={pwRelented ? LOGIN.passwordRelent : LOGIN.passwordTooltip}
                  open={pwFocused}
                  side="right"
                >
                  <div
                    className="flex items-center gap-2 transition-all duration-300"
                    style={{ width: pwFocused && !pwRelented ? "22%" : "100%" }}
                  >
                    <SketchInput
                      id="password"
                      type={revealed ? "text" : "password"}
                      value={revealed ? LOGIN.revealed : password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => {
                        setPwFocused(true);
                        tighten();
                        trust("interact");
                        window.setTimeout(() => {
                          setPwRelented(true);
                          window.setTimeout(() => setPwFocused(false), AWKWARD);
                        }, AWKWARD);
                      }}
                      autoComplete="off"
                      sketchId="password-field"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRevealed((r) => !r);
                        tighten();
                      }}
                      className="shrink-0 text-graphite-faint hover:text-graphite"
                      aria-label={revealed ? "Hide password" : "Show password"}
                    >
                      {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </SketchTooltip>
                <p className="mt-1 font-note text-xs text-graphite-faint">{LOGIN.capsLock}</p>
              </div>

              {/* ------------------------------------------ security question */}
              <div>
                <SketchLabel>{LOGIN.petQuestion}</SketchLabel>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setPetOpen((o) => !o);
                      tighten();
                    }}
                    className="relative flex w-full items-center justify-between px-4 py-2.5 font-hand"
                  >
                    <SketchFrame id="pet-select" variant="box" strokeWidth={1.4} />
                    <span className="relative z-10">{pet}</span>
                    <ChevronDown className="relative z-10 h-4 w-4" />
                  </button>
                  {petOpen && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-1 scribble-in bg-paper p-2">
                      <SketchFrame id="pet-menu" variant="box" strokeWidth={1.3} />
                      {LOGIN.petOptions.map((o) => (
                        <button
                          key={o}
                          className="relative z-10 block w-full px-2 py-1 text-left font-hand hover:text-redpencil"
                          onClick={() => {
                            setPet(o);
                            setPetOpen(false);
                          }}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ----------------------------------------------------- 2FA */}
              <div>
                <div className="flex items-baseline justify-between">
                  <SketchLabel>Two-factor code</SketchLabel>
                  <button
                    className="font-note text-xs text-graphite-faint underline decoration-dotted hover:text-redpencil"
                    onClick={() => {
                      setOtpStarted(true);
                      tighten();
                      trust("interact");
                    }}
                  >
                    Send code
                  </button>
                </div>
                <div className="flex gap-2">
                  {otp.map((d, i) => (
                    <div key={i} className="relative h-11 w-11">
                      <SketchFrame id={`otp-${i}`} variant="box" strokeWidth={1.3} roughness={2} />
                      <span className="relative z-10 grid h-full place-content-center font-typed text-lg">
                        {d}
                      </span>
                    </div>
                  ))}
                  {otpVerified && (
                    <span className="self-center font-display text-xl text-greenpencil">
                      {LOGIN.otpVerified}
                    </span>
                  )}
                </div>
                {otpStarted && !otpVerified && (
                  <p className="mt-1 font-note text-xs text-graphite-faint">{LOGIN.otpSending}</p>
                )}
              </div>

              {/* --------------------------------------------- remember me */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SketchTooltip content={LOGIN.rememberTooltip}>
                  <label className="flex cursor-pointer items-center gap-2 font-hand">
                    <SketchCheckbox
                      checked
                      onCheckedChange={() => {
                        bump("remember-attempts");
                        remember("deny", "tried to un-remember themselves");
                        trust("optOut");
                        tighten();
                      }}
                    />
                    Remember me
                  </label>
                </SketchTooltip>
                <button
                  className="font-hand text-graphite-soft underline decoration-dotted hover:text-redpencil"
                  onClick={() => {
                    setForgot(true);
                    trust("optOut");
                    window.setTimeout(() => setForgot(false), REGRET);
                  }}
                >
                  Forgot password?
                </button>
              </div>

              {/* ------------------------------------------------- captcha */}
              <SketchButton
                variant="quiet"
                size="sm"
                sketchId="captcha-open"
                onClick={() => {
                  setCaptchaOpen(true);
                  trust("interact");
                }}
              >
                I&rsquo;m not a robot
              </SketchButton>

              <SketchRule />

              {/* ------------------------------------------------- sign in */}
              <SketchButton
                ref={signRef}
                variant="primary"
                size="lg"
                className="w-full"
                sketchId="sign-in"
                disabled={!!busy}
                onClick={() => enter("the sign-in button")}
              >
                {busy ?? LOGIN.signInLabels[signLabel]}
              </SketchButton>

              <div className="grid gap-2">
                <SketchButton
                  sketchId="sso-google"
                  className={cn("w-full", googleShake && "animate-[annoyed_0.4s_ease-in-out]")}
                  onClick={() => {
                    setGoogleShake(true);
                    window.setTimeout(() => setGoogleShake(false), BEAT);
                    remember("deny", "tried Google");
                    trust("optOut");
                  }}
                >
                  Sign in with Google — <b>{LOGIN.google}</b>
                </SketchButton>
                <SketchTooltip content={LOGIN.apple}>
                  <span className="block">
                    <SketchButton disabled sketchId="sso-apple" className="w-full">
                      Sign in with Apple
                    </SketchButton>
                  </span>
                </SketchTooltip>
                <SketchButton
                  sketchId="sso-trust"
                  className="w-full"
                  onClick={() => enter("Sign in with Trust")}
                >
                  Sign in with Trust
                </SketchButton>
                <SketchButton
                  variant="quiet"
                  size="sm"
                  bare
                  sketchId="guest"
                  onClick={() => enter("Continue as Deborah")}
                >
                  {LOGIN.guest}
                </SketchButton>
              </div>
            </div>
          </SketchCard>
        </motion.div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative px-3 py-1.5">
            <SketchFrame id="lang" variant="box" strokeWidth={1.2} roughness={2.4} />
            <span className="relative z-10 font-note text-xs">🌐 {LOGIN.language}</span>
          </div>
          <Link
            href="/legal/terms"
            className="font-note text-xs text-graphite-faint underline decoration-dotted"
          >
            Terms
          </Link>
        </div>

        <p key={disclaimer} className="mt-3 scribble-in text-center font-note text-xs text-graphite-faint">
          {DISCLAIMERS[disclaimer]}
        </p>

        {!sincere && (
          <StickyNote tone="yellow" className="mx-auto mt-8 max-w-sm">
            <p className="font-note text-xs">
              Tip: any button on this page will sign you in. The friction is decorative.
            </p>
          </StickyNote>
        )}
      </div>

      {/* ------------------------------------------------------ forgot modal */}
      <SketchDialogRoot open={forgot} onOpenChange={setForgot}>
        <SketchDialogContent title={LOGIN.forgot} hideClose>
          <p className="font-hand">&nbsp;</p>
        </SketchDialogContent>
      </SketchDialogRoot>

      {/* ----------------------------------------------------------- captcha */}
      <SketchDialogRoot open={captchaOpen} onOpenChange={setCaptchaOpen}>
        <SketchDialogContent
          title="Verify you're human"
          description={LOGIN.captchaPrompt}
        >
          <div className="grid grid-cols-3 gap-2">
            {CAPTCHA_TILES.map((i) => {
              const picked = captchaPicks.includes(i);
              return (
                <button
                  key={i}
                  onClick={() => {
                    setCaptchaPicks((p) => (picked ? p.filter((x) => x !== i) : [...p, i]));
                    trust("interact");
                  }}
                  className={cn(
                    "relative grid aspect-square place-content-center bg-paper-deep/60 text-3xl transition-transform",
                    picked && "scale-95",
                  )}
                  aria-pressed={picked}
                  aria-label={`Tile ${i + 1}, traffic light`}
                >
                  <SketchFrame
                    id={`tile-${i}`}
                    variant="box"
                    strokeWidth={picked ? 2.4 : 1.2}
                    stroke={picked ? "#b4392f" : undefined}
                  />
                  <span className="relative z-10">🚦</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="font-note text-sm text-graphite-faint">
              {captchaTries > 0 ? LOGIN.captchaRetry[Math.min(captchaTries - 1, 2)] : " "}
            </p>
            <SketchButton
              sketchId="captcha-verify"
              onClick={() => {
                const n = captchaTries + 1;
                setCaptchaTries(n);
                setCaptchaPicks([]);
                trust("interact");
                if (n >= 3) {
                  window.setTimeout(() => {
                    setCaptchaOpen(false);
                    enter("Close enough");
                  }, DOUBLE_TAKE);
                }
              }}
            >
              Verify
            </SketchButton>
          </div>
          {captchaTries >= 3 && (
            <p className="mt-3 text-center">
              <Circled>Close enough.</Circled>
            </p>
          )}
        </SketchDialogContent>
      </SketchDialogRoot>
    </div>
  );
}
