import baseApi, { endpoints } from "../config/api";


export const contactService = {
    fetchContacts:async (page:number)=>{
        const response = await baseApi.get(`${endpoints.getContacts}?page=${page}`)
        return response.data
    },
    deleteContact:async (id:string)=>{
        const response = await baseApi.delete(`${endpoints.deleteContact}?id=${id}`)
        return response.data
    },
}