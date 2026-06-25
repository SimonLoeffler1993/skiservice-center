import SkiserviceErstellen from "@/components/skiservice/erstellen/SeiteErstellen";
import { skiservicesPreiseOptions } from "@/hooks/useSkiservicesPreiseOptions";

import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

export default async function SkiserviceErstellenPage() {
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery(skiservicesPreiseOptions);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <SkiserviceErstellen />
        </HydrationBoundary>
    );
}