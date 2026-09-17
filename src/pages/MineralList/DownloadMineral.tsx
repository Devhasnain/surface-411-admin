import { ChangeEvent, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { Button, InputField, Label, PageBreadCrumb, Tile, } from "../../components";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useDownloadMineral } from "../../hooks";
import { useLocationStore } from "../../store";
import SelectLocation from "./SelectLocation";


let initialInputValues: {
  limit: string | number;
  state: { label: string; value: string };
  county: string;
} = {
  limit: 500,
  state: { label: "", value: "" },
  county: "",
};

const DownloadMineral = () => {
  const { mutate, isPending } = useDownloadMineral();
  const location = useLocationStore((state) => state.locations);

  const [form, setForm] = useState(initialInputValues);

  const disableSubmit = useMemo(() => {
    if (!form.limit) {
      return true;
    }
    if (!form.state.value) {
      return true;
    }
    if (!form.county) {
      return true;
    }

    return false;
  }, [form]);

  const filteredCounties = useMemo(
    () =>
      location?.filter(
        (item: any) =>
          item?.type === "county" && item?.state?.code === form.state.value
      ) || [],
    [form]
  );

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target.name === "state") {
      setForm((pre) => ({ ...pre, county: "" }));
    }

    setForm((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleDownload = (e:any) => {
    e.preventDefault();
    mutate(
      { ...form, state: form.state.label },
      {
        onSuccess: (data) => {
          const blob = new Blob([data?.csv], {
            type: "text/csv;charset=utf-8;",
          });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.setAttribute("href", url);
          link.setAttribute("download", `${form.state.label}(${form.county})-owners-list(${form.limit}).csv`);
          link.style.visibility = "hidden";

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          toast.success(`${form.limit === "full" ? "" : form.limit > data.total ? "" : form.limit + "/" }${data?.total} records downloaded`);
        },
        onError: (error) => toast.error(GetApiErrorMessage(error)),
      }
    );
  };

  return (
    <div className="min-h-[80vh]">
      <PageBreadCrumb pageTitle="Download Mineral" />
      <Tile>
        <form onSubmit={handleDownload}>
          <div className="grid grid-cols-2 gap-5">
            <SelectLocation
              name="state"
              label="State"
              placeholder="Select state"
              value={form.state}
              className="z-10"
              onChange={handleOnChange}
            />
            {form.state.value && (
              <div className="">
                <Label htmlFor="counties">Counties</Label>
                <div className="flex flex-row items-center flex-wrap gap-2">
                  {filteredCounties.map((item: any) => {
                    const isSelected = item.name === form.county;
                    return (
                      <span
                        onClick={() =>
                          setForm((pre) => ({ ...pre, county: item.name }))
                        }
                        className={`cursor-pointer rounded-xl px-4 py-2 border transition-colors ${
                          isSelected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "text-gray-500 border-gray-300 hover:border-blue-500"
                        }`}
                        key={item?.code || item?.name}
                        role="button"
                        tabIndex={0}
                      >
                        {item.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="w-full lg:w-6/12 mb-5">
            <Label htmlFor="Limit">Number of records</Label>

            <div className="flex flex-row items-center gap-3">
              <InputField
                placeholder="Limit"
                type="text"
                name="limit"
                value={form.limit}
                onChange={handleOnChange}
              />
              <Button
                type="button"
                onClick={() =>
                  setForm((pre) => ({
                    ...pre,
                    limit: pre.limit === "full" ? 500 : "full",
                  }))
                }
                variant={form.limit === "full" ? "primary" : "outline"}
              >
                Full List
              </Button>
            </div>
          </div>
          <Button
            disabled={disableSubmit || isPending}
            className="self-start"
            size="sm"
            type="submit"
            loading={isPending}
          >
            Submit
          </Button>
        </form>
      </Tile>
    </div>
  );
};

export default DownloadMineral;
