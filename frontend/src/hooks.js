import { useEffect, useState, useRef } from "react";
import { getRegistrationWindow } from "./api";

function breakdown(ms) {
  const c = Math.max(ms, 0);
  return {
    days: Math.floor(c / 86400000),
    hours: Math.floor((c % 86400000) / 3600000),
    mins: Math.floor((c % 3600000) / 60000),
    secs: Math.floor((c % 60000) / 1000),
  };
}

/**
 * Tracks the registration window using the BACKEND as the source of truth
 * (never trust the client clock for something a user could tamper with).
 * We fetch once, then tick locally using the offset between server time
 * and local time so the countdown stays smooth without re-fetching every second.
 */
export function useRegistrationWindow() {
  const [state, setState] = useState({ phase: "loading", days: 0, hours: 0, mins: 0, secs: 0 });
  const offsetRef = useRef(0); // serverNow - localNow, in ms
  const windowRef = useRef({ openAt: null, closeAt: null });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getRegistrationWindow();
        if (cancelled) return;
        const serverNow = new Date(data.now).getTime();
        offsetRef.current = serverNow - Date.now();
        windowRef.current = { openAt: new Date(data.openAt).getTime(), closeAt: new Date(data.closeAt).getTime() };
      } catch (e) {
        console.error("Failed to load registration window", e);
      }
    }
    load();
    const refetch = setInterval(load, 60000); // resync with server every minute

    const tick = setInterval(() => {
      const { openAt, closeAt } = windowRef.current;
      if (!openAt) return;
      const now = Date.now() + offsetRef.current;
      let phase = "open";
      if (now < openAt) phase = "upcoming";
      else if (now > closeAt) phase = "closed";
      const target = phase === "upcoming" ? openAt : closeAt;
      setState({ phase, ...breakdown(target - now) });
    }, 1000);

    return () => { cancelled = true; clearInterval(refetch); clearInterval(tick); };
  }, []);

  return state;
}
