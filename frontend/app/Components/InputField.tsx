import { useState } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  register: UseFormRegister<any>;
  fieldName: string;
  title: string;
  type: string;
  extraClassName?: string;
  disabled?: boolean;
  error?: FieldError;
};

export default function InputField({
  register,
  fieldName,
  title,
  type,
  extraClassName,
  disabled = false,
  error,
}: InputFieldProps) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const baseClassName =
    "block h-9.5 w-full py-2 px-3 shadow-sm appearance-none " +
    "transition-colors leading-tight rounded-md border border-gray-400 md:text-sm " +
    "focus:outline-none focus:shadow-outline focus:ring-accent focus:border-accent " +
    "placeholder:text-gray-400 hover:border-gray-500";

  return (
    <div className={extraClassName}>
      <p className="mb-1 text-sm font-medium">{title}</p>
      <input
        className={
          disabled
            ? baseClassName + " bg-gray-100"
            : baseClassName + " bg-white"
        }
        {...register(fieldName)}
        type={isPasswordShown ? "text" : type}
        placeholder={title}
        disabled={disabled}
      />

      {type === "password" && (
        <div className="relative">
          <i
            className={
              "absolute material-symbols-rounded -top-6 right-4 " +
              "-translate-y-1/4 cursor-pointer text-gray-400 hover:text-gray-500"
            }
            onClick={() => setIsPasswordShown((state) => !state)}
          >
            {isPasswordShown ? "visibility" : "visibility_off"}
          </i>
        </div>
      )}

      {error && <div className="text-sm mt-1 text-error">{error.message}</div>}
    </div>
  );
}
