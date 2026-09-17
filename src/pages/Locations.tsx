import { ChangeEvent, FormEvent, memo, useCallback, useMemo, useState, } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import { Button, Tile, InputField as Input, Label, Select, IconButton, Modal, AgGridTable, DeleteConfirmation, } from "../components/index";
import { useAddLocation, useDeleteLocation, useFetchLocations } from "../hooks";
import { createActionsColumn, createTextColumn } from "../libs";
import GetApiErrorMessage from "../utils/GetApiErrorMessage";
import SelectLocation from "./MineralList/SelectLocation";
import { useModal } from "../hooks/useModal";


const Locations = () => {
  const [delLocId, setDelLocId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const { data, isPending: loading, refetch } = useFetchLocations(page, 20);
  const deleteLocApi = useDeleteLocation();
  const addLocModal = useModal();
  const delLocModal = useModal();

  const confirmDeletion = (id: string) => {
    setDelLocId(id);
    delLocModal.openModal();
  };

  const onCancelDel = () => {
    setDelLocId(null);
    delLocModal.closeModal();
  };

  const onConfirmDeletion = () => {
    if (!delLocId) {
      delLocModal.closeModal();
      return;
    }

    deleteLocApi.mutate(delLocId, {
      onSuccess: () => {
        setDelLocId(null);
        toast.success("Location deleted succesfully");
        delLocModal.closeModal();
      },
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };

  const columnDefs = useMemo(
    () => [
      createTextColumn("name", "Name", { flex: 3.5 }),
      createTextColumn("code", "Code", { flex: 3.5 }),
      createTextColumn("type", "Type", { flex: 3.5 }),
      createTextColumn("state.name", "State", { flex: 3.5 }),
      createActionsColumn({
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
          Locations
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <IconButton onClick={refetch} loading={loading}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
          <li>
            <Button size="sm" onClick={addLocModal.openModal}>
              Add new
            </Button>
          </li>
        </ol>
      </div>
      <Tile>
        <AddNewLocation
          isOpen={addLocModal.isOpen}
          closeModal={addLocModal.closeModal}
        />

        <AgGridTable
          rowData={data?.locations || []}
          columnDefs={columnDefs}
          page={page}
          total={data?.total}
          loading={loading}
          limit={20}
          onPageChange={setPage}
        />

        <DeleteConfirmation
          isOpen={delLocModal.isOpen}
          onCancel={onCancelDel}
          onConfirm={onConfirmDeletion}
          loading={deleteLocApi.isPending}
        />
      </Tile>
    </>
  );
};

type Props = {
  isOpen: boolean;
  closeModal: () => void;
};

const initialValues = {
  name: "",
  type: "",
  code: "",
  location: { label: "", value: "" },
  taxYear: "",
};

const AddNewLocation = memo(({ isOpen, closeModal }: Props) => {
  const { mutate, isPending } = useAddLocation();

  const [form, setForm] = useState(initialValues);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((pre) => ({ ...pre, [name]: value }));
    },
    [form]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(
      {
        ...form,
        state: { name: form.location.label, code: form.location.value },
      },
      {
        onSuccess: () => {
          setForm(initialValues);
          toast.success("New location has been added.");
          closeModal();
        },
        onError: (error) => toast.error(GetApiErrorMessage(error)),
      }
    );
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-175">
        <form onSubmit={handleSubmit} className="p-8 mt-10 flex flex-col gap-3">
          <div className="">
            <Label htmlFor="name">Name</Label>
            <Input
              placeholder="Name"
              name="name"
              value={form.name}
              required={true}
              onChange={onChange}
              min={2}
              type="text"
            />
          </div>
          <div className="">
            <Label htmlFor="type">Type</Label>
            <Select
              options={[
                {
                  label: "County",
                  value: "county",
                },
                {
                  label: "State",
                  value: "state",
                },
              ]}
              required={true}
              name="type"
              onChange={onChange}
            />
          </div>

          {form.type === "state" && (
            <div className="">
              <Label htmlFor="code">Code</Label>
              <Input
                placeholder="Code"
                name="code"
                required={true}
                value={form.code}
                onChange={onChange}
                min={1}
                type="text"
              />
            </div>
          )}

          {form.type === "county" && (
            <SelectLocation
              required={true}
              label="State"
              placeholder="Select state"
              className="top-0"
              name="location"
              value={form.location}
              onChange={onChange}
            />
          )}

          {form.type === "county" && (
            <div className="">
              <Label htmlFor="taxYear">Tax Year</Label>
              <Input
                placeholder="Tax Year"
                name="taxYear"
                value={form.taxYear}
                required={true}
                onChange={onChange}
                min={2}
                type="text"
              />
            </div>
          )}

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              disabled={isPending}
              loading={isPending}
              type="submit"
              size="sm"
            >
              Add
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
});

export default memo(Locations);
