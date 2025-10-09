import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

import type { Route } from "./+types/Register";
import { useAuth } from "~/Contexts/useAuth";
import BoxContainer from "~/Components/BoxContainer";
import Loader from "~/Components/Loader";
import AnonymousRoute from "~/Restrictions/AnonymousRoute";
import AuthInputField from "~/Components/AuthInputField";
import SubmitButton from "~/Components/SubmitButton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Django + React Starter Kit" },
    { name: "description",
      content: "Production-ready Django + React Starter Kit" },
  ];
}

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
  passwordConfirmation: z.string()
}).superRefine(({ password, passwordConfirmation }, ctx) => {
  if (password !== passwordConfirmation) {
    ctx.addIssue({
      path: ["password"],
      message: "The passwords do not match"
    } as z.core.$ZodRawIssue);
    ctx.addIssue({
      path: ["passwordConfirmation"],
      message: "The passwords do not match"
    } as z.core.$ZodRawIssue);
  }
});
type FormFields = z.infer<typeof formSchema>;

export default function Register() {
  const { registerUser } = useAuth();
  const {
    register,
    subscribe,
    handleSubmit,
    setError,
    watch,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema)
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await registerUser(data.email, data.password, (error: any) => {
      setError("root", {
        message: error.response?.data?.detail || error.message
      });
    });
  };

  useEffect(() => {
    const triggers = ({ values, isSubmitted }: any) => {
      if (values.password !== "" && isSubmitted) trigger("password");
      if (values.passwordConfirmation !== "" && isSubmitted) trigger("passwordConfirmation");
    };

    const callback = () => {
      subscribe({
        formState: { values: true },
        name: "password",
        exact: true,
        callback: triggers
      });
      subscribe({
        formState: { values: true },
        name: "passwordConfirmation",
        exact: true,
        callback: triggers
      });
    };

    return callback;
  }, [subscribe]);

  return (
    <AnonymousRoute>
      <Loader isLoading={isSubmitting} />

      <BoxContainer>
        <p className="mb-3 text-center text-3xl text-accent font-semibold">
          Welcome!
        </p>
        <p className="mb-9 text-center text-xl font-semibold">
          Create your account to view more
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {errors.root && (
            <div className="text-center mb-3 text-error">
              {errors.root.message}
            </div>
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
            disabled={!watch("email") ||
                      !watch("password") ||
                      !watch("passwordConfirmation") ||
                      isSubmitting}
            extraClassName="h-14 w-full mt-5 text-lg bg-accent hover:bg-bold-accent"
          />
        </form>

        <p className="mt-7 mb-2 text-center">
          Already have an account? <a
            className="cursor-pointer text-accent hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in now
          </a>
        </p>
      </BoxContainer>
    </AnonymousRoute>
  );
};
