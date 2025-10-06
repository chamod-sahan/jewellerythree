'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/90 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/logo.svg" // replace with your logo path
            alt="jewllery shop"
            className="h-8"
          />
        </Link>

        {/* Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 text-white font-semibold tracking-wider"
        >
          <span>MENU</span>
          <div className="w-6 h-6 border border-white rotate-45"></div>
        </button>
      </div>

      {/* Fullscreen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black text-white flex flex-col md:flex-row justify-between p-8 md:p-16"
          >
            {/* Left Side - Navigation */}
            <div className="flex flex-col justify-center space-y-6 text-5xl md:text-6xl font-extrabold">
              {['Home', 'About', 'Work', 'Services', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-gray-200 hover:to-gray-500 transition-all"
                >
                  {item}
                </Link>
              ))}
            </div>

            {/* Right Side - Contact Info */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="md:w-1/2 mt-10 md:mt-0 border-l border-gray-700 pl-10 flex flex-col justify-center"
            >
              <h2 className="text-4xl font-bold mb-6">GET IN TOUCH</h2>
              <p className="text-gray-300 mb-2">
                532, Old Galle Rd, Horethuduwa, Moratuwa, LK
              </p>
              <p className="text-gray-400 mb-2">
                TEL: <span className="text-lime-400">077 677 2707</span>
              </p>
              <p className="text-gray-400 mb-6">
                EMAIL:{' '}
                <span className="text-lime-400">hello@scepter.studio</span>
              </p>
              <div className="flex space-x-6 text-sm text-gray-400">
                {['LinkedIn', 'Behance', 'Instagram', 'Facebook'].map((item) => (
                  <Link key={item} href="#" className="hover:text-white">
                    {item}
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-10 right-10 flex items-center space-x-2 text-white font-semibold tracking-wider"
            >
              <span>CLOSE</span>
              <div className="w-6 h-6 border border-white rotate-45"></div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
