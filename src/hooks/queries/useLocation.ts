import { useQuery } from "@tanstack/react-query";

import { locationService } from "../../services";
import { QUERY_KEYS } from "../../config/api";


export const useFetchLocations= (page:number,limit:number)=>{
    return useQuery({
        queryKey:QUERY_KEYS.LOCATIONS_LIST(page),
        queryFn:()=>locationService.fetchList(page,limit)
    })
}

export const useFetchLocationsFullList = ()=>{
    return useQuery({
        queryKey:QUERY_KEYS.LOCATIONS_FULL_LIST,
        queryFn:()=>locationService.fetchFullList()
    })
}