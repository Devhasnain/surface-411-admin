import { ChangeEvent, FormEvent, memo, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { TodoInput, TextArea, InputField as Input, Button, Label, } from "../../components/index";
import { getLocations } from "../../store/slices/locationsSlice";
import { addMineral } from "../../store/slices/mineralsSlice";
import { getToken } from "../../store/slices/authSlice";
import { useMutation } from "../../hooks/useMutation";
import SelectLocation from "./SelectLocation";
import { endpoints } from "../../config/api";


let initialInputValues = {
  name: "",
  email: "",
  zipcode: "",
  number: "",
  address: "",
  state: { label: "", value: "" },
  ownerState: { label: "", value: "" },
  description: "",
  city: "",
};

let initialArrayValues: any = {
  names: [],
  emails: [],
  numbers: [],
  addresses: [],
  counties: [],
};

const AddMineralForm = () => {
  const dispatch = useDispatch();
  const token = useSelector(getToken);
  const location = useSelector(getLocations);
  const [formInputs, setFormInputs] = useState(initialInputValues);
  const [formArray, setFormArray] = useState(initialArrayValues);
  const { request, loading } = useMutation();

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

  const handleCountyToggle = useCallback(
    (countyName: string) => {
      setFormArray((pre: any) => ({
        ...pre,
        counties: pre.counties.includes(countyName)
          ? pre.counties.filter((a: any) => a !== countyName)
          : [...pre.counties, countyName],
      }));
    },
    []
  );

  const filteredCounties = location?.filter(
    (item: any) =>
      item?.type === "county" &&
      item?.state?.code === formInputs.state.value
  ) || [];

  const handleOnSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const payload = {
        ...formArray,
        name: formInputs.name,
        zipcode: formInputs.zipcode,
        description: formInputs.description,
        state: {
          name: formInputs.state?.label,
          code: formInputs?.state?.value,
        },
        ownerState: {
          name: formInputs.ownerState.label,
          code: formInputs.ownerState.value,
        },
      };

      toast.promise(request(payload, endpoints.addMineral, token ?? ""), {
        loading: "Submitting...",
        success: (res) => {
          dispatch(addMineral(res.data));
          setFormArray(initialArrayValues);
          setFormInputs(initialInputValues);
          return "Submitted successfully!";
        },
        error: (err) => {
          console.error("Error:", err);
          return "Submission failed!";
        },
      });
    },
    [formArray, formInputs]
  );

  console.log(formArray);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleOnSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <TodoInput
          type="text"
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
            className="z-10"
            onChange={handleOnChange}
          />
          {formInputs.state.value && <div className="">
            <Label htmlFor="counties">Counties</Label>
            <div className="flex flex-row items-center flex-wrap gap-2">
              {filteredCounties.map((item: any) => {
                const isSelected = formArray.counties.includes(item?.name);
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
          </div>}
        </div>
      </div>
      <div>
        <span className="font-medium text-lg">Mineral Owner Location</span>
        <div className="space-y-5">
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
              <Label htmlFor="zipcode">Zip code</Label>
              <Input
                placeholder="Zip code"
                type="number"
                name="zipcode"
                value={formInputs.zipcode}
                onChange={handleOnChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <SelectLocation
              name="ownerState"
              label="Onwer state"
              placeholder="Onwer state"
              value={formInputs.ownerState}
              onChange={handleOnChange}
            />
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
      <Button disabled={loading} className="self-start" size="sm" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default memo(AddMineralForm);
