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

  const Logo = ({ size = 54, onClick }: { size?: number; onClick?: () => void }) => (
    <Link href="/" aria-label={siteName} onClick={onClick}
      className="flex-shrink-0 group">
      <div
        style={{ width: size, height: size }}
        className={`rounded-full overflow-hidden ring-2 ring-cyan-400 ring-offset-2
          group-hover:ring-cyan-500 group-hover:ring-offset-[3px]
          transition-all duration-200 ease-out
          ${!logoUrl ? 'bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center text-2xl select-none' : ''}`}
      >
        {logoUrl
          ? <Image src={logoUrl} alt={siteName} width={size} height={size} className="object-cover w-full h-full" />
          : '⛵'}
      </div>
    </Link>
  )

  return (
    <>
      {/* ── Brand accent strip ── */}
      <div className="h-[3px] bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400 sticky top-0 z-50" />

      {/* ── Main header bar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-[3px] z-50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-8 h-[68px] flex items-center gap-10">

          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-0">
            {navLinks.map(({ label, href, external }: any) => {
              const isActive = href !== '#' && (pathname === href || (href !== '/' && pathname.startsWith(href + '/')))
              return (
                <Link key={label} href={href}
                  target={external ? '_blank' : undefined}
                  rel={external ? 'noopener noreferrer' : undefined}
                  className={`relative px-[18px] py-[22px] text-[13.5px] font-medium tracking-[0.015em]
                    transition-colors duration-150 group/nav whitespace-nowrap
                    ${isActive ? 'text-cyan-500' : 'text-gray-700 hover:text-gray-950'}`}
                >
                  {label}
                  <span className={`absolute bottom-[10px] left-[18px] right-[18px] h-[2px] rounded-full bg-cyan-500
                    transition-all duration-200 origin-left
                    ${isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover/nav:scale-x-100 group-hover/nav:opacity-100'}`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden lg:block ml-auto">
            <div className={`flex items-center rounded-full overflow-hidden border transition-all duration-200
              ${searchFocused
                ? 'border-cyan-500 shadow-[0_0_0_3px_rgba(6,182,212,0.18)]'
                : 'border-cyan-400 hover:border-cyan-500'}`}>
              <input type="text" value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search"
                className="px-4 py-[7px] text-[13px] outline-none w-[148px] text-gray-700 placeholder:text-gray-400 bg-white"
              />
              <button type="submit" aria-label="Search"
                className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 transition-colors px-[11px] py-[7px] flex items-center self-stretch">
                <Search size={14} className="text-white" strokeWidth={2.5} />
              </button>
            </div>
          </form>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden ml-auto p-1.5 rounded-lg text-gray-600 hover:text-cyan-500 hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          Full-screen mobile overlay
          Always in DOM — CSS transitions handle open/close
      ══════════════════════════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] lg:hidden
          transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Slide-in panel */}
      <div
        className={`fixed inset-0 z-[70] bg-white lg:hidden flex flex-col
          transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Top cyan accent */}
        <div className="h-[3px] bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400 flex-shrink-0" />

        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <Logo size={48} onClick={() => setMenuOpen(false)} />
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          {navLinks.map(({ label, href, external }: any, i: number) => {
            const isActive = href !== '#' && (pathname === href || (href !== '/' && pathname.startsWith(href + '/')))
            return (
              <Link
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                onClick={() => setMenuOpen(false)}
                style={{ transitionDelay: menuOpen ? `${i * 40}ms` : '0ms' }}
                className={`flex items-center gap-4 py-4 border-b border-gray-100 last:border-0
                  text-[16px] font-medium tracking-[0.01em]
                  transition-all duration-200
                  ${isActive ? 'text-cyan-500' : 'text-gray-800 hover:text-cyan-500'}
                  ${menuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}
              >
                {/* Active left indicator */}
                <span className={`w-[3px] h-5 rounded-full flex-shrink-0 transition-colors duration-200
                  ${isActive ? 'bg-cyan-500' : 'bg-gray-200 group-hover:bg-cyan-300'}`}
                />
                {label}
                {external && (
                  <span className="ml-auto text-[10px] font-normal text-gray-400 tracking-wider uppercase">External</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Search at bottom */}
        <div className="px-6 pt-4 pb-10 border-t border-gray-100 flex-shrink-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Search</p>
          <form onSubmit={handleSearch}
            className="flex items-center border border-cyan-400 rounded-full overflow-hidden
              focus-within:border-cyan-500 focus-within:shadow-[0_0_0_3px_rgba(6,182,212,0.15)]
              transition-all duration-200">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="flex-1 px-5 py-3 text-[14px] outline-none text-gray-700 placeholder:text-gray-400 bg-white"
            />
            <button type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 transition-colors px-4 py-3 flex items-center self-stretch">
              <Search size={15} className="text-white" strokeWidth={2.5} />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
