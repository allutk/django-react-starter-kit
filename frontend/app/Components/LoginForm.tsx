import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

import { useAuth } from "~/Contexts/useAuth";
import Loader from "./Loader";
import AuthInputField from "./AuthInputField";
import SubmitButton from "./SubmitButton";

const formSchema = z.object({
  email: z.email(),
  password: z.string(),
});
type FormFields = z.infer<typeof formSchema>;

export default function LoginForm() {
  const { loginUser } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await loginUser(data.email, data.password, (error: any) => {
      setError("root", {
        message: error.response?.data?.detail || error.message,
      });
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Loader isLoading={isSubmitting} />

      {errors.root && (
        <div className="text-center mb-3 text-error">{errors.root.message}</div>
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
  );
}
