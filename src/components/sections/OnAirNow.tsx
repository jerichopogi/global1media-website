import { useMemo } from "react";
import { Section, SectionHead } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { useNow } from "@/hooks/useNow";
import {
  scheduleStations,
  shows,
  type ScheduleStation,
  type Show,
} from "@/data/schedule";
import {
  airingNow,
  clockInTz,
  formatCountdown,
  formatRange,
  tzTimeLabel,
  upNext,
  type AiringNow,
  type UpNext,
} from "@/lib/schedule";

/** Animated "live" equalizer — irregular bar timing reads like a real meter. */
const EQ_BARS: Array<[number, number, number]> = [
  [60, 0.9, 0],
  [100, 1.3, 0.15],
  [45, 0.7, 0.05],
  [80, 1.1, 0.25],
];

function Equalizer() {
  return (
    <span aria-hidden className="flex h-3 items-end gap-[2px]">
      {EQ_BARS.map(([h, dur, delay], i) => (
        <span
          key={i}
          className="w-[2px] rounded-full bg-accent"
          style={{
            height: `${h}%`,
            transformOrigin: "bottom",
            animation: `eq-bounce ${dur}s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </span>
  );
}

type StationState = {
  station: ScheduleStation;
  current: AiringNow | null;
  next: UpNext | null;
};

function StationCard({ state, index }: { state: StationState; index: number }) {
  const { station, current, next } = state;
  const progress = current
    ? Math.min(100, (current.elapsed / current.duration) * 100)
    : 0;

  return (
    <Reveal delay={index * 60}>
      <a
        href={station.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`card-surface group flex h-full flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
          current ? "hover:border-brand-bright/60" : "opacity-85 hover:opacity-100"
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-bg/60 p-1.5 ring-1 ring-line">
            {station.logo ? (
              <img
                src={station.logo}
                alt=""
                loading="lazy"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-sm font-extrabold text-brand-bright">
                {station.name.slice(0, 2)}
              </span>
            )}
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-bold leading-tight">{station.name}</h3>
            {station.frequency && (
              <span className="text-xs font-semibold text-dim">
                {station.frequency} FM
              </span>
            )}
          </div>

          {current ? (
            <span className="ml-auto inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
              <Equalizer />
              Live
            </span>
          ) : (
            <span className="ml-auto text-[10px] font-bold uppercase tracking-[0.18em] text-dim">
              Off air
            </span>
          )}
        </div>

        <div className="mt-5 flex-1 border-t border-line pt-5">
          {current ? (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                Now playing
              </p>
              <p className="mt-1 text-lg font-bold leading-snug tracking-tight">
                {current.show.title}
              </p>
              <p className="mt-0.5 text-sm text-dim">
                {formatRange(current.show.start, current.show.end)}
              </p>
              <div
                className="mt-4 h-1 w-full overflow-hidden rounded-full bg-line"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span
                  className="block h-full rounded-full bg-gradient-to-r from-brand to-brand-bright transition-[width] duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-dim">
                Automated music
              </p>
              {next && (
                <p className="mt-2 text-sm leading-snug">
                  <span className="font-semibold text-muted">Up next:</span>{" "}
                  {next.show.title}
                  <span className="block text-dim">
                    {formatRange(next.show.start, next.show.end)} ·{" "}
                    {formatCountdown(next.inMinutes)}
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      </a>
    </Reveal>
  );
}

export function OnAirNow() {
  const now = useNow(30_000);

  // Group shows by station once — the data never changes at runtime.
  const showsByStation = useMemo(() => {
    const map: Record<string, Show[]> = {};
    for (const show of shows) (map[show.station] ??= []).push(show);
    return map;
  }, []);

  const clock = clockInTz(now);
  const states: StationState[] = scheduleStations.map((station) => {
    const list = showsByStation[station.key] ?? [];
    return {
      station,
      current: airingNow(list, clock),
      next: upNext(list, clock),
    };
  });

  // Surface live stations first.
  const ordered = [...states].sort(
    (a, b) => Number(Boolean(b.current)) - Number(Boolean(a.current)),
  );
  const liveCount = states.filter((s) => s.current).length;

  return (
    <Section id="on-air" className="bg-bg-deep/40">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          eyebrow="Live Schedule"
          title="On the air right now"
          description="A real-time look at what's playing across our stations — updated to the minute, on local Pacific time."
        />
        <Reveal className="mb-[clamp(2.5rem,1.5rem+3vw,4.5rem)]">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm backdrop-blur">
            <span
              className="h-2 w-2 rounded-full bg-accent"
              style={{ animation: "pulse-ring 2.4s ease-out infinite" }}
            />
            <span className="font-semibold text-ink">{liveCount} live</span>
            <span className="text-dim">· {tzTimeLabel(now)}</span>
          </span>
        </Reveal>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {ordered.map((state, i) => (
          <StationCard key={state.station.key} state={state} index={i} />
        ))}
      </div>
    </Section>
  );
}
