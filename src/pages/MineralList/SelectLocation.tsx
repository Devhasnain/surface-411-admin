import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import AsyncSelect from "react-select/async";

import { useFetchLocationsFullList } from "../../hooks";
import { useLocationStore } from "../../store";
import { Label } from "../../components/index";


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
  const locationsApi = useFetchLocationsFullList();
  const locationStore = useLocationStore();
  const [select, setSelect] = useState<any>(value);

  const locations = useMemo(
    () =>
      locationStore.locations
        ?.filter((item) => item?.type === "state")
        ?.map((item) => ({
          label: item?.name,
          value: item?.code,
        })) ?? [],
    [locationStore.locations]
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

  const promiseOptions = useCallback(
    (inputValue: string) =>
      new Promise<any[]>((resolve) => {
        resolve(filteredLocations(inputValue));
      }),
    [filteredLocations]
  );

  useEffect(() => {
    if (locationsApi.data?.locations?.length) {
      locationStore.setLocations(locationsApi.data?.locations);
    }
  }, [locationsApi.data]);

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
          isLoading={locationsApi.isPending}
          loadOptions={promiseOptions}
        />
        {!locations?.length ? (
          <ArrowPathIcon
            onClick={() => locationsApi.refetch()}
            className={`cursor-pointer ${
              locationsApi.isPending ? "animate-spin" : ""
            }`}
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
