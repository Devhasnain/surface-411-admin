import { Navigate, useLocation } from "react-router";
import { useEffect } from "react";

import { useGetUserProfile } from "../hooks";
import { useAuthStore } from "../store";


export const AuthManager: React.FC = () => {
  const pathname = useLocation()?.pathname;
  const { isLoading, setLoading, token, user, lastAuthenticated } =
    useAuthStore();
  const { mutate: getUserProfile } = useGetUserProfile();

  useEffect(() => {
    const validateAuth = async () => {
      setLoading(true);

      // Check if token and user exist
      if (!token) {
        setLoading(false);
        return;
      }

      if (!lastAuthenticated) {
        getUserProfile();
        return;
      }

      // Check if timestamp is older than 15 minutes
      const now = Date.now();
      const fifteenMinutesInMs = 15 * 60 * 1000;

      if (lastAuthenticated && now - lastAuthenticated > fifteenMinutesInMs) {
        getUserProfile();
        return;
      }

      setLoading(false);
    };

    validateAuth();
  }, [token, user, lastAuthenticated, setLoading]);

  // Show loader while validating
  if (isLoading) {
    return <></>;
  }

  if (token && pathname?.includes("/signin")) {
    return <Navigate to={"/"} replace />;
  }

  // Redirect to login if not authenticated
  if (!token && pathname !== "/signin") {
    return <Navigate to="/signin" replace />;
  }

  return <></>;
};
