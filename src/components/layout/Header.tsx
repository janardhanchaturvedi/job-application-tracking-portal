'use client'
import React, { useState, useEffect } from 'react'
import { Briefcase, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname() // Get current path
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [router])

  const navigation = [
    { name: 'Dashboard', path: '/' },
    { name: 'Add Application', path: '/add-job' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header className='bg-white shadow-sm sticky top-0 z-10'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex h-16 justify-between items-center'>
          <div className='flex'>
            <Link href='/' className='flex items-center'>
              <Briefcase className='h-8 w-8 text-blue-600' />
              <span className='ml-2 text-xl font-bold text-gray-900'>JobTrack</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className='hidden md:flex space-x-8'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:border-b-2 hover:border-blue-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className='flex md:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              onClick={toggleMenu}
            >
              <span className='sr-only'>Open main menu</span>
              {isMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className='md:hidden'>
          <div className='space-y-1 px-2 pb-3 pt-2'>
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
