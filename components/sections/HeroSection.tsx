'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface HeroSectionProps {
  subtitle?:   string
  title?:      string
  description?: string
  heroImage?:  string | null
  cta1Label?:  string
  cta1Link?:   string
  cta2Label?:  string
  cta2Link?:   string
}

const DEFAULT_LINES = ['Learn Quran, Fiqh &', 'More From Shia', 'Scholars.']

const STATS = [
  { value: '500+', label: 'Students' },
  { value: '20+',  label: 'Courses'  },
  { value: '10+',  label: 'Scholars' },
]

export default function HeroSection({
  subtitle   = 'Aabtaab – Faith. Knowledge. Access.',
  title,
  description = 'At Aabtaab, we bring accessible and affordable Shia Islamic education to everyone, no matter where you are in the world.',
  heroImage,
  cta1Label  = 'Explore Courses',
  cta1Link   = '/online-courses',
  cta2Label  = 'Our Services',
  cta2Link   = '/services',
}: HeroSectionProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setShow(true), 60)
    return () => clearTimeout(id)
  }, [])

  /* Shared animation builder — returns a style object */
  function a(delay: number, axis: 'y' | 'x' = 'y', distance = 20): React.CSSProperties {
    const translate = axis === 'y'
      ? `translateY(${show ? 0 : distance}px)`
      : `translateX(${show ? 0 : distance}px)`
    return {
      opacity:    show ? 1 : 0,
      transform:  show ? 'none' : translate,
      transition: `opacity 0.55s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
    }
  }

  const titleLines = title ? title.split('\n') : DEFAULT_LINES

  return (
    <section className="relative w-full bg-white overflow-hidden" style={{ minHeight: 580 }}>

      {/* ── Right-side image ── */}
      <div
        className="absolute right-0 top-0 h-full w-[58%] pointer-events-none select-none"
        style={a(0, 'x', 40)}
      >
        {heroImage ? (
          <Image
            src={heroImage}
            alt="Hero"
            fill
            priority
            className="object-cover object-left-top"
          />
        ) : (
          /* Placeholder when no Sanity image is set */
          <div className="w-full h-full bg-gradient-to-br from-slate-100 via-slate-50 to-white" />
        )}
        {/* Fade the image into the white background on the left */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/55 to-transparent" />
        {/* Subtle bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent" />
      </div>

      {/* ── Content ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-8 lg:px-14"
        style={{ minHeight: 580, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 88, paddingBottom: 88 }}
      >
        <div style={{ maxWidth: 510 }}>

          {/* Live enrollment badge */}
          <div style={a(0)} className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-3 py-[5px] mb-6">
            <span className="w-[7px] h-[7px] rounded-full bg-green-500 animate-pulse flex-shrink-0" />
            <span className="text-[11px] font-medium text-gray-500 tracking-[0.04em]">Enrolling Now</span>
          </div>

          {/* Subtitle */}
          <p style={a(80)} className="text-[13px] text-gray-400 mb-4 tracking-wide">
            {subtitle}
          </p>

          {/* Headline — lines stagger in */}
          <h1
            className="font-bold text-gray-900 leading-[1.07] tracking-tight mb-6"
            style={{ fontSize: 'clamp(34px, 3.8vw, 52px)' }}
          >
            {titleLines.map((line, i) => (
              <span key={i} style={a(160 + i * 80)} className="block">
                {line}
              </span>
            ))}
          </h1>

          {/* Description */}
          <p style={{ ...a(400), maxWidth: 390 }} className="text-[14px] text-gray-500 leading-[1.75] mb-8">
            {description}
          </p>

          {/* CTA row */}
          <div style={a(480)} className="flex items-center gap-3 flex-wrap">
            <Link
              href={cta1Link}
              className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-[13.5px] font-medium px-6 py-[10px] rounded-full transition-colors duration-150"
            >
              {cta1Label}
              <ArrowRight size={13} strokeWidth={2.5} />
            </Link>
            <Link
              href={cta2Link}
              className="inline-flex items-center text-[13.5px] font-medium text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-6 py-[10px] rounded-full transition-colors duration-150"
            >
              {cta2Label}
            </Link>
          </div>

          {/* Stats */}
          <div style={a(580)} className="flex items-center gap-8 mt-10 pt-8 border-t border-gray-100">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-[20px] font-bold text-gray-900 leading-none">{value}</p>
                <p className="text-[11.5px] text-gray-400 mt-1 tracking-wide">{label}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
