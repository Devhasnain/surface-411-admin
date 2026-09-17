import { ChangeEvent, FormEvent, memo, useCallback, useEffect, useState, } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useParams } from "react-router";
import toast from "react-hot-toast";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useMineralDetails, useUpdateMineral } from "../../hooks";
import TodoInput from "../../components/ui/todoInput/TodoInput";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import TextArea from "../../components/form/input/TextArea";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useLocationStore } from "../../store";
import SelectLocation from "./SelectLocation";
import { Tile } from "../../components";


let initialInputValues = {
  name: "",
  email: "",
  zipcode: "",
  number: "",
  city: "",
  address: "",
  state: { label: "", value: "" },
  ownerState: { label: "", value: "" },
  description: "",
};

let initialArrayValues: any = {
  names: [],
  emails: [],
  numbers: [],
  addresses: [],
  counties: [],
};

const EditMineral = () => {
  const { id } = useParams();
  const mineralDetailApi = useMineralDetails(id || "");

  const location = useLocationStore((state) => state.locations);
  const [formInputs, setFormInputs] = useState(initialInputValues);
  const [formArray, setFormArray] = useState(initialArrayValues);
  const { mutate: updateMineral, isPending: loading } = useUpdateMineral();

  const handleOnChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormInputs((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };

  const handleResetInput = (name: string) => {
    setFormInputs((pre) => ({ ...pre, [name]: "" }));
  };

  const handleOnChangeArray = (e: any) => {
    setFormArray((pre: any) => ({ ...pre, [e.fieldName]: e.value }));
  };

  const handleArrayRemoveItem = (e: { fieldName: string; value: any }) => {
    setFormArray((pre: any) => ({ ...pre, [e.fieldName]: e.value }));
  };

  const handleCountyToggle = useCallback((countyName: string) => {
    setFormArray((pre: any) => ({
      ...pre,
      counties: pre.counties.includes(countyName)
        ? pre.counties.filter((a: any) => a !== countyName)
        : [...pre.counties, countyName],
    }));
  }, []);

  const filteredCounties =
    location?.filter(
      (item: any) =>
        item?.type === "county" && item?.state?.code === formInputs.state.value
    ) || [];

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formArray,
      name: formInputs.name,
      zipcode: formInputs.zipcode,
      description: formInputs.description,
      city: formInputs.city,
      ownerState: {
        name: formInputs.ownerState.label,
        code: formInputs.ownerState.value,
      },
      state: {
        name: formInputs.state?.label,
        code: formInputs?.state?.value,
      },
    };
    updateMineral(
      { payload, id },
      {
        onSuccess: () => toast.success("Updated successfully"),
        onError: (error) => toast.error(GetApiErrorMessage(error)),
      }
    );
  };

  useEffect(() => {
    if (mineralDetailApi?.data?.mineral) {
      const data = mineralDetailApi?.data?.mineral;
      setFormInputs({
        ...initialInputValues,
        zipcode: data?.zipcode,
        state: { label: data?.state?.name, value: data?.state?.code },
        ownerState: {
          label: data?.ownerState?.name || "",
          value: data?.ownerState?.code || "",
        },
        description: data?.description,
        city: data?.city,
      });
      setFormArray({
        names: data?.names,
        emails: data?.emails ?? [],
        numbers: data?.numbers ?? [],
        counties: data?.counties ?? [],
        addresses: data?.addresses ?? [],
      });
    }
  }, [mineralDetailApi?.data?.mineral]);

  return (
    <>
      <PageBreadcrumb
        pageTitle="Edit mineral"
        previousTitle="Mineral list"
        previousLink="/mineral"
      />
      <Tile>
        <form
          className="flex flex-col gap-4 relative"
          onSubmit={handleOnSubmit}
        >
          {mineralDetailApi.isPending && (
            <div className="absolute top-0 left-0 w-full h-full backdrop-blur-xs z-1 flex flex-col items-center justify-center">
              <ArrowPathIcon height={22} width={22} className="animate-spin" />
              <span>Loading</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-5">
            <TodoInput
              type="texr"
              label="Name"
              placeholder="Name"
              fieldName="names"
              name="name"
              value={formInputs.name}
              items={formArray.names}
              onChange={handleOnChange}
              addItem={handleOnChangeArray}
              resetInput={handleResetInput}
              removeItem={handleArrayRemoveItem}
            />
            <TodoInput
              type="email"
              label="Email"
              placeholder="Email"
              fieldName="emails"
              name="email"
              value={formInputs.email}
              items={formArray.emails}
              onChange={handleOnChange}
              addItem={handleOnChangeArray}
              resetInput={handleResetInput}
              removeItem={handleArrayRemoveItem}
            />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <TodoInput
              label="Phone number"
              placeholder="Phone number"
              fieldName="numbers"
              name="number"
              type="number"
              value={formInputs.number}
              items={formArray.numbers}
              onChange={handleOnChange}
              addItem={handleOnChangeArray}
              resetInput={handleResetInput}
              removeItem={handleArrayRemoveItem}
            />
          </div>
          <div>
            <span className="font-medium text-lg">Mineral Location</span>
            <div className="grid grid-cols-2 gap-5">
              <SelectLocation
                name="state"
                label="State"
                placeholder="Select state"
                value={formInputs.state}
                onChange={handleOnChange}
              />
              {formInputs.state.value && (
                <div className="">
                  <Label htmlFor="counties">Counties</Label>
                  <div className="flex flex-row items-center flex-wrap gap-2">
                    {filteredCounties.map((item: any) => {
                      const isSelected = formArray.counties.includes(
                        item?.name
                      );
                      return (
                        <span
                          onClick={() => handleCountyToggle(item?.name)}
                          className={`cursor-pointer rounded-xl px-4 py-2 border transition-colors ${
                            isSelected
                              ? "bg-blue-500 text-white border-blue-500"
                              : "text-gray-500 border-gray-300 hover:border-blue-500"
                          }`}
                          key={item?.code || item?.name}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              handleCountyToggle(item?.name);
                          }}
                        >
                          {item.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <span className="font-medium text-lg">Mineral Owner Location</span>
            <div className="grid grid-cols-2 gap-5">
              <div className="">
                <Label htmlFor="city">City</Label>
                <Input
                  placeholder="City"
                  type="text"
                  name="city"
                  value={formInputs.city}
                  onChange={handleOnChange}
                />
              </div>
              <div className="">
                <Label htmlFor="zipcode">Zipcode</Label>
                <Input
                  placeholder="Zipcode"
                  type="number"
                  name="zipcode"
                  value={formInputs.zipcode}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <SelectLocation
                  name="ownerState"
                  label="Owner state"
                  placeholder="Owner state"
                  value={formInputs.ownerState}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <TodoInput
                  label="Address"
                  placeholder="Address"
                  fieldName="addresses"
                  name="address"
                  type="text"
                  value={formInputs.address}
                  items={formArray.addresses}
                  onChange={handleOnChange}
                  addItem={handleOnChangeArray}
                  resetInput={handleResetInput}
                  removeItem={handleArrayRemoveItem}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1">
            <Label htmlFor="description">Description</Label>
            <TextArea
              minLength={10}
              required={true}
              rows={10}
              placeholder="Description"
              name="description"
              value={formInputs.description}
              onChange={handleOnChange}
            />
          </div>
          <Button
            disabled={loading}
            className="self-start"
            size="sm"
            type="submit"
          >
            Update
          </Button>
        </form>
      </Tile>
    </>
  );
};

export default memo(EditMineral);
