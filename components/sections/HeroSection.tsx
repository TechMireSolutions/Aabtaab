"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Users, BookOpen, GraduationCap } from "lucide-react";

interface HeroSectionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  heroImage?: string | null;
  cta1Label?: string;
  cta1Link?: string;
  cta2Label?: string;
  cta2Link?: string;
}

const DEFAULT_LINES = ["Learn Quran, Fiqh &", "More From Shia", "Scholars."];

const STATS = [
  { value: "500+", label: "Students", Icon: Users },
  { value: "20+", label: "Courses", Icon: BookOpen },
  { value: "10+", label: "Scholars", Icon: GraduationCap },
];

export default function HeroSection({
  subtitle = "Aabtaab — Faith. Knowledge. Access.",
  title,
  description = "At Aabtaab, we bring accessible and affordable Shia Islamic education to everyone, no matter where you are in the world.",
  heroImage,
  cta1Label = "Explore Courses",
  cta1Link = "/online-courses",
  cta2Label = "Our Services",
  cta2Link = "/services",
}: HeroSectionProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 80);
    return () => clearTimeout(id);
  }, []);

  function a(delay: number, dist = 20): React.CSSProperties {
    return {
      opacity: show ? 1 : 0,
      transform: show ? "none" : `translateY(${dist}px)`,
      transition: `opacity 0.65s ease ${delay}ms, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
    };
  }

  const titleLines = title ? title.split("\n") : DEFAULT_LINES;

  return (
    <section className="relative w-full bg-white overflow-hidden min-h-[480px] md:min-h-[600px]">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #dde5ef 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.5,
        }}
      />

      {/* Soft cyan glow */}
      <div
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(8,145,178,0.05) 0%, transparent 65%)",
        }}
      />

      {/* Hero image — full bg on mobile, right-panel on md+ */}
      <div
        className="absolute inset-0 md:inset-auto md:right-0 md:top-0 md:h-full md:w-[55%] pointer-events-none select-none"
        style={{ opacity: show ? 1 : 0, transition: "opacity 1s ease 100ms" }}
      >
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Hero"
            fill
            sizes="(max-width: 768px) 100vw, 55vw"
            priority
            className="object-cover object-center md:object-left-top"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-slate-100 via-cyan-50/20 to-white" />
        )}
        {/* Mobile overlay — keeps text readable over the full-bleed image */}
        <div className="absolute inset-0 bg-white/90 md:hidden" />
        <div className="absolute inset-0 bg-linear-to-b from-white/60 via-transparent to-white/80 md:hidden" />
        {/* Desktop overlays */}
        <div className="absolute inset-0 hidden md:block bg-linear-to-r from-white via-white/55 to-transparent" />
        <div className="absolute inset-0 hidden md:block bg-linear-to-t from-white/15 to-transparent" />
      </div>

      {/* Content */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 flex flex-col justify-center
        min-h-[480px] md:min-h-[600px] pt-12 pb-12 md:pt-[90px] md:pb-[90px]"
      >
        <div className="w-full md:max-w-[520px]">
          {/* Badge */}
          <div
            style={a(0)}
            className="inline-flex items-center gap-2 mb-5 bg-white border border-gray-200 shadow-sm rounded-full px-3.5 py-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-[11px] font-semibold text-gray-600 tracking-wide">
              Enrolling Now
            </span>
          </div>

          {/* Kicker */}
          <p
            style={a(80)}
            className="text-[11px] sm:text-[11.5px] font-semibold text-gray-400 uppercase tracking-[0.15em] mb-4"
          >
            {subtitle}
          </p>

          {/* Headline */}
          <h1
            className="mb-4"
            style={{
              fontSize: "clamp(30px, 5vw, 52px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
            }}
          >
            {titleLines.map((line, i) => (
              <span key={i} style={{ ...a(140 + i * 80), display: "block" }}>
                {i === titleLines.length - 1 ? (
                  <span style={{ color: "#0891b2" }}>{line}</span>
                ) : (
                  <span style={{ color: "#0f172a" }}>{line}</span>
                )}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p
            style={a(380)}
            className="text-[13.5px] sm:text-[14px] text-gray-500 leading-[1.8] mb-7 max-w-[400px]"
          >
            {description}
          </p>

          {/* CTAs */}
          <div style={a(450)} className="flex items-center gap-3 flex-wrap">
            <Link
              href={cta1Link}
              className="group inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-[13px] sm:text-[13.5px] font-semibold px-5 sm:px-6 py-2.5 rounded-full
                shadow-[0_4px_16px_rgba(8,145,178,0.35)] hover:shadow-[0_6px_24px_rgba(8,145,178,0.5)]
                transition-all duration-200 hover:-translate-y-px"
            >
              {cta1Label}
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform duration-150"
              />
            </Link>
            <Link
              href={cta2Link}
              className="inline-flex items-center text-[13px] sm:text-[13.5px] font-medium text-slate-700 hover:text-slate-900
                border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50
                px-5 sm:px-6 py-2.5 rounded-full transition-all duration-200"
            >
              {cta2Label}
            </Link>
          </div>

          {/* Stats */}
          <div
            style={a(550)}
            className="flex items-center gap-5 sm:gap-6 mt-8 pt-7 border-t border-gray-100 flex-wrap"
          >
            {STATS.map(({ value, label, Icon }) => (
              <div key={label} className="flex items-center gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
                  <Icon
                    size={14}
                    className="text-cyan-600"
                    strokeWidth={1.75}
                  />
                </div>
                <div>
                  <p
                    className="text-[16px] sm:text-[17px] font-bold leading-none tracking-tight"
                    style={{ color: "#0f172a" }}
                  >
                    {value}
                  </p>
                  <p className="text-[10px] sm:text-[10.5px] text-gray-400 mt-0.5">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
