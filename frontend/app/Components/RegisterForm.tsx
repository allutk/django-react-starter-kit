import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

import { useAuth } from "~/Contexts/useAuth";
import AuthInputField from "./AuthInputField";
import SubmitButton from "./SubmitButton";
import Loader from "./Loader";

const formSchema = z
  .object({
    email: z.email(),
    password: z.string(),
    passwordConfirmation: z.string(),
  })
  .superRefine(({ password, passwordConfirmation }, ctx) => {
    if (password !== passwordConfirmation) {
      ctx.addIssue({
        path: ["password"],
        message: "The passwords do not match",
      } as z.core.$ZodRawIssue);
      ctx.addIssue({
        path: ["passwordConfirmation"],
        message: "The passwords do not match",
      } as z.core.$ZodRawIssue);
    }
  });
type FormFields = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const { registerUser } = useAuth();
  const {
    register,
    subscribe,
    handleSubmit,
    setError,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await registerUser(data.email, data.password, (error: any) => {
      setError("root", {
        message: error.response?.data?.detail || error.message,
      });
    });
  };

  useEffect(() => {
    const triggers = ({ values, isSubmitted }: any) => {
      if (values.password !== "" && isSubmitted) trigger("password");
      if (values.passwordConfirmation !== "" && isSubmitted)
        trigger("passwordConfirmation");
    };

    const callback = () => {
      subscribe({
        formState: { values: true },
        name: "password",
        exact: true,
        callback: triggers,
      });
      subscribe({
        formState: { values: true },
        name: "passwordConfirmation",
        exact: true,
        callback: triggers,
      });
    };

    return callback;
  }, [subscribe]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Loader isLoading={isSubmitting} />

      {errors.root && (
        <div className="text-center mb-3 text-error">{errors.root.message}</div>
      )}

      <AuthInputField
        register={register}
        fieldName="email"
        type="email"
        placeholder="example@mail.com"
        icon="mail"
        error={errors.email}
      />

      <AuthInputField
        register={register}
        fieldName="password"
        type="password"
        placeholder="Password"
        icon="lock"
        error={errors.password}
      />

      <AuthInputField
        register={register}
        fieldName="passwordConfirmation"
        type="password"
        placeholder="Confirm password"
        icon="lock"
        error={errors.passwordConfirmation}
      />

      <SubmitButton
        text="Sign Up"
        disabled={
          !watch("email") ||
          !watch("password") ||
          !watch("passwordConfirmation") ||
          isSubmitting
        }
        extraClassName="h-14 w-full mt-5 text-lg bg-accent hover:bg-bold-accent"
      />
    </form>
  );
}
