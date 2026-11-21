import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document
      .querySelectorAll("[data-route-scroll-container]")
      .forEach((container) => {
        container.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
  }, [location.key, location.hash]);

  return <Outlet />;
};

export default ScrollToTop;
