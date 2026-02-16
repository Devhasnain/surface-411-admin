import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import AsyncSelect from "react-select/async";

import { getLocations, setLocations } from "../../store/slices/locationsSlice";
import { getToken } from "../../store/slices/authSlice";
import { useQuery } from "../../hooks/useQuery";
import { Label } from "../../components/index";
import { endpoints } from "../../config/api";


type Props = {
  required?: boolean;
  className?: string;
  name: string;
  value: any;
  label?: string;
  placeholder?: string;
  onChange: (e: any) => void;
};

const SelectLocation = ({
  required = false,
  name,
  onChange,
  value,
  label,
  placeholder = "Location",
}: Props) => {
  const [select, setSelect] = useState<any>(value);
  const token = useSelector(getToken) ?? "";
  const dispatch = useDispatch();

  const rawLocations = useSelector(getLocations);
  const locations = useMemo(
    () =>
      rawLocations
        ?.filter((item) => item?.type === "state")
        ?.map((item) => ({
          label: item?.name,
          value: item?.code,
        })) ?? [],
    [rawLocations]
  );

  const filteredLocations = useCallback(
    (inputValue: string) => {
      return locations.filter((item) =>
        inputValue?.trim()
          ? item.label.toLowerCase().includes(inputValue.toLowerCase())
          : true
      );
    },
    [locations]
  );

  const { request, data, error, loading } = useQuery(
    endpoints.getLocations,
    token,
    !rawLocations?.length
  );

  const promiseOptions = useCallback(
    (inputValue: string) =>
      new Promise<any[]>((resolve) => {
        resolve(filteredLocations(inputValue));
      }),
    [filteredLocations]
  );

  useEffect(() => {
    if (data?.locations?.length) {
      dispatch(setLocations(data.locations));
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (select?.value && name) {
      onChange({ target: { name, value: select } });
    }
  }, [select]);

  useEffect(() => {
    if (value) {
      setSelect(value);
    }
  }, [value]);

  return (
    <div className="relative">
      {label && <Label>{label}</Label>}
      <div className="flex flex-row items-center gap-3">
        <AsyncSelect
          placeholder={placeholder}
          className="h-11! w-full z-10"
          isMulti={false}
          value={select}
          onChange={(e) => setSelect(e)}
          cacheOptions
          required={required}
          defaultOptions={locations}
          isLoading={loading}
          loadOptions={promiseOptions}
        />
        {!locations?.length ? (
          <ArrowPathIcon
            onClick={request}
            className={`cursor-pointer ${loading ? "animate-spin" : ""}`}
            height={20}
            width={20}
            color="gray"
          />
        ) : null}
      </div>
    </div>
  );
};

export default memo(SelectLocation);
