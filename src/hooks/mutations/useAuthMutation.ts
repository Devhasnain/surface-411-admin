import { useMutation, useQueryClient } from "@tanstack/react-query";

import { authService, userService } from "../../services";
import { QUERY_KEYS } from "../../config/api";
import { useAuthStore } from "../../store";


export const useLogin = () => {
    const setAccessToken = useAuthStore((state) => state.setToken);
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: any) => authService.login(data),
        onSuccess: (data) => {
            localStorage.setItem("token", JSON.stringify(data.token))
            setAccessToken(data.token);

            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.AUTH_LOOKUP });
        },
        onError: (error: any) => {
            console.error('Login error:', error);
        },
    });
};


export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: (data: any) => authService.updateProfile(data),
    });
};

export const useUpdatePassword = () => {
    return useMutation({
        mutationFn: (data: any) => authService.updatePassword(data)
    })
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => userService.createAdminUser(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_USERS })
        }
    })
}

export const useUpdateCustomerProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => authService.updateCustomerProfile(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMER_DETAIL(variables?.id || "") })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS })
        }
    });
};

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => userService.deleteCustomer(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS })
    })
}