import { useMutation, useQueryClient } from "@tanstack/react-query";

import { mineralService } from "../../services";
import { QUERY_KEYS } from "../../config/api";


export const useUpdateMineral = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => mineralService.updateMineral(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MINERALS })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MINERAL_DETAIL(variables?.id) })
        }
    })
}


export const useUpdateMineralBulk = () => {
    return useMutation({
        mutationFn: (data: any) => mineralService.updateMineralBulk(data.skip, data.limit),
    })
}


export const useDeleteMineral = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => mineralService.deleteMineral(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MINERALS })
    })
}

export const useAddMineral = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => mineralService.addMineral(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MINERALS })
    })
}

export const useAddMineralsBulk = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => mineralService.uploadBulkMineral(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MINERALS })
    })
}

export const useDownloadMineral = () => {
    return useMutation({
        mutationFn: (p: any) => mineralService.downloadMineral(p)
    })
}