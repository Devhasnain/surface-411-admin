import { ChangeEvent, useCallback, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import Papa from "papaparse";
import * as XLSX from "xlsx";

import { useAddMineralsBulk } from "../../hooks";
import { Button, Label } from "../../components";
import { useLocationStore } from "../../store";
import SelectLocation from "./SelectLocation";


const FileDropZone = () => {
  const location = useLocationStore((state) => state.locations);
  const [form, setForm] = useState({
    state: { label: "", value: "" },
    counties: [],
  });
  const [data, setData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, isPending: loading } = useAddMineralsBulk();

  function uploadInChunks(data: any[], form?: any) {
    const chunks = chunkArray(data, 500);

    for (let i = 0; i < chunks.length; i++) {
      mutate(
        { list: chunks[i], ...form },
        {
          onError: (err) =>
            toast.error(`Error uploading chunk ${i + 1}: ${err?.message}`),
        }
      );
    }
  }

  const onFileUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) {
      toast.error("No file selected.");
      return;
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    setIsLoading(true);

    if (fileExtension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          setData(results?.data);
          setIsLoading(false);
        },
        error: () => {
          toast.error("Failed to parse CSV file.");
          setIsLoading(false);
        },
      });
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = event.target?.result as string;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          setData(jsonData);
        } catch {
          toast.error("Failed to parse Excel file.");
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsBinaryString(file);
    } else {
      toast.error("Unsupported file type. Please upload CSV or Excel.");
      setIsLoading(false);
    }
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleOnChangeArray = (e: any) => {
    setForm((pre) => ({ ...pre, [e.fieldName]: e.value }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: loading,
    multiple: false,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    onDrop: onFileUpload,
    accept: {
      "text/csv": [],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
    },
  });

  const handleUloadData = useCallback(
    (e: any) => {
      e?.preventDefault();
      if (!form?.state?.value || !form.counties?.length) {
        toast.error("Please select both a state and at least one county.");
        return;
      }
      uploadInChunks(data, form);
    },
    [form]
  );


  return (
    <div>
      {data?.length ? (
        <form className="space-y-5" onSubmit={handleUloadData}>
          <div className="space-y-1">
            <h2 className="text-xl text-gray-700 dark:text-gray-400">
              Assign Fallback State & Counties
            </h2>
            <p className="text-gray-700 dark:text-gray-400">
              Some uploaded records are missing state or county information.
              Please select a default state and counties below. These values
              will be applied to any records without location details.
            </p>
          </div>
          <div className="">
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
                    handleOnChangeArray({
                      fieldName: "counties",
                      value: e.target.value,
                    })
                  }
                  className="w-full rounded-lg!"
                />
              </div>
            </div>
          </div>
          <div>
            <span className="text-gray-700 dark:text-gray-400">
              {data?.length} items
            </span>
          </div>

          <div>
            <Button
              disabled={loading}
              loading={loading}
              className="self-start"
              size="sm"
              type="submit"
            >
              Upload
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-7">
          <form
            {...getRootProps()}
            className={`dropzone rounded-xl   border-dashed border-gray-300 p-7 lg:p-10
            ${
              isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }
          `}
            id="demo-upload"
          >
            {/* Hidden Input */}
            <input {...getInputProps()} disabled={isLoading} />
            <div className="dz-message flex flex-col items-center m-0!">
              {/* Icon Container */}
              <div className="mb-5.5 flex justify-center">
                <div className="flex h-17 w-17  items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  {isLoading ? (
                    <i className="pi pi-spinner animate-spin! "></i>
                  ) : (
                    <svg
                      className="fill-current"
                      width="29"
                      height="28"
                      viewBox="0 0 29 28"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
              {/* Text Content */}
              <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
              </h4>
              <span className=" text-center mb-5 block w-full max-w-72.5 text-sm text-gray-700 dark:text-gray-400">
                Drag and drop your CSV, or XLSX files here or browse
              </span>
              <div className="flex flex-row items-center justify-center gap-5">
                <span className="font-medium underline text-theme-sm text-brand-500 cursor-pointer">
                  Browse File
                </span>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export default FileDropZone;
