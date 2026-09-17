import type { ColDef } from 'ag-grid-community';


interface Options {
  bold?: boolean
  muted?: boolean
  flex?: number
  width?: number
  filter?: boolean
  pinned?: boolean
  cellRenderer?: (data?: any) => void;
}

export const createTextColumn = (
  field: string,
  headerName: string,
  options: Options = {},
): ColDef => ({
  field,
  headerName,
  flex: options.flex ?? 1,
  width: options.width,
  filter: options.filter ?? false,
  pinned: options.pinned,
    cellClass: [
      options.bold ? 'font-semibold text-slate-900' : 'text-slate-700',
      options.muted ? 'text-slate-400 text-sm' : '',
  ].join(' ').trim(),
  cellRenderer: options?.cellRenderer
})