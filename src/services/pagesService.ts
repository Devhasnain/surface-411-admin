import baseApi, { endpoints } from "../config/api";


export const pagesService = {
    fetchFaqs: async () => {
        const r = await baseApi.get(endpoints.getFaqs);
        return r.data
    },
    deleteFaq: async (id: string) => {
        const r = await baseApi.delete(`${endpoints.deleteFaqs}?id=${id}`);
        return r.data
    },
    addFaq: async (p: any) => {
        const r = await baseApi.post(`${endpoints.createFaqs}`, p);
        return r.data
    },
    updateFaq: async (p: any) => {
        const r = await baseApi.put(`${endpoints?.updateFaqs}?id=${p.id}`, p);
        return r.data
    },
    getPage:async (slug:string)=>{
        const r = await baseApi.get(`${endpoints.getPage}?slug=${slug}`);
        return r.data
    },
    updatePage:async (p:any)=>{
        const r = await baseApi.put(`${endpoints.updatePage}`,p);
        return r.data
    },
}
