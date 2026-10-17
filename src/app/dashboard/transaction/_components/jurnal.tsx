"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getJurnals } from "@/features/jurnal/action";

import JurnalTable, { type SelectedJurnal } from "./jurnal-table";
import CreateJurnalCard from "./create-jurnal-card";
import DeleteJurnalDialog from "./delete-jurnal-dialog";
import UpdateJurnalDialog from "./update-jurnal-dialog";
import DashboardContent from "../../_components/dashboard-content";

export default function Jurnal() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedJurnal, setSelectedJurnal] = useState<SelectedJurnal>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jurnals", page, limit, search],
    queryFn: () => getJurnals({ page, limit, search }),
  });

  const refreshJurnals = () => {
    void refetch();
  };

  return (
    <div className="flex min-w-0 flex-col gap-8">
      {/* Dashboard Summary */}
      <section className="min-w-0">
        <DashboardContent />
      </section>

      {/* Journal Management */}
      <section className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        {/* Create Journal */}
        <div className="min-w-0">
          <CreateJurnalCard refetch={refreshJurnals} />
        </div>

        {/* Journal Table */}
        <div className="min-w-0">
          <JurnalTable
            jurnals={data}
            isLoading={isLoading}
            refetch={refreshJurnals}
            page={page}
            limit={limit}
            search={search}
            setPage={setPage}
            setLimit={setLimit}
            setSearch={setSearch}
            setSelectedJurnal={setSelectedJurnal}
          />
        </div>
      </section>

      {/* Update & Delete Dialogs */}
      <DeleteJurnalDialog
        selectedJurnal={selectedJurnal}
        setSelectedJurnal={setSelectedJurnal}
        refetch={refreshJurnals}
      />

      <UpdateJurnalDialog
        selectedJurnal={selectedJurnal}
        setSelectedJurnal={setSelectedJurnal}
        refetch={refreshJurnals}
      />
    </div>
  );
}
