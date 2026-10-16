"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getJurnals } from "@/features/jurnal/action";
import JurnalTable from "./jurnal-table";

export default function Jurnal() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jurnals", page, limit, search],
    queryFn: () => getJurnals({ page, limit, search }),
  });

  return (
    <div className="space-y-6">
      <JurnalTable jurnals={data} isLoading={isLoading} />
    </div>
  );
}
