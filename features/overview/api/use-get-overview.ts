"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export const useGetOverview = () => {
  // Wrapper function to safely use search params
  const getSearchParams = () => {
    // Only call useSearchParams in a client component
    if (typeof window !== "undefined") {
      const params = useSearchParams();
      return {
        from: params?.get("from") ?? null,
        to: params?.get("to") ?? null,
      };
    }
    return { from: null, to: null };
  };

  const { from, to } = getSearchParams();

  const queryUrl = from && to ? `?from=${from}&to=${to}` : "";

  const queryClient = useQuery({
    queryKey: ["overview", from, to],
    queryFn: async () => {
      const response = await axios.get(`/api/overview${queryUrl}`);
      return response.data;
    },
  });

  return queryClient;
};
