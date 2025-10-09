import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { useAuth } from "~/Contexts/useAuth";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import Loader from "./Loader";

type PasswordChangeFormProps = {
  extraClassName?: string;
};

const formSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  newPasswordConfirmation: z.string(),
});
type FormFields = z.infer<typeof formSchema>;

export default function PasswordChangeForm({
  extraClassName,
}: PasswordChangeFormProps) {
  const { updateUserPassword } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    reset,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (data.newPassword !== data.newPasswordConfirmation) {
      setError("root", { message: "The passwords do not match" });
    } else {
      await updateUserPassword(
        data.currentPassword,
        data.newPassword,
        data.newPasswordConfirmation,
        (error: any) =>
          setError("root", {
            message: error.response.data.detail,
          }),
        () => {
          reset();
          clearErrors();
        }
      );
    }
  };

  return (
    <form
      className={extraClassName}
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <Loader isLoading={isSubmitting} />

      {errors.root && (
        <div className="text-center mb-3 text-error">{errors.root.message}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField
          register={register}
          fieldName="currentPassword"
          title="Current password"
          type="password"
          error={errors.currentPassword}
        />

        <InputField
          register={register}
          fieldName="newPassword"
          title="New password"
          type="password"
          extraClassName="md:row-start-3"
          error={errors.newPassword}
        />

        <InputField
          register={register}
          fieldName="newPasswordConfirmation"
          title="Confirm new password"
          type="password"
          extraClassName="md:row-start-3"
          error={errors.newPasswordConfirmation}
        />
      </div>

      <div className="flex justify-end pt-6">
        <SubmitButton
          text="Save"
          disabled={
            isSubmitting ||
            !watch("currentPassword") ||
            !watch("newPassword") ||
            !watch("newPasswordConfirmation")
          }
          extraClassName="h-10 px-4 text-sm bg-accent hover:bg-bold-accent"
        />
      </div>
    </form>
  );
}
