"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import type { EventSummary } from "@/types/event";

interface EventsCountdownProps {
  events?: EventSummary[] | null;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeRemaining(targetDate: string): TimeRemaining {
  const total = Date.parse(targetDate) - Date.now();
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds, total };
}

export default function EventsCountdown({ events }: EventsCountdownProps) {
  const [mounted, setMounted] = useState(false);
  const [nextEvent, setNextEvent] = useState<EventSummary | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    const found = (events ?? []).find(
      (event) => Date.parse(event.startDate) > Date.now()
    ) || null;
    
    setNextEvent(found);

    if (!found) return;

    setTimeLeft(calculateTimeRemaining(found.startDate));

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(found.startDate);
      setTimeLeft(remaining);
      if (remaining.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [events]);

  if (!nextEvent) return null;

  // Format event date nicely
  const eventDate = new Date(nextEvent.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="container-page py-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-linear-to-br from-slate-900 to-slate-950 px-6 py-6 text-white sm:px-10 sm:py-8 shadow-card">
        <div className="bg-hero-glow pointer-events-none absolute -right-24 top-1/2 size-72 -translate-y-1/2 rounded-full opacity-30" />
        
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 py-1 text-2xs font-semibold uppercase tracking-wider text-gold-400">
              <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-gold-400" />
              Upcoming Event
            </div>
            
            <h3 className="mt-3.5 font-display text-xl sm:text-2xl font-bold leading-tight text-white line-clamp-1">
              {nextEvent.title}
            </h3>
            
            <div className="mt-2.5 flex flex-wrap gap-4 text-sm-plus text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-brand-400" />
                {eventDate}
              </span>
              {nextEvent.city && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-brand-400" />
                  {nextEvent.city}{nextEvent.state ? `, ${nextEvent.state}` : ""}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center shrink-0">
            {/* Timer boxes */}
            <div className="flex gap-2.5 min-h-[56px] sm:min-h-[64px]">
              {!mounted || timeLeft.total <= 0 ? (
                <>
                  {[
                    { label: "Days" },
                    { label: "Hrs" },
                    { label: "Min" },
                    { label: "Sec" },
                  ].map(({ label }) => (
                    <div
                      key={label}
                      className="flex size-14 sm:size-16 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/5 animate-pulse"
                    >
                      <span className="font-display text-lg sm:text-xl font-bold leading-none text-gold-500/20">--</span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-semibold">{label}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    { value: timeLeft.days, label: "Days" },
                    { value: timeLeft.hours, label: "Hrs" },
                    { value: timeLeft.minutes, label: "Min" },
                    { value: timeLeft.seconds, label: "Sec" },
                  ].map(({ value, label }) => (
                    <div
                      key={label}
                      className="flex size-14 sm:size-16 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xs"
                    >
                      <span className="font-display text-lg sm:text-xl font-bold leading-none text-gold-400">
                        {String(value).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 mt-1 font-semibold">
                        {label}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>

            <Link
              href={`/events/${nextEvent.slug.current}`}
              className="btn-primary group py-3 px-6 h-fit text-sm-plus font-semibold shrink-0"
            >
              Event Details
              <ArrowRight
                size={14}
                strokeWidth={2.5}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
