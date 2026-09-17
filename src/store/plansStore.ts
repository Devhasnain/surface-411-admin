import { create } from 'zustand';


export interface PlansStore {
    plans: any[] | [];
    setPlans: (plan: any) => void;
};

export const usePlansStore = create<PlansStore>()(
    (set, get) => ({
        plans: [],
        setPlans: (plans) => set({ plans }),
    })
)