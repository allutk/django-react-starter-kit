import { useState } from "react";
import type { FieldError, UseFormRegister } from "react-hook-form";

type InputFieldProps = {
  register: UseFormRegister<any>;
  fieldName: string;
  type: string;
  placeholder: string;
  icon: string;
  error?: FieldError;
};

export default function AuthInputField({
  register,
  fieldName,
  type,
  placeholder,
  icon,
  error,
}: InputFieldProps) {
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  return (
    <div>
      <div
        className={error ? "relative h-14 w-full" : "relative h-14 w-full mb-6"}
      >
        <input
          className={
            "h-full w-full pl-13 pr-5 shadow-sm appearance-none transition-colors leading-tight " +
            "rounded-md border bg-white border-gray-400 placeholder:text-gray-400 hover:border-gray-500 " +
            "focus:outline-none focus:shadow-outline focus:ring-accent focus:border-accent"
          }
          {...register(fieldName)}
          type={isPasswordShown ? "text" : type}
          placeholder={placeholder}
        />

        <i
          className={
            "absolute material-symbols-rounded top-1/2 left-4 " +
            "-translate-y-1/2 pointer-events-none text-black"
          }
        >
          {icon}
        </i>

        {type === "password" && (
          <i
            className={
              "absolute material-symbols-rounded top-1/2 right-4 cursor-pointer " +
              "-translate-y-1/2 text-black hover:text-accent"
            }
            onClick={() => setIsPasswordShown((state) => !state)}
          >
            {isPasswordShown ? "visibility" : "visibility_off"}
          </i>
        )}
      </div>

      {error && (
        <div className="text-sm mt-1 mb-3 text-error">{error.message}</div>
      )}
    </div>
  );
}
