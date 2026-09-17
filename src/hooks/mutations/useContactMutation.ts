import { useMutation, useQueryClient } from "@tanstack/react-query";

import { contactService } from "../../services";
import { QUERY_KEYS } from "../../config/api";


export const useDeleteContact = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => contactService.deleteContact(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.CONTACTS })
    })
}