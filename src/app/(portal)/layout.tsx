import { TopNav } from "@/components/shell/top-nav";
import { Footer } from "@/components/shell/footer";
import { TrustyWidget } from "@/components/shell/trusty";
import { CookieBanner } from "@/components/shell/cookie-banner";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pt-8">{children}</main>
      <Footer />
      <TrustyWidget />
      <CookieBanner />
    </div>
  );
}
