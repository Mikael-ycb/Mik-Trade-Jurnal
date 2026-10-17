"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJurnals } from "@/features/jurnal/action";
import JurnalTable from "./jurnal-table";
import CreateJurnalCard from "./create-transaction-card";

export default function Jurnal() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

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
      />
    </div>
  );
}
