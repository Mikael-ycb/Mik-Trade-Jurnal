import type { Metadata } from "next";
import DashboardContent from "./_components/dashboard-content";

export const metadata: Metadata = {
  title: "Miternal - Trading Dashboard",
  description:
    "Track your crypto trades, monitor profit and loss, and analyze your trading performance.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-4 p-2">
      <section id="header">
        <h1 className="text-4xl font-bold text-primary">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your trading performance, monitor profit and loss, and review
          your crypto trading journal.
        </p>
      </section>
      <DashboardContent />
    </div>
  );
}
