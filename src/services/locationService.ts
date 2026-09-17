import baseApi, { endpoints } from "../config/api";


export const locationService = {
    fetchList:async (page:number,limit:number)=>{
        const res = await baseApi.get(`${endpoints.getLocations}?page=${page}&limit=${limit}`);
        return res.data
    },
    deleteLocation : async (id:string)=>{
        const res = await baseApi.delete(`${endpoints.deleteLocation}?id=${id}`);
        return res.data
    },
    addLocation : async (payload:any)=>{
        const res = await baseApi.post(`${endpoints.addLocation}`,payload);
        return res.data
    },
    fetchFullList:async()=>{
        const r = await baseApi.get(endpoints.getLocationsFullList);
        return r.data
    }
}