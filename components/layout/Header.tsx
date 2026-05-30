'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

interface HeaderProps {
  darulQuranUrl?: string
  siteName?: string
  logoUrl?: string | null
}

const NAV_LINKS = [
  { label: 'Online Classes', href: '/online-courses' },
  { label: 'Services',       href: '/services' },
  { label: 'Articles',       href: '/articles' },
  { label: 'Donate',         href: '/donate' },
  { label: 'About',          href: '/about' },
]

export default function Header({ darulQuranUrl, siteName = 'Aabtaab', logoUrl }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery]       = useState('')
  const pathname = usePathname()
  const router   = useRouter()

  const navLinks = [
    ...NAV_LINKS,
    { label: 'Dar ul Quran', href: darulQuranUrl || '#', external: true },
  ]

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/articles?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center gap-6">

        {/* ── Logo ── */}
        <Link href="/" className="flex-shrink-0">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={siteName}
              width={58}
              height={58}
              className="rounded-full object-cover border-2 border-cyan-400"
            />
          ) : (
            <div className="w-[58px] h-[58px] rounded-full border-2 border-cyan-400 bg-gradient-to-b from-sky-100 to-blue-200 flex items-center justify-center text-2xl select-none shadow-inner">
              ⛵
            </div>
          )}
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
          {navLinks.map(({ label, href, external }: any) => {
            const isActive =
              href !== '#' &&
              (pathname === href || (href !== '/' && pathname.startsWith(href + '/')))
            return (
              <Link
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={`text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-cyan-500'
                    : 'text-gray-800 hover:text-cyan-500'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* ── Search (desktop) ── */}
        <form onSubmit={handleSearch} className="hidden lg:flex items-center ml-auto">
          <div className="flex items-center border border-cyan-400 rounded-full overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="px-4 py-[7px] text-sm outline-none w-36 text-gray-700 placeholder:text-gray-400 bg-white"
            />
            <button
              type="submit"
              aria-label="Search"
              className="bg-cyan-500 hover:bg-cyan-600 transition-colors h-full px-3 py-[7px] flex items-center"
            >
              <Search size={15} className="text-white" strokeWidth={2.5} />
            </button>
          </div>
        </form>

        {/* ── Mobile hamburger ── */}
        <button
          className="lg:hidden ml-auto p-1.5 text-gray-700 hover:text-cyan-500 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-6 pb-4 shadow-md">
          {navLinks.map(({ label, href, external }: any) => {
            const isActive =
              href !== '#' &&
              (pathname === href || (href !== '/' && pathname.startsWith(href + '/')))
            return (
              <Link
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className={`block py-3 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${
                  isActive ? 'text-cyan-500' : 'text-gray-800 hover:text-cyan-500'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            )
          })}
          <form onSubmit={handleSearch} className="mt-4 flex items-center border border-cyan-400 rounded-full overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="flex-1 px-4 py-2 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-white"
            />
            <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 px-3 py-2 transition-colors">
              <Search size={15} className="text-white" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      )}
    </header>
  )
}
