import axios from "axios";


const baseApi = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? import.meta.env.VITE_API_URL : "http://localhost:3000/api",
  timeout: 20000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


baseApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

baseApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = JSON.parse(token);
    }

    return config
  },
  (error) => {
    console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const endpoints = {
  login: "/auth/login",
  signup: "/auth/sign-up",
  lookup: "/auth/lookup",
  updateProfile: "/admin/update-profile",
  getUsers: "/admin/get-users",
  getCustomers: "/admin/get-customers",
  getUser: "/admin/get-user",
  createUser: "/admin/create-user",
  getFaqs: "/admin/faq",
  createFaqs: "/admin/faq/create",
  updateFaqs: "/admin/faq/update",
  deleteFaqs: "/admin/faq/delete",
  getPage: "/admin/page/get",
  updatePage: "/admin/page/update",
  updateUser: "/admin/update-user",
  deleteUser: "/admin/delete-user",
  addLocation: "/admin/locations/add",
  getLocations: "/admin/locations",
  getLocationsFullList: "/admin/locations/full-list",
  deleteLocation: "/admin/locations/delete",
  deleteNewsletter: "/admin/newsletter/delete",
  deleteContact: "/admin/contact/delete",
  getContacts: "/admin/contact",
  getNewsLetters: "/admin/newsletter",
  getAnalytics: "/admin/analytics",
  updatePassword: "/admin/update-password",
  addMineral: "/admin/mineral/add",
  downloadMineral: "/admin/mineral/download",
  uploadBulkMineral: "/admin/mineral/add-bulk",
  getMinerals: "/admin/mineral",
  getPaginatedMinerals: "/admin/mineral/list",
  deleteMineral: "/admin/mineral/delete",
  editMineral: "/admin/mineral/edit",
  updateMineralBulk: "/admin/mineral/update-bulk",
  getPlans: "/admin/plan",
  createPlan: "/admin/plan/create",
  deletePlan: "/admin/plan/delete",
  editPlan: "/admin/plan/edit",
}

export const QUERY_KEYS = {
  // AUTH
  AUTH_LOOKUP: ["AUTH_LOOKUP"],

  // DASHBOARD
  DASHBOARD_ANALYTICS: ['Dashboard-analytics'],

  ADMIN_USERS: ['ADMIN_USERS'],
  CUSTOMERS: ['CUSTOMER_USERS'],
  CUSTOMER_USERS: (page: number) => ['CUSTOMER_USERS', page],
  CUSTOMER_DETAIL: (id: string) => ['CUSTOMER', id],

  MINERALS: ['MINERALS_LIST'],
  MINERAL_LIST: (page: number, params: {
    name: string,
    stateCode: string,
    county: string
  }) => ['MINERALS_LIST', page, params],
  MINERAL_DETAIL: (id: string) => ['MINERAL', id],

  LOCATIONS: ['LOCATIONS_LIST'],
  LOCATIONS_LIST: (page: number) => ['LOCATIONS_LIST', page],
  LOCATIONS_FULL_LIST: ['LOCATIONS_FULL_LIST'],
  LOCATION_DETAIL: (id: string) => ['LOCATION', id],

  CONTACTS: ['CONTACTS'],
  CONTACTS_LIST: (page: number) => ['CONTACTS', page],

  NEWSLETTERS: ['NEWSLETTERS'],
  PLANS_LIST: ['PLANS_LIST'],

  FAQS_LIST: ['FAQS_LIST'],
  PAGE: (slug: string) => ['PAGE', slug],


}


export const UserTypes = {
  user: "user",
  admin: "admin"
}

export default baseApi;
