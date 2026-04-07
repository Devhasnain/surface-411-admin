import { ArrowPathIcon, EyeIcon, MagnifyingGlassIcon, PencilSquareIcon, } from "@heroicons/react/24/outline";
import { ChangeEvent, memo, useCallback, useEffect, useMemo, useState, } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MultiSelect } from "primereact/multiselect";
import { Link, useLocation } from "react-router";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Column } from "primereact/column";
import toast from "react-hot-toast";

import { Button, IconButton, Label, Modal, PageMeta, InputField as Input, } from "../../components";
import { removeMineral } from "../../store/slices/mineralsSlice";
import { getLocations } from "../../store/slices/locationsSlice";
import { useDeleteRequest } from "../../hooks/useDeleteRequest";
import { getToken } from "../../store/slices/authSlice";
import baseApi, { endpoints } from "../../config/api";
import { useModal } from "../../hooks/useModal";
import { navItems } from "../../layout/Routes";
import SelectLocation from "./SelectLocation";
import { TrashBinIcon } from "../../icons";


export default function MineralList() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [mineralsList, setMineralsList] = useState([]);
  const [total, setTotal] = useState(0);
  const token = useSelector(getToken);
  const [loading, setLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = useLocation()?.pathname;
  const pageTitle = useMemo(() => {
    if (pathname?.includes("/mineral"))
      return (
        navItems.find((item) => item.id === "mineral")?.name || "Mineral Owners"
      );
    return "";
  }, [pathname]);

  const toggleSearch = () => setShowSearch((pre) => !pre);

  const fetchMinerals = useCallback(
    async ({
      name = "",
      stateCode = "",
      counties = "",
    }: {
      name?: string;
      stateCode?: string;
      counties?: string;
    }) => {
      setLoading(true);
      try {
        const res = await baseApi.get(
          `${endpoints.getPaginatedMinerals}?page=${page}&limit=${rows}&name=${name}&stateCode=${stateCode}&counties=${counties}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setMineralsList(res.data?.minerals || []);
        setTotal(res.data?.total || 0);
      } catch (error) {
        toast.error("Failed to load minerals");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    },
    [page, rows, token]
  );

  useEffect(() => {
    fetchMinerals({});
  }, [page, rows, fetchMinerals]);

  return (
    <>
      <PageMeta title="Contact |" description="" />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          {pageTitle}
        </h2>
        <ol className="flex items-center gap-2">
          <li>
            <IconButton onClick={toggleSearch}>
              <MagnifyingGlassIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
          <li>
            <IconButton onClick={() => fetchMinerals({})} loading={loading}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
        </ol>
      </div>

      {showSearch && <SearchForm onSearch={fetchMinerals} loading={loading} />}

      <div className="rounded-2xl min-w-200 max-w-250 overflow-x-auto border border-gray-200 bg-white">
        <DataTable
          value={mineralsList}
          paginator
          rows={rows}
          totalRecords={total}
          first={(page - 1) * rows}
          lazy
          loading={loading}
          onPage={(e) => {
            setPage((e.page ?? 0) + 1); // default page = 0
            setRows(e.rows ?? rows); // keep old rows if undefined
          }}
          rowsPerPageOptions={[10, 20, 40, 100]}
          globalFilterFields={[
            "names",
            "emails",
            "numbers",
            "state",
            "counties",
            "addresses",
            "",
          ]}
          emptyMessage="No results found!"
          scrollable={true}
          scrollHeight="65vh" // 👈 makes table body scrollable
          paginatorDropdownAppendTo={"self"}
        >
          <Column
            field="names"
            filter={false}
            headerClassName="!bg-transparent !py-3"
            header={
              <span className="text-gray-500 text-sm font-normal">Name</span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal line-clamp-2">
                {getValue(rowData?.names[0])}
              </span>
            )}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="emails"
            filter={false}
            headerClassName="!bg-transparent !py-3"
            header={
              <span className="text-gray-500 text-sm font-normal">Email</span>
            }
            body={(rowData) => (
              <>
                <span className="text-gray-500 text-sm font-normal">
                  {getValue(rowData?.emails[0])}
                </span>
              </>
            )}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="numbers"
            filter={false}
            header={
              <span className="text-gray-500 text-sm font-normal">Number</span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal">
                {getValue(rowData?.numbers[0])}
              </span>
            )}
            style={{ minWidth: "14rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            field="state"
            filter={false}
            header={
              <span className="text-gray-500 text-sm font-normal">State</span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal">
                {rowData?.state?.name ?? "-"}
              </span>
            )}
            style={{ minWidth: "12rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            field="counties"
            header={
              <span className="text-gray-500 text-sm font-normal">
                Counties
              </span>
            }
            body={(rowData) => (
              <Dropdown
                value={rowData?.counties?.length ? rowData?.counties[0] : ""}
                options={rowData?.counties}
                className="w-40 text-sm!"
                pt={{
                  input: { className: "text-sm py-1" },
                }}
              />
              // <span className="text-gray-500 text-sm font-normal">
              //   {rowData?.state?.name}
              // </span>
            )}
            style={{ minWidth: "12rem" }}
          />
          <Column
            field="addresses"
            filter={false}
            header={
              <span className="text-gray-500 text-sm font-normal line-clamp-2!">
                Address
              </span>
            }
            body={(rowData) => (
              <span className="text-gray-500 text-sm font-normal line-clamp-2">
                {rowData?.addresses[0] ?? "-"}
              </span>
            )}
            style={{ minWidth: "12rem" }}
            headerClassName="!bg-transparent !py-3"
          />
          <Column
            body={(rowData) => (
              <div className="text-gray-500 text-sm font-normal flex flex-row items-center gap-2">
                <Link to={`/mineral/${rowData?._id}`}>
                  <EyeIcon className="h-4 w-4 cursor-pointer" />
                </Link>
                <Link to={`/edit-mineral/${rowData?._id}`}>
                  <PencilSquareIcon className="h-4 w-4 cursor-pointer" />
                </Link>
                {/* <TrashBinIcon
                  className="h-4 w-4 cursor-pointer"
                  onClick={() => handleDelete(rowData?._id)}
                /> */}
                <DeleteConfirmation id={rowData?._id} />
              </div>
            )}
            style={{ minWidth: "4rem" }}
          />
        </DataTable>
        {/* </di/v> */}
      </div>
    </>
  );
}

const DeleteConfirmation = memo(({ id }: any) => {
  const dispatch = useDispatch();
  const { isOpen, closeModal, openModal } = useModal();
  const { request, loading } = useDeleteRequest(
    `${endpoints.deleteMineral}?id=${id}`
  );

  const handleDelete = useCallback(() => {
    if (!id) return;
    const deletePromise = toast.promise(request({}), {
      loading: "Deleting Mineral...",
      success: "Mineral deleted successfully!",
      error: "Failed to delete Mineral.",
    });

    deletePromise.then(() => {
      dispatch(removeMineral(id));
      closeModal();
    });
  }, [id]);

  return (
    <>
      <TrashBinIcon className="h-4 w-4 cursor-pointer" onClick={openModal} />
      <Modal onClose={closeModal} isOpen={isOpen} className="max-w-175">
        <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Confirm deletion
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Are you sure you want to delete this document?
            </p>
          </div>
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
              disabled={loading}
              loading={loading}
              type="submit"
              size="sm"
              onClick={handleDelete}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
});

const SearchForm = memo(
  ({ onSearch, loading }: { onSearch: (e: any) => void; loading: boolean }) => {
    const location = useSelector(getLocations);
    const [form, setForm] = useState({
      name: "",
      state: { label: "", value: "" },
      counties: [],
    });

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
      setForm((pre) => ({ ...pre, [e.target.name]: e.target.value }));
    };

    const handleArrayChange = (e: { name: string; value: any }) => {
      setForm((pre) => ({ ...pre, [e.name]: e.value }));
    };

    const onSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;
      onSearch({
        name: form.name,
        stateCode: form.state?.value || "",
        counties: form.counties?.join(",") || "",
      });
    };

    const onClearSearch = () => {
      if (loading) return;
      setForm({
        name: "",
        state: { label: "", value: "" },
        counties: [],
      });
      onSearch({
        name: "",
        stateCode: "",
        counties: "",
      });
    };

    return (
      <form onSubmit={onSubmit} className="mb-8 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-5">
          <SelectLocation
            name="state"
            label="State"
            placeholder="Select state"
            value={form.state}
            onChange={handleOnChange}
          />
          <div className="">
            <Label htmlFor="counties">Counties</Label>
            <MultiSelect
              placeholder="Select Counties"
              options={location?.filter(
                (item) =>
                  item?.type === "county" &&
                  item?.state?.name === form.state.label
              )}
              optionLabel="name"
              optionValue="name"
              filter={true}
              value={form.counties}
              onChange={(e) =>
                handleArrayChange({
                  name: "counties",
                  value: e.target.value,
                })
              }
              className="w-full rounded-lg!"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="">
            <Label htmlFor="name">Name</Label>
            <Input
              placeholder="Name"
              type="text"
              name="name"
              value={form.name}
              onChange={handleOnChange}
            />
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 mt-3">
          <Button
            disabled={loading}
            onClick={onClearSearch}
            type="button"
            variant="outline"
            size="sm"
          >
            Clear
          </Button>
          <Button disabled={loading} type="submit" size="sm">
            Search
          </Button>
        </div>
      </form>
    );
  }
);

const getValue = (value: ""): string | any => {
  if (value === null || value === undefined || value === "") return "-";
  return value;
};
