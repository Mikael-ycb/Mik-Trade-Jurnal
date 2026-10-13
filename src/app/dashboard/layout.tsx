import { AppSidebar } from "@/components/layout/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Miternal Dashboard",
  description: "Your personal trading journal dashboard",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "17rem",
          "--sidebar-width-icon": "4rem",
        } as React.CSSProperties
      }
    >
      <div className="relative flex min-h-svh w-full overflow-hidden bg-[#050611] text-white">
        {/* Background effects */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/3 size-96 rounded-full bg-blue-600/10 blur-[130px]" />
          <div className="absolute right-0 top-1/3 size-96 rounded-full bg-violet-600/10 blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 size-72 rounded-full bg-indigo-600/[0.07] blur-[120px]" />
        </div>

        <AppSidebar />

        <main className="relative z-10 min-w-0 flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
