import { useMutation, useQueryClient } from "@tanstack/react-query";

import { locationService } from "../../services";
import { QUERY_KEYS } from "../../config/api";


export const useDeleteLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => locationService.deleteLocation(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOCATIONS })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOCATIONS_FULL_LIST })
        }
    })
}

export const useAddLocation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => locationService.addLocation(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOCATIONS })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.LOCATIONS_FULL_LIST })
        }
    })
}