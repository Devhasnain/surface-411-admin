import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { Button, InputField, Label } from "../../components";
import { useUpdateMineralBulk } from "../../hooks";


const BulkUpdateMinerals = () => {
  const [form, setForm] = useState({
    skip: 0,
    limit: 1000,
  });
  const { mutate, isPending } = useUpdateMineralBulk();
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((pre) => ({ ...pre, [e.target.name]: e.target.value }));
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    mutate(form, {
      onSuccess: () => toast.success("Updated minerals"),
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };
  return (
    <form onSubmit={onSubmit} className="space-y-5 w-full md:w-6/12 lg:w-4/12">
      <div>
        <Label htmlFor="skip">Skip</Label>
        <InputField
          name="skip"
          id="skip"
          value={form.skip}
          onChange={onChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="limit">Limit</Label>
        <InputField
          name="limit"
          id="limit"
          value={form.limit}
          onChange={onChange}
          required
        />
      </div>
      <Button loading={isPending} disabled={isPending} type="submit">Update</Button>
    </form>
  );
};

export default BulkUpdateMinerals;
