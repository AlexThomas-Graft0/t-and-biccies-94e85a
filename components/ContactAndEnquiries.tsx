'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

// Premium SVG Icons
function MapPinIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function PhoneIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.155-.44.011-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  );
}

function EnvelopeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

function ClockIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function CopyIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.16-7.5-8.875a9.06 9.06 0 0 0-1.5-.124m7.5 10.376c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 0 1 12 11.25V9M9 10.5h.008v.008H9V10.5Zm0 2.25h.008v.008H9v-.008Zm0 2.25h.008v.008H9V15Zm3-4.5h.008v.008H12V10.5Zm0 2.25h.008v.008H12v-.008Zm0 2.25h.008v.008H12V15Zm3-4.5h.008v.008H15V10.5Zm0 2.25h.008v.008H15v-.008Z" />
    </svg>
  );
}

function SparklesIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.187L15 15l-5.187.904zM18.007 7.119L17 11l-1.007-3.881L12 6.119l3.993-1.007L17 1l1.007 4.112L22 6.119l-3.993 1.007z" />
    </svg>
  );
}

const animationVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15,
    },
  },
};

export function ContactAndEnquiries() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    guestCount: '',
    eventType: 'Birthday Party',
    details: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedText, setCopiedText] = useState<'phone' | 'address' | 'email' | null>(null);
  const [isOpenNow, setIsOpenNow] = useState(false);

  // Safely evaluate opening status after mounting to avoid hydration mismatch
  useEffect(() => {
    // Current Wales time is roughly British Summer Time / GMT.
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hours = now.getHours();
    
    // Mon - Fri (1-5), 8 AM to 4 PM (8 to 16)
    if (day >= 1 && day <= 5 && hours >= 8 && hours < 16) {
      setIsOpenNow(true);
    } else {
      setIsOpenNow(false);
    }
  }, []);

  const handleCopy = (text: string, type: 'phone' | 'address' | 'email') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, name: value })); // Typo safe setter or dynamic:
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Combine form data into the single 'message' text field from the DB schema
    const combinedMessage = `[Event Type: ${formData.eventType}] [Date: ${formData.eventDate}] [Estimated Guests: ${formData.guestCount}] Details: ${formData.details}`;

    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            message: combinedMessage,
          },
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        guestCount: '',
        eventType: 'Birthday Party',
        details: '',
      });
    } catch (err) {
      console.error('Enquiry submission failed:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-[#FAF6F0] text-[#2C3531] overflow-hidden">
      {/* Decorative floral background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#607A66]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C87A53]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION 5.1: Contact Info & Map */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={animationVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-24"
        >
          {/* Left Column: Direct Access Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#607A66]/10 text-[#607A66] mb-4">
                <SparklesIcon className="w-3.5 h-3.5" /> Come Say Hello
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2C3531] tracking-tight leading-tight">
                Pop in and say hello.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#2C3531]/80 font-sans leading-relaxed">
                We love meeting our neighbors! Whether you want to book a table over the phone, have a question about our ingredients, or just want to chat about cakes, our door is always open.
              </p>
            </div>

            {/* Address, Phone, Email & Hours Blocks */}
            <div className="space-y-6">
              
              {/* Card 1: Find Our Door */}
              <div className="group relative p-5 bg-white rounded-2xl border border-[#607A66]/10 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#607A66]/10 text-[#607A66] flex items-center justify-center">
                    <MapPinIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#2C3531]/60 uppercase tracking-wider">Find Our Door</h4>
                      <button 
                        onClick={() => handleCopy('1 Pandy Lane, Bedwas, Caerphilly, Wales, CF83 8BJ', 'address')}
                        className="text-[#607A66] hover:text-[#C87A53] p-1 rounded-md hover:bg-gray-50 transition-colors"
                        title="Copy Address"
                      >
                        {copiedText === 'address' ? <span className="text-xs font-sans text-emerald-600 font-medium">Copied!</span> : <CopyIcon />}
                      </button>
                    </div>
                    <p className="mt-1 font-serif text-lg text-[#2C3531] font-bold">t and biccies</p>
                    <p className="text-sm text-[#2C3531]/85 mt-0.5">
                      1 Pandy Lane, Bedwas,<br />
                      Caerphilly, Wales, CF83 8BJ
                    </p>
                    <p className="text-xs text-[#2C3531]/60 mt-2 italic">
                      (We are located right in the heart of Bedwas village, just a short walk from the local shops and bus stops.)
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: Contact Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Phone */}
                <div className="p-5 bg-white rounded-2xl border border-[#607A66]/10 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#C87A53]/10 text-[#C87A53] flex items-center justify-center">
                        <PhoneIcon className="w-4 h-4" />
                      </div>
                      <button 
                        onClick={() => handleCopy('07588896465', 'phone')}
                        className="text-[#607A66] hover:text-[#C87A53] p-1 rounded-md hover:bg-gray-50 transition-colors"
                        title="Copy Phone"
                      >
                        {copiedText === 'phone' ? <span className="text-xs font-sans text-emerald-600 font-medium">Copied!</span> : <CopyIcon />}
                      </button>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#2C3531]/60 uppercase tracking-wider">Give Us a Ring</h4>
                      <a href="tel:07588896465" className="block text-base font-bold text-[#2C3531] mt-1 hover:text-[#C87A53] transition-colors">
                        07588896465
                      </a>
                      <p className="text-xs text-[#2C3531]/60 mt-1 italic leading-tight">
                        Call during hours. Leave a message if we are baking!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="p-5 bg-white rounded-2xl border border-[#607A66]/10 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col h-full justify-between">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[#607A66]/10 text-[#607A66] flex items-center justify-center">
                        <EnvelopeIcon className="w-4 h-4" />
                      </div>
                      <button 
                        onClick={() => handleCopy('alex-thomas92@outlook.com', 'email')}
                        className="text-[#607A66] hover:text-[#C87A53] p-1 rounded-md hover:bg-gray-50 transition-colors"
                        title="Copy Email"
                      >
                        {copiedText === 'email' ? <span className="text-xs font-sans text-emerald-600 font-medium">Copied!</span> : <CopyIcon />}
                      </button>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-[#2C3531]/60 uppercase tracking-wider">Send an Email</h4>
                      <a href="mailto:alex-thomas92@outlook.com" className="block text-sm font-bold text-[#2C3531] mt-1 hover:text-[#C87A53] transition-colors break-words">
                        alex-thomas92@outlook.com
                      </a>
                    </div>
                  </div>
                </div>

              </div>

              {/* Card 3: Opening Hours */}
              <div className="p-5 bg-white rounded-2xl border border-[#607A66]/10 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <ClockIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[#2C3531]/60 uppercase tracking-wider">Our Weekly Hours</h4>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isOpenNow ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-emerald-600 animate-pulse' : 'bg-red-600'}`}></span>
                        {isOpenNow ? 'Open Now' : 'Closed Now'}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2 text-sm text-[#2C3531]/90">
                      <div className="flex justify-between border-b border-gray-100 pb-1">
                        <span className="font-medium">Monday to Friday</span>
                        <span className="font-semibold text-[#2C3531]">8:00 AM - 4:00 PM</span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>Saturday & Sunday</span>
                        <span className="italic text-xs">Closed for private events</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Beautiful Interactive Map Card */}
          <div className="lg:col-span-7 h-full min-h-[450px] lg:min-h-[550px] relative rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white group">
            {/* Embedded maps iframe styled elegantly */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2480.076615555416!2d-3.2045582233777596!3d51.58514117183184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m3!1zMSBQYW5keSBMbiwgQmVkd2FzLCBDYWVycGhpbGx5IENGODMgOEJKLCBVSw!5e0!3m2!1sen!2sus!4v1710000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full grayscale-[10%] contrast-[110%] group-hover:grayscale-0 transition-all duration-700"
              title="t and biccies Location Map"
            />
            
            {/* Map Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#2C3531]/95 text-[#FAF6F0] backdrop-blur-md p-4 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#FAF6F0]/10">
              <div>
                <p className="text-xs text-[#FAF6F0]/60 uppercase tracking-widest font-semibold">Our Location</p>
                <p className="font-serif text-base font-bold mt-0.5">1 Pandy Lane, Bedwas</p>
                <p className="text-xs text-[#FAF6F0]/75">Directly opposite the Bedwas Community Centre</p>
              </div>
              <a 
                href="https://maps.google.com/?q=1+Pandy+Lane,+Bedwas,+Caerphilly,+CF83+8BJ" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center px-4 py-2 bg-[#C87A53] hover:bg-[#b56b46] text-white font-semibold text-xs rounded-xl transition-colors shrink-0 gap-1.5"
              >
                <MapPinIcon className="w-3.5 h-3.5" />
                Get Directions
              </a>
            </div>
          </div>
        </motion.div>

        {/* SECTION 5.2: Custom Events & Large Orders Enquiry Form */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={animationVariants}
          className="max-w-4xl mx-auto"
        >
          <div className="relative bg-[#FAF6F0] rounded-3xl border-2 border-[#607A66] p-8 sm:p-12 shadow-xl overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#607A66_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2C3531]">
                Planning a special event?
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#2C3531]/80 leading-relaxed font-sans">
                From baby showers and birthday parties in our cozy cafe to large afternoon tea spreads delivered straight to your home or office, we&apos;d love to help make your event special. Fill out the form below, and we&apos;ll get back to you within 24 hours to plan the perfect menu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="relative space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Field 1: Your Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#2C3531] mb-1">
                    Your Name <span className="text-[#C87A53]">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="e.g., Lowri Roberts"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#607A66]/30 bg-white text-[#2C3531] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#607A66] focus:border-transparent transition-all"
                  />
                </div>

                {/* Field 2: Email Address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#2C3531] mb-1">
                    Email Address <span className="text-[#C87A53]">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="e.g., lowri@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#607A66]/30 bg-white text-[#2C3531] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#607A66] focus:border-transparent transition-all"
                  />
                </div>

                {/* Field 3: Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#2C3531] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="e.g., 07123 456789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#607A66]/30 bg-white text-[#2C3531] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#607A66] focus:border-transparent transition-all"
                  />
                </div>

                {/* Field 4: Date of Your Event */}
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-semibold text-[#2C3531] mb-1">
                    Date of Your Event
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#607A66]/30 bg-white text-[#2C3531] focus:outline-none focus:ring-2 focus:ring-[#607A66] focus:border-transparent transition-all"
                  />
                </div>

                {/* Field 5: Estimated Number of Guests */}
                <div>
                  <label htmlFor="guestCount" className="block text-sm font-semibold text-[#2C3531] mb-1">
                    Estimated Number of Guests
                  </label>
                  <input
                    type="text"
                    id="guestCount"
                    name="guestCount"
                    placeholder="e.g., 15 guests"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#607A66]/30 bg-white text-[#2C3531] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#607A66] focus:border-transparent transition-all"
                  />
                </div>

                {/* Field 6: What kind of event are you hosting? */}
                <div>
                  <label htmlFor="eventType" className="block text-sm font-semibold text-[#2C3531] mb-1">
                    What kind of event are you hosting?
                  </label>
                  <select
                    id="eventType"
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#607A66]/30 bg-white text-[#2C3531] focus:outline-none focus:ring-2 focus:ring-[#607A66] focus:border-transparent transition-all"
                  >
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Baby Shower">Baby Shower</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Corporate Event">Corporate Event</option>
                    <option value="Wake">Wake</option>
                    <option value="Other Special Gathering">Other Special Gathering</option>
                  </select>
                </div>

              </div>

              {/* Field 7: Tell us a little about your event */}
              <div>
                <label htmlFor="details" className="block text-sm font-semibold text-[#2C3531] mb-1">
                  Tell us a little about your event <span className="text-[#C87A53]">*</span>
                </label>
                <textarea
                  id="details"
                  name="details"
                  required
                  rows={4}
                  placeholder="e.g., I am looking to host a baby shower for 12 people at the cafe on a Friday afternoon. We would like a mix of traditional and savoury afternoon tea packages with gluten-free options."
                  value={formData.details}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#607A66]/30 bg-white text-[#2C3531] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#607A66] focus:border-transparent transition-all"
                />
              </div>

              {/* Status Notifications */}
              {submitStatus === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-3"
                >
                  <span className="text-xl">✨</span>
                  <div>
                    <strong className="font-semibold block">Thank you so much!</strong>
                    Your enquiry has been sent to Alex. We will get back to you within 24 hours.
                  </div>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-3"
                >
                  <span className="text-xl">⚠️</span>
                  <div>
                    <strong className="font-semibold block">Oops, something went wrong.</strong>
                    Please try again or contact us directly at <a href="mailto:alex-thomas92@outlook.com" className="underline font-bold">alex-thomas92@outlook.com</a>.
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 bg-[#C87A53] hover:bg-[#b56b46] active:bg-[#a15f3d] disabled:bg-gray-400 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C87A53]"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Enquiry...
                    </>
                  ) : (
                    'Send Enquiry to Alex'
                  )}
                </button>
              </div>

            </form>
          </div>
        </motion.div>

      </div>
    </section>
  );
}