import { useMutation, useQueryClient } from "@tanstack/react-query";

import { newsletterService } from "../../services";


export const useDeleteNewsletter = ()=>{
    const qc = useQueryClient();
    return useMutation({
        mutationFn:(id:string)=>newsletterService.deleteEmail(id),
        onSuccess:()=>qc.invalidateQueries({queryKey:['newsletter-emails']})
    })
}