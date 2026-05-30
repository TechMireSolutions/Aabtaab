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
  const [menuOpen, setMenuOpen]           = useState(false)
  const [query, setQuery]                 = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
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
      setMenuOpen(false)
    }
  }

  return (
    <>
      {/* ── Desktop & tablet header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center gap-10">

          {/* Logo */}
          <Link href="/" aria-label={siteName} className="flex-shrink-0">
            <div className="w-[54px] h-[54px] rounded-full overflow-hidden border-2 border-cyan-400">
              {logoUrl
                ? <Image src={logoUrl} alt={siteName} width={54} height={54} className="object-cover w-full h-full" />
                : <div className="w-full h-full bg-sky-50 flex items-center justify-center text-xl select-none">⛵</div>}
            </div>
          </Link>

          {/* Nav — desktop only */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-8">
            {navLinks.map(({ label, href, external }: any) => {
              const isActive = href !== '#' &&
                (pathname === href || (href !== '/' && pathname.startsWith(href + '/')))
              return (
                <Link
                  key={label}
                  href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={`text-[14px] font-medium whitespace-nowrap transition-colors duration-150
                    ${isActive ? 'text-cyan-500' : 'text-gray-700 hover:text-gray-950'}`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Search — desktop only */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center ml-auto">
            <div className={`flex items-center rounded-full overflow-hidden border transition-colors duration-150
              ${searchFocused ? 'border-cyan-500' : 'border-gray-300 hover:border-cyan-400'}`}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search"
                className="px-4 py-[7px] text-[13px] outline-none w-[140px] text-gray-700 placeholder:text-gray-400 bg-white"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-cyan-500 hover:bg-cyan-600 transition-colors px-3 py-[7px] flex items-center self-stretch"
              >
                <Search size={14} className="text-white" strokeWidth={2.5} />
              </button>
            </div>
          </form>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-auto p-2 text-gray-600 hover:text-gray-900 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

        </div>
      </header>

      {/* ══════════════════════════════════════
          Full-screen mobile menu
      ══════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 lg:hidden
          transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Panel */}
      <div className={`fixed inset-0 z-[70] bg-white lg:hidden flex flex-col
        transition-transform duration-300 ease-in-out
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Panel top bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-cyan-400">
              {logoUrl
                ? <Image src={logoUrl} alt={siteName} width={48} height={48} className="object-cover w-full h-full" />
                : <div className="w-full h-full bg-sky-50 flex items-center justify-center text-xl select-none">⛵</div>}
            </div>
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile nav links */}
        <nav className="flex-1 overflow-y-auto px-6 py-2">
          {navLinks.map(({ label, href, external }: any) => {
            const isActive = href !== '#' &&
              (pathname === href || (href !== '/' && pathname.startsWith(href + '/')))
            return (
              <Link
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`block py-4 text-[15px] font-medium border-b border-gray-100 last:border-0 transition-colors
                  ${isActive ? 'text-cyan-500' : 'text-gray-800 hover:text-cyan-500'}`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile search */}
        <div className="px-6 pb-10 pt-4 border-t border-gray-100 flex-shrink-0">
          <form onSubmit={handleSearch}
            className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:border-cyan-500 transition-colors">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="flex-1 px-5 py-3 text-[14px] outline-none text-gray-700 placeholder:text-gray-400 bg-white"
            />
            <button type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 transition-colors px-4 py-3 flex items-center self-stretch">
              <Search size={15} className="text-white" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
