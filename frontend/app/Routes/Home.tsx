import type { Route } from "./+types/Home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Django + React Starter Kit" },
    { name: "description", content: "Production-ready Django + React Starter Kit" },
  ];
}

export default function Home() {
  return (
    <div>
      No content yet
    </div>
  );
}
