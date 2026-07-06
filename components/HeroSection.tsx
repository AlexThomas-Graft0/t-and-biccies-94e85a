'use client';

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export function HeroSection() {
  const [activeBakeCount, setActiveBakeCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBakeCount() {
      try {
        const { count, error } = await supabase
          .from('menu_items')
          .select('*', { count: 'exact', head: true })
          .eq('is_available', true);
        
        if (!error && count !== null) {
          setActiveBakeCount(count);
        }
      } catch (err) {
        // Fallback gracefully without throwing
      }
    }
    fetchBakeCount();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 14,
      },
    },
  };

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 40,
        damping: 18,
        delay: 0.3,
      },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF6F0] min-h-[90vh] flex items-center py-16 lg:py-24">
      {/* Background Decorative Patterns */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2C3531" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Warm Welcome Copy */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Live Indicator / Accent Header */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#607A66]/10 text-[#607A66]">
                <span className="w-2 h-2 rounded-full bg-[#607A66] animate-pulse" />
                A warm Welsh welcome
              </span>
              
              {activeBakeCount !== null && activeBakeCount > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-[#C87A53]/10 text-[#C87A53]">
                  ☕ {activeBakeCount} Fresh Treats on the Menu Today
                </span>
              )}
            </motion.div>

            {/* Small Accent Header */}
            <motion.p 
              variants={itemVariants} 
              className="text-[#C87A53] font-medium tracking-wide text-sm sm:text-base mb-2 uppercase"
            >
              One cuppa at a time
            </motion.p>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2C3531] leading-[1.1] tracking-tight mb-6"
            >
              Freshly baked afternoon tea, delivered to your table in{' '}
              <span className="relative inline-block text-[#607A66]">
                Bedwas
                <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#C87A53]/20 rounded-full" />
              </span>.
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-[#2C3531]/80 leading-relaxed max-w-xl mb-8"
            >
              Pull up a chair at <strong className="text-[#2C3531]">t and biccies</strong>. We are a family-run cafe in the heart of Caerphilly, serving homemade scones, fresh savoury treats, and perfectly brewed tea. Whether you’re joining us in our cozy shop or packing a picnic for the valleys, we have a spot saved just for you.
            </motion.p>

            {/* Dual CTAs & Trust Badge */}
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="#book" 
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl text-white font-medium bg-[#C87A53] hover:bg-[#b0633d] transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C87A53] text-center"
                >
                  Book Afternoon Tea
                </a>
                <a 
                  href="#hampers" 
                  className="inline-flex justify-center items-center px-8 py-4 rounded-xl text-[#2C3531] font-medium bg-[#FAF6F0] border-2 border-[#607A66]/30 hover:border-[#607A66] hover:bg-white transition-all duration-200 text-center"
                >
                  Order Picnic Hampers
                </a>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-sm text-[#2C3531]/70 italic mt-4">
                <span className="text-[#607A66] font-bold text-lg">✓</span>
                <span>Proudly baking from scratch at 1 Pandy Lane</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: High-Impact Atmospheric Imagery */}
          <motion.div 
            className="lg:col-span-5 relative"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Elegant Background Card Shadow effect */}
            <div className="absolute -inset-2 rounded-[2rem] bg-gradient-to-tr from-[#607A66]/10 to-[#C87A53]/10 blur-xl opacity-70 pointer-events-none" />

            <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-[#FAF6F0] aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
              <img 
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80" 
                alt="Atmospheric rustic afternoon tea with vintage china and homemade scones" 
                className="object-cover w-full h-full scale-100 hover:scale-105 transition-transform duration-700 ease-out"
                loading="eager"
              />
              
              {/* Floating Decorative Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#FAF6F0]/95 backdrop-blur-sm p-5 rounded-xl border border-[#607A66]/20 shadow-lg">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-[#607A66]/10 text-[#607A66] shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif text-[#2C3531] text-base font-bold">Our Bedwas Kitchen</h4>
                    <p className="text-[#2C3531]/80 text-xs mt-0.5 leading-relaxed">
                      Scones hand-rolled daily with rich Welsh butter &amp; served with dollops of fresh clotted cream.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Scone / Tea Leaves Sketch Accent */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#C87A53]/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#607A66]/10 rounded-full blur-2xl pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}