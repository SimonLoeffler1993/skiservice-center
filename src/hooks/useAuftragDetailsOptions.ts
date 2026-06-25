import { getAuftragLesen } from "@/lib/auftragaction";
import { queryOptions } from "@tanstack/react-query";

export const auftragDetailsOptions = (serviceAuftragID: number) => queryOptions({
    queryKey: ["serviceAuftragDetails", serviceAuftragID],
    queryFn: () => getAuftragLesen(serviceAuftragID),
    gcTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
})