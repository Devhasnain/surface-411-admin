import { useQuery } from "@tanstack/react-query";

import { mineralService } from "../../services";
import { QUERY_KEYS } from "../../config/api";
import { useDebounce } from "../useDebounce";


export const useFetchMinerals = (params: {
    page: number,
    rows: number,
    name: string,
    stateCode: string,
    county: string
}) => {
    const debouncedSearch = useDebounce(params?.name, 500);

    return useQuery({
        queryKey: QUERY_KEYS.MINERAL_LIST(params.page, {
            stateCode: params.stateCode,
            county: params.county,
            ...(debouncedSearch ? { name: debouncedSearch } : { name: "" })
        }),
        queryFn: () => mineralService.fetchList(params)
    })
}

export const useMineralDetails = (id: string) => {
    return useQuery({
        queryKey: id ? QUERY_KEYS.MINERAL_DETAIL(id) : [],
        queryFn: () => (id ? mineralService.mineralDetails(id) : null)
    })
}