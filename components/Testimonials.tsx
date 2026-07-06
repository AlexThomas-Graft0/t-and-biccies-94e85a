'use client';

import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

// Premium Lucide-style SVG Icons to avoid import discrepancy
function StarIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function QuoteIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9 Schott-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}

function HeartIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}

interface TestimonialData {
  id: string;
  rating: number;
  text: string;
  reviewerName: string;
  location: string;
  image: string;
  tag: string;
}

const localTestimonials: TestimonialData[] = [
  {
    id: 'rev-1',
    rating: 5,
    text: "The warmest welcome you'll find in Caerphilly! The scones were still warm when they brought them out, and the homemade jam is absolutely to die for. It feels like sitting in your nan's cozy kitchen.",
    reviewerName: "Sian Davies",
    location: "Bedwas",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    tag: "Cafe Dining"
  },
  {
    id: 'rev-2',
    rating: 5,
    text: "We ordered three Welsh Valley Picnic Hampers for a family walk up Caerphilly Mountain. Everything was beautifully packed, incredibly fresh, and there was so much food! It made our day so special.",
    reviewerName: "Gareth Evans",
    location: "Caerphilly",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    tag: "Valley Picnic"
  },
  {
    id: 'rev-3',
    rating: 5,
    text: "Sent an afternoon tea gift box to my sister for her birthday. She was over the moon! The packaging was gorgeous and the gluten-free options were just as delicious as the standard ones.",
    reviewerName: "Megan Roberts",
    location: "Ystrad Mynach",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    tag: "Gift Delivery"
  }
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15
    }
  }
};

export function Testimonials() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: `[Website Testimonial Submission] ${formData.message}`
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="bg-[#FAF6F0] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#C87A53] font-sans font-semibold tracking-widest text-xs uppercase block mb-3">
            A warm Welsh welcome, one cuppa at a time
          </span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#2C3531] tracking-tight leading-tight mb-6">
            Loved by locals in Bedwas &amp; beyond
          </h2>
          <div className="w-24 h-1 bg-[#607A66] mx-auto mb-6 rounded-full" />
          <p className="text-[#2C3531]/80 font-sans text-lg leading-relaxed">
            There is nothing we love more than making our guests feel like old friends. Read what our wonderful community has to say about our freshly baked scones, cozy shop, and valley hampers.
          </p>
        </div>

        {/* Testimonials Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {localTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-[#607A66]/10 flex flex-col justify-between relative group overflow-hidden"
            >
              {/* Subtle top brand accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#607A66] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              
              <div>
                {/* Rating & Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex text-[#C87A53]">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 fill-current mr-0.5" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-[#FAF6F0] text-[#607A66] rounded-full border border-[#607A66]/10">
                    {testimonial.tag}
                  </span>
                </div>

                {/* Quote Icon */}
                <QuoteIcon className="text-[#607A66]/10 mb-4" />

                {/* Testimonial Text */}
                <p className="text-[#2C3531] font-sans text-base leading-relaxed italic mb-8 relative z-10">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>

              {/* Reviewer Bio */}
              <div className="flex items-center pt-6 border-t border-[#FAF6F0] mt-auto">
                <img
                  src={testimonial.image}
                  alt={testimonial.reviewerName}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#607A66]/20"
                />
                <div>
                  <h4 className="font-serif text-[#2C3531] font-semibold text-base">
                    {testimonial.reviewerName}
                  </h4>
                  <p className="text-[#607A66] font-sans text-xs flex items-center">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#C87A53] mr-1.5" />
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Share your story / Enquiry block */}
        <div className="bg-[#607A66] rounded-3xl overflow-hidden shadow-xl text-white relative">
          
          {/* Background Decorative Graphic */}
          <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 sm:p-12 lg:p-16 relative z-10 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm">
                <HeartIcon className="w-4 h-4 text-[#C87A53] fill-[#C87A53]" />
                <span>Share your experience</span>
              </div>
              <h3 className="text-3xl sm:text-4xl font-serif leading-tight">
                Have you baked memories with us?
              </h3>
              <p className="text-white/80 font-sans leading-relaxed">
                We are a small, family-run cafe in the heart of Caerphilly, and your feedback helps us keep doing what we love. Drop us a message, share your experience, or ask Alex a question about our homemade menu!
              </p>
              
              <div className="pt-4 border-t border-white/10 space-y-3 text-sm text-white/70 font-sans">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C87A53]" />
                  We read every single message around our kitchen table.
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C87A53]" />
                  Need catering or large orders? We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            </div>

            {/* Right Form Column */}
            <div className="lg:col-span-7 bg-[#FAF6F0] text-[#2C3531] p-6 sm:p-10 rounded-2xl shadow-lg border border-white/20">
              <h4 className="text-2xl font-serif text-[#2C3531] mb-2">
                Send a Message to Alex &amp; Family
              </h4>
              <p className="text-sm text-[#2C3531]/70 font-sans mb-6">
                Tell us about your visit, leave a 5-star review, or ask about our bakes.
              </p>

              {submitStatus === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#607A66]/10 border border-[#607A66] rounded-xl p-6 text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-[#607A66] rounded-full flex items-center justify-center mx-auto text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h5 className="font-serif text-xl text-[#2C3531] font-bold">Thank you so much!</h5>
                  <p className="text-sm text-[#2C3531]/80 max-w-md mx-auto">
                    Your message has been received. Our family will read your kind words, and if you asked a question, we will get back to you soon.
                  </p>
                  <button
                    onClick={() => setSubmitStatus('idle')}
                    className="text-xs font-semibold underline text-[#C87A53] hover:text-[#C87A53]/80 transition-colors"
                  >
                    Send another note
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-[#2C3531]/70 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g., Sarah Jenkins"
                        className="w-full bg-white border border-[#607A66]/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C87A53] focus:border-transparent transition-all placeholder-[#2C3531]/40"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-[#2C3531]/70 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g., sarah@example.com"
                        className="w-full bg-white border border-[#607A66]/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C87A53] focus:border-transparent transition-all placeholder-[#2C3531]/40"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-[#2C3531]/70 mb-1.5">
                      Phone Number <span className="text-xs text-[#2C3531]/40 lowercase italic">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g., 07123 456789"
                      className="w-full bg-white border border-[#607A66]/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C87A53] focus:border-transparent transition-all placeholder-[#2C3531]/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-[#2C3531]/70 mb-1.5">
                      Your Review or Message *
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us what you loved, or ask us anything! e.g., 'The scones were warm and the jam was delicious...'"
                      className="w-full bg-white border border-[#607A66]/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#C87A53] focus:border-transparent transition-all placeholder-[#2C3531]/40 resize-none"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-sm text-red-600 font-medium bg-red-50 p-2.5 rounded-lg border border-red-200">
                      Oops! Something went wrong while saving your message. Please try again.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C87A53] hover:bg-[#C87A53]/90 text-white font-serif font-semibold text-base py-3 px-6 rounded-lg shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending to the kitchen...
                      </>
                    ) : (
                      'Send Love Note to Alex'
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}