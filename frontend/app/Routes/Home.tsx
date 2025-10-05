import type { Route } from "./+types/Home";
import ProtectedRoute from "~/Restrictions/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Django + React Starter Kit" },
    { name: "description",
      content: "Production-ready Django + React Starter Kit" },
  ];
}

export default function Home() {
  return (
    <ProtectedRoute>
      <div>Home</div>
    </ProtectedRoute>
  );
}
