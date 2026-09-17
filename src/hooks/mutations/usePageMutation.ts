import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../config/api";
import { pagesService } from "../../services";


export const useDeleteFaq = () =>{
    const qc = useQueryClient();
    return useMutation({
        mutationFn:(id:string)=>pagesService.deleteFaq(id),
        onSuccess:()=>qc.invalidateQueries({queryKey:QUERY_KEYS.FAQS_LIST})
    })
}

export const useAddFaq = () =>{
    const qc = useQueryClient();
    return useMutation({
        mutationFn:(p:any)=>pagesService.addFaq(p),
        onSuccess:()=>qc.invalidateQueries({queryKey:QUERY_KEYS.FAQS_LIST})
    })
}

export const useUpdateFaq = () =>{
    const qc = useQueryClient();
    return useMutation({
        mutationFn:(p:any)=>pagesService.updateFaq(p),
        onSuccess:()=>qc.invalidateQueries({queryKey:QUERY_KEYS.FAQS_LIST})
    })
}

export const useUpdatePage = () =>{
    const qc = useQueryClient();
    return useMutation({
        mutationFn:(p:any)=>pagesService.updatePage(p),
        onSuccess:(_,variables)=>qc.invalidateQueries({queryKey:QUERY_KEYS.PAGE(variables.slug)})
    })
}