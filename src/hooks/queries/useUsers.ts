import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "../../config/api";
import { userService } from "../../services";


export const useFetchUsers = ()=>{
    return useQuery({
        queryKey:QUERY_KEYS.ADMIN_USERS,
        queryFn:()=>userService.fetchAdminUsers()
    })
}

export const useFetchCustomers= ({page,limit}:{page:number,limit:number})=>{
    return useQuery({
        queryKey:QUERY_KEYS.CUSTOMER_USERS(page),
        queryFn:()=>userService.fetchCustomers(page,limit)
    })
}

export const useFetchCustomer = (id:string)=>{
    return useQuery({
        queryKey:id ? QUERY_KEYS.CUSTOMER_DETAIL(id) : [],
        queryFn:()=>(id ? userService.customerProfile(id) : null),
        enabled:!!id
    })
}