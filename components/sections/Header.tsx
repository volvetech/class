'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Clothes', href: '/ai-clothes-changer' },
    { label: 'Hair Color', href: '/virtual-hair-color-try-on' },
    { label: 'Hairstyle', href: '/virtual-hairstyle-try-on' },
    { label: 'Glasses', href: '/virtual-glasses-try-on' },
    { label: 'Ring', href: '/virtual-ring-try-on' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold text-gradient-gold">Virtual Try On</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Login
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm">
              Try for Free
            </button>
          </div>

          <button
            className="lg:hidden p-2 text-gray-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-3 text-gray-300 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 px-4">
                <button className="py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  Login
                </button>
                <button className="py-2 bg-gradient-to-r from-yellow-400 to-amber-600 text-black font-semibold rounded-lg text-sm">
                  Try for Free
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}