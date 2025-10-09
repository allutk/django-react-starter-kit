import { useAuth } from "~/Contexts/useAuth";
import ProtectedRoute from "~/Restrictions/ProtectedRoute";
import BoxContainer from "~/Components/BoxContainer";
import UserDetailsForm from "~/Components/UserDetailsForm";
import PasswordChangeForm from "~/Components/PasswordChangeForm";

export function meta() {
  return [
    { title: "Django + React Starter Kit" },
    {
      name: "description",
      content: "Production-ready Django + React Starter Kit",
    },
  ];
}

export default function Home() {
  const { userDetails } = useAuth();

  return (
    <ProtectedRoute>
      <BoxContainer extraClassName="md:max-w-xl divide-y divide-gray-200 ">
        <p className="py-6 first:pt-0 text-center text-3xl text-accent font-semibold">
          Welcome, {userDetails?.email}!
        </p>
        <UserDetailsForm extraClassName="py-6" />
        <PasswordChangeForm extraClassName="py-6 last:pb-0" />
      </BoxContainer>
    </ProtectedRoute>
  );
}
