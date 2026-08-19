import type { Metadata, Viewport } from "next";
import { Caveat, Patrick_Hand, Kalam, Cutive_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { TrustProvider } from "@/lib/trust-provider";
import { TooltipProvider } from "@/components/sketch";
import { AmbientLayer } from "@/components/shell/ambient-layer";
import { PrintTruth } from "@/components/shell/print-truth";

const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", weight: ["400", "600", "700"] });
const patrick = Patrick_Hand({ subsets: ["latin"], variable: "--font-patrick", weight: "400" });
const kalam = Kalam({ subsets: ["latin"], variable: "--font-kalam", weight: ["300", "400", "700"] });
const cutive = Cutive_Mono({ subsets: ["latin"], variable: "--font-cutive", weight: "400" });

export const metadata: Metadata = {
  title: {
    default: "TrustPortal — Trust, delivered.",
    template: "%s · TrustPortal",
  },
  description:
    "TrustPortal is the enterprise trust platform. Delivery not guaranteed. Trust is.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f4f1e8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${caveat.variable} ${patrick.variable} ${kalam.variable} ${cutive.variable}`}
    >
      <body>
        <Suspense fallback={null}>
          <TrustProvider>
            <TooltipProvider delayDuration={120}>
              {children}
              <AmbientLayer />
            </TooltipProvider>
          </TrustProvider>
        </Suspense>
        <PrintTruth />
      </body>
    </html>
  );
}
