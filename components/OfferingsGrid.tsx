'use client';

import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface PriceState {
  tea: string;
  hamper: string;
  giftBox: string;
}

export function OfferingsGrid() {
  const [prices, setPrices] = useState<PriceState>({
    tea: '£18.50',
    hamper: '£35.00',
    giftBox: '£22.00'
  });

  useEffect(() => {
    async function fetchLivePrices() {
      try {
        // Fetch Traditional Tea price from menu_items
        const { data: menuData } = await supabase
          .from('menu_items')
          .select('price')
          .eq('name', 'The Traditional Afternoon Tea')
          .maybeSingle();

        // Fetch Picnic Hamper price from pre_order_products
        const { data: hamperData } = await supabase
          .from('pre_order_products')
          .select('price')
          .eq('name', 'The Welsh Valleys Picnic Hamper')
          .maybeSingle();

        // Fetch Gift Box price from pre_order_products
        const { data: giftData } = await supabase
          .from('pre_order_products')
          .select('price')
          .eq('name', 'The Bedwas Bakers Gift Box')
          .maybeSingle();

        setPrices({
          tea: menuData?.price ? `£${Number(menuData.price).toFixed(2)}` : '£18.50',
          hamper: hamperData?.price ? `£${Number(hamperData.price).toFixed(2)}` : '£35.00',
          giftBox: giftData?.price ? `£${Number(giftData.price).toFixed(2)}` : '£22.00'
        });
      } catch (error) {
        // Fallback silently to hardcoded default values
      }
    }

    fetchLivePrices();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 14,
      },
    },
  };

  const offerings = [
    {
      title: 'Join Us for Afternoon Tea',
      description: 'Relax in our cozy Bedwas cafe. Enjoy a traditional three-tiered stand filled with warm, handmade scones, finger sandwiches, and sweet treats made fresh daily.',
      cta: 'Book a Table',
      priceLabel: `From ${prices.tea} pp`,
      link: '#book',
      badge: 'Cafe Experience',
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A3 3 0 1 1 20.4 8.281l-1.95 2.1a1 1 0 0 1-.722.33H12a1 1 0 0 1-1-1V5.214a1 1 0 0 1 1-1h2.64a1 1 0 0 1 .722.33l1.95 2.1ZM3 19.5h18M5 19.5v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6" />
        </svg>
      )
    },
    {
      title: 'Take-Away Picnic Hampers',
      description: 'Heading out to explore the beautiful Welsh valleys? Take our freshly packed picnic hampers with you, filled with savouries, cakes, and refreshing drinks.',
      cta: 'Pre-Order a Hamper',
      priceLabel: `From ${prices.hamper}`,
      link: '#hampers',
      badge: 'Valley Adventures',
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      )
    },
    {
      title: 'Afternoon Tea Gift Boxes',
      description: "Send a thoughtful, hand-packed box of treats to someone special. Perfect for birthdays, thank-yous, or just to show you care. Local delivery available.",
      cta: 'Shop Gift Boxes',
      priceLabel: `From ${prices.giftBox}`,
      link: '#gifts',
      badge: 'Thoughtful Gifts',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0-2.625V21m-6.75-13.5h13.5" />
        </svg>
      )
    }
  ];

  return (
    <section className="bg-[#FAF6F0] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative floral styling element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#607A66]/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#C87A53]/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#C87A53] font-medium text-sm tracking-widest uppercase block mb-3">
            A warm Welsh welcome, one cuppa at a time
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C3531] tracking-tight mb-4">
            Freshly Baked in Bedwas
          </h2>
          <div className="w-16 h-1 bg-[#607A66] mx-auto rounded-full mb-6" />
          <p className="text-gray-600 font-sans text-base sm:text-lg">
            Whether you’re stepping into our cozy cafe, packing up a scenic valleys picnic, or sending warm wishes to a loved one, we have something beautiful prepared for you.
          </p>
        </div>

        {/* Offerings Grid Container */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {offerings.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full group"
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-[#607A66] text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                  {item.badge}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-[#2C3531] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm border border-gray-100">
                  {item.priceLabel}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-3 mb-4">
                  <span className="p-2.5 bg-[#FAF6F0] text-[#C87A53] rounded-lg">
                    {item.icon}
                  </span>
                  <h3 className="text-xl font-serif text-[#2C3531] font-bold group-hover:text-[#C87A53] transition-colors duration-200">
                    {item.title}
                  </h3>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                  {item.description}
                </p>

                {/* Card CTA Link */}
                <div className="mt-auto">
                  <a
                    href={item.link}
                    className="inline-flex items-center justify-center w-full px-5 py-3 text-sm font-semibold text-white bg-[#C87A53] hover:bg-[#b0653f] active:bg-[#975330] rounded-xl transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-[#C87A53] focus:ring-offset-2"
                  >
                    <span>{item.cta}</span>
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Trust Note */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#607A66]/10 text-[#607A66] rounded-full text-xs font-semibold uppercase tracking-wide">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Proudly baking from scratch at 1 Pandy Lane, Bedwas
          </div>
        </div>
      </div>
    </section>
  );
}