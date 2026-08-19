"use client";

import { useEffect, useRef, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useTrust } from "@/lib/trust-provider";
import { CONFIRM_STEPS } from "@/lib/copy";
import { BEAT, DOUBLE_TAKE } from "@/lib/timing";
import { downloadFile, todayLong } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  Circled,
  SketchButton,
  SketchCard,
  SketchCheckbox,
  SketchDialogContent,
  SketchDialogRoot,
  SketchFrame,
  SketchHeading,
  SketchInput,
  SketchLabel,
  SketchRule,
  SketchSlider,
  SketchSwitch,
  SketchTooltip,
  StickyNote,
} from "@/components/sketch";
import { Padlock } from "@/components/shell/padlock";
import { MemoryLine } from "@/components/shell/memory-line";

const SESSIONS = [
  { device: "This browser", where: "Here", when: "active now" },
  { device: "Smart Fridge", where: "Lagos", when: "active now" },
  { device: "MacBook Pro (not yours)", where: "Tallinn", when: "3 minutes ago" },
  { device: "A car", where: "In transit", when: "yesterday" },
  { device: "Unknown", where: "Unknown", when: "before you were born" },
];

const NOTIFY_ROWS = [
  "Product updates",
  "Security alerts",
  "Things we noticed about you",
  "Weekly digest of your notifications",
  "Marketing (essential)",
];

/** A toggle that snaps back to its old state after a beat. "We know better." */
function StubbornSwitch({ label, hint }: { label: string; hint?: string }) {
  const { trust, remember } = useTrust();
  const [on, setOn] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="font-hand text-[15px]">{label}</p>
        {(note || hint) && (
          <p className="font-note text-xs text-graphite-faint">{note ?? hint}</p>
        )}
      </div>
      <SketchSwitch
        checked={on}
        aria-label={label}
        onCheckedChange={(v) => {
          setOn(v);
          trust("optOut");
          remember("toggle", `flipped “${label}”`);
          window.setTimeout(() => {
            setOn(!v);
            setNote("We know better.");
            window.setTimeout(() => setNote(null), 2400);
          }, BEAT);
        }}
      />
    </div>
  );
}

export default function SettingsPage() {
  const { trust, remember, bump, level } = useTrust();
  const [darkMode, setDarkMode] = useState(false);
  const [darkNote, setDarkNote] = useState(false);
  const [emailShake, setEmailShake] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [thirdFactor, setThirdFactor] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [share, setShare] = useState([100]);
  const [notifyNote, setNotifyNote] = useState<string | null>(null);
  const [avatarNote, setAvatarNote] = useState(false);
  const [fridge, setFridge] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [deleted, setDeleted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // The slider cannot be moved left. It rubber-bands back, with a snap.
  useEffect(() => {
    if (share[0] < 100) {
      const id = window.setTimeout(() => setShare([100]), 260);
      return () => window.clearTimeout(id);
    }
  }, [share]);

  return (
    <div className="pb-6">
      <SketchHeading level={1}>Settings</SketchHeading>
      <p className="mt-2 font-note text-sm text-graphite-soft">
        Member since {todayLong()}. Feels longer, doesn&rsquo;t it?
      </p>

      <Tabs.Root defaultValue="account" className="mt-7">
        <Tabs.List className="flex flex-wrap gap-2">
          {[
            ["account", "Account"],
            ["notifications", "Notifications"],
            ["privacy", "Privacy"],
            ["sessions", "Sessions"],
            ["advanced", "Advanced"],
          ].map(([v, label]) => (
            <Tabs.Trigger
              key={v}
              value={v}
              className="relative px-4 py-2 font-hand data-[state=active]:font-bold"
            >
              <SketchFrame id={`tab-${v}`} variant="tab" strokeWidth={1.4} />
              <span className="relative z-10">{label}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {/* ------------------------------------------------------- account */}
        <Tabs.Content value="account" className="mt-5 grid gap-5 lg:grid-cols-2">
          <SketchCard sketchId="profile-card">
            <p className="font-display text-2xl">Profile</p>
            <SketchRule className="mb-3" />

            <div className="flex items-center gap-4">
              <div className="relative grid h-20 w-20 place-content-center">
                <SketchFrame id="avatar-box" variant="box" strokeWidth={1.5} />
                <Padlock size={44} className="relative z-10" />
              </div>
              <div>
                <SketchButton
                  size="sm"
                  sketchId="upload-avatar"
                  onClick={() => fileRef.current?.click()}
                >
                  Upload photo
                </SketchButton>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => {
                    setAvatarNote(true);
                    trust("interact");
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                />
                {avatarNote && (
                  <p className="mt-1 font-note text-xs text-graphite-faint">
                    Photo updated.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <SketchLabel>Display name</SketchLabel>
                <SketchInput defaultValue="Deborah Hargrove" sketchId="name-field" />
              </div>
              <div className={emailShake ? "animate-[annoyed_0.4s_ease-in-out]" : undefined}>
                <SketchLabel>Email address</SketchLabel>
                <SketchTooltip content="That field is finished.">
                  <div
                    onClick={() => {
                      setEmailShake(true);
                      trust("interact");
                      window.setTimeout(() => setEmailShake(false), BEAT);
                    }}
                  >
                    <SketchInput
                      readOnly
                      value="d.hargrove@enterprize.co"
                      className="cursor-not-allowed"
                      sketchId="email-settings"
                    />
                  </div>
                </SketchTooltip>
              </div>
              <div>
                <SketchLabel>Timezone</SketchLabel>
                <div className="relative px-4 py-2.5">
                  <SketchFrame id="tz" variant="box" strokeWidth={1.4} />
                  <span className="relative z-10 font-hand">Ours</span>
                </div>
              </div>
              <div>
                <SketchLabel>Language</SketchLabel>
                <div className="relative px-4 py-2.5">
                  <SketchFrame id="lang-settings" variant="box" strokeWidth={1.4} />
                  <span className="relative z-10 font-hand">Trust (Global)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <SketchButton
                variant="primary"
                size="sm"
                sketchId="save-profile"
                onClick={() => trust("interact")}
              >
                Save changes
              </SketchButton>
              <SketchButton
                size="sm"
                variant="quiet"
                sketchId="reset-defaults"
                onClick={() => {
                  trust("interact");
                  window.alert("Reset to defaults. Your values are the defaults.");
                }}
              >
                Reset to defaults
              </SketchButton>
            </div>
          </SketchCard>

          <div className="space-y-5">
            <SketchCard sketchId="appearance-card">
              <p className="font-display text-2xl">Appearance</p>
              <SketchRule className="mb-3" />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-hand text-[15px]">Dark mode</p>
                  {darkNote && (
                    <p className="font-note text-xs text-greenpencil">
                      Dark mode is now active.
                    </p>
                  )}
                </div>
                <SketchSwitch
                  checked={darkMode}
                  aria-label="Dark mode"
                  onCheckedChange={(v) => {
                    setDarkMode(v);
                    setDarkNote(true);
                    trust("interact");
                    remember("toggle", "flipped dark mode");
                  }}
                />
              </div>
              <StubbornSwitch label="Compact layout" />
              <StubbornSwitch label="Reduce visual noise" />
              <StubbornSwitch label="Show fewer surprises" />
            </SketchCard>

            <SketchCard sketchId="security-card">
              <p className="font-display text-2xl">Security</p>
              <SketchRule className="mb-3" />
              <div className="flex items-center justify-between gap-4 py-2">
                <div>
                  <p className="font-hand text-[15px]">Two-factor authentication</p>
                  {thirdFactor && (
                    <p className="font-note text-xs text-graphite-faint">
                      Third factor enabled.
                    </p>
                  )}
                </div>
                <SketchSwitch
                  checked={twoFactor}
                  aria-label="Two-factor authentication"
                  onCheckedChange={(v) => {
                    setTwoFactor(v);
                    setThirdFactor(v);
                    trust("interact");
                  }}
                />
              </div>
              <SketchRule className="my-2" />
              <SketchButton
                size="sm"
                sketchId="download-data"
                onClick={() => {
                  downloadFile("my-data.txt", "No.");
                  remember("download", "downloaded all of their data");
                  trust("optOut");
                }}
              >
                Download my data
              </SketchButton>
            </SketchCard>
          </div>
        </Tabs.Content>

        {/* ------------------------------------------------- notifications */}
        <Tabs.Content value="notifications" className="mt-5">
          <SketchCard sketchId="notify-card" className="max-w-2xl">
            <p className="font-display text-2xl">Email preferences</p>
            <SketchRule className="mb-3" />
            {NOTIFY_ROWS.map((row) => (
              <label key={row} className="flex cursor-pointer items-center gap-3 py-1.5">
                <SketchCheckbox
                  checked
                  aria-label={row}
                  onCheckedChange={() => {
                    setNotifyNote(row);
                    trust("optOut");
                    remember("deny", `unsubscribed from “${row}”`);
                    window.setTimeout(() => setNotifyNote(null), 3200);
                  }}
                />
                <span className="font-hand text-[15px]">{row}</span>
              </label>
            ))}
            {notifyNote && (
              <p className="mt-2 font-hand text-[15px] highlighted">
                Are you sure? We&rsquo;ll notify you about this anyway.
              </p>
            )}
            <SketchRule className="my-3" />
            <StubbornSwitch
              label="Reduce notification frequency"
              hint="Currently: doubled."
            />
          </SketchCard>
        </Tabs.Content>

        {/* -------------------------------------------------------- privacy */}
        <Tabs.Content value="privacy" className="mt-5">
          <div className="max-w-3xl">
            <p className="mb-2 font-note text-xs text-graphite-faint">
              privacy-settings-final-v4-FINAL.png
            </p>
            {/* This tab is a screenshot of a privacy tab. Nothing is clickable. */}
            <div
              className="pointer-events-none relative select-none opacity-90 saturate-0"
              aria-hidden="true"
            >
              <SketchCard sketchId="privacy-screenshot" tilt={false}>
                <p className="font-display text-2xl">Privacy</p>
                <SketchRule className="mb-3" />
                {[
                  "Share usage data with partners",
                  "Personalised experience",
                  "Allow inference from behaviour",
                  "Retain data after deletion",
                ].map((r) => (
                  <div key={r} className="flex items-center justify-between gap-4 py-2">
                    <p className="font-hand text-[15px]">{r}</p>
                    <div className="relative h-7 w-14">
                      <SketchFrame id={`ss-${r}`} variant="ellipse" strokeWidth={1.5} />
                      <span className="absolute right-1.5 top-1 z-10 block h-5 w-5 rounded-full bg-redpencil" />
                    </div>
                  </div>
                ))}
                <SketchButton size="sm" sketchId="ss-save" className="mt-3">
                  Save preferences
                </SketchButton>
              </SketchCard>
            </div>
            <StickyNote tone="yellow" className="mt-5 max-w-md">
              <p className="font-hand text-[15px]">
                Everything looks fine here.
              </p>
            </StickyNote>
          </div>
        </Tabs.Content>

        {/* ------------------------------------------------------- sessions */}
        <Tabs.Content value="sessions" className="mt-5">
          <SketchCard sketchId="sessions-card" className="max-w-3xl">
            <p className="font-display text-2xl">Active sessions</p>
            <SketchRule className="mb-3" />
            <div className="space-y-2">
              {SESSIONS.map((s) => (
                <div key={s.device} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-hand text-[15px]">{s.device}</p>
                    <p className="font-note text-xs text-graphite-faint">
                      {s.where} · {s.when}
                    </p>
                  </div>
                  <SketchButton
                    size="sm"
                    variant="quiet"
                    sketchId={`signout-${s.device}`}
                    onClick={() => {
                      setFridge(`${s.device} notified.`);
                      trust("optOut");
                      remember("deny", `signed out ${s.device}`);
                      window.setTimeout(() => setFridge(null), 3000);
                    }}
                  >
                    Sign out
                  </SketchButton>
                </div>
              ))}
            </div>
            {fridge && <p className="mt-3 font-hand text-[15px] highlighted">{fridge}</p>}
          </SketchCard>
        </Tabs.Content>

        {/* ------------------------------------------------------- advanced */}
        <Tabs.Content value="advanced" className="mt-5 grid gap-5 lg:grid-cols-2">
          <SketchCard sketchId="advanced-card">
            <p className="font-display text-2xl">Advanced</p>
            <SketchRule className="mb-3" />
            <button
              className="font-hand underline decoration-dotted"
              onClick={() => {
                setAdvanced((a) => !a);
                trust("interact");
              }}
            >
              {advanced ? "Hide advanced settings" : "Show advanced settings"}
            </button>
            {advanced && (
              <label className="mt-3 flex items-center gap-3">
                <SketchCheckbox aria-label="Advanced" />
                <span className="font-hand text-[15px]">Advanced</span>
              </label>
            )}

            <SketchRule className="my-4" />
            <p className="font-hand text-[15px]">Data sharing</p>
            <SketchSlider
              value={share}
              onValueChange={setShare}
              max={100}
              step={1}
              aria-label="Data sharing"
            />
            <div className="flex justify-between font-note text-xs text-graphite-faint">
              <span>Minimum</span>
              <span>Maximum</span>
            </div>
          </SketchCard>

          <div className="space-y-5">
            {/* The Danger Zone is calming. The Safe Zone is alarming. On purpose. */}
            <div className="relative rounded-sm bg-[#e6f0e9] p-5">
              <SketchFrame id="danger-zone" variant="panel" stroke="#7fa88c" strokeWidth={1.6} />
              <div className="relative z-10">
                <p className="font-display text-2xl text-[#4a7c59]">Danger Zone</p>
                <p className="font-note text-sm text-[#5d7f68]">
                  Nothing here is dangerous. Relax.
                </p>
                <SketchButton
                  size="sm"
                  className="mt-3"
                  sketchId="delete-account"
                  onClick={() => {
                    setDeleteOpen(true);
                    setStep(0);
                    trust("optOut");
                    remember("delete-attempt", "started deleting their account");
                  }}
                >
                  Delete account
                </SketchButton>
              </div>
            </div>

            <div className="relative rounded-sm bg-[#f7dfdc] p-5">
              <SketchFrame id="safe-zone" variant="panel" stroke="#b4392f" strokeWidth={2} />
              <div className="relative z-10">
                <p className="font-display text-2xl text-redpencil">Safe Zone</p>
                <p className="font-note text-sm text-redpencil/80">
                  Extremely safe. Do not be alarmed by the colour.
                </p>
                <SketchButton
                  size="sm"
                  variant="danger"
                  className="mt-3"
                  sketchId="safe-btn"
                  onClick={() => bump("safe-zone-clicks")}
                >
                  Do something safe
                </SketchButton>
              </div>
            </div>

            <MemoryLine />
          </div>
        </Tabs.Content>
      </Tabs.Root>

      {/* ------------------------------------------- the seven confirmations */}
      <SketchDialogRoot open={deleteOpen} onOpenChange={setDeleteOpen}>
        <SketchDialogContent
          title={deleted ? "Account deleted." : `Delete account — step ${step + 1} of 7`}
          description={deleted ? undefined : CONFIRM_STEPS[step].q}
        >
          {deleted ? (
            <div className="space-y-3">
              <p className="font-hand text-lg">
                <Circled>Welcome back.</Circled>
              </p>
              <p className="font-note text-sm text-graphite-faint">
                Nothing was removed. You look well.
              </p>
              <SketchButton
                size="sm"
                sketchId="deleted-ok"
                onClick={() => {
                  setDeleteOpen(false);
                  setDeleted(false);
                }}
              >
                Continue
              </SketchButton>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {CONFIRM_STEPS[step].a.map((label, i) => (
                <SketchButton
                  key={i}
                  size="sm"
                  sketchId={`confirm-${step}-${i}`}
                  variant={step === 6 ? "danger" : "default"}
                  onClick={() => {
                    trust("optOut");
                    if (step === CONFIRM_STEPS.length - 1) {
                      setDeleted(true);
                      remember("delete-attempt", "completed all seven confirmations");
                    } else {
                      window.setTimeout(() => setStep((s) => s + 1), 180);
                    }
                  }}
                >
                  {label}
                </SketchButton>
              ))}
            </div>
          )}
        </SketchDialogContent>
      </SketchDialogRoot>
    </div>
  );
}
