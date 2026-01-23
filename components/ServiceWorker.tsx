"use client";

import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let reloading = false;
    let intervalId: number | null = null;

    const onControllerChange = () => {
      if (reloading) return;
      reloading = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      onControllerChange,
    );

    (async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        const maybePromptUpdate = async () => {
          const waiting = reg.waiting;
          if (!waiting) return;

          const shouldReload = window.confirm(
            "An update is available. Reload now?",
          );
          if (!shouldReload) return;

          waiting.postMessage({ type: "SKIP_WAITING" });
        };

        // Check immediately after register
        await reg.update();
        await maybePromptUpdate();

        // When a new SW is found, watch it until it reaches "installed"
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (
              installing.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              void maybePromptUpdate();
            }
          });
        });

        // Re-check when the tab becomes visible (common “premium” behavior)
        const onVisibility = () => {
          if (document.visibilityState === "visible") void reg.update();
        };
        document.addEventListener("visibilitychange", onVisibility);

        // Periodic update check (keeps installs fresh without user hard-refreshing)
        intervalId = window.setInterval(
          () => void reg.update(),
          30 * 60 * 1000,
        );

        // Cleanup visibility listener on unmount
        return () =>
          document.removeEventListener("visibilitychange", onVisibility);
      } catch {
        // ignore
      }
    })();

    return () => {
      if (intervalId) window.clearInterval(intervalId);
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        onControllerChange,
      );
    };
  }, []);

  return null;
}
