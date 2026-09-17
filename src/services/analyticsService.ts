import baseApi, { endpoints } from "../config/api";


export const analyticsService = {
    dashboardAnalytics : async ()=>{
        const res = await baseApi.get(endpoints.getAnalytics);
        return res.data
    }
}