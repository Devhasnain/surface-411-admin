import { persist } from 'zustand/middleware';
import { create } from 'zustand';


export interface AuthStore {
    user: any | null;
    token: string | null;
    lastAuthenticated: number | null;
    isLoading: boolean;

    setLoading: (loading: boolean) => void;
    setLastAuthenticated: (date: number | null) => void;
    setUser: (user: any) => void;
    setToken: (token: string) => void;

    updateUser: (user: any) => void;
    resetAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            lastAuthenticated: null,
            isLoading: false,


            setLoading: (loading) => set({ isLoading: loading }),

            setLastAuthenticated: (date) => set({ lastAuthenticated: date }),
            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),

            updateUser: (update) => {
                const { user } = get();
                if (!user) return;
                set({ user: { ...user, ...update } })
            },

            resetAuth: () => {
                localStorage.removeItem("token")
                set({ user: null, token: null, lastAuthenticated:null })
            }

        }), {
        name: "auth-storage"
    }
    )
)