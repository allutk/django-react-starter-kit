import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuth } from "~/Contexts/useAuth";

export default function AnonymousRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  return !isLoggedIn() ? children : <Navigate to="/" replace />;
};
