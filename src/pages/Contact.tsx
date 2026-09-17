import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";

import { AgGridTable, DeleteConfirmation, IconButton, Modal, Tile, } from "../components";
import { createActionsColumn, createDateColumn, createTextColumn, } from "../libs";
import { useDeleteContact, useFetchContacts, useModal } from "../hooks";
import GetApiErrorMessage from "../utils/GetApiErrorMessage";


const Contact = () => {
  const [delConId, setDelConId] = useState<string | null>(null);
  const [contactDetail, setContactDetail] = useState<any | null>(null);

  const delConModal = useModal();
  const detailModal = useModal();
  const [page, setPage] = useState(1);
  const { data, isPending, refetch } = useFetchContacts(page);
  const { mutate, isPending: isDeleting } = useDeleteContact();

  const confirmDeletion = (id: string) => {
    setDelConId(id);
    delConModal.openModal();
  };

  const onCancelDel = () => {
    setDelConId(null);
    delConModal.closeModal();
  };

  const onConfirmDeletion = () => {
    if (!delConId) {
      delConModal.closeModal();
      return;
    }
    mutate(delConId, {
      onSuccess: () => {
        setDelConId(null);
        toast.success("User deleted succesfully");
        delConModal.closeModal();
      },
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };

  const openDetailsModal = (data: any) => {
    setContactDetail(data);
    detailModal.toggleModal();
  };
  const closeDetailsModal = () => {
    setContactDetail(null);
    detailModal.toggleModal();
  };

  const columnDefs = useMemo(
    () => [
      createTextColumn("name", "Name"),
      createTextColumn("email", "Email"),
      createTextColumn("phone", "Number"),
      createTextColumn("message", "Message"),
      createDateColumn("createdAt", "Created at"),
      createActionsColumn({
        onView: openDetailsModal,
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
          Contact Messages
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
          rowData={data?.contacts || []}
          columnDefs={columnDefs}
          page={page}
          total={data?.total}
          loading={isPending}
          limit={10}
          onPageChange={setPage}
        />
      </Tile>
      <DeleteConfirmation
        isOpen={delConModal.isOpen}
        onCancel={onCancelDel}
        onConfirm={onConfirmDeletion}
        loading={isDeleting}
      />
      <Modal  className="max-w-175 p-10" isOpen={detailModal.isOpen} onClose={closeDetailsModal}>

        <div className="flex flex-col">
          <span>Name: {contactDetail?.name}</span>
          <span>Email: {contactDetail?.email}</span>
          <span>Number: {contactDetail?.phone}</span>
          <p className="mt-3">{contactDetail?.message}</p>
        </div>
      </Modal>
    </>
  );
};

export default Contact;
