"use client";

import { getBalanceSummary } from "@/features/action";
import { useQuery } from "@tanstack/react-query";
import { BalanceCards } from "./balance-card";
// import WizardInput from "./wizard-input";
// import GenerativeContent from "./generative-content";

export default function DashboardContent() {
  const { data, error } = useQuery({
    queryKey: ["jurnal-balance"],
    queryFn: () => getBalanceSummary(),
  });

  return (
    <section id="content" className="space-y-4">
      {/* Aktifkan jika fitur input berbasis wizard sudah digunakan */}
      {/* <WizardInput refetch={refetch} /> */}

      <BalanceCards data={data} error={error} />

      {/* Fitur AI belum digunakan */}
      {/* <GenerativeContent /> */}
    </section>
  );
}
