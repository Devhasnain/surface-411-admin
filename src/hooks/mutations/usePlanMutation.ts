import { useMutation, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../config/api";
import { planService } from "../../services";


export const useAddPlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (p: any) => planService.c(p),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS_LIST })
    })
}
export const useDeletePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (i: any) => planService.d(i),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS_LIST })
    })
}

export const useUpdatePlan = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (i: any) => planService.u(i),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS_LIST })
    })
}