'use client'
import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    /* scroll exactly one card width + gap */
    const card = el.querySelector('[data-card]') as HTMLElement | null
    const gap  = 32
    const amount = (card ? card.offsetWidth + gap : 340)
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  if (!items.length) return null

  return (
    <section className={`py-14 ${bg === 'gray' ? 'bg-[#fafafa]' : 'bg-white'} border-b border-gray-100`}>
      <div className="max-w-7xl mx-auto px-8">

        {/* Header row */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold text-cyan-500 uppercase tracking-widest mb-1">
              {eyebrow}
            </p>
            <h2 className="text-[26px] font-bold text-gray-900 leading-tight">{title}</h2>
            {subtitle && (
              <p className="text-[13.5px] text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollBy('left')}
                disabled={!canLeft}
                aria-label="Previous"
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors
                  ${canLeft
                    ? 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                    : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                <ChevronLeft size={15} strokeWidth={2} />
              </button>
              <button
                onClick={() => scrollBy('right')}
                disabled={!canRight}
                aria-label="Next"
                className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors
                  ${canRight
                    ? 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                    : 'border-gray-100 text-gray-300 cursor-not-allowed'}`}
              >
                <ChevronRight size={15} strokeWidth={2} />
              </button>
            </div>
            <Link
              href={viewAllHref}
              className="text-[13px] font-medium text-cyan-500 hover:text-cyan-600 transition-colors whitespace-nowrap"
            >
              {viewAllLabel} →
            </Link>
          </div>
        </div>

        {/* Scrollable track */}
        <div
          ref={trackRef}
          className="flex gap-8 overflow-x-auto scroll-smooth"
          style={{
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              data-card
              className="flex-shrink-0 w-[280px] sm:w-[300px] lg:w-[340px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ContentCard
                image={item.image}
                title={item.title}
                description={item.description}
                href={item.href}
                badge={item.badge}
                ctaLabel={item.ctaLabel}
                active={i % 3 === 1}
              />
            </div>
          ))}
        </div>

      </div>

      {/* Hide scrollbar in WebKit */}
      <style>{`
        [data-carousel-track]::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
