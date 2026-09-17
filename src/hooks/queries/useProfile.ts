import { useMutation, useQuery } from '@tanstack/react-query';

import { authService } from '../../services';
import { useAuthStore } from '../../store';


export const useGetUserProfile = () => {
    const { setUser, setLastAuthenticated, resetAuth } = useAuthStore((state) => state);

    return useMutation({
        mutationFn: () => authService.lookup(),
        onSuccess: (data) => {
            setUser(data.user);
            setLastAuthenticated(Date.now())
        },
        onError: () => resetAuth()
    })
}