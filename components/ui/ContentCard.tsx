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
    <div className="flex flex-col">

      {/* Image */}
      <Link href={href} className="block rounded-xl overflow-hidden mb-4 bg-gray-100">
        <div className="relative w-full aspect-[4/3]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-4xl select-none">
              📖
            </div>
          )}
        </div>
      </Link>

      {/* Badge */}
      {badge && (
        <span className="text-[11px] font-semibold uppercase tracking-widest text-cyan-500 mb-1">
          {badge}
        </span>
      )}

      {/* Title */}
      <h3 className="font-bold text-gray-900 text-[17px] leading-snug mb-2">
        <Link href={href} className="hover:text-cyan-600 transition-colors duration-150">
          {title}
        </Link>
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[13.5px] text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
          {description}
        </p>
      )}

      {/* CTA */}
      <div className="mt-auto pt-1">
        <Link
          href={href}
          className={`inline-flex items-center gap-2 px-4 py-[9px] rounded-lg text-[13px] font-medium transition-colors duration-150
            ${active
              ? 'bg-cyan-500 text-white hover:bg-cyan-600'
              : 'border border-gray-300 text-gray-700 hover:bg-cyan-500 hover:text-white hover:border-cyan-500'
            }`}
        >
          {ctaLabel}
          <ArrowUpRight size={13} strokeWidth={2.5} />
        </Link>
      </div>

    </div>
  )
}
