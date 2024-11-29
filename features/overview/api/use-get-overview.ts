import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useSearchParams } from "next/navigation"

export const useGetOverview = () => {

    const searchParams = useSearchParams()
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    const queryUrl = (!from || !to) ? `` : `?from=${from}&to=${to}`

    const queryClient = useQuery({
        queryKey: ["overview"],
        queryFn: async () => {
            const response = await axios.get(`/api/overview${queryUrl}`)
            return await response.data
        }
    })

    return queryClient
}