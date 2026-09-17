import "./agGrid.css";

import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import {} from "@heroicons/react/24/outline";
import { AgGridReact } from "ag-grid-react";
import { memo, useMemo } from "react";

import { AppPagination } from "./AppPagination";


const CustomLoadingOverlay = memo(() => {
  return <span>Loading...</span> 
  // <LoaderCircle size={20} color={"#fe6313"} className="animate-spin" />;
});

ModuleRegistry.registerModules([AllCommunityModule]);

interface propsType {
  rowData: any;
  columnDefs: any;
  page: number;
  limit?: number;
  total?: number;
  loading?: boolean;
  onPageChange?: (val?: any) => void;
}

export const AgGridTable = ({
  rowData,
  columnDefs,
  limit = 10,
  total = 0,
  loading,
  page = 1,
  onPageChange,
}: propsType) => {
  const defaultColDef = useMemo(
    () => ({
      filter: true,
      sortable: true,
      resizable: true,
      filterParams: {
        filterPlaceholder: "",
      },
    }),
    []
  );

  return (
    <>
      <div
        className={`ag-theme-quartz ag-theme-products  dark:bg-transparent! h-125`}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          paginationPageSize={limit}
          suppressPaginationPanel={true}
          loading={loading}
          overlayLoadingTemplate={`<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>`} // fallback
          loadingOverlayComponent={CustomLoadingOverlay}
        />
      </div>
      {
        onPageChange && total ?(
          <AppPagination
          currentPage={page}
          onPageChange={onPageChange}
          totalPages={Math.ceil((total || 0) / limit)}
          />
        ):""
      }
    </>
  );
};
