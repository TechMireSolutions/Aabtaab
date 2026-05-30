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
  const [menuOpen, setMenuOpen]       = useState(false)
  const [query, setQuery]             = useState('')
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
    }
  }

  return (
    <>
      {/* ── Thin cyan brand accent at very top ── */}
      <div className="h-[3px] bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-400" />

      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto px-8 h-[68px] flex items-center gap-10">

          {/* ── Logo ── */}
          <Link href="/" aria-label={siteName} className="flex-shrink-0 group">
            <div className={`w-[54px] h-[54px] rounded-full overflow-hidden
              ring-2 ring-cyan-400 ring-offset-2
              group-hover:ring-cyan-500 group-hover:ring-offset-[3px]
              transition-all duration-200 ease-out
              ${!logoUrl ? 'bg-gradient-to-br from-sky-100 to-blue-200 flex items-center justify-center text-2xl select-none' : ''}`}>
              {logoUrl
                ? <Image src={logoUrl} alt={siteName} width={54} height={54} className="object-cover w-full h-full" />
                : '⛵'}
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-0">
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
                  className={`
                    relative px-[18px] py-[22px] text-[13.5px] font-medium tracking-[0.015em]
                    transition-colors duration-150 group/nav whitespace-nowrap
                    ${isActive ? 'text-cyan-500' : 'text-gray-700 hover:text-gray-950'}
                  `}
                >
                  {label}
                  {/* Sliding underline — always present but scaled for active, slides in on hover */}
                  <span
                    className={`
                      absolute bottom-[10px] left-[18px] right-[18px] h-[2px] rounded-full bg-cyan-500
                      transition-all duration-200 origin-left
                      ${isActive
                        ? 'scale-x-100 opacity-100'
                        : 'scale-x-0 opacity-0 group-hover/nav:scale-x-100 group-hover/nav:opacity-100'}
                    `}
                  />
                </Link>
              )
            })}
          </nav>

          {/* ── Search bar ── */}
          <form onSubmit={handleSearch} className="hidden lg:block ml-auto">
            <div
              className={`
                flex items-center rounded-full overflow-hidden border
                transition-all duration-200
                ${searchFocused
                  ? 'border-cyan-500 shadow-[0_0_0_3px_rgba(6,182,212,0.18)]'
                  : 'border-cyan-400 hover:border-cyan-500'}
              `}
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search"
                className="px-4 py-[7px] text-[13px] outline-none w-[148px] text-gray-700 placeholder:text-gray-400 bg-white"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 transition-colors px-[11px] py-[7px] flex items-center self-stretch"
              >
                <Search size={14} className="text-white" strokeWidth={2.5} />
              </button>
            </div>
          </form>

          {/* ── Mobile toggle ── */}
          <button
            className="lg:hidden ml-auto p-1.5 rounded-lg text-gray-600 hover:text-cyan-500 hover:bg-gray-50 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile dropdown ── */}
        {menuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-6 pb-4 shadow-lg">
            <nav className="mt-1">
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
                    className={`
                      flex items-center gap-3 py-3 text-[13.5px] font-medium
                      border-b border-gray-50 last:border-0 transition-colors
                      ${isActive ? 'text-cyan-500' : 'text-gray-700 hover:text-cyan-500'}
                    `}
                    onClick={() => setMenuOpen(false)}
                  >
                    {/* Active indicator pill */}
                    <span className={`w-1 h-4 rounded-full flex-shrink-0 transition-colors ${isActive ? 'bg-cyan-500' : 'bg-transparent'}`} />
                    {label}
                  </Link>
                )
              })}
            </nav>
            <form onSubmit={handleSearch} className="mt-3 flex items-center border border-cyan-400 rounded-full overflow-hidden">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="flex-1 px-4 py-2 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-white"
              />
              <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 px-3 py-2 transition-colors">
                <Search size={14} className="text-white" strokeWidth={2.5} />
              </button>
            </form>
          </div>
        )}
      </header>
    </>
  )
}
