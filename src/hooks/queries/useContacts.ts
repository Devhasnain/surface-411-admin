import { useQuery } from "@tanstack/react-query";

import { contactService } from "../../services";
import { QUERY_KEYS } from "../../config/api";


export const useFetchContacts = (page:number)=>{
    return useQuery({
        queryKey:QUERY_KEYS.CONTACTS_LIST(page),
        queryFn:()=>contactService.fetchContacts(page)
    })
}