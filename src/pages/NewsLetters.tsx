import { ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useMemo } from "react";

import { createActionsColumn, createDateColumn, createTextColumn, } from "../libs";
import IconButton from "../components/ui/iconButton/IconButton";
import { useDeleteNewsletter, useFetchEmails } from "../hooks";
import Tile from "../components/common/Tile";
import { AgGridTable } from "../components";


export default function NewsLetters() {
  const { data, isPending, refetch } = useFetchEmails();
  const deleteApi = useDeleteNewsletter();

  const handleDelete = (id: string) => {
    if (!id) return;

    toast.promise(deleteApi.mutateAsync(id), {
      loading: "Deleting Newsletter...",
      success: "Newsletter deleted successfully!",
      error: "Failed to delete Newsletter.",
    });
  };

  const columnDefs = useMemo(
    () => [
      createTextColumn("name", "Name"),
      createTextColumn("email", "Email"),
      createDateColumn("createdAt", "Created at"),
      createActionsColumn({
        onDelete: (data: any) => handleDelete(data?._id),
      }),
    ],
    []
  );
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Newsletters
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <IconButton onClick={refetch} loading={isPending}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
        </ol>
      </div>
      <Tile>
        <AgGridTable
          rowData={data?.newsletters || []}
          columnDefs={columnDefs}
          page={1}
          total={data?.newsletters?.length}
          loading={isPending}
          limit={50}
          onPageChange={() => {}}
        />
      </Tile>
    </>
  );
}
