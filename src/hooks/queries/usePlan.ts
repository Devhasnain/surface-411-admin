import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../config/api";
import { planService } from "../../services";


export const useFetchPlans = ()=>{
    return useQuery({
        queryKey:QUERY_KEYS.PLANS_LIST,
        queryFn:()=>planService.g(),
    })
}