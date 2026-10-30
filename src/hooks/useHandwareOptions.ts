import { queryOptions } from "@tanstack/react-query";
import { holeHandware } from "@/lib/handwareactions";

export const handwareOptions = queryOptions({
    queryKey: ["handware"],
    queryFn: () => holeHandware(),
});
