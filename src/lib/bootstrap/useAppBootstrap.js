import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { appBootstrap } from "./appBootstrap";
import { authService } from "@lib/services/auth.service";
import { setAccessToken } from "@lib/api/client";
import { useAuthStore, useIntegrationsStore } from "@shared/stores";
import { Brokers } from "@features/integrations/brokers/config";

const PUBLIC_ROUTES = ["/login", "/register"];

export function useAppBootstrap() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const fetchConnectionStatus = useIntegrationsStore(
    (s) => s.fetchConnectionStatus,
  );

  useEffect(() => {
    async function init() {
      try {
        if (!navigator.onLine) {
          navigate("/offline", { replace: true });
          return;
        }
        let authenticated = isAuthenticated;

        try {
          const res = await authService.refresh();

          if (res?.accessToken) {
            setAccessToken(res.accessToken);

            const user = await authService.getMe();
            login(user);

            await fetchConnectionStatus(Brokers.DHAN.key);

            authenticated = true;
          }
        } catch (err) {
          console.error("Token refresh failed", err);
        }

        if (!authenticated && PUBLIC_ROUTES.includes(location.pathname)) {
          return;
        }

        if (!authenticated) {
          navigate("/login", { replace: true });
          return;
        }

        await appBootstrap();
      } catch (err) {
        console.error("Bootstrap failed:", err);
        navigate("/server-unavailable", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return loading;
}
