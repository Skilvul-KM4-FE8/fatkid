import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useGetTransactions = () => {
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
        queryKey: ["transactions"],
        queryFn: async () => {
            const response = await axios.get(`/api/transaction${queryUrl}`)
            return await response.data
        }
    })

    return queryClient
}