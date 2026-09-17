import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState, } from "react";
import { useParams } from "react-router";
import toast from "react-hot-toast";

import { useFetchCustomer, useUpdateCustomerProfile } from "../../hooks";
import UserMetaCard from "../../components/UserProfile/UserMetaCard";
import UserInfoCard from "../../components/UserProfile/UserInfoCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { formatToDMY } from "../../utils/DateFormate";
import { useModal } from "../../hooks/useModal";


let initialValues = {
  name: "",
  email: "",
  phone: "",
  bio: "",
  role: "",
  permissions: ["read"],
};

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const { data, isPending } = useFetchCustomer(id || "");

  const updateApi = useUpdateCustomerProfile();
  const { isOpen, openModal, closeModal } = useModal();
  const [form, setForm] = useState(initialValues);

  const [haveChanges, setHaveChanges] = useState(false);

  const subscription = useMemo(() => {
    return user?.subscription;
  }, [user?.subscription]);

  const handleOnChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      if (name === "permissions") {
        setForm((prev) => {
          const permissions = prev.permissions.includes(value)
            ? prev.permissions.filter((perm) => perm !== value)
            : [...prev.permissions, value];
          return { ...prev, permissions: permissions };
        });
      } else {
        setForm((pre) => ({ ...pre, [name]: value }));
      }
      if (!haveChanges) setHaveChanges(!haveChanges);
    },
    [form]
  );

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateApi.mutate(
      { ...form, id: user?._id },
      {
        onSuccess: () => toast.success("User Profile Updated."),
        onError: (error) => toast.error(GetApiErrorMessage(error)),
      }
    );
  };

  useEffect(() => {
    if (data?.user) {
      setUser(data?.user);
      setForm({
        name: data?.user?.name,
        email: data?.user?.email,
        phone: data?.user?.phone,
        bio: data?.user?.bio,
        role: data?.user?.role,
        permissions: data?.user?.permissions ?? initialValues.permissions,
      });
    }
  }, [data, id]);

  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 lg:p-6">
        <div className="space-y-6">
          <UserMetaCard
            user={user}
            openModal={openModal}
            isOpen={isOpen}
            closeModal={closeModal}
            onSubmit={handleSave}
            form={form}
            onChange={handleOnChange}
            haveChanges={haveChanges}
            loading={isPending || updateApi.isPending}
          />
          <UserInfoCard user={user} />
          {subscription && (
            <ComponentCard title="Subscription">
              <>
                <div className="grid grid-cols-2 gap-y-5">
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Started at
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {formatToDMY(subscription?.start_date)}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Ends at
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {formatToDMY(subscription?.expires_at)}
                    </p>
                  </div>
                  {subscription?.canceled_at && (
                    <div>
                      <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                        Cancelled at
                      </p>
                      <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                        {formatToDMY(subscription?.canceled_at)}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Monthly downloads limit
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {subscription?.monthlyDownloadLimit}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Downloads this month
                    </p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                      {subscription?.monthlyDownloadLimit}
                    </p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                      Amount
                    </p>
                    <h2 className="text-2xl">
                      {(subscription?.amount / 100).toFixed(2)}$
                    </h2>
                  </div>
                </div>

                {subscription?.downloads_list?.length ? (
                  <div className="space-y-4">
                    <h3 className="text-xl border-b pb-2">Downloads history</h3>

                    <div className="space-y-2">
                      {subscription?.downloads_list?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="border rounded-lg px-4 py-2 flex flex-row items-center justify-between"
                          >
                            <span>{item?.county}</span>
                            <span>{item?.items_count}</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </>
            </ComponentCard>
          )}
        </div>
      </div>
    </>
  );
}
