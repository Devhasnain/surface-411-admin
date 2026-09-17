import baseApi, { endpoints } from "../config/api";


export const planService = {
    g: async () => {
        const r = await baseApi.get(endpoints.getPlans);
        return r.data
    },
    c: async (p: any) => {
        const r = await baseApi.post(endpoints.createPlan, p);
        return r.data
    },
     u: async (p: any) => {
        const r = await baseApi.put(endpoints.editPlan, p);
        return r.data
    },
     d: async (p: any) => {
        const r = await baseApi.delete(`${endpoints.deletePlan}?id=${p}`);
        return r.data
    },
}