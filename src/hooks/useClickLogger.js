import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logClick } from "../services/loggingService";

export function useClickLogger() {
  const location = useLocation();

  useEffect(() => {
    const handleClick = (event) => {
      const target = event.target;

      const clickData = {
        element: target.tagName,
        className: target.className,
        id: target.id,
        text: target.textContent?.slice(0, 50),
        page: location.pathname,
      };

      logClick(clickData);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [location.pathname]);
}
