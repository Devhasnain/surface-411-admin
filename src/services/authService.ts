import baseApi, { endpoints } from "../config/api";


export const authService = {
    login: async (payload: any) => {
        const response = await baseApi.post(endpoints.login, payload);
        return response.data
    },
    lookup:async()=>{
        const response = await baseApi.get(endpoints.lookup);
        return response.data
    },
    updateProfile:async (payload:any)=>{
        const res = await baseApi.post(endpoints.updateProfile,payload)
        return res.data
    },
    updatePassword:async (payload:any)=>{
        const res = await baseApi.put(endpoints.updatePassword,payload);
        return res.data
    },
    updateCustomerProfile:async (payload:any)=>{
        const res = await baseApi.put(endpoints.updateUser,payload);
        return res.data
    },
}