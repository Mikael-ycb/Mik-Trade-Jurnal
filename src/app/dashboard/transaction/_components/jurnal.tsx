"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getJurnals } from "@/features/jurnal/action";
import JurnalTable, { type SelectedJurnal } from "./jurnal-table";
import CreateJurnalCard from "./create-transaction-card";
import DeleteJurnalDialog from "./delete-jurnal-dialog";

export default function Jurnal() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedJurnal, setSelectedJurnal] = useState<SelectedJurnal>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jurnals", page, limit, search],
    queryFn: () => getJurnals({ page, limit, search }),
  });

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <CreateJurnalCard refetch={() => void refetch()} />

      <JurnalTable
        jurnals={data}
        isLoading={isLoading}
        refetch={() => void refetch()}
        page={page}
        limit={limit}
        search={search}
        setPage={setPage}
        setLimit={setLimit}
        setSearch={setSearch}
        setSelectedJurnal={setSelectedJurnal}
      />

      <DeleteJurnalDialog
        selectedJurnal={selectedJurnal}
        setSelectedJurnal={setSelectedJurnal}
        refetch={() => void refetch()}
      />
    </div>
  );
}
