import baseApi, { endpoints } from "../config/api";


export const mineralService = {
    fetchList:async ({
        page,
        rows,
        name,
        stateCode,
        county
    }:{
        page:number,
        rows:number,
        name:string,
        stateCode:string,
        county:string
    })=>{
        const res = await baseApi.get(`${endpoints.getPaginatedMinerals}?page=${page}&limit=${rows}&name=${name}&stateCode=${stateCode}&county=${county}`)
        return res.data
    },

    mineralDetails:async (id:string)=>{
        const res = await baseApi.get(`${endpoints.getMinerals}?id=${id}`);
        return res.data
    },
    updateMineral:async(data:any)=>{
        const res = await baseApi.put(`${endpoints.editMineral}?id=${data.id}`, data.payload)
        return res.data
    },
    updateMineralBulk:async(skip:number, limit:number)=>{
        const res = await baseApi.put(`${endpoints.updateMineralBulk}?skip=${skip}&limi=${limit}`)
        return res.data
    },
    deleteMineral:async(id:string)=>{
        const res = await baseApi.delete(`${endpoints.deleteMineral}?id=${id}`)
        return res.data
    },
      addMineral:async(payload:any)=>{
        const res = await baseApi.post(endpoints.addMineral,payload)
        return res.data
    },
    uploadBulkMineral:async (payload:any)=>{
        const res = await baseApi.post(endpoints.uploadBulkMineral,payload);
        return res.data
    },
    downloadMineral:async (p:any)=>{
        const r = await baseApi.get(`${endpoints.downloadMineral}?limit=${p.limit}&state=${p.state}&county=${p.county}`);
        return r.data
    }
}
