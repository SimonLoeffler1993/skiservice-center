import { infiniteQueryOptions } from "@tanstack/react-query";
import { getSaisonVerleihList } from "@/lib/saisonverleihactions";

export const saisonverleihListOptions = () =>
  infiniteQueryOptions({
    queryKey: ["saisonverleihList"],

    queryFn: ({ pageParam }) => getSaisonVerleihList(15, pageParam),

    // undefined = kein last_id beim ersten Aufruf
    initialPageParam: undefined as number | undefined,

    getNextPageParam: (lastPage, allPages) => {
      console.log("lastPage:", lastPage);
      console.log("lastPage.at(-1):", lastPage?.at(-1));
      console.log("allPages:", allPages);
      if (!lastPage || lastPage.length === 0) return undefined;
      return lastPage.at(-1)?.ID
    },

    gcTime:    1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
  });