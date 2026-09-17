import baseApi, { endpoints } from "../config/api";


export const newsletterService = {
    fetchEmails:async ()=>{
        const r = await baseApi.get(endpoints.getNewsLetters);
        return r.data
    },
     deleteEmail:async (id:string)=>{
        const r = await baseApi.delete(`${endpoints.deleteNewsletter}?id=${id}`);
        return r.data
    }
}