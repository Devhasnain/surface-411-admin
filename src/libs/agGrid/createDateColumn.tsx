// src/lib/agGrid/columns/createDateColumn.ts
import type { ColDef } from "ag-grid-community";

import { formatToDMY } from "../../utils/DateFormate";


type DateFormat = "smart" | "order" | "full";

export const createDateColumn = (
  field: string,
  headerName: string,
  format: DateFormat = "full",
  flex = 1
): ColDef => ({
  field,
  headerName,
  flex,
  filter: false,
  cellRenderer: ({ value }: { value: any }) => (
    <span className="text-slate-700 text-sm">{formatToDMY(value)}</span>
  ),
});
