// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components";
// src/lib/agGrid/columns/createSelectColumn.tsx
import type { ColDef } from "ag-grid-community";


export const createSelectColumn = (
  field: string,
  headerName: string,
  flex = 1.5
): ColDef => ({
  field,
  headerName,
  flex,
  filter: false,
  cellRenderer: ({ data }: { data: any }) => (
    <select className="w-64">
      {data[field]?.length < 0 ? (
        <option>No {headerName} found</option>
      ) : (
        data[field]?.map((item: string, i: number) => {
          return (
            <option key={i} value={item}>
              {item}
            </option>
          );
        })
      )}
    </select>
  ),
});
