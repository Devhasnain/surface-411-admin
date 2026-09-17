import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

import BasicTableOne from "../../components/tables/BasicTables/BasicTableOne";
import { TableBody, TableCell, TableRow } from "../../components/ui/table";
import AddUserModel from "../../components/UserProfile/AddUserModel";
import IconButton from "../../components/ui/iconButton/IconButton";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useCreateUser, useFetchUsers } from "../../hooks";
import Button from "../../components/ui/button/Button";
import { formatToDMY } from "../../utils/DateFormate";
import { useModal } from "../../hooks/useModal";
import { useAuthStore } from "../../store";


const Users = () => {
  const auth = useAuthStore((state) => state.user);
  const { data, isPending, refetch } = useFetchUsers();

  return (
    <>
      <Header isLoading={isPending} onReload={refetch} />
      <BasicTableOne head={["User", "Email", "Role", "Created at"]}>
        <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
          {data?.users?.length
            ? data?.users?.map((user: any) => (
                <TableRow key={user?._id} className="group">
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <Link
                      to={
                        user?._id === auth?._id
                          ? "/profile"
                          : `/user/${user?._id}`
                      }
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 overflow-hidden rounded-full border flex flex-col items-center justify-center">
                        {user?.picture ? (
                          <img
                            width={40}
                            height={40}
                            src={user.picture}
                            alt={"user image"}
                          />
                        ) : (
                          <span>{user?.name[0]?.toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {user?.name}
                        </span>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user?.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {user?.role[0]?.toUpperCase()}
                    {user?.role?.slice(1)}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {formatToDMY(user?.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            : ""}
        </TableBody>
      </BasicTableOne>
    </>
  );
};

type HeaderProps = {
  isLoading: boolean;
  onReload: () => void;
};

const initialValues = {
  name: "",
  email: "",
  password: "",
  role: "",
  phone: "",
  bio: "",
  permissions: ["read"],
};

const Header = ({ isLoading, onReload }: HeaderProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  const { mutate, isPending } = useCreateUser();
  const [form, setForm] = useState(initialValues);
  const [haveChanges, setHaveChanges] = useState(false);

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
    mutate(form, {
      onSuccess: () => {
        setHaveChanges(false);
        toast.success("New user has been added.");
        setForm(initialValues);
        closeModal();
      },
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Users
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <IconButton onClick={onReload} loading={isLoading}>
              <ArrowPathIcon
                height={18}
                width={18}
                className={`transition-colors dark:group-hover:text-white`}
              />
            </IconButton>
          </li>
          <li>
            <Button onClick={openModal} size="sm">
              Add new
            </Button>
          </li>
        </ol>
      </div>
      <AddUserModel
        user={null}
        isOpen={isOpen}
        closeModal={closeModal}
        onSubmit={handleSave}
        form={form}
        onChange={handleOnChange}
        haveChanges={haveChanges}
        loading={isPending}
        buttonTitle="Save"
      />
    </>
  );
};

export default Users;
