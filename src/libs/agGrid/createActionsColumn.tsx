import { PencilSquareIcon, TrashIcon, EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import type { ColDef } from "ag-grid-community";


interface ActionConfig<T> {
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
  onDownload?:(row:T)=>void
}

export interface BadgeMap {
  [key: string]: {
    label: string;
    className: string;
  };
}

export const createActionsColumn = <T,>(
  config: ActionConfig<T>,
  width = 130,
): ColDef => ({
  headerName: "Actions",
  width,
  filter: false,
  sortable: false,
  pinned: "right", // table scroll karo to actions hamesha visible rahega
  cellRenderer: ({ data }: { data: T }) => (
    <div className="flex items-center gap-3 py-1">
      {config.onView && (
        <EyeIcon onClick={() => config.onView!(data)} height={18}
        className="cursor-pointer" width={18} />
      )}
      {config.onDownload && (
        <ArrowDownTrayIcon
          onClick={() => config.onDownload!(data)}
          height={18}
          className="cursor-pointer"
          width={18}
        />
      )}

      {config.onEdit && (
        <PencilSquareIcon
          onClick={() => config.onEdit!(data)}
          height={18}
          className="cursor-pointer"
          width={18}
        />
      )}

      {config.onDelete && (
        <TrashIcon
          onClick={() => config.onDelete!(data)}
          height={18}
          className="cursor-pointer"
          width={18}
        />
      )}
    </div>
  ),
});
