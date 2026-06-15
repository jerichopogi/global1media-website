import { useEffect, useState } from "react";

/**
 * Returns the current time, re-rendering on a fixed interval so time-based UI
 * (like the on-air schedule) stays live without manual refresh.
 */
export function useNow(intervalMs = 30_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
