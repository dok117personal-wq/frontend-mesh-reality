import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { AppInstallBanner } from "@/components/app-install-banner";

interface ToolsLayoutProps {
  children: React.ReactNode;
}

export default async function ToolsLayout({
  children,
}: ToolsLayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex-1 overflow-hidden pt-24">{children}</main>
      <SiteFooter />
      <AppInstallBanner />
    </>
  );
}
