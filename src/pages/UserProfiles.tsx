import { ChangeEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import GetApiErrorMessage from "../utils/GetApiErrorMessage";
import { useModal } from "../hooks/useModal";
import { useUpdateProfile } from "../hooks";
import { useAuthStore } from "../store";


const initialValues = {
  name: "",
  email: "",
  role: "",
  phone: "",
  bio: "",
  permissions: ["read"],
};

export default function UserProfiles() {
  const { user, updateUser } = useAuthStore();
  const { mutate, isPending } = useUpdateProfile();

  const { isOpen, openModal, closeModal } = useModal();
  const [haveChanges, setHaveChanges] = useState(false);
  const [form, setForm] = useState(initialValues);

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

  const handleSave = (e: any) => {
    e.preventDefault();
    mutate(
      {
        name: form?.name,
        email: form?.email,
        role: form?.role,
        phone: form?.phone,
        bio: form?.bio,
      },
      {
        onSuccess: () => {
          updateUser(form);
          toast.success("Profile Updated succesfully.");
          closeModal();
        },
        onError: (error) => toast.error(GetApiErrorMessage(error)),
      }
    );
  };

  useEffect(() => {
    if (user) {
      setForm({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        role: user?.role ?? "",
        permissions: user?.permissions ?? initialValues?.permissions,
        bio: user?.bio ?? "",
      });
    }

    return () => {
      setHaveChanges(false);
    };
  }, [user]);

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
            loading={isPending}
          />
          <UserInfoCard user={user} />
        </div>
      </div>
    </>
  );
}
