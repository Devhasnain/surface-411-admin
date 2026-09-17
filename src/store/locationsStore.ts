import { create } from "zustand";


export interface LocationStore {
    locations: any[] | [];
    setLocations: (loc: any) => void
}

export const useLocationStore = create<LocationStore>()(
    (set) => ({
        locations: [],
        setLocations: (locations) => set({ locations })
    })
)