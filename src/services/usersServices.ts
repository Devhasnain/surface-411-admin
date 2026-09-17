import baseApi, { endpoints } from "../config/api";


export const userService = {
    fetchAdminUsers:async ()=>{
        const res = await baseApi.get(endpoints.getUsers);
        return res.data
    },
    createAdminUser:async (payload:any)=>{
        const res = await baseApi.post(endpoints.createUser,payload)
        return res.data
    },
    fetchCustomers:async (page:number,limit:number)=>{
        const res = await baseApi.get(`${endpoints.getCustomers}?page=${page}&limit=${limit}`)
        return res.data
    },
    deleteCustomer:async (id:string)=>{
        const res = await baseApi.delete(`${endpoints.deleteUser}?id=${id}`);
        return res.data
    },
    customerProfile:async (id:string)=>{
        const res = await baseApi.get(`${endpoints.getUser}?id=${id}`);
        return res.data
    }
}