import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

import { useAuth } from "~/Contexts/useAuth";
import InputField from "./InputField";
import SubmitButton from "./SubmitButton";
import Loader from "./Loader";

type UserDetailsFormProps = {
  extraClassName?: string;
};

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});
type FormFields = z.infer<typeof formSchema>;

export default function UserDetailsForm({
  extraClassName,
}: UserDetailsFormProps) {
  const { userDetails, patchUserDetails } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");
  const areDetailsUpdated =
    (firstName ? firstName : "") !==
      (userDetails?.firstName ? userDetails.firstName : "") ||
    (lastName ? lastName : "") !==
      (userDetails?.lastName ? userDetails.lastName : "");

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await patchUserDetails({
      onFailCallback: (error: any) =>
        setError("root", {
          message: error.response.data.detail,
        }),
      firstName: data.firstName ? data.firstName : undefined,
      lastName: data.lastName ? data.lastName : undefined,
    });
  };

  useEffect(() => {
    if (userDetails) {
      setValue("firstName", userDetails.firstName);
      setValue("lastName", userDetails.lastName);
    }
  }, [userDetails]);

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
          fieldName="firstName"
          title="First name"
          type="text"
          error={errors.firstName}
        />

        <InputField
          register={register}
          fieldName="lastName"
          title="Last name"
          type="text"
          error={errors.lastName}
        />
      </div>

      <div className="flex justify-end pt-6">
        <SubmitButton
          text="Save"
          disabled={isSubmitting || !areDetailsUpdated}
          extraClassName="h-10 px-4 text-sm bg-accent hover:bg-bold-accent"
        />
      </div>
    </form>
  );
}
