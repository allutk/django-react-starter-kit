import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";

import type { Route } from "./+types/Login";
import BoxContainer from "~/Components/BoxContainer";
import Loader from "~/Components/Loader";
import AnonymousRoute from "~/Restrictions/AnonymousRoute";
import { useAuth } from "~/Contexts/useAuth";
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
  password: z.string()
});
type FormFields = z.infer<typeof formSchema>;

export default function Login() {
  const { loginUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema)
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await loginUser(data.email, data.password, (error: any) => {
      setError("root", {
        message: error.response.data.detail
      });
    });
  };

  return (
    <AnonymousRoute>
      <Loader isLoading={isSubmitting} />

      <BoxContainer>
        <p className="mb-3 text-center text-3xl text-accent font-semibold">
          Welcome!
        </p>
        <p className="mb-9 text-center text-xl font-semibold">
          Log in to view more
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {errors.root && (
            <div className="text-center mb-3 text-error">
              {errors.root.message}
            </div>
          )}

          <AuthInputField
            fieldName="email"
            type="email"
            placeholder="example@mail.com"
            icon="mail"
            error={errors.email}
            register={register}
          />

          <AuthInputField
            fieldName="password"
            type="password"
            placeholder="Password"
            icon="lock"
            error={errors.password}
            register={register}
          />

          <SubmitButton
            text="Log In"
            disabled={!watch("email") || !watch("password") || isSubmitting}
            extraClassName="h-14 w-full mt-5 text-lg bg-accent hover:bg-bold-accent"
          />
        </form>

        <p className="mt-7 mb-2 text-center">
          Don't have an account? <a
            className="cursor-pointer text-accent hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign up now
          </a>
        </p>
      </BoxContainer>
    </AnonymousRoute>
  );
};
