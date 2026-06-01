'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import ContentCard from '@/components/ui/ContentCard'

export interface CarouselItem {
  id:           string
  image?:       string | null
  title:        string
  description?: string | null
  href:         string
  badge?:       string | null
  ctaLabel?:    string
}

interface CarouselSectionProps {
  eyebrow:       string
  title:         string
  subtitle?:     string
  items:         CarouselItem[]
  viewAllHref:   string
  viewAllLabel?: string
  bg?:           'white' | 'gray'
}

export default function CarouselSection({
  eyebrow,
  title,
  subtitle,
  items,
  viewAllHref,
  viewAllLabel = 'View all',
  bg = 'white',
}: CarouselSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(false)

  const sync = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }, [])

  useEffect(() => {
    sync()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', sync, { passive: true })
    window.addEventListener('resize', sync)
    return () => {
      el.removeEventListener('scroll', sync)
      window.removeEventListener('resize', sync)
    }
  }, [sync, items])

  function scrollBy(dir: 'left' | 'right') {
    const el = trackRef.current
    if (!el) return
    const card   = el.querySelector('[data-card]') as HTMLElement | null
    const amount = (card ? card.offsetWidth + 24 : 320)
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  if (!items.length) return null

  const bgClass = bg === 'gray' ? 'bg-slate-50' : 'bg-white'

  return (
    <section className={`py-10 md:py-16 border-b border-gray-100 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7 sm:mb-10">
          <div>
            <p className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-cyan-600 mb-2">
              <span className="w-6 h-px bg-cyan-400 inline-block" />
              {eyebrow}
            </p>
            <h2 className="font-bold text-[27px] text-slate-900 leading-tight tracking-[-0.02em]">{title}</h2>
            {subtitle && (
              <p className="text-[13.5px] text-gray-500 mt-1.5 max-w-md">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0 sm:ml-6">
            {/* Prev / Next */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollBy('left')}
                disabled={!canLeft}
                aria-label="Previous"
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${canLeft
                    ? 'border-gray-200 text-gray-500 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                    : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                onClick={() => scrollBy('right')}
                disabled={!canRight}
                aria-label="Next"
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${canRight
                    ? 'border-gray-200 text-gray-500 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                    : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>

            <Link
              href={viewAllHref}
              className="group inline-flex items-center gap-1.5 text-[13px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors whitespace-nowrap"
            >
              {viewAllLabel}
              <ArrowRight
                size={13}
                strokeWidth={2.5}
                className="group-hover:translate-x-0.5 transition-transform duration-150"
              />
            </Link>
          </div>
        </div>

        {/* Scroll track + edge fades */}
        <div className="relative">
          {/* Left fade */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none
              bg-gradient-to-r ${bg === 'gray' ? 'from-slate-50' : 'from-white'} to-transparent
              transition-opacity duration-200 ${canLeft ? 'opacity-100' : 'opacity-0'}`}
          />
          {/* Right fade */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none
              bg-gradient-to-l ${bg === 'gray' ? 'from-slate-50' : 'from-white'} to-transparent
              transition-opacity duration-200 ${canRight ? 'opacity-100' : 'opacity-0'}`}
          />

          <div
            ref={trackRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-2"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {items.map((item, i) => (
              <div
                key={item.id}
                data-card
                className="flex-shrink-0 w-[272px] sm:w-[296px] lg:w-[316px]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <ContentCard
                  image={item.image}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  badge={item.badge}
                  ctaLabel={item.ctaLabel}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
