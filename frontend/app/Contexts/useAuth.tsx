import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode
} from "react";
import { useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";
import { StatusCodes } from "http-status-codes";
import toast from "react-hot-toast";

import { ACCESS_TOKEN, REFRESH_TOKEN, TOAST_OPTIONS } from "~/Constants";
import type { UserDetails } from "~/Models/User";
import backendApi from "~/Services/BackendApi";
import type { UserDetailsUpdateRequest } from "~/Models/ApiRequest";
import type {
UserDetailsResponse,
  UserTokensResponse
} from "~/Models/ApiResponse";

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  userDetails: UserDetails | null;
  isLoggedIn: () => boolean;
  loginUser: (
    email: string,
    password: string,
    onFailCallback: (error: any) => void
  ) => Promise<void>;
  registerUser: (
    email: string,
    password: string,
    onFailCallback: (error: any) => void
  ) => Promise<void>;
  logoutUser: () => void;
  patchUserDetails: (
    params: {
      onFailCallback: (error: any) => void,
      email?: string,
      firstName?: string,
      lastName?: string
    }
  ) => Promise<void>;
  updateUserPassword: (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
    onFailCallback: (error: any) => void,
    onSuccessCallback: () => void
  ) => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isReady, setIsReady] = useState(false);

  const isLoggedIn = (): boolean => {
    return !!accessToken && !!refreshToken;
  };

  const getUserDetails = async (): Promise<void> => {
    try {
      const res = await backendApi.get<UserDetailsResponse>("/user/");

      if (res.status === StatusCodes.OK) {
        const data = res.data;
        setUserDetails({
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name
        });
      }
    } catch (error) {
      logoutUser();
    }
  };

  const loginUser = async (
    email: string,
    password: string,
    onFailCallback: (error: any) => void
  ): Promise<void> => {
    try {
      const res = await backendApi.post<UserTokensResponse>("/token/", {
        email: email,
        password: password
      });

      if (res.status === StatusCodes.OK) {
        const accessToken = res.data.access;
        const refreshToken = res.data.refresh;
    
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem(REFRESH_TOKEN, refreshToken);
        await getUserDetails();
  
        toast.success("Logged in successfully!", TOAST_OPTIONS);
        navigate("/");
      }
    } catch (error: any) {
      onFailCallback(error);
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    onFailCallback: (error: any) => void
  ): Promise<void> => {
    try {
      const res = await backendApi.post<UserDetailsResponse>("/user/", {
        email: email,
        password: password
      });

      if (res.status === StatusCodes.CREATED) {
        await loginUser(email, password, onFailCallback);
      }
    } catch (error: any) {
      onFailCallback(error);
    }
  };

  const logoutUser = (): void => {
    if (localStorage.getItem(ACCESS_TOKEN) ||
        localStorage.getItem(REFRESH_TOKEN)) {
      setAccessToken(null);
      setRefreshToken(null);
      setUserDetails(null);
  
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
  
      toast.success("Signed out successfully!", TOAST_OPTIONS);
      navigate("/");
    }
  };

  const patchUserDetails = async (params: {
    onFailCallback: (error: any) => void,
    email?: string,
    firstName?: string,
    lastName?: string,
    password?: string
  }): Promise<void> => {
    if (userDetails) {
      try {
        const req = {} as UserDetailsUpdateRequest;
        params.firstName ? req.first_name = params.firstName : req.first_name = null;
        params.lastName ? req.last_name = params.lastName : req.last_name = null;

        const res = await backendApi.patch<UserDetailsResponse>(
          "/user/" + userDetails.id + "/",
          req
        );

        if (res.status === StatusCodes.OK) {
          setUserDetails({
            id: res.data.id,
            email: res.data.email,
            firstName: res.data.first_name,
            lastName: res.data.last_name
          });
          toast.success("User details updated successfully!", TOAST_OPTIONS);
        }
      } catch (error: any) {
        params.onFailCallback(error);
      }
    }
  };

  const updateUserPassword = async (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirmation: string,
    onFailCallback: (error: any) => void,
    onSuccessCallback: () => void
  ): Promise<void> => {
    try {
      const res = await backendApi.put("/password/change/", {
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation
      });

      if (res.status === StatusCodes.OK) {
        onSuccessCallback();
        toast.success("Password changed successfully!", TOAST_OPTIONS);
      }
    } catch (error: any) {
      onFailCallback(error);
    }
  };

  const tokenRefresh = async () => {
    try {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      const res = await backendApi.post<UserTokensResponse>("/token/refresh/", {
        refresh: refreshToken
      });

      if (res.status === StatusCodes.OK) {
        const accessToken = res.data.access;
        setAccessToken(accessToken);
        localStorage.setItem(ACCESS_TOKEN, accessToken);
      }
    } catch (error: any) {
      logoutUser();
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);

    if (accessToken && refreshToken) {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      const decodedToken = jwtDecode(accessToken);
      const tokenExpiration = decodedToken.exp;
      const secondsNow = Date.now() / 1000;

      const getUserDetailsCall = async () => {
        if (!userDetails) await getUserDetails();
      };

      if (!tokenExpiration || tokenExpiration < secondsNow) {
        tokenRefresh().then(() => getUserDetailsCall());
      } else {
        getUserDetailsCall();
      }
    }

    setIsReady(true);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        userDetails,
        isLoggedIn,
        loginUser,
        registerUser,
        logoutUser,
        patchUserDetails,
        updateUserPassword
      }}
    >
      {isReady ? children : null}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
