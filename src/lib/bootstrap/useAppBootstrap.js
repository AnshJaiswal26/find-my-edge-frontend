import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { appBootstrap } from "./appBootstrap";
import { authService } from "@lib/services/auth.service";
import { setAccessToken } from "@lib/api/client";
import { useAuthStore } from "@shared/stores";

const PUBLIC_ROUTES = ["/login", "/register"];

export function useAppBootstrap() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    async function init() {
      try {
        //  Offline check
        if (!navigator.onLine) {
          navigate("/offline", { replace: true });
          return;
        }

        // Try restoring session
        try {
          const res = await authService.refresh();

          if (res?.accessToken) {
            setAccessToken(res.accessToken);

            const user = await authService.getMe();
            setUser(user);
          }
        } catch {}

        if (!isAuthenticated && PUBLIC_ROUTES.includes(location.pathname)) {
          return;
        }

        // If user not authenticated → login
        if (!isAuthenticated) {
          navigate("/login", { replace: true });
          return;
        }

        // Bootstrap app
        await appBootstrap();
      } catch (err) {
        console.error("Bootstrap failed:", err);
        navigate("/server-unavailable", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [navigate, setUser]);

  return loading;
}
