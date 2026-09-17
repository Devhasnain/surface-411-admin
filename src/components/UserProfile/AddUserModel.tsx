import { ChangeEvent } from "react";

import TextArea from "../form/input/TextArea";
import Checkbox from "../form/input/Checkbox";
import Input from "../form/input/InputField";
import { useAuthStore } from "../../store";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import { Modal } from "../ui/modal";
import Label from "../form/Label";


type Props = {
  user: any;
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (e: any) => void;
  form: {
    name: string;
    email: string;
    password?: string;
    role?: string;
    phone: string;
    bio: string;
    permissions?: string[];
  };
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  haveChanges: boolean;
  loading: boolean;
  buttonTitle?: string;
};

const AddUserModel = ({
  user,
  isOpen,
  closeModal,
  onSubmit,
  form,
  onChange,
  haveChanges,
  loading,
  buttonTitle = "Save Changes",
}: Props) => {
  const auth = useAuthStore((state) => state.user);
  return (
    <Modal isOpen={isOpen} onClose={closeModal} className="max-w-175">
      <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Personal Information
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Update your details to keep your profile up-to-date.
          </p>
        </div>
        <form className="flex flex-col" onSubmit={onSubmit}>
          <div className="custom-scrollbar overflow-y-auto px-2 pb-3">
            <div className="mt-3">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-12">
                <div className="col-span-12 lg:col-span-6">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    value={form?.name}
                    required={true}
                    placeholder="Name"
                    id="name"
                    name="name"
                    min={3}
                    onChange={onChange}
                  />
                </div>

                <div className="col-span-12 lg:col-span-6">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    value={form?.email}
                    required={true}
                    placeholder="Email address"
                    id="email"
                    name="email"
                    onChange={onChange}
                  />
                </div>

                {"password" in form && (
                  <div className="col-span-12 lg:col-span-6">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      type="text"
                      value={form?.password}
                      required={true}
                      placeholder="Password"
                      id="password"
                      name="password"
                      onChange={onChange}
                    />
                  </div>
                )}

                <div className="col-span-12 lg:col-span-6">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    type="number"
                    value={form?.phone}
                    placeholder="Phone number"
                    id="phone"
                    name="phone"
                    onChange={onChange}
                  />
                </div>

                {"role" in form && (
                  <div className="col-span-12 lg:col-span-6">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      defaultValue={form.role}
                      name="role"
                      options={[
                        {
                          label: "User",
                          value: "user",
                        },
                        {
                          label: "Admin",
                          value: "admin",
                        },
                      ]}
                      onChange={onChange}
                      required={true}
                    />
                  </div>
                )}

                {"permissions" in form && auth?._id !== user?._id ? (
                  <div className="col-span-12">
                    <Label htmlFor="permissions">Permissions</Label>
                    <div className="flex flex-row items-center gap-5">
                      {["read", "create", "update", "delete"].map(
                        (item, index) => (
                          <Checkbox
                            key={index}
                            label={
                              item[0].toUpperCase() + item.slice(1, item.length)
                            }
                            value={item}
                            name="permissions"
                            disabled={item === "read"}
                            checked={
                              "permissions" in form &&
                              form?.permissions?.includes(item)
                                ? true
                                : false
                            }
                            onChange={onChange}
                          />
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <></>
                )}

                <div className="col-span-12">
                  <Label htmlFor="bio">Bio</Label>
                  <TextArea
                    name="bio"
                    value={form?.bio}
                    onChange={onChange}
                    rows={4}
                    placeholder="Bio"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={closeModal}
            >
              Close
            </Button>
            <Button
              disabled={loading || !haveChanges}
              loading={loading}
              type="submit"
              size="sm"
            >
              {buttonTitle}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddUserModel;
