import { createContext, useContext, type ReactNode } from "react";

import backendApi from "~/Services/BackendApi";

type BackendApiContextType = {
  callPing: (
    onFailCallback: (error: any) => void
  ) => Promise<string | undefined>
};

const BackendApiContext = createContext<BackendApiContextType>(
  {} as BackendApiContextType
);

export default function BackendApiProvider(
  { children }: { children: ReactNode }
) {
  const callPing = async (
    onFailCallback: (error: any) => void
  ): Promise<string | undefined> => {
    try {
      const res = await backendApi.get<{"message": string}>("/ping/");
      if (res.status === 200) {
        return res.data.message;
      }
    } catch (error: any) {
      onFailCallback(error);
    }
  };

  return (
    <BackendApiContext.Provider
      value={{
        callPing
      }}
    >
      {children}
    </BackendApiContext.Provider>
  );
};

export const useBackendApi = () => useContext(BackendApiContext);
