import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface ContentCardProps {
  image?:       string | null
  title:        string
  description?: string | null
  href:         string
  ctaLabel?:    string
  badge?:       string | null
  active?:      boolean
}

export default function ContentCard({
  image,
  title,
  description,
  href,
  ctaLabel = 'Book Now',
  badge,
  active = false,
}: ContentCardProps) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:shadow-card-hover
        ${active
          ? 'shadow-[0_2px_16px_rgba(8,145,178,0.14)] border border-cyan-200/80'
          : 'shadow-card border border-gray-100'
        }`}
    >
      {/* Active top accent stripe */}
      {active && (
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-cyan-400 via-cyan-500 to-sky-400 z-10" />
      )}

      {/* Image */}
      <Link href={href} className="block overflow-hidden shrink-0">
        <div className="relative w-full aspect-[3/2] bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 via-sky-50 to-slate-100">
              <span className="text-5xl opacity-25 select-none">📖</span>
            </div>
          )}
          {/* Hover dim overlay */}
          <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 px-4 pt-4 pb-5">
        {badge && (
          <span className="w-fit text-[10px] font-bold uppercase tracking-[0.12em] text-cyan-700 bg-cyan-50 border border-cyan-100/80 rounded-full px-2.5 py-0.5 mb-3">
            {badge}
          </span>
        )}

        <h3 className="font-semibold text-slate-900 text-[15px] leading-snug mb-2 line-clamp-2">
          <Link href={href} className="hover:text-cyan-600 transition-colors duration-150">
            {title}
          </Link>
        </h3>

        {description && (
          <p className="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
            {description}
          </p>
        )}

        {/* CTA */}
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1 text-[12.5px] font-semibold text-cyan-600 hover:text-cyan-700 pt-0.5 group/cta"
        >
          {ctaLabel}
          <ArrowUpRight
            size={12}
            strokeWidth={2.5}
            className="transition-transform duration-200 group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
          />
        </Link>
      </div>
    </div>
  )
}
