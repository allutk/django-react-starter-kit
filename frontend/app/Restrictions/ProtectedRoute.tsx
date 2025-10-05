import type { ReactNode } from "react";
import { Navigate } from "react-router";

import { useAuth } from "~/Contexts/useAuth";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
};
