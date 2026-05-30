'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ExternalLink } from 'lucide-react'

interface HeaderProps {
  darulQuranUrl?: string
  siteName?: string
}

const baseNavLinks = [
  { label: 'Home',           href: '/',               external: false },
  { label: 'Online Courses', href: '/online-courses',  external: false },
  { label: 'Services',       href: '/services',        external: false },
  { label: 'Articles',       href: '/articles',        external: false },
  { label: 'Donate',         href: '/donate',          external: false },
  { label: 'About Us',       href: '/about',           external: false },
  { label: 'Contact',        href: '/contact',         external: false },
]

export default function Header({ darulQuranUrl, siteName = 'AABTAAB' }: HeaderProps) {
  const [open, setOpen] = useState(false)

  const navLinks = [
    ...baseNavLinks,
    { label: 'Dar Ul Quran', href: darulQuranUrl || '#', external: true },
  ]

  return (
    <header className="bg-primary-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container-main">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold tracking-widest hover:text-gold-400 transition-colors">
            {siteName}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, href, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-1 text-sm font-medium px-3 py-2 rounded hover:bg-primary-600 hover:text-gold-400 transition-colors"
              >
                {label}
                {external && <ExternalLink size={12} />}
              </Link>
            ))}
          </nav>

          <button
            className="lg:hidden p-2 rounded hover:bg-primary-600 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-primary-700 border-t border-primary-600">
          <div className="container-main py-2">
            {navLinks.map(({ label, href, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? '_blank' : undefined}
                rel={external ? 'noopener noreferrer' : undefined}
                className="flex items-center gap-2 py-3 text-sm font-medium border-b border-primary-600 last:border-0 hover:text-gold-400 transition-colors"
                onClick={() => setOpen(false)}
              >
                {label}
                {external && <ExternalLink size={12} />}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
