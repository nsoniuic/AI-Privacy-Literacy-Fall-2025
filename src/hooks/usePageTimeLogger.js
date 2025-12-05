import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { logPageVisit } from "../services/loggingService";

export function usePageTimeLogger() {
  const location = useLocation();
  const pageEntryTime = useRef(Date.now());

  useEffect(() => {
    const entryTime = Date.now();
    pageEntryTime.current = entryTime;

    return () => {
      const exitTime = Date.now();
      const duration = exitTime - pageEntryTime.current;

      logPageVisit({
        page: location.pathname,
        durationMs: duration,
      });
    };
  }, [location.pathname]);
}
