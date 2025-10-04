import { useState } from "react";

import type { Route } from "./+types/Home";
import { useBackendApi } from "~/Contexts/useBackendApi";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Django + React Starter Kit" },
    { name: "description",
      content: "Production-ready Django + React Starter Kit" },
  ];
}

export default function Home() {
  const { callPing } = useBackendApi();

  const [pingResponse, setPingResponse] = useState<string | null>(null);

  const onCallPing = async () => {
    const res = await callPing((error: any) => console.log(error));
    if (res) setPingResponse(res);
  };

  return (
    <div className="p-4">
      <button className="cursor-pointer" onClick={onCallPing}>
        Ping
      </button>

      {pingResponse &&
        <div>{pingResponse}</div>
      }
    </div>
  );
}
