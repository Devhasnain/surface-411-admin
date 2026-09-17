import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../config/api";
import { pagesService } from "../../services";


export const useFetchFaqs = () => useQuery({
    queryKey: QUERY_KEYS.FAQS_LIST,
    queryFn: () => pagesService.fetchFaqs()
})

export const useGetPage = (slug:string) => useQuery({
    queryKey: QUERY_KEYS.PAGE(slug),
    queryFn: () => pagesService.getPage(slug)
})