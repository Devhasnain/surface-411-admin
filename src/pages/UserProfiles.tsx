import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { getToken, getUser, updateUser } from "../store/slices/authSlice";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import GetApiErrorMessage from "../utils/GetApiErrorMessage";
import PageMeta from "../components/common/PageMeta";
import { useMutation } from "../hooks/useMutation";
import { useModal } from "../hooks/useModal";
import { endpoints } from "../config/api";


const initialValues = {
  name: "",
  email: "",
  role: "",
  phone: "",
  bio: "",
  permissions: ["read"],
};

export default function UserProfiles() {
  const user = useSelector(getUser);

  const { isOpen, openModal, closeModal } = useModal();
  const token = useSelector(getToken);
  const dispatch = useDispatch();
  const { loading, request } = useMutation(endpoints.updateProfile);
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

  const handleSave = useCallback(
    async (e: any) => {
      try {
        e.preventDefault();
        await request(
          {
            name: form?.name,
            email: form?.email,
            role: form?.role,
            phone: form?.phone,
            bio: form?.bio,
          },
          null,
          token ?? ""
        );
        dispatch(updateUser(form));
        setHaveChanges(false);
        toast.success("Profile updated.");
        closeModal();
      } catch (error) {
        toast.error(GetApiErrorMessage(error));
      }
    },
    [form]
  );

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
      <PageMeta title={`${user?.name} | Petro411`} description="" />
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
            loading={loading}
          />
          <UserInfoCard user={user} />
        </div>
      </div>
    </>
  );
}
