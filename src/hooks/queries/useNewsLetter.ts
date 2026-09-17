import { useQuery } from "@tanstack/react-query";

import { newsletterService } from "../../services";
import { QUERY_KEYS } from "../../config/api";


export const useFetchEmails = ()=>{
    return useQuery({
        queryKey:QUERY_KEYS.NEWSLETTERS,
        queryFn:()=>newsletterService.fetchEmails()
    })
}