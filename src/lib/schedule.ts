import { SCHEDULE_TZ, type Show } from "@/data/schedule";

/**
 * Time helpers for the on-air schedule. All reasoning is done in minutes from
 * local midnight in SCHEDULE_TZ, with weekday-aware handling for shows that
 * run past midnight.
 */

const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MINUTES_PER_DAY = 1440;

export type Clock = {
  /** 0=Sun … 6=Sat in SCHEDULE_TZ. */
  weekday: number;
  /** Minutes since local midnight in SCHEDULE_TZ. */
  minutes: number;
};

export type AiringNow = {
  show: Show;
  /** Minutes the show has been on air. */
  elapsed: number;
  /** Total run length in minutes. */
  duration: number;
};

export type UpNext = {
  show: Show;
  /** Minutes until it starts. */
  inMinutes: number;
};

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/** Run length in minutes; end <= start means the show crosses midnight. */
export function durationOf(show: Show): number {
  const start = toMinutes(show.start);
  const end = toMinutes(show.end);
  return end > start ? end - start : end + MINUTES_PER_DAY - start;
}

/** Read the current wall clock in SCHEDULE_TZ from a Date. */
export function clockInTz(date: Date): Clock {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_TZ,
    hourCycle: "h23",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const weekday = WEEKDAY_NAMES.indexOf(get("weekday"));
  const hour = parseInt(get("hour"), 10) % 24;
  const minute = parseInt(get("minute"), 10);
  return { weekday, minutes: hour * 60 + minute };
}

/**
 * The show currently on air for a given set, or null. When windows overlap
 * (messy source data), the most recently started show wins.
 */
export function airingNow(shows: Show[], clock: Clock): AiringNow | null {
  let best: AiringNow | null = null;
  let bestStartAbs = -Infinity;

  for (const show of shows) {
    const duration = durationOf(show);
    const startOfDay = toMinutes(show.start);

    // A show may have started today or up to 2 days ago (covers >24h windows).
    for (let daysAgo = 0; daysAgo <= 2; daysAgo++) {
      const startWeekday = (clock.weekday - daysAgo + 7) % 7;
      if (!show.days.includes(startWeekday)) continue;

      const startAbs = startOfDay - daysAgo * MINUTES_PER_DAY;
      const elapsed = clock.minutes - startAbs;
      if (elapsed >= 0 && elapsed < duration && startAbs > bestStartAbs) {
        bestStartAbs = startAbs;
        best = { show, elapsed, duration };
      }
    }
  }

  return best;
}

/** The soonest upcoming show for a set, looking up to a week ahead. */
export function upNext(shows: Show[], clock: Clock): UpNext | null {
  let best: UpNext | null = null;
  let bestDelta = Infinity;

  for (const show of shows) {
    const startOfDay = toMinutes(show.start);
    for (let daysAhead = 0; daysAhead <= 7; daysAhead++) {
      const startWeekday = (clock.weekday + daysAhead) % 7;
      if (!show.days.includes(startWeekday)) continue;

      const startAbs = startOfDay + daysAhead * MINUTES_PER_DAY;
      const delta = startAbs - clock.minutes;
      if (delta > 0 && delta < bestDelta) {
        bestDelta = delta;
        best = { show, inMinutes: delta };
      }
    }
  }

  return best;
}

/** "14:00" → "2:00 PM" */
export function to12Hour(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

/** "10:00" + "14:00" → "10:00 AM – 2:00 PM" */
export function formatRange(start: string, end: string): string {
  return `${to12Hour(start)} – ${to12Hour(end)}`;
}

/** Friendly "in 25 min" / "in 2 hr 5 min". */
export function formatCountdown(minutes: number): string {
  if (minutes < 60) return `in ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `in ${h} hr` : `in ${h} hr ${m} min`;
}

/** Current time label in SCHEDULE_TZ, e.g. "3:42 PM PT". */
export function tzTimeLabel(date: Date): string {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: SCHEDULE_TZ,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return `${time} PT`;
}
