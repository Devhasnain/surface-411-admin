import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Divider } from "primereact/divider";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

import { DeleteConfirmation, IconButton } from "../../components";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useDeletePlan, useFetchPlans } from "../../hooks";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useModal } from "../../hooks/useModal";
import { usePlansStore } from "../../store";


const Plans = () => {
  const storePlans = usePlansStore((state) => state.setPlans);
  const [delPlanId, setDelPlanId] = useState<string | null>(null);
  const { isOpen, toggleModal } = useModal();
  const { data, isPending, refetch } = useFetchPlans();
  const { mutate: deletePlan, isPending: isDeleting } = useDeletePlan();

  const confirmDeletion = (id: string) => {
    setDelPlanId(id);
    toggleModal();
  };

  const onCancelDel = () => {
    setDelPlanId(null);
    toggleModal();
  };

  const onConfirmDeletion = () => {
    if (!delPlanId) {
      toggleModal();
      return;
    }
    deletePlan(delPlanId, {
      onSuccess: () => {
        setDelPlanId(null);
        toast.success("User deleted succesfully");
        toggleModal();
      },
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };

  useEffect(() => {
    if (data?.plans?.length) {
      storePlans(data?.plans);
    }
  }, [data?.plans]);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Plans
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <IconButton onClick={refetch} loading={isPending}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
          <li>
            <Link
              className="bg-brand-500 py-3 px-3 rounded-lg text-white hover:bg-brand-600"
              to={"/plans/create"}
            >
              Add new
            </Link>
          </li>
        </ol>
      </div>
      <div className="grid grid-cols-3 w-full gap-8">
        {data?.plans?.length
          ? data?.plans?.map((item: any, i: number) => (
              <div
                key={i}
                className="border rounded-xl shadow hover:shadow-md bg-white dark:bg-gray-dark dark:border-gray-dark p-5 dark:text-white group relative"
              >
                {!isDeleting && (
                  <div className="flex flex-row items-center gap-1 justify-end opacity-0 group-hover:opacity-100 z-0! group-hover:z-1! absolute top-3 right-3">
                    <TrashBinIcon
                      className="cursor-pointer"
                      onClick={() => confirmDeletion(item?._id)}
                      height={20}
                      width={20}
                    />
                    <Link to={`/plans/${item?._id}`}>
                      <PencilIcon height={22} width={22} />
                    </Link>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <h1 className="font-medium text-lg">{item?.title}</h1>
                  <h2 className="font-medium text-3xl">${item?.amount}</h2>
                  <h3 className="font-medium text-md">{item?.subtitle}</h3>
                  {item?.downloadLimit && (
                    <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400">
                      Download Limit: {item?.downloadLimit}
                    </h4>
                  )}
                </div>
                <h3 className="font-medium text-md mt-3 text-gray-500">
                  Features
                </h3>

                <Divider className="!my-2 !dark:border-gray-dark" />

                <div className="flex flex-col mb-2">
                  {item?.features?.map((feat: string, id: number) => (
                    <span className="text-gray-500" key={id}>
                      {feat}
                    </span>
                  ))}
                </div>

                <p className="text-gray-500">{item?.description}</p>
              </div>
            ))
          : ""}
      </div>
      <DeleteConfirmation
        isOpen={isOpen}
        onCancel={onCancelDel}
        onConfirm={onConfirmDeletion}
        loading={isDeleting}
      />
    </>
  );
};

export default Plans;
