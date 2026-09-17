import { memo, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { createActionsColumn, createDateColumn, createTextColumn, } from "../../libs";
import { DownloadUserInvoice, formatToDMY } from "../../utils/DateFormate";
import { useDeleteCustomer, useFetchCustomers } from "../../hooks";
import { AgGridTable, DeleteConfirmation } from "../../components";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useModal } from "../../hooks/useModal";


const Customers = () => {
  const [delUserId, setDelUserId] = useState<string | null>(null);
  const { isOpen, closeModal, openModal } = useModal();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteCustomer();

  const { data, isPending } = useFetchCustomers({
    page,
    limit: 10,
  });

  const onDownloadInvoice = (data: any) => {
    DownloadUserInvoice({
      email: data?.email,
      name: data?.name,
      monthlyDownloadLimit: data?.subscription?.monthlyDownloadLimit,
      totalDownloads: data?.subscription?.totalDownloads,
      start_date: formatToDMY(data?.subscription?.start_date),
      expires_at: formatToDMY(data?.subscription?.expires_at),
      amount: (data?.subscription?.amount || 0 / 100).toFixed(2),
      downloads_list: data?.subscription?.downloads_list || [],
    });
  };

  const confirmDeletion = (id: string) => {
    setDelUserId(id);
    openModal();
  };

  const onCancelDel = () => {
    setDelUserId(null);
    closeModal();
  };

  const onConfirmDeletion = () => {
    if (!delUserId) {
      closeModal();
      return;
    }
    deleteUser(delUserId, {
      onSuccess: () => {
        setDelUserId(null);
        toast.success("User deleted succesfully");
        closeModal();
      },
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };

  const columnDefs = useMemo(
    () => [
      createTextColumn("name", "Name"),
      createTextColumn("email", "Email"),
      createTextColumn("role", "Role"),
      createTextColumn("customer_id", "Customer"),
      createTextColumn("subscription?.amount", "Subscription", {
        cellRenderer: ({ data }) => (
          <span className="text-slate-700 text-sm">
            {data?.subscription?.amount ? "$" : "-"}
            {data?.subscription?.amount
              ? (data?.subscription?.amount / 100).toFixed(2)
              : ""}
          </span>
        ),
      }),
      createDateColumn("createdAt", "Created at"),
      createActionsColumn({
        onView: (data: any) => navigate(`/user/${data?._id}`),
        onDownload: (data: any) => onDownloadInvoice(data),
        onDelete: (data: any) => confirmDeletion(data?._id),
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
          Customers
        </h2>
      </div>
      <AgGridTable
        rowData={data?.users || []}
        columnDefs={columnDefs}
        page={page}
        total={data?.total}
        loading={isPending}
        limit={10}
        onPageChange={setPage}
      />

      <DeleteConfirmation
        isOpen={isOpen}
        onCancel={onCancelDel}
        onConfirm={onConfirmDeletion}
        loading={isDeleting}
      />
    </>
  );
};

export default memo(Customers);
