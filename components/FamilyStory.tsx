'use client';

import React, { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Heart, Sparkles, Flame, Wheat, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  dietary_tags: string[];
  is_available: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 16,
    },
  },
};

const cardHoverVariants: Variants = {
  hover: {
    y: -6,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

export function FamilyStory() {
  const [featuredBakes, setFeaturedBakes] = useState<MenuItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'method' | 'roots'>('ingredients');

  useEffect(() => {
    async function fetchBakes() {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .limit(3);

        if (!error && data && data.length > 0) {
          // Map numeric types safely
          const mapped: MenuItem[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            description: item.description,
            price: Number(item.price),
            category: item.category,
            dietary_tags: item.dietary_tags || [],
            is_available: item.is_available,
          }));
          setFeaturedBakes(mapped);
        }
      } catch (err) {
        console.error('Error fetching featured bakes:', err);
      }
    }
    fetchBakes();
  }, []);

  // Standard fallback items based on the provided copy deck
  const fallbackBakes: MenuItem[] = [
    {
      id: 'fallback-1',
      name: 'Signature Warm Scones',
      description: 'Our signature warm plain and fruit scones, served with rich clotted cream and strawberry jam.',
      price: 3.0,
      category: 'Afternoon Tea',
      dietary_tags: ['V'],
      is_available: true,
    },
    {
      id: 'fallback-2',
      name: 'Mini Cheese & Leek Quiches',
      description: 'Warm, savory, and packed with local Welsh cheddar and fresh leeks in flaky hand-pressed pastry.',
      price: 3.5,
      category: 'Savoury',
      dietary_tags: ['V'],
      is_available: true,
    },
    {
      id: 'fallback-3',
      name: 'Victoria Sponge Bites',
      description: 'Classic light sponge filled with elegant vanilla buttercream and our homemade berry jam.',
      price: 3.5,
      category: 'Sweet Extras',
      dietary_tags: ['V'],
      is_available: true,
    },
  ];

  const displayBakes = featuredBakes.length > 0 ? featuredBakes : fallbackBakes;

  const philosophyDetails = {
    ingredients: {
      title: 'Sourced from the Valleys',
      text: 'We use local Welsh ingredients wherever we can. From rich salted Welsh butter to fresh berries from nearby farms, we keep our bakes honest, simple, and incredibly delicious.',
      badge: '100% Local Pride',
      icon: <Wheat className="w-5 h-5 text-[#C87A53]" />,
    },
    method: {
      title: 'Hand-Rolled & Freshly Baked',
      text: 'Every single scone we serve is rolled by hand, every sandwich is freshly prepared, and every picnic hamper is packed with care. No shortcuts, just pure family dedication.',
      badge: 'Crafted with Care',
      icon: <Flame className="w-5 h-5 text-[#C87A53]" />,
    },
    roots: {
      title: 'From Bedwas to Your Heart',
      text: 'What started as a family love for baking around our own kitchen table at 1 Pandy Lane has grown into a warm, welcoming space for our community. We treat everyone like an old friend.',
      badge: 'Family Recipe Heritage',
      icon: <Heart className="w-5 h-5 text-[#C87A53]" />,
    },
  };

  return (
    <section id="story" className="relative bg-[#FAF6F0] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-[#2C3531]">
      {/* Subtle organic background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#607A66] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C87A53] opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
        >
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div variants={itemVariants} className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#607A66]/10 text-[#607A66] text-xs font-semibold uppercase tracking-wider font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                Our Story
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-[#2C3531] leading-tight font-bold">
                From our family kitchen to your table.
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 text-lg text-[#2C3531]/90 leading-relaxed font-sans">
              <p>
                At <span className="font-semibold text-[#607A66]">t and biccies</span>, we believe that the best moments in life are shared over a good cup of tea and a proper slice of cake. What started as a family love for baking around our own kitchen table in Bedwas has grown into a warm, welcoming space for our community.
              </p>
              <p>
                Every single scone we serve is rolled by hand, every sandwich is freshly prepared, and every picnic hamper is packed with care. We use local Welsh ingredients wherever we can, keeping our bakes honest, simple, and incredibly delicious. We treat everyone who walks through our door like an old friend. Come on in, get comfortable, and let us pour you a cuppa.
              </p>
            </motion.div>

            {/* Interactive Philosophy Selector */}
            <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#607A66]/10 shadow-sm">
              <div className="flex border-b border-[#607A66]/10 pb-4 mb-4 gap-2 overflow-x-auto scrollbar-none">
                {(['ingredients', 'method', 'roots'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-[#607A66] text-white shadow-sm'
                        : 'text-[#2C3531]/70 hover:text-[#2C3531] hover:bg-[#607A66]/5'
                    }`}
                  >
                    {tab === 'ingredients' && 'Local Ingredients'}
                    {tab === 'method' && 'Handmade Promise'}
                    {tab === 'roots' && 'Our Roots'}
                  </button>
                ))}
              </div>

              <div className="min-h-[100px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {philosophyDetails[activeTab].icon}
                    <h4 className="font-serif text-lg font-bold text-[#2C3531]">
                      {philosophyDetails[activeTab].title}
                    </h4>
                    <span className="ml-auto text-xs font-semibold text-[#C87A53] bg-[#C87A53]/10 px-2.5 py-0.5 rounded-full">
                      {philosophyDetails[activeTab].badge}
                    </span>
                  </div>
                  <p className="text-sm text-[#2C3531]/80 leading-relaxed font-sans">
                    {philosophyDetails[activeTab].text}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div variants={itemVariants} className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <a
                href="#menu"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#C87A53] hover:bg-[#b0653f] text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C87A53] min-h-[44px] text-base"
              >
                Read Our Full Menu
                <ArrowRight className="w-5 h-5" />
              </a>
              <span className="text-sm text-[#2C3531]/70 italic sm:border-l sm:border-[#2C3531]/20 sm:pl-4 py-1">
                ✓ Proudly baking from scratch at 1 Pandy Lane
              </span>
            </motion.div>
          </div>

          {/* Right Column: Beautiful Image Composition */}
          <div className="lg:col-span-5 relative">
            <motion.div
              variants={itemVariants}
              className="relative z-10 rounded-2xl overflow-hidden shadow-xl aspect-[4/5] border-4 border-white bg-white"
            >
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1200"
                alt="Alex and the family baking together in our warm kitchen"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="font-serif text-xl font-bold">Our Bedwas Family Kitchen</p>
                <p className="text-xs text-white/90">Where every recipe is crafted with pure passion</p>
              </div>
            </motion.div>

            {/* Overlapping secondary decorative photo */}
            <motion.div
              variants={itemVariants}
              className="absolute -bottom-10 -left-10 lg:-left-16 z-20 w-44 sm:w-56 rounded-xl overflow-hidden shadow-2xl border-4 border-white bg-white hidden sm:block"
            >
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=600"
                alt="Steaming tea and fresh scones on a wooden table"
                className="w-full aspect-square object-cover"
                loading="lazy"
              />
            </motion.div>

            {/* Terracotta Graphic Accent */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#C87A53] rounded-full -z-10 opacity-20" />
            <div className="absolute -bottom-6 right-12 w-16 h-16 bg-[#607A66] rounded-full -z-10 opacity-20" />
          </div>
        </motion.div>

        {/* Dynamic Subsection: Fresh out of the oven today */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-24 pt-16 border-t border-[#607A66]/10"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C3531]">
              Freshly Out of Our Oven Today
            </h3>
            <p className="text-sm sm:text-base text-[#2C3531]/75 mt-2 font-sans">
              Take a look at some of our family-favorite bakes prepared in our Bedwas kitchen daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayBakes.map((bake) => (
              <motion.div
                key={bake.id}
                variants={cardHoverVariants}
                whileHover="hover"
                className="bg-white rounded-2xl p-6 border border-[#607A66]/10 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="text-xs font-bold text-[#607A66] bg-[#607A66]/10 px-2.5 py-1 rounded-full uppercase tracking-wider font-sans">
                      {bake.category}
                    </span>
                    <span className="font-serif text-lg font-bold text-[#C87A53]">
                      £{bake.price.toFixed(2)}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl font-bold text-[#2C3531] mb-2">
                    {bake.name}
                  </h4>
                  <p className="text-sm text-[#2C3531]/80 leading-relaxed mb-4 font-sans">
                    {bake.description}
                  </p>
                </div>

                {bake.dietary_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#607A66]/5">
                    {bake.dietary_tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF6F0] text-[#2C3531]/70 border border-[#2C3531]/10 uppercase"
                        title={
                          tag === 'V'
                            ? 'Vegetarian'
                            : tag === 'VG'
                            ? 'Vegan'
                            : tag === 'GF'
                            ? 'Gluten-Free'
                            : tag === 'DF'
                            ? 'Dairy-Free'
                            : tag
                        }
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}