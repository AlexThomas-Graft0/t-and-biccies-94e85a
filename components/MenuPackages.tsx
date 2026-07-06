'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

// Interfaces mapping database/UI models
interface Package {
  id: string;
  name: string;
  price: string;
  dietary_tags: string[];
  description: string;
  included: string[];
  image: string;
}

interface DrinkItem {
  name: string;
  price: string;
  description: string;
  category: 'hot' | 'cold_extra';
}

export function MenuPackages() {
  // State for dietary filter
  const [selectedTag, setSelectedTag] = useState<string>('ALL');
  // State for database menu items (if any exist)
  const [dbMenuItems, setDbMenuItems] = useState<any[]>([]);

  // Static high-quality packages copy matching full site content
  const staticPackages: Package[] = [
    {
      id: 'pkg-1',
      name: 'The Traditional Afternoon Tea',
      price: '£18.50',
      dietary_tags: ['V', 'GF', 'DF'],
      description: 'A classic British favorite, served on a beautiful tiered stand.',
      included: [
        'Local roasted ham with mustard, cool cucumber & cream cheese, and fresh egg mayonnaise & cress sandwiches.',
        'Our signature warm plain and fruit scones, served with rich clotted cream and strawberry jam.',
        'A rotating selection of hand-baked sweet treats, including mini Victoria sponges, lemon drizzle bites, and chocolate fudge brownies.',
        'A bottomless pot of Welsh Brew tea or freshly ground coffee.'
      ],
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pkg-2',
      name: 'The Savoury Afternoon Tea',
      price: '£19.50',
      dietary_tags: ['V'],
      description: 'Perfect for those who prefer warm bakes over sweet treats.',
      included: [
        'Mature Welsh cheddar with orchard chutney, and smoked salmon with chive cream cheese sandwiches.',
        'Warm pork, sage, and onion sausage rolls, plus homemade mini cheese and leek quiches.',
        'A warm cheddar and chive scone, served with salted Welsh butter and caramelised onion chutney.',
        'A selection of savoury bites and crisp cheese straws.',
        'A bottomless pot of tea or coffee.'
      ],
      image: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pkg-3',
      name: 'The Little Bakers Tea',
      price: '£9.50',
      dietary_tags: ['V', 'GF'],
      description: 'A simple, fun afternoon tea designed just for little appetites (under 12).',
      included: [
        'Soft triangle sandwiches: Mild cheddar cheese, strawberry jam, and sliced ham.',
        'A mini chocolate chip scone with butter and jam.',
        'A decorated vanilla cupcake and fresh fruit skewers.',
        'A choice of apple juice, orange juice, or a warm milk babyccino.'
      ],
      image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 'pkg-4',
      name: 'The Valley Seasonal Special',
      price: '£21.00',
      dietary_tags: ['V', 'GF'],
      description: 'A cozy, seasonal twist on our traditional tea, celebrating autumn and winter flavors.',
      included: [
        'Sandwiches: Roasted turkey with cranberry sauce, and warm brie with grape chutney.',
        'Warm spiced apple and cinnamon scones with clotted cream and plum jam.',
        'Mini pumpkin spice tarts, dark chocolate orange slices, and gingerbread bites.',
        'A warm mug of spiced apple cider or a festive spiced tea.'
      ],
      image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Static drinks menu matching copy
  const hotDrinks: DrinkItem[] = [
    { name: 'Welsh Brew Everyday Tea', price: '£2.20', description: 'Our house blend, strong and comforting.', category: 'hot' },
    { name: 'Specialty Herbal Teas', price: '£2.50', description: 'Chamomile, Peppermint, Earl Grey, or Berry Infusion.', category: 'hot' },
    { name: 'Americano', price: '£2.60', description: 'Freshly ground espresso with hot water, served with local milk.', category: 'hot' },
    { name: 'Flat White / Cappuccino / Latte', price: '£3.00', description: 'Silky smooth coffee made with our signature espresso blend.', category: 'hot' },
    { name: 'The Cozy Hot Chocolate', price: '£3.50', description: 'Rich milk chocolate topped with whipped cream and mini marshmallows.', category: 'hot' }
  ];

  const coldAndExtras: DrinkItem[] = [
    { name: 'Still / Sparkling Welsh Water', price: '£1.80', description: '', category: 'cold_extra' },
    { name: 'Traditional Cloudy Lemonade', price: '£2.50', description: '', category: 'cold_extra' },
    { name: 'Elderflower Pressé', price: '£2.50', description: '', category: 'cold_extra' },
    { name: 'Extra Scone with Butter & Jam', price: '£3.00', description: '', category: 'cold_extra' },
    { name: 'Slice of Handmade Cake of the Day', price: '£3.50', description: "Ask your server for today's freshly baked selection.", category: 'cold_extra' }
  ];

  // Fetch live custom items if they exist in the DB
  useEffect(() => {
    async function getMenuItems() {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true);
        if (data && data.length > 0) {
          setDbMenuItems(data);
        }
      } catch (err) {
        console.error('Error fetching from Supabase menu_items:', err);
      }
    }
    getMenuItems();
  }, []);

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  // Filter logic for packages
  const filteredPackages = selectedTag === 'ALL'
    ? staticPackages
    : staticPackages.filter(pkg => pkg.dietary_tags.includes(selectedTag));

  return (
    <section id="menu" className="bg-[#FAF6F0] text-[#2C3531] py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section 2.1: Menu Intro & Culinary Philosophy */}
        <div className="max-w-3xl mx-auto text-center mb-16 relative">
          <div className="absolute inset-0 -m-4 border border-[#607A66]/30 rounded-2xl pointer-events-none" />
          <div className="p-8 md:p-12">
            <span className="text-[#C87A53] font-mono text-sm tracking-wider uppercase block mb-3">
              Homemade Daily in Bedwas
            </span>
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl text-[#2C3531] leading-tight mb-6">
              Honest, homemade treats made with local pride.
            </h2>
            <p className="text-lg text-[#2C3531]/80 font-sans leading-relaxed mb-8">
              Everything on our menu is prepared fresh in our Bedwas kitchen. We source our butter, cream, and seasonal ingredients from local Welsh suppliers to ensure every bite feels like home.
            </p>
            
            {/* Dietary Tags Notice & Interactive Filter */}
            <div className="border-t border-[#607A66]/20 pt-6">
              <p className="text-sm font-medium text-[#2C3531]/70 mb-4">
                We want everyone to enjoy our treats. Select a tag below to highlight options suitable for your dietary needs:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { tag: 'ALL', label: 'Show All Menu' },
                  { tag: 'V', label: '[V] Vegetarian' },
                  { tag: 'VG', label: '[VG] Vegan' },
                  { tag: 'GF', label: '[GF] Gluten-Free' },
                  { tag: 'DF', label: '[DF] Dairy-Free' }
                ].map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => setSelectedTag(item.tag)}
                    className={`px-4 py-2 rounded-full font-mono text-xs transition-all duration-200 outline-none focus:ring-2 focus:ring-[#C87A53] ${
                      selectedTag === item.tag
                        ? 'bg-[#C87A53] text-[#FAF6F0] shadow-md'
                        : 'bg-[#607A66]/10 text-[#607A66] hover:bg-[#607A66]/20'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[#2C3531]/60 mt-4 italic">
                * If you have a severe allergy, please let our team know when booking so we can take extra care.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2.2: Afternoon Tea Packages Grid */}
        <div className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-[#607A66]/20 pb-4">
            <div>
              <h3 className="font-serif text-2xl md:text-4xl text-[#2C3531]">Our Afternoon Tea Packages</h3>
              <p className="text-[#607A66] font-sans text-sm mt-1">Tiered delicacies built for unforgettable moments</p>
            </div>
            <span className="text-xs font-mono text-[#2C3531]/60 mt-2 md:mt-0">
              Showing {filteredPackages.length} of {staticPackages.length} packages
            </span>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12"
          >
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg.id}
                variants={itemVariants}
                className="group bg-white rounded-2xl overflow-hidden border border-[#607A66]/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Section with pricing badge */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-[#FAF6F0] py-1 px-3 rounded-full text-xs font-mono text-[#C87A53] font-semibold border border-[#C87A53]/20 shadow-sm">
                    {pkg.price}
                  </div>
                  {/* Dietary Badge Pill Container */}
                  <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {pkg.dietary_tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#2C3531]/90 backdrop-blur-sm text-[#FAF6F0] text-[10px] font-mono px-2 py-0.5 rounded-md"
                      >
                        [{tag}]
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h4 className="font-serif text-xl md:text-2xl text-[#C87A53] font-medium group-hover:text-[#b05f34] transition-colors">
                        {pkg.name}
                      </h4>
                      <span className="font-serif text-lg text-[#2C3531] font-semibold shrink-0">
                        {pkg.price}
                      </span>
                    </div>
                    
                    <p className="text-[#2C3531]/80 text-sm font-sans mb-6 italic">
                      {pkg.description}
                    </p>

                    {/* Bullet Points of Included Items */}
                    <div className="border-t border-[#607A66]/15 pt-5 mb-6">
                      <h5 className="font-mono text-xs text-[#607A66] uppercase tracking-wider mb-3 font-semibold">
                        What's Included:
                      </h5>
                      <ul className="space-y-3">
                        {pkg.included.map((bullet, idx) => (
                          <li key={idx} className="flex items-start text-sm text-[#2C3531]/90">
                            <span className="text-[#C87A53] mr-2.5 mt-1 shrink-0">✦</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Order / Reserve Direct Link */}
                  <div className="pt-4 border-t border-[#607A66]/10 flex items-center justify-between mt-auto">
                    <span className="text-xs text-[#2C3531]/50 font-mono">
                      * 24h advance reservation required
                    </span>
                    <a
                      href="#booking"
                      className="inline-flex items-center text-xs font-mono text-[#C87A53] hover:text-[#2C3531] font-semibold uppercase tracking-wider transition-colors duration-200"
                    >
                      Book This Tea
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Section 2.3: Drinks & Sweet Extras */}
        <div className="bg-[#FAF6F0] rounded-3xl border border-[#607A66]/20 p-8 md:p-12 shadow-sm relative">
          <div className="absolute top-0 right-0 transform translate-x-1/10 -translate-y-1/10 opacity-10 pointer-events-none">
            {/* Elegant Background Floral/Teapot Motif SVG */}
            <svg width="240" height="240" fill="none" viewBox="0 0 24 24" className="text-[#607A66]">
              <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1" />
            </svg>
          </div>

          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="font-serif text-2xl md:text-4xl text-[#2C3531] mb-2">Drinks &amp; Sweet Extras</h3>
            <p className="text-sm font-mono text-[#607A66]">The perfect accompaniments to complete your tea experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            
            {/* Column 1: Hot Drinks */}
            <div>
              <div className="flex items-center gap-3 mb-6 border-b border-[#607A66]/20 pb-2">
                <span className="text-[#C87A53]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z" />
                  </svg>
                </span>
                <h4 className="font-serif text-xl text-[#2C3531] font-medium">Hot Drinks</h4>
              </div>
              <ul className="space-y-6">
                {hotDrinks.map((drink, idx) => (
                  <li key={idx} className="group">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-serif text-md text-[#2C3531] font-medium group-hover:text-[#C87A53] transition-colors">
                        {drink.name}
                      </span>
                      <span className="font-mono text-sm text-[#C87A53] font-semibold shrink-0 ml-4">
                        {drink.price}
                      </span>
                    </div>
                    {drink.description && (
                      <p className="text-xs text-[#2C3531]/70 font-sans italic">
                        {drink.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Cold Drinks & Extras */}
            <div>
              <div className="flex items-center gap-3 mb-6 border-b border-[#607A66]/20 pb-2">
                <span className="text-[#C87A53]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <h4 className="font-serif text-xl text-[#2C3531] font-medium">Cold Drinks &amp; Extras</h4>
              </div>
              <ul className="space-y-6">
                {coldAndExtras.map((drink, idx) => (
                  <li key={idx} className="group">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-serif text-md text-[#2C3531] font-medium group-hover:text-[#C87A53] transition-colors">
                        {drink.name}
                      </span>
                      <span className="font-mono text-sm text-[#C87A53] font-semibold shrink-0 ml-4">
                        {drink.price}
                      </span>
                    </div>
                    {drink.description && (
                      <p className="text-xs text-[#2C3531]/70 font-sans italic">
                        {drink.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Optional Database-driven custom menu items showcase */}
          {dbMenuItems.length > 0 && (
            <div className="mt-16 pt-12 border-t border-[#607A66]/20">
              <div className="mb-6">
                <span className="bg-[#607A66]/10 text-[#607A66] text-xs font-mono px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
                  Today's Chef Specials
                </span>
                <h4 className="font-serif text-lg text-[#2C3531] mt-2">Fresh Out of the Oven Today</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dbMenuItems.map((item) => (
                  <div key={item.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-[#607A66]/10">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-serif text-sm font-semibold text-[#2C3531]">{item.name}</span>
                      <span className="font-mono text-xs text-[#C87A53] font-semibold">£{Number(item.price).toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-[#2C3531]/70 font-sans line-clamp-2">{item.description}</p>
                    {item.dietary_tags && item.dietary_tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {item.dietary_tags.map((tag: string) => (
                          <span key={tag} className="text-[9px] font-mono bg-[#607A66]/10 text-[#607A66] px-1.5 py-0.2 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic CTA at bottom of Menu */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-[#607A66] text-[#FAF6F0] rounded-2xl px-8 py-10 max-w-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="font-serif text-2xl md:text-3xl mb-3">Ready to join us in our cozy shop?</h4>
              <p className="text-[#FAF6F0]/90 text-sm max-w-xl mx-auto mb-6">
                We bake everything fresh specifically for your arrival time. Reserve your table at least 24 hours in advance to secure your spot.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#booking"
                  className="bg-[#C87A53] hover:bg-[#b05f34] text-white font-mono text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 text-center"
                >
                  Book Afternoon Tea
                </a>
                <a
                  href="#hampers"
                  className="bg-transparent hover:bg-white/10 text-white border border-white/30 font-mono text-sm px-6 py-3 rounded-xl transition-all duration-200 text-center"
                >
                  Order Picnic Hampers
                </a>
              </div>
            </div>
            <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          </div>
        </div>

      </div>
    </section>
  );
}