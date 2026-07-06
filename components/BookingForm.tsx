'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

// Types matching database schema and form states
interface ReservationForm {
  guests: number;
  date: string;
  timeSlot: string;
  packages: {
    traditional: number;
    savoury: number;
    kids: number;
    seasonal: number;
  };
  name: string;
  email: string;
  phone: string;
  dietary: {
    gf: boolean;
    v: boolean;
    vg: boolean;
    df: boolean;
    nut: boolean;
  };
  specialRequests: string;
}

const INITIAL_FORM_STATE: ReservationForm = {
  guests: 2,
  date: '',
  timeSlot: '',
  packages: {
    traditional: 0,
    savoury: 0,
    kids: 0,
    seasonal: 0,
  },
  name: '',
  email: '',
  phone: '',
  dietary: {
    gf: false,
    v: false,
    vg: false,
    df: false,
    nut: false,
  },
  specialRequests: '',
};

const TIME_SLOTS = [
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
];

const PACKAGES = [
  {
    key: 'traditional' as const,
    name: 'Traditional Afternoon Tea',
    price: 18.50,
    description: 'Delicate sandwiches, hand-rolled warm scones with clotted cream & jam, and fresh daily sweet treats.',
    tags: ['V', 'GF', 'DF'],
  },
  {
    key: 'savoury' as const,
    name: 'The Savoury Afternoon Tea',
    price: 19.50,
    description: 'Welsh cheddar & chutney sandwiches, warm sausage rolls, cheese & leek quiche, and cheddar & chive scone.',
    tags: ['V'],
  },
  {
    key: 'kids' as const,
    name: 'The Little Bakers Tea (For Kids)',
    price: 9.50,
    description: 'Soft triangle sandwiches, mini chocolate chip scone, vanilla cupcake, and fruit juice. Under 12s.',
    tags: ['V', 'GF'],
  },
  {
    key: 'seasonal' as const,
    name: 'The Valley Seasonal Special',
    price: 21.00,
    description: 'Cozy autumn/winter special: turkey & cranberry, spiced apple scones, pumpkin tarts, & spiced tea.',
    tags: ['V', 'GF'],
  },
];

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 15, staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -15, transition: { duration: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 14 } },
};

export function BookingForm() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<ReservationForm>(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [minDateString, setMinDateString] = useState<string>('2024-11-20');

  // Safely calculate default future dates after mount to avoid SSR mismatch
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setMinDateString(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, guests: parseInt(e.target.value) }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const day = selectedDate.getDay();
    // 0 = Sunday, 6 = Saturday. Cafe is open Monday through Friday for bookings.
    if (day === 0 || day === 6) {
      setErrorMsg('Please select a weekday (Monday to Friday). The cafe is closed on weekends.');
      setFormData((prev) => ({ ...prev, date: '' }));
    } else {
      setErrorMsg(null);
      setFormData((prev) => ({ ...prev, date: e.target.value }));
    }
  };

  const selectTimeSlot = (slot: string) => {
    setFormData((prev) => ({ ...prev, timeSlot: slot }));
  };

  const updatePackageQty = (key: keyof typeof formData.packages, increment: boolean) => {
    setFormData((prev) => {
      const currentQty = prev.packages[key];
      const newQty = increment ? currentQty + 1 : Math.max(0, currentQty - 1);
      return {
        ...prev,
        packages: {
          ...prev.packages,
          [key]: newQty,
        },
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDietaryToggle = (key: keyof typeof formData.dietary) => {
    setFormData((prev) => ({
      ...prev,
      dietary: {
        ...prev.dietary,
        [key]: !prev.dietary[key],
      },
    }));
  };

  // Helper calculation for grand total
  const calculateTotal = () => {
    return (
      formData.packages.traditional * 18.50 +
      formData.packages.savoury * 19.50 +
      formData.packages.kids * 9.50 +
      formData.packages.seasonal * 21.00
    );
  };

  const totalPackagesSelected = 
    formData.packages.traditional +
    formData.packages.savoury +
    formData.packages.kids +
    formData.packages.seasonal;

  // Validation
  const isStep1Valid = formData.guests > 0 && formData.date !== '' && formData.timeSlot !== '';
  const isStep2Valid = totalPackagesSelected > 0;
  const isStep3Valid = formData.name.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '';

  const nextStep = () => {
    if (step === 1 && !isStep1Valid) {
      setErrorMsg('Please select guest count, date, and an available time slot.');
      return;
    }
    if (step === 2 && !isStep2Valid) {
      setErrorMsg('Please select at least one afternoon tea package.');
      return;
    }
    if (step === 3 && !isStep3Valid) {
      setErrorMsg('Please provide your name, email, and phone number.');
      return;
    }
    setErrorMsg(null);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Prepare dietary notes list
    const dietaryNotesList: string[] = [];
    if (formData.dietary.gf) dietaryNotesList.push('Gluten-Free');
    if (formData.dietary.v) dietaryNotesList.push('Vegetarian');
    if (formData.dietary.vg) dietaryNotesList.push('Vegan');
    if (formData.dietary.df) dietaryNotesList.push('Dairy-Free');
    if (formData.dietary.nut) dietaryNotesList.push('Nut Allergy');

    // Build package descriptions
    const selectedPacks: string[] = [];
    if (formData.packages.traditional > 0) selectedPacks.push(`${formData.packages.traditional}x Traditional`);
    if (formData.packages.savoury > 0) selectedPacks.push(`${formData.packages.savoury}x Savoury`);
    if (formData.packages.kids > 0) selectedPacks.push(`${formData.packages.kids}x Kids`);
    if (formData.packages.seasonal > 0) selectedPacks.push(`${formData.packages.seasonal}x Seasonal`);

    const packagesSummaryText = selectedPacks.join(', ');

    try {
      const { error } = await supabase
        .from('reservations')
        .insert({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          reservation_date: formData.date,
          time_slot: formData.timeSlot,
          guest_count: formData.guests,
          dietary_notes: dietaryNotesList.join(', ') || 'None stated',
          special_requests: `Packages: ${packagesSummaryText}. Notes: ${formData.specialRequests || 'None'}`,
          status: 'Pending',
        });

      if (error) {
        throw new Error(error.message);
      }

      setStep(5); // Success step
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while saving your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Human friendly date string
  const getFriendlyDate = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <section id="booking" className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF6F0] text-[#2C3531]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sm font-semibold tracking-wider text-[#C87A53] uppercase block mb-2">
            A warm Welsh welcome, one cuppa at a time.
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-[#2C3531] tracking-tight mb-4">
            Reserve a table in our cozy Bedwas cafe.
          </h1>
          <p className="text-lg text-[#2C3531]/80 font-sans">
            We would love to host you! To make sure we have your table ready and your scones fresh out of the
            oven, we ask that you book your afternoon tea at least 24 hours in advance.
          </p>
        </div>

        {/* Form layout: Split panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-white rounded-2xl shadow-xl overflow-hidden border border-[#607A66]/10">
          
          {/* Left panel: Info & Visual banner */}
          <div className="lg:col-span-5 bg-[#607A66] text-[#FAF6F0] p-8 lg:p-12 h-full flex flex-col justify-between min-h-[400px] lg:min-h-[650px] relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80"
                alt="Cozy Afternoon Tea Table"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="relative z-10 space-y-6">
              <div className="inline-block bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider text-[#FAF6F0]">
                ✓ Proudly baking from scratch at 1 Pandy Lane
              </div>
              <h2 className="text-3xl font-serif leading-tight">Your Cozy Afternoon Tea Experience</h2>
              <p className="text-sm text-[#FAF6F0]/90 leading-relaxed max-w-sm">
                Each booking reserves your private table in our family cafe. Sit back, relax, and enjoy bottomless pots of tea alongside our handcrafted tiers.
              </p>
            </div>

            <div className="relative z-10 pt-8 border-t border-white/20 space-y-4 text-sm">
              <div>
                <p className="font-semibold text-white">Opening Hours for Bookings:</p>
                <p className="text-[#FAF6F0]/80">Monday to Friday: 8:00 AM - 4:00 PM</p>
              </div>
              <div>
                <p className="font-semibold text-white">Group Sizes:</p>
                <p className="text-[#FAF6F0]/80">Online booking: 1 to 8 guests. For larger parties, baby showers, or custom events, please use our custom enquiry options.</p>
              </div>
            </div>
          </div>

          {/* Right panel: Step-by-step Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between min-h-[550px]">
            {/* Step Indicators */}
            {step < 5 && (
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#607A66] mb-3">
                  <span>Step {step} of 4</span>
                  <span>{step === 1 ? 'Party & Date' : step === 2 ? 'Choose Packages' : step === 3 ? 'Your Details' : 'Review & Confirm'}</span>
                </div>
                <div className="h-1.5 w-full bg-[#FAF6F0] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C87A53] transition-all duration-300 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Message banner */}
            {errorMsg && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-[#DC2626] text-sm text-[#DC2626] rounded">
                <p className="font-semibold">Please correct the following:</p>
                <p>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Party Size & Date & Time */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="guests" className="block font-serif text-lg text-[#2C3531] font-medium">
                        How many guests are joining us?
                      </label>
                      <select
                        id="guests"
                        name="guests"
                        value={formData.guests}
                        onChange={handleGuestsChange}
                        className="w-full px-4 py-3 bg-[#FAF6F0] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607A66] text-base"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'Guest' : 'Guests'} {num === 8 ? '(For 9+, please contact us directly)' : ''}
                          </option>
                        ))}
                      </select>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label htmlFor="date" className="block font-serif text-lg text-[#2C3531] font-medium">
                        Choose a date (Monday – Friday only)
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        min={minDateString}
                        value={formData.date}
                        onChange={handleDateChange}
                        className="w-full px-4 py-3 bg-[#FAF6F0] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607A66] text-base"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-3">
                      <label className="block font-serif text-lg text-[#2C3531] font-medium">
                        Select an available time slot
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {TIME_SLOTS.map((slot) => {
                          const isSelected = formData.timeSlot === slot;
                          return (
                            <button
                              type="button"
                              key={slot}
                              onClick={() => selectTimeSlot(slot)}
                              className={`py-3 px-2 text-center rounded-lg text-sm font-semibold transition-all duration-200 border ${
                                isSelected
                                  ? 'bg-[#C87A53] text-[#FAF6F0] border-[#C87A53] shadow-md scale-[1.02]'
                                  : 'bg-[#FAF6F0] text-[#2C3531] border-gray-200 hover:border-[#607A66] hover:bg-white'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  </motion.div>
                )}

                {/* STEP 2: Choose Afternoon Tea Packages */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="mb-2">
                      <h2 className="font-serif text-xl text-[#2C3531] font-semibold">What would you like to enjoy?</h2>
                      <p className="text-xs text-gray-500">Specify quantities for your group. You can mix and match.</p>
                    </div>

                    <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                      {PACKAGES.map((pkg) => {
                        const count = formData.packages[pkg.key];
                        return (
                          <motion.div
                            variants={itemVariants}
                            key={pkg.key}
                            className={`p-4 rounded-xl border transition-all ${
                              count > 0 ? 'border-[#C87A53] bg-[#C87A53]/5' : 'border-gray-200 bg-white'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-serif text-base font-bold text-[#2C3531]">{pkg.name}</h3>
                                  <span className="text-xs font-semibold text-[#C87A53] bg-[#C87A53]/10 px-2 py-0.5 rounded-full">
                                    £{pkg.price.toFixed(2)} each
                                  </span>
                                  <div className="flex gap-1">
                                    {pkg.tags.map((tag) => (
                                      <span key={tag} className="text-[10px] font-mono border border-gray-300 px-1 rounded text-gray-500">
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{pkg.description}</p>
                              </div>

                              {/* Quantity Selector */}
                              <div className="flex items-center gap-2 bg-[#FAF6F0] rounded-lg p-1 border border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => updatePackageQty(pkg.key, false)}
                                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-[#2C3531] font-bold text-lg transition-colors"
                                >
                                  -
                                </button>
                                <span className="w-6 text-center font-mono font-bold text-sm text-[#2C3531]">
                                  {count}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updatePackageQty(pkg.key, true)}
                                  className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-[#2C3531] font-bold text-lg transition-colors"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Dynamic helper text matching package count with guests */}
                    {totalPackagesSelected !== formData.guests && (
                      <div className="p-3 bg-amber-50 rounded-lg text-xs text-[#D97706] flex justify-between items-center">
                        <span>
                          Tip: You have {formData.guests} {formData.guests === 1 ? 'guest' : 'guests'} but selected {totalPackagesSelected} package(s).
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            // Quick fill Traditional for all guests
                            setFormData((prev) => ({
                              ...prev,
                              packages: { traditional: prev.guests, savoury: 0, kids: 0, seasonal: 0 },
                            }));
                          }}
                          className="underline hover:text-amber-800 font-semibold"
                        >
                          Match to guests
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: Contact & Dietary Details */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <motion.div variants={itemVariants} className="space-y-1">
                        <label htmlFor="name" className="block text-sm font-semibold text-[#2C3531]">
                          Your Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="e.g., Sarah Jenkins"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607A66] text-sm"
                        />
                      </motion.div>

                      <motion.div variants={itemVariants} className="space-y-1">
                        <label htmlFor="email" className="block text-sm font-semibold text-[#2C3531]">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="e.g., sarah@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607A66] text-sm"
                        />
                      </motion.div>
                    </div>

                    <motion.div variants={itemVariants} className="space-y-1">
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#2C3531]">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="e.g., 07123 456789"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-[#FAF6F0] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607A66] text-sm"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2 pt-2">
                      <span className="block text-sm font-semibold text-[#2C3531]">
                        Dietary Requirements & Allergies
                      </span>
                      <p className="text-xs text-gray-500">
                        Please check any boxes that apply to your group so we can prepare your menu safely.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                        {[
                          { key: 'gf' as const, label: 'Gluten-Free (GF)' },
                          { key: 'v' as const, label: 'Vegetarian (V)' },
                          { key: 'vg' as const, label: 'Vegan (VG)' },
                          { key: 'df' as const, label: 'Dairy-Free (DF)' },
                          { key: 'nut' as const, label: 'Nut Allergy' },
                        ].map((diet) => {
                          const isChecked = formData.dietary[diet.key];
                          return (
                            <button
                              type="button"
                              key={diet.key}
                              onClick={() => handleDietaryToggle(diet.key)}
                              className={`py-2 px-3 text-left rounded-lg text-xs font-semibold border transition-all ${
                                isChecked
                                  ? 'bg-[#607A66] text-[#FAF6F0] border-[#607A66]'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#607A66]'
                              }`}
                            >
                              {isChecked ? '✓ ' : ''}
                              {diet.label}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-1">
                      <label htmlFor="specialRequests" className="block text-sm font-semibold text-[#2C3531]">
                        Special Requests or Notes
                      </label>
                      <textarea
                        id="specialRequests"
                        name="specialRequests"
                        rows={2}
                        placeholder='e.g., "Celebrating my mum&apos;s 70th birthday!" or "We will have a baby pram with us and need a little extra space."'
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-[#FAF6F0] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#607A66] text-sm"
                      />
                    </motion.div>
                  </motion.div>
                )}

                {/* STEP 4: Review & Submit */}
                {step === 4 && (
                  <motion.div
                    key="step4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#607A66]/20 space-y-4">
                      <h3 className="font-serif text-lg text-[#2C3531] font-bold border-b border-gray-200 pb-2">
                        Your Reservation Summary
                      </h3>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Party Size</p>
                          <p className="font-semibold text-[#2C3531]">{formData.guests} Guests</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Date & Time</p>
                          <p className="font-semibold text-[#2C3531]">
                            {getFriendlyDate(formData.date)} at {formData.timeSlot}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Selected Packages</p>
                        <div className="space-y-1">
                          {PACKAGES.map((pkg) => {
                            const count = formData.packages[pkg.key];
                            if (count === 0) return null;
                            return (
                              <div key={pkg.key} className="flex justify-between items-center bg-white px-3 py-1.5 rounded border border-gray-100">
                                <span className="text-[#2C3531] font-medium text-xs">
                                  {count}x {pkg.name}
                                </span>
                                <span className="font-mono text-xs font-semibold text-[#C87A53]">
                                  £{(count * pkg.price).toFixed(2)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Dietary notes review */}
                      {Object.values(formData.dietary).some(v => v) && (
                        <div className="text-sm">
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dietary Requirements</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(formData.dietary).map(([key, val]) => {
                              if (!val) return null;
                              return (
                                <span key={key} className="bg-[#607A66]/10 text-[#607A66] px-2 py-0.5 rounded text-xs font-medium">
                                  {key.toUpperCase()}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Special requests review */}
                      {formData.specialRequests && (
                        <div className="text-sm">
                          <p className="text-xs text-gray-500 uppercase tracking-wider">Special Notes</p>
                          <p className="text-xs italic text-gray-600 bg-white p-2 rounded border border-gray-100">
                            &ldquo;{formData.specialRequests}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Guest details review */}
                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-sm">
                        <div>
                          <p className="text-xs text-gray-500">Contact Details</p>
                          <p className="font-medium text-[#2C3531] text-xs">
                            {formData.name} ({formData.phone})
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Estimated Total</p>
                          <p className="text-lg font-bold text-[#C87A53] font-mono">
                            £{calculateTotal().toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-lg text-xs text-[#D97706]">
                      ⚠️ <strong>Friendly Reminder:</strong> Booking is subject to 24-hour verification. No payment is taken online today. You can pay via cash or card at the cafe on the day!
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Success Screen */}
                {step === 5 && (
                  <motion.div
                    key="step5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center py-8 space-y-6"
                  >
                    <div className="w-16 h-16 bg-[#607A66]/10 text-[#607A66] rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <h2 className="text-3xl font-serif text-[#2C3531] font-bold">
                      Your table is booked! We can&apos;t wait to welcome you.
                    </h2>
                    
                    <p className="text-[#2C3531]/80 max-w-md mx-auto text-sm">
                      A confirmation email has been sent to <strong className="text-[#C87A53]">{formData.email}</strong>.
                    </p>

                    <div className="bg-white rounded-xl p-6 border border-gray-200 text-left text-sm max-w-md mx-auto space-y-4 shadow-sm">
                      <h4 className="font-bold text-[#2C3531] border-b border-gray-100 pb-2">What happens next?</h4>
                      <ul className="space-y-3 text-xs text-gray-600">
                        <li className="flex gap-2">
                          <span className="text-[#C87A53] font-bold">1.</span>
                          <span><strong>We&apos;ll get baking:</strong> Our family will prepare your fresh treats specifically for your arrival time.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[#C87A53] font-bold">2.</span>
                          <span><strong>Need to make a change?</strong> If your plans change, please give us a call at <strong className="text-[#2C3531]">07588896465</strong> at least 24 hours in advance so we can adjust our baking schedule.</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-[#C87A53] font-bold">3.</span>
                          <span><strong>Where to find us:</strong> 1 Pandy Lane, Bedwas, Caerphilly (Just opposite the community center).</span>
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(INITIAL_FORM_STATE);
                          setStep(1);
                        }}
                        className="px-6 py-2.5 bg-[#607A66] hover:bg-[#506755] text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                      >
                        Book Another Table
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Form Actions Footer */}
              {step < 5 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-3 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-[#FAF6F0] transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-[#607A66] hover:bg-[#506755] text-white rounded-lg text-sm font-semibold transition-colors shadow-md flex items-center gap-2"
                    >
                      Continue
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-[#C87A53] hover:bg-[#b56942] text-white rounded-lg text-sm font-semibold transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Confirm My Reservation'
                      )}
                    </button>
                  )}
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </section>
  );
}