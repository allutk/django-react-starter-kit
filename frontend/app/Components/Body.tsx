import type { ReactNode } from "react";

import Navbar from "./Navbar";

export default function Body({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-bg-from via-bg-via to-bg-to">
      <Navbar />

      <main className="flex flex-grow relative items-center overflow-hidden">
        <div className="container mx-auto relative z-10">
          <div className="flex flex-row content-center justify-center items-center">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
