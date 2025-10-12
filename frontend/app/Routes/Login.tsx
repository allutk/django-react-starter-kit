import { useNavigate } from "react-router";

import BoxContainer from "~/Components/BoxContainer";
import AnonymousRoute from "~/Restrictions/AnonymousRoute";
import LoginForm from "~/Components/LoginForm";

export function meta() {
  return [
    { title: "Django + React Starter Kit" },
    {
      name: "description",
      content: "Production-ready Django + React Starter Kit",
    },
  ];
}

export default function Login() {
  const navigate = useNavigate();

  return (
    <AnonymousRoute>
      <BoxContainer>
        <p className="mb-3 text-center text-3xl text-accent font-semibold">
          Welcome!
        </p>
        <p className="mb-9 text-center text-xl font-semibold">
          Log in to view more
        </p>

        <LoginForm />

        <p className="mt-7 mb-2 text-center">
          Don't have an account?{" "}
          <a
            className="cursor-pointer text-accent hover:underline"
            onClick={() => navigate("/register")}
          >
            Sign up now
          </a>
        </p>
      </BoxContainer>
    </AnonymousRoute>
  );
}
