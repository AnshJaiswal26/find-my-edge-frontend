import { useEffect, useState } from "react";
import { appBootstrap } from "./appBootstrap";
import { useNavigate } from "react-router-dom";

export function useAppBootstrap() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function init() {
      try {
        // user offline
        if (!navigator.onLine) {
          navigate("/offline", { replace: true });
          return;
        }

        await appBootstrap();
      } catch (err) {
        console.error("Bootstrap failed:", err);

        // server unreachable
        navigate("/server-unavailable", { replace: true });
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [navigate]);

  return loading;
}
