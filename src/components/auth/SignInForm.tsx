import { ChangeEvent, memo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";

import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { useLogin } from "../../hooks";
import Label from "../form/Label";


const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setForm((pre) => ({ ...pre, [name]: value }));
  };

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    login(form, {
      onSuccess: () => toast.success("Login successfull"),
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <form onSubmit={handleOnSubmit}>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    value={form.email}
                    onChange={handleOnChange}
                    name="email"
                    id="email"
                    type="email"
                    required={true}
                    placeholder="info@gmail.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleOnChange}
                      name="password"
                      id="password"
                      required={true}
                      min={6}
                      autoComplete="current-password"
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link
                    to="/forget-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button
                    disabled={
                      !form.email.trim() || !form.password.trim() || isPending
                    }
                    className="w-full"
                    size="sm"
                    loading={isPending}
                  >
                    Sign in
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(SignInForm);
