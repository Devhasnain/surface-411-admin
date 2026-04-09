import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useState, } from "react";
import { ArrowPathIcon, MagnifyingGlassIcon, } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import toast from "react-hot-toast";

import { Button, Tile, InputField as Input, Label, Select, PageMeta, IconButton, Modal, } from "../components/index";
import { addLocation, deleteLocation, getLocations, setLocations, } from "../store/slices/locationsSlice";
import GetApiErrorMessage from "../utils/GetApiErrorMessage";
import { useDeleteRequest } from "../hooks/useDeleteRequest";
import SelectLocation from "./MineralList/SelectLocation";
import { getToken } from "../store/slices/authSlice";
import { useMutation } from "../hooks/useMutation";
import { useQuery } from "../hooks/useQuery";
import { useModal } from "../hooks/useModal";
import { endpoints } from "../config/api";
import { TrashBinIcon } from "../icons";


const Locations = () => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const locations = useSelector(getLocations);
  const { isOpen, openModal, closeModal } = useModal();
  const { request, data, loading } = useQuery(
    endpoints.getLocations,
    token ?? "",
    !locations?.length
  );
  const deleteLocApi = useDeleteRequest();

  const handleDeleteLocation = useCallback((id: string) => {
    if (!id) return;
    const deletePromise = toast.promise(
      deleteLocApi.request({ path: `${endpoints.deleteLocation}?id=${id}` }),
      {
        loading: "Deleting location...",
        success: "Location deleted successfully!",
        error: "Failed to delete location.",
      }
    );

    deletePromise.then(() => {
      dispatch(deleteLocation(id));
    });
  }, []);

  useEffect(() => {
    if (data?.locations?.length) {
      dispatch(setLocations(data?.locations));
    }
  }, [data]);

  return (
    <>
      <PageMeta title={"Locations | Petro411"} description="" />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Locations
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <IconButton onClick={request} loading={loading}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
          <li>
            <Button size="sm" onClick={openModal}>
              Add new
            </Button>
          </li>
        </ol>
      </div>
      <Tile>
        <AddNewLocation isOpen={isOpen} closeModal={closeModal} />

        <div className="w-full overflow-x-hidden">
          <DataTable
            value={locations}
            paginator
            rows={10}
            dataKey="id"
            loading={loading}
            globalFilterFields={["name", "code", "type", "state", ""]}
            emptyMessage="No locations found."
            rowsPerPageOptions={[5, 10, 20, 30, 40, 50, 100]}
          >
            <Column
              field="name"
              sortable={true}
              filter={true}
              header={
                <span className="text-gray-500 text-sm font-normal">Name</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.name}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="code"
              sortable={true}
              filter={true}
              header={
                <span className="text-gray-500 text-sm font-normal">Code</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.code}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="type"
              sortable={true}
              filter={true}
              header={
                <span className="text-gray-500 text-sm font-normal">Type</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.type}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
            <Column
              field="state"
              sortable={true}
              filter={true}
              header={
                <span className="text-gray-500 text-sm font-normal">State</span>
              }
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  {rowData?.state?.name ?? "-"}
                </span>
              )}
              style={{ minWidth: "12rem" }}
            />
            <Column
              field=""
              body={(rowData) => (
                <span className="text-gray-500 text-sm font-normal">
                  <TrashBinIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => handleDeleteLocation(rowData?._id)}
                  />
                </span>
              )}
              style={{ minWidth: "0.5rem" }}
            />
          </DataTable>
        </div>
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
};

const AddNewLocation = memo(({ isOpen, closeModal }: Props) => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const addLocApi = useMutation(endpoints.addLocation);

  const [form, setForm] = useState(initialValues);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm((pre) => ({ ...pre, [name]: value }));
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      try {
        e.preventDefault();
        const res = await addLocApi.request(
          {
            ...form,
            state: { name: form.location.label, code: form.location.value },
          },
          null,
          token ?? ""
        );
        dispatch(addLocation(res.location));
        setForm(initialValues);
        toast.success("New location has been added.");
        closeModal();
      } catch (error) {
        toast.error(GetApiErrorMessage(error));
      }
    },
    [form]
  );

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
              disabled={addLocApi.loading}
              loading={addLocApi.loading}
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
