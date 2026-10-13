"use client";

import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../ui/sidebar";
import Link from "next/link";
import {
  ArrowRightLeft,
  ChartNoAxesCombined,
  Wallet,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    label: "Overview",
    description: "Trading dashboard",
    icon: ChartNoAxesCombined,
    href: "/dashboard",
  },
  {
    label: "Transactions",
    description: "Your trade history",
    icon: ArrowRightLeft,
    href: "/dashboard/transaction",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating" className="border-0">
      {/* Brand */}
      <SidebarHeader className="px-3 pb-5 pt-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="block">
              <SidebarMenuButton
                size="lg"
                tooltip="Miternal"
                className="h-14 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 transition hover:bg-white/[0.06] hover:text-white"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-gradient-to-br from-blue-500/25 to-violet-500/25 shadow-lg shadow-blue-500/10">
                  <Wallet className="size-[18px] text-blue-300" />
                </div>

                <div className="flex min-w-0 flex-col gap-1 text-left">
                  <span className="truncate text-[15px] font-bold tracking-tight text-white">
                    Miternal<span className="text-blue-400">.</span>
                  </span>
                  <span className="truncate text-[9px] font-semibold tracking-[0.18em] text-slate-500">
                    TRADING JOURNAL
                  </span>
                </div>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="mx-2 mt-4 h-px bg-gradient-to-r from-blue-400/20 via-violet-400/10 to-transparent" />
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 py-2">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </SidebarGroupLabel>

          <SidebarMenu className="gap-2">
            {sidebarItems.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={isActive}
                    className={cn(
                      "group relative h-[58px] rounded-xl px-3 transition-all duration-200",
                      "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100",
                      isActive &&
                        "bg-gradient-to-r from-blue-500/[0.14] via-indigo-500/[0.10] to-violet-500/[0.10] text-white hover:bg-blue-500/[0.12] hover:text-white",
                    )}
                  >
                    <Link
                      href={item.href}
                      className="flex w-full min-w-0 items-center gap-3"
                    >
                      {isActive && (
                        <span className="absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full bg-gradient-to-b from-blue-400 to-violet-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]" />
                      )}

                      <div
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-xl transition-all",
                          isActive
                            ? "border border-blue-400/20 bg-gradient-to-br from-blue-400/15 to-violet-400/15 text-blue-300"
                            : "text-slate-500 group-hover:text-slate-200",
                        )}
                      >
                        <Icon className="size-[18px]" />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <span className="truncate text-[13px] font-semibold">
                          {item.label}
                        </span>
                        <span
                          className={cn(
                            "truncate text-[10px]",
                            isActive ? "text-blue-200/60" : "text-slate-600",
                          )}
                        >
                          {item.description}
                        </span>
                      </div>

                      {isActive && (
                        <ChevronRight className="size-4 shrink-0 text-blue-300/70" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom card */}
      <SidebarFooter className="mt-auto p-3">
        <div className="relative overflow-hidden rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-500/[0.10] via-[#111329] to-violet-500/[0.12] p-3.5 group-data-[collapsible=icon]:p-2">
          <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-violet-500/10 blur-2xl" />

          <div className="relative flex items-start gap-3 group-data-[collapsible=icon]:justify-center">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/[0.08]">
              <Sparkles className="size-[17px] text-violet-300" />
            </div>

            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="text-xs font-semibold text-slate-100">
                Trade with purpose
              </p>
              <p className="mt-1.5 text-[10px] leading-[1.7] text-slate-400">
                Every trade has a lesson. Keep learning.
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-500">
                  Stay disciplined
                </span>
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
