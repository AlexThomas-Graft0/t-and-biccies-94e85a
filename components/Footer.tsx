'use client';

import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  dietary_tags: string[];
  is_available: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15 },
  },
};

export function Footer() {
  const [featuredBakes, setFeaturedBakes] = useState<MenuItem[]>([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    async function fetchFeaturedItems() {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('id, name, description, price, category, dietary_tags, is_available')
          .eq('is_available', true)
          .limit(3);

        if (!error && data && data.length > 0) {
          setFeaturedBakes(data as MenuItem[]);
        } else {
          // Tasteful placeholder items matching copy if database is empty
          setFeaturedBakes([
            {
              id: 'placeholder-1',
              name: 'Signature Warm Scones',
              description: 'Served with rich clotted cream and strawberry jam.',
              price: 3.00,
              category: 'Extras',
              dietary_tags: ['V'],
              is_available: true
            },
            {
              id: 'placeholder-2',
              name: 'Traditional Afternoon Tea',
              description: 'A classic British favorite on a beautiful tiered stand.',
              price: 18.50,
              category: 'Packages',
              dietary_tags: ['V', 'GF'],
              is_available: true
            }
          ]);
        }
      } catch (err) {
        console.error('Error loading footer menu items:', err);
      }
    }

    fetchFeaturedItems();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setIsSubscribed(true);
      setNewsletterEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-[#2C3531] text-[#FAF6F0] font-sans selection:bg-[#C87A53] selection:text-[#FAF6F0]">
      {/* Decorative Top Border Wave */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#607A66] via-[#C87A53] to-[#607A66]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
        {/* Newsletter & Warm Welcome Banner */}
        <div className="mb-16 grid grid-cols-1 gap-8 rounded-2xl bg-[#3A4540] p-8 md:p-12 lg:grid-cols-3 lg:items-center">
          <div className="lg:col-span-2">
            <span className="font-serif text-sm italic text-[#C87A53] tracking-wide block mb-2">
              A warm Welsh welcome, one cuppa at a time.
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#FAF6F0]">
              Join our cozy Bedwas tea circle
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[#FAF6F0]/80 max-w-xl">
              Subscribe to get seasonal menu updates, secret family baking recipes, and priority booking windows for our famous festive afternoon teas.
            </p>
          </div>
          <div className="w-full">
            {isSubscribed ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="rounded-lg bg-[#607A66]/30 p-4 border border-[#607A66] text-center text-sm font-medium text-[#FAF6F0]"
              >
                ✓ You&apos;re on the guestlist! We&apos;ll keep the kettle warm for you.
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="footer-email" className="sr-only">Email address</label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full rounded-lg border-0 bg-[#2C3531] px-4 py-3 text-sm text-[#FAF6F0] placeholder-[#FAF6F0]/50 focus:ring-2 focus:ring-[#C87A53] focus:outline-none"
                />
                <button
                  type="submit"
                  className="whitespace-nowrap rounded-lg bg-[#C87A53] px-5 py-3 text-sm font-semibold text-[#FAF6F0] shadow-sm hover:bg-[#b56943] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C87A53]"
                >
                  Sign Me Up
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Main Footer Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Column 1: Brand & Dynamic Menu Highlights */}
          <motion.div variants={itemVariants} className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#FAF6F0]">
                t and biccies
              </span>
              <span className="inline-block h-2 w-2 rounded-full bg-[#C87A53]" />
            </div>
            <p className="text-sm leading-relaxed text-[#FAF6F0]/80">
              Thank you for supporting our family-run cafe in Bedwas. Every hand-rolled scone is crafted with local pride and real Welsh heart.
            </p>

            {/* Micro Dynamic Showcase */}
            <div className="border-t border-[#FAF6F0]/10 pt-4">
              <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-[#C87A53] mb-2">
                Fresh From Our Kitchen
              </h4>
              <ul className="space-y-2">
                {featuredBakes.map((bake) => (
                  <li key={bake.id} className="text-xs flex justify-between items-start gap-2">
                    <span className="text-[#FAF6F0]/90 font-medium">
                      {bake.name}
                      {bake.dietary_tags && bake.dietary_tags.length > 0 && (
                        <span className="ml-1 text-[10px] text-[#C87A53] font-mono">
                          [{bake.dietary_tags.join(',')}]
                        </span>
                      )}
                    </span>
                    <span className="text-[#FAF6F0]/60 font-mono">£{Number(bake.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Column 2: Navigation Links */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-serif text-lg font-medium text-[#FAF6F0] tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="#book"
                  className="text-[#FAF6F0]/80 hover:text-[#C87A53] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C87A53]"
                >
                  Book a Table
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  className="text-[#FAF6F0]/80 hover:text-[#C87A53] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C87A53]"
                >
                  Our Food Menu
                </a>
              </li>
              <li>
                <a
                  href="#hampers"
                  className="text-[#FAF6F0]/80 hover:text-[#C87A53] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C87A53]"
                >
                  Picnic Hampers
                </a>
              </li>
              <li>
                <a
                  href="#gifts"
                  className="text-[#FAF6F0]/80 hover:text-[#C87A53] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C87A53]"
                >
                  Gift Boxes
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-[#FAF6F0]/80 hover:text-[#C87A53] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C87A53]"
                >
                  Custom Enquiries
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Find Us */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-serif text-lg font-medium text-[#FAF6F0] tracking-wide">
              Find Us
            </h3>
            <p className="text-sm leading-relaxed text-[#FAF6F0]/80">
              1 Pandy Lane, Bedwas,<br />
              Caerphilly, Wales, CF83 8BJ
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#C87A53]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:07588896465"
                  className="text-[#FAF6F0]/80 hover:text-[#C87A53] transition-colors"
                >
                  07588896465
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-4 w-4 text-[#C87A53]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:alex-thomas92@outlook.com"
                  className="text-[#FAF6F0]/80 hover:text-[#C87A53] transition-colors break-all"
                >
                  alex-thomas92@outlook.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* Column 4: Opening Hours */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="font-serif text-lg font-medium text-[#FAF6F0] tracking-wide">
              Opening Hours
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-[#FAF6F0]/10 pb-2">
                <span className="text-[#FAF6F0]/80">Mon - Fri</span>
                <span className="font-medium">8:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between border-b border-[#FAF6F0]/10 pb-2">
                <span className="text-[#FAF6F0]/80">Sat - Sun</span>
                <span className="font-medium text-[#C87A53]">Closed</span>
              </div>
              <p className="text-xs italic text-[#FAF6F0]/60 mt-1">
                *Reserved for private events and precious family baking weekends!
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-[#FAF6F0]/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-xs text-[#FAF6F0]/60 text-center md:text-left">
            © 2024 t and biccies. All rights reserved. Hand-baked with love in Bedwas, Caerphilly.
          </p>

          <div className="flex items-center justify-center md:justify-end gap-6">
            <a
              href="#admin"
              className="text-xs text-[#FAF6F0]/50 hover:text-[#C87A53] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C87A53]"
            >
              Staff Admin Login
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-xs text-[#C87A53] hover:text-[#FAF6F0] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C87A53]"
              aria-label="Scroll back to top of page"
            >
              Back to top
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}