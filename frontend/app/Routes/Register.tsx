import { useNavigate } from "react-router";

import BoxContainer from "~/Components/BoxContainer";
import AnonymousRoute from "~/Restrictions/AnonymousRoute";
import RegisterForm from "~/Components/RegisterForm";

export function meta() {
  return [
    { title: "Django + React Starter Kit" },
    {
      name: "description",
      content: "Production-ready Django + React Starter Kit",
    },
  ];
}

export default function Register() {
  const navigate = useNavigate();

  return (
    <AnonymousRoute>
      <BoxContainer>
        <p className="mb-3 text-center text-3xl text-accent font-semibold">
          Welcome!
        </p>
        <p className="mb-9 text-center text-xl font-semibold">
          Create your account to view more
        </p>

        <RegisterForm />

        <p className="mt-7 mb-2 text-center">
          Already have an account?{" "}
          <a
            className="cursor-pointer text-accent hover:underline"
            onClick={() => navigate("/login")}
          >
            Log in now
          </a>
        </p>
      </BoxContainer>
    </AnonymousRoute>
  );
}
