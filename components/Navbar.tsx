'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Our Story', href: '#story' },
    { name: 'Menu', href: '#menu' },
    { name: 'Picnic & Gifts', href: '#hampers' },
    { name: 'Contact', href: '#contact' },
  ];

  const bannerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const navVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 12, delay: 0.1 }
    }
  };

  const mobileMenuVariants: Variants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: { duration: 0.25, ease: 'easeInOut' }
    },
    open: { 
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.35, ease: 'easeOut' }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      {/* Top Welcome Banner */}
      <motion.div 
        variants={bannerVariants}
        initial="hidden"
        animate="visible"
        className="w-full bg-[#607A66] text-[#FAF6F0] text-xs py-2 px-4 flex flex-col sm:flex-row justify-between items-center gap-1.5 border-b border-[#607A66]/20 font-sans tracking-wide"
      >
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C87A53]" />
          <span>A warm Welsh welcome, one cuppa at a time.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] sm:text-xs opacity-90">
          <span>✓ Proudly baking from scratch at 1 Pandy Lane</span>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:inline">Mon - Fri: 8:00 AM - 4:00 PM</span>
        </div>
      </motion.div>

      {/* Main Navbar */}
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`w-full transition-all duration-300 border-b ${
          scrolled 
            ? 'bg-[#FAF6F0]/95 backdrop-blur-md py-3 shadow-md border-[#607A66]/10' 
            : 'bg-[#FAF6F0] py-5 border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* Logo */}
            <a 
              href="#home" 
              className="group flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-[#C87A53] rounded-lg p-1"
              aria-label="t and biccies Home"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#607A66]/10 group-hover:bg-[#607A66]/20 transition-colors duration-300">
                <svg 
                  className="w-6 h-6 text-[#607A66]" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.5" 
                    d="M17 10a4 4 0 011.085 7.636A9 9 0 016 19a9 9 0 01-1.085-3.364A4 4 0 016 10h11zm0 0V8a2 2 0 00-2-2H9a2 2 0 00-2 2v2m10 0a4 4 0 00-4-4" 
                  />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold text-[#2C3531] tracking-tight leading-none group-hover:text-[#C87A53] transition-colors duration-300">
                  t and biccies
                </span>
                <span className="font-sans text-[9px] uppercase tracking-widest text-[#607A66] font-semibold mt-0.5">
                  Bedwas Cafe
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative font-sans text-sm font-medium text-[#2C3531] hover:text-[#C87A53] transition-colors duration-200 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#C87A53] rounded px-1 group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C87A53] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              ))}
            </div>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="#hampers"
                className="font-sans text-sm font-medium text-[#607A66] hover:text-[#2C3531] px-4 py-2 rounded-full border border-[#607A66]/30 hover:border-[#2C3531] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#607A66]"
              >
                Order Hampers
              </a>
              <a
                href="#reserve"
                className="font-sans text-sm font-semibold text-[#FAF6F0] bg-[#C87A53] hover:bg-[#b0633b] px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C87A53]"
              >
                Book Afternoon Tea
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-[#2C3531] hover:text-[#C87A53] hover:bg-[#607A66]/5 focus:outline-none focus:ring-2 focus:ring-[#C87A53] transition-all"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu Panel */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden overflow-hidden bg-[#FAF6F0] border-t border-[#607A66]/10"
            >
              <div className="px-4 pt-3 pb-6 space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#2C3531] hover:text-[#C87A53] hover:bg-[#607A66]/5 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
                
                <div className="pt-4 border-t border-[#607A66]/10 space-y-3 px-3">
                  <a
                    href="#hampers"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center font-sans text-base font-medium text-[#607A66] border border-[#607A66]/40 py-2.5 rounded-full hover:bg-[#607A66]/5 transition-all"
                  >
                    Order Picnic Hampers
                  </a>
                  <a
                    href="#reserve"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center font-sans text-base font-semibold text-[#FAF6F0] bg-[#C87A53] py-2.5 rounded-full shadow-sm hover:bg-[#b0633b] transition-all"
                  >
                    Book Afternoon Tea
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </header>
  );
}