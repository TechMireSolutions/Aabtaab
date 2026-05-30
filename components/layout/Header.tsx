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

  const LogoMark = ({ size = 58, onClick }: { size?: number; onClick?: () => void }) => (
    <Link href="/" aria-label={siteName} onClick={onClick} className="flex-shrink-0 group">
      <div
        style={{
          width: size, height: size,
          filter: 'drop-shadow(0 4px 14px rgba(6,182,212,0.45))',
          transition: 'filter 0.2s ease',
        }}
        className="rounded-full overflow-hidden ring-[2.5px] ring-cyan-400 ring-offset-2
          group-hover:ring-cyan-500
          transition-all duration-200"
      >
        <div
          style={{ width: size, height: size }}
          className={`w-full h-full ${!logoUrl ? 'bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center text-2xl select-none' : ''}`}
        >
          {logoUrl
            ? <Image src={logoUrl} alt={siteName} width={size} height={size} className="object-cover w-full h-full" />
            : '⛵'}
        </div>
      </div>
    </Link>
  )

  return (
    <>
      {/* ════════════════════ DESKTOP HEADER ════════════════════ */}
      <div className="sticky top-0 z-50 hidden lg:block">
        <header className="bg-white shadow-[0_1px_0_0_rgba(0,0,0,0.06),0_4px_16px_rgba(0,0,0,0.07)]">
          <div className="max-w-7xl mx-auto px-8 h-[76px] flex items-center gap-8">

            {/* Logo */}
            <LogoMark size={58} />

            {/* Vertical divider */}
            <div className="w-px h-8 bg-gray-100 flex-shrink-0" />

            {/* Nav */}
            <nav className="flex flex-1 items-center justify-center gap-1">
              {navLinks.map(({ label, href, external }: any) => {
                const isActive = href !== '#' &&
                  (pathname === href || (href !== '/' && pathname.startsWith(href + '/')))
                return (
                  <Link
                    key={label}
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className={`
                      relative px-4 py-2 rounded-full text-[13.5px] font-medium
                      whitespace-nowrap transition-all duration-200
                      ${isActive
                        ? 'bg-cyan-500 text-white shadow-[0_2px_8px_rgba(6,182,212,0.4)]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-slate-50'}
                    `}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Vertical divider */}
            <div className="w-px h-8 bg-gray-100 flex-shrink-0" />

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-shrink-0">
              <div className={`flex items-center rounded-full overflow-hidden border transition-all duration-200
                ${searchFocused
                  ? 'border-cyan-500 shadow-[0_0_0_3px_rgba(6,182,212,0.18)]'
                  : 'border-gray-200 hover:border-cyan-400'}`}>
                <div className="pl-4 pr-1 flex items-center text-gray-400">
                  <Search size={13} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search…"
                  className="px-2 py-[8px] text-[13px] outline-none w-[130px] text-gray-700 placeholder:text-gray-400 bg-white"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className={`m-[3px] w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0
                    transition-all duration-200
                    ${query.trim()
                      ? 'bg-cyan-500 text-white shadow-[0_2px_6px_rgba(6,182,212,0.4)]'
                      : 'bg-gray-100 text-gray-400'}`}
                >
                  <Search size={12} strokeWidth={2.5} />
                </button>
              </div>
            </form>

          </div>

          {/* Gradient bottom border: cyan → teal → navy */}
          <div className="h-[2.5px] bg-gradient-to-r from-cyan-400 via-teal-400 to-[#1e3a6e]" />
        </header>
      </div>

      {/* ════════════════════ MOBILE HEADER ════════════════════ */}
      <div className="sticky top-0 z-50 lg:hidden">
        <div className="h-[3px] bg-gradient-to-r from-cyan-400 via-teal-400 to-[#1e3a6e]" />
        <header className="bg-white border-b border-gray-100 shadow-sm">
          <div className="px-5 h-[62px] flex items-center justify-between">
            <LogoMark size={48} />
            <button
              className="p-2 rounded-xl text-gray-600 hover:text-cyan-500 hover:bg-slate-50 transition-colors"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </header>
      </div>

      {/* ════════════════════ MOBILE FULL-SCREEN MENU ════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] lg:hidden
          transition-opacity duration-300
          ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      />

      {/* Slide-in panel */}
      <div className={`fixed inset-0 z-[70] bg-white lg:hidden flex flex-col
        transition-transform duration-300 ease-in-out
        ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        <div className="h-[3px] bg-gradient-to-r from-cyan-400 via-teal-400 to-[#1e3a6e] flex-shrink-0" />

        {/* Panel header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <LogoMark size={48} onClick={() => setMenuOpen(false)} />
          <button
            onClick={() => setMenuOpen(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-6 py-4">
          {navLinks.map(({ label, href, external }: any, i: number) => {
            const isActive = href !== '#' &&
              (pathname === href || (href !== '/' && pathname.startsWith(href + '/')))
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
                <span className={`w-[3px] h-5 rounded-full flex-shrink-0 transition-colors duration-200
                  ${isActive ? 'bg-cyan-500' : 'bg-gray-200'}`} />
                {label}
                {external && (
                  <span className="ml-auto text-[10px] font-normal text-gray-400 tracking-wider uppercase">External</span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Search */}
        <div className="px-6 pt-4 pb-10 border-t border-gray-100 flex-shrink-0">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Search</p>
          <form onSubmit={handleSearch}
            className="flex items-center border border-cyan-400 rounded-full overflow-hidden
              focus-within:border-cyan-500 focus-within:shadow-[0_0_0_3px_rgba(6,182,212,0.15)]
              transition-all duration-200">
            <input
              type="text" value={query}
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
