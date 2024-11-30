"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export const useGetOverview = () => {
  const [queryParams, setQueryParams] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && searchParams) {
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      setQueryParams({ from, to });
    }
  }, [searchParams]);

  const queryUrl = queryParams.from && queryParams.to ? `?from=${queryParams.from}&to=${queryParams.to}` : "";

  const queryClient = useQuery({
    queryKey: ["overview", queryParams.from, queryParams.to],
    queryFn: async () => {
      const response = await axios.get(`/api/overview${queryUrl}`);
      return response.data;
    },
    enabled: !!queryParams.from && !!queryParams.to, // Hanya fetch jika ada parameter
  });

  return queryClient;
};
