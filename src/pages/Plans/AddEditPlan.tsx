import { memo, useEffect, useState } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";

import ComponentCard from "../../components/common/ComponentCard";
import TodoInput from "../../components/ui/todoInput/TodoInput";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { Button, InputField, Label } from "../../components";
import TextArea from "../../components/form/input/TextArea";
import { useAddPlan, useUpdatePlan } from "../../hooks";
import { usePlansStore } from "../../store";


let initialValues = {
  title: "",
  subtitle: "",
  description: "",
  priceId: "",
  feature: "",
  features: [],
  amount: "",
  downloadLimit: "",
};
const AddEditPlan = () => {
  const params = useParams();
  let planId = params?.id;
  const plans = usePlansStore((state) => state.plans);
  const updateApi = useUpdatePlan();
  const createApi = useAddPlan();
  const [formData, setFormData] = useState(initialValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (planId) {
      updateApi.mutate(
        {
          ...formData,
          planId,
          amount: parseFloat(Number(formData.amount).toFixed(2)),
          downloadLimit: parseInt(formData.downloadLimit) || 0,
          download_limit: parseInt(formData.downloadLimit) || 0, // Try both camelCase and snake_case
        },
        {
          onSuccess: () => {
            toast.success("Plan updated successfully.");
          },
          onError: (error) => toast.error(GetApiErrorMessage(error)),
        }
      );
    } else {
      createApi.mutate(
        {
          ...formData,
          amount: parseFloat(Number(formData.amount).toFixed(2)),
          downloadLimit: parseInt(formData.downloadLimit) || 0,
          download_limit: parseInt(formData.downloadLimit) || 0, // Try both camelCase and snake_case
        },
        {
          onSuccess: () => {
            toast.success("Plan created successfully.");
            setFormData(initialValues);
          },
          onError: (error) => toast.error(GetApiErrorMessage(error)),
        }
      );
    }
  };

  useEffect(() => {
    if (plans?.length && planId) {
      const plan = plans.find((item) => item._id === planId);
      setFormData({
        title: plan?.title ?? "",
        description: plan?.description ?? "",
        subtitle: plan?.subtitle ?? "",
        priceId: plan?.priceId ?? "",
        feature: "",
        features: plan?.features ?? [],
        amount: plan?.amount ?? "",
        downloadLimit: plan?.downloadLimit ?? "",
      });
    }
  }, [plans, planId]);

  return (
    <>
      <ComponentCard title={params?.id ? "Edit plan" : "Create plan"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="">
              <Label>Title</Label>
              <InputField
                min={3}
                required
                max={50}
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter plan title"
              />
            </div>

            <div className="">
              <Label>Subtitle</Label>
              <InputField
                min={3}
                required
                max={50}
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                placeholder="Enter plan subtitle"
              />
            </div>

            <div className="">
              <Label>Stripe price id</Label>
              <InputField
                min={5}
                max={200}
                required
                name="priceId"
                value={formData.priceId}
                onChange={handleChange}
                placeholder="Enter Stripe Price ID"
              />
            </div>

            <div className="">
              <Label>Amount</Label>
              <InputField
                min={0}
                step="0.01"
                max={10000}
                required
                name="amount"
                value={formData.amount}
                type="number"
                onChange={handleChange}
                placeholder="Enter Stripe Price amount"
              />
            </div>

            <div className="">
              <TodoInput
                type="text"
                label="Features"
                placeholder="Feature"
                fieldName="features"
                name="feature"
                value={formData.feature}
                items={formData.features}
                onChange={handleChange}
                addItem={(e) =>
                  setFormData((pre) => ({
                    ...pre,
                    [e.fieldName]: e.value,
                  }))
                }
                resetInput={(e) => {
                  setFormData((pre) => ({ ...pre, [e]: "" }));
                }}
                removeItem={(e) => {
                  setFormData((pre) => ({
                    ...pre,
                    [e.fieldName]: e.value,
                  }));
                }}
              />
            </div>
            <div className="">
              <Label>Download Limit</Label>
              <InputField
                min={0}
                max={1000000}
                required
                name="downloadLimit"
                value={formData.downloadLimit}
                type="number"
                onChange={handleChange}
                placeholder="Enter download limit (e.g., 1000)"
              />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter plan description"
              rows={4}
              minLength={20}
              maxLength={500}
              required
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={createApi.isPending || updateApi.isPending}
              disabled={createApi.isPending || updateApi.isPending}
            >
              {params?.id ? "Update Plan" : "Create Plan"}
            </Button>
          </div>
        </form>
      </ComponentCard>
    </>
  );
};

export default memo(AddEditPlan);
