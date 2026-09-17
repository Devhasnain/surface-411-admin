import React, { useState } from "react";
import toast from "react-hot-toast";

import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useUpdatePassword } from "../../hooks";
import { useModal } from "../../hooks/useModal";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import Label from "../form/Label";


const ResetPasswordModal = () => {
  const { isOpen, openModal, closeModal } = useModal();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { mutate, isPending } = useUpdatePassword();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password doesn't match.");
      return;
    }

    mutate(form, {
      onSuccess: () => {
        setForm({ newPassword: "", confirmPassword: "", currentPassword: "" });
        closeModal();
        toast.success("Password updated successfully!");
      },
      onError: (error) => {
        toast.error(GetApiErrorMessage(error));
      },
    });
  };
  return (
    <>
      <button
        onClick={openModal}
        className="flex min-w-36 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      >
        Reset Password
      </button>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-md">
        <div className="relative w-full bg-white rounded-2xl p-6 dark:bg-gray-800">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Reset Password
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Enter your current password and choose a new one.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="text"
                placeholder="Current Password"
                min={6}
                value={form.currentPassword}
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="text"
                placeholder="New Password"
                min={6}
                value={form.newPassword}
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="text"
                min={6}
                placeholder="Repeat new password"
                value={form.confirmPassword}
                required
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                loading={isPending}
                disabled={isPending}
              >
                Update Password
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ResetPasswordModal;
