import type { Metadata } from "next";
import Jurnal from "./_components/jurnal";

export const metadata: Metadata = {
  title: "Miternal - Trading Jurnal",
  description: "view and manage your Trade",
};

export default function JurnalPage() {
  return (
    <div className="space-y-4 p-2">
      <section id="header">
        <h1 className="text-4xl font-bold text-primary">Jurnal</h1>
        <p className="text-muted-foreground">
          Track your trading performance, monitor profit and loss, and review
          your crypto trading journal.
        </p>
      </section>
      <section id="content">
        <Jurnal />
      </section>
    </div>
  );
}
