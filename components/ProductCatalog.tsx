'use client';

import React, { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_path: string;
  min_lead_hours: number;
  is_active: boolean;
  features?: string[];
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-picnic-hamper',
    name: 'The Welsh Valleys Picnic Hamper',
    price: 35.00,
    category: 'Take-Away Picnic Hamper',
    min_lead_hours: 48,
    is_active: true,
    image_path: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
    description: 'Heading out to explore Caerphilly Castle, climb the mountain, or enjoy a walk in the valleys? Pack our signature picnic hamper! It comes beautifully arranged in a fully recyclable, easy-to-carry box with wooden cutlery and napkins.',
    features: [
      '2x Freshly prepared sandwiches of your choice',
      '2x Large homemade pork, sage, and onion sausage rolls',
      '2x Individual cheese, tomato, and basil quiches',
      '2x Plain scones with individual pots of clotted cream and strawberry jam',
      '2x Generous slices of our daily handmade cake',
      '2x Bottles of cloudy lemonade or elderflower pressé'
    ]
  },
  {
    id: 'prod-gift-box',
    name: 'The Bedwas Bakers Gift Box',
    price: 22.00,
    category: 'Afternoon Tea Gift Box',
    min_lead_hours: 48,
    is_active: true,
    image_path: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80',
    description: "The ultimate sweet treat to brighten someone's day. Beautifully packaged in a rustic box with a hand-tied ribbon and a handwritten gift note. Available for local pickup or local delivery within 5 miles of Bedwas.",
    features: [
      '4x Homemade fruit and plain scones',
      '2x Individual jars of premium strawberry jam',
      '2x Pots of rich clotted cream',
      '4x Slices of our best-selling cakes and brownies',
      '4x Individually wrapped specialty Welsh Brew tea bags',
      'A handwritten greeting card with your custom message'
    ]
  }
];

const TIME_SLOTS = [
  '9:00 AM - 10:30 AM',
  '10:30 AM - 12:00 PM',
  '12:00 PM - 1:30 PM',
  '1:30 PM - 3:00 PM',
  '3:00 PM - 3:30 PM'
];

export function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({
    'prod-picnic-hamper': 0,
    'prod-gift-box': 0
  });
  const [fulfillmentType, setFulfillmentType] = useState<'Pickup' | 'Delivery'>('Pickup');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(TIME_SLOTS[0]);
  
  // Customer Info State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Submit and UI Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [successEmail, setSuccessEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch dynamic products if available
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('pre_order_products')
          .select('*')
          .eq('is_active', true);

        if (!error && data && data.length > 0) {
          // Merge custom features list for default items if matches
          const formatted = data.map((item: any) => {
            const defaultMatch = DEFAULT_PRODUCTS.find(p => p.name.toLowerCase() === item.name.toLowerCase());
            return {
              id: item.id,
              name: item.name,
              description: item.description || '',
              price: Number(item.price),
              category: item.category,
              image_path: item.image_path || (defaultMatch?.image_path ?? 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80'),
              min_lead_hours: item.min_lead_hours || 48,
              is_active: item.is_active,
              features: defaultMatch?.features || ['Freshly packed by hand in Bedwas', 'Baked from scratch with local ingredients']
            };
          });
          setProducts(formatted);
          
          // Re-initialize quantities dictionary
          const initialQtys: Record<string, number> = {};
          formatted.forEach(p => {
            initialQtys[p.id] = 0;
          });
          setSelectedItems(initialQtys);
        }
      } catch (err) {
        console.error('Error fetching pre_order_products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Generate available pickup/delivery dates (Weekdays only, starting from 48 hours from today)
  const availableDates = React.useMemo(() => {
    const dates: { value: string; label: string }[] = [];
    let current = new Date();
    // Add 48 hours minimum lead time
    current.setHours(current.getHours() + 48);

    let count = 0;
    while (count < 10) {
      const day = current.getDay();
      // 0 = Sunday, 6 = Saturday (We are closed weekends)
      if (day !== 0 && day !== 6) {
        const value = current.toISOString().split('T')[0];
        const label = current.toLocaleDateString('en-GB', {
          weekday: 'short',
          day: 'numeric',
          month: 'short'
        });
        dates.push({ value, label });
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);

  // Set initial date when available dates are calculated
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0].value);
    }
  }, [availableDates, selectedDate]);

  // Handle CTA trigger from catalog cards
  const selectProductAndScroll = (productId: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: Math.max(prev[productId] || 0, 1)
    }));
    
    const element = document.getElementById('pre-order-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQtyChange = (productId: string, val: number) => {
    setSelectedItems(prev => ({
      ...prev,
      [productId]: Math.max(0, val)
    }));
  };

  // Calculations
  const calculatedItems = Object.entries(selectedItems)
    .filter(([_, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = products.find(p => p.id === id);
      return {
        id,
        name: product?.name || 'Unknown Treat',
        qty,
        price: product?.price || 0,
        subtotal: (product?.price || 0) * qty
      };
    });

  const itemsTotal = calculatedItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const deliveryFee = fulfillmentType === 'Delivery' ? 3.50 : 0;
  const grandTotal = itemsTotal + deliveryFee;

  // Form validation
  const isFormValid = () => {
    if (itemsTotal === 0) return false;
    if (!fullName.trim()) return false;
    if (!email.trim() || !email.includes('@')) return false;
    if (!phone.trim()) return false;
    if (fulfillmentType === 'Delivery' && !deliveryAddress.trim()) return false;
    if (!selectedDate) return false;
    return true;
  };

  // Submit Handler
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      setErrorMessage('Please fill in all required fields and select at least one item.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const generatedId = `TB-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone,
      fulfillment_type: fulfillmentType,
      fulfillment_date: selectedDate,
      fulfillment_time: selectedTimeSlot,
      items: calculatedItems.map(item => ({
        name: item.name,
        qty: item.qty,
        price: item.price
      })),
      total_price: grandTotal,
      notes: [
        cardMessage ? `Gift Card Message: ${cardMessage}` : null,
        specialInstructions ? `Special Instructions: ${specialInstructions}` : null
      ].filter(Boolean).join(' | '),
      status: 'Pending'
    };

    try {
      const { error } = await supabase
        .from('pre_orders')
        .insert([orderPayload]);

      if (error) throw error;

      setSuccessEmail(email);
      setOrderId(generatedId);
      // Reset quantities
      setSelectedItems(prev => {
        const reset = { ...prev };
        Object.keys(reset).forEach(k => { reset[k] = 0; });
        return reset;
      });
    } catch (err: any) {
      console.error('Failed to submit order:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order. Please try again or call us at 07588896465.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut', staggerChildren: 0.15 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="bg-[#FAF6F0] text-[#2C3531] font-sans py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[#C87A53] font-serif italic text-lg block mb-2">
            A warm Welsh welcome, one cuppa at a time
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif text-[#2C3531] font-bold tracking-tight mb-4">
            Take a little piece of t and biccies with you
          </h1>
          <p className="text-base sm:text-lg text-[#2C3531]/80 leading-relaxed">
            Perfect for outdoor adventures in the Welsh valleys or as a thoughtful gift for someone special. 
            Every single hamper and gift box is packed by hand in Bedwas, using fresh, homemade bakes.
          </p>
        </div>

        {/* Lead Time Notice Banner */}
        <div className="bg-[#607A66]/10 border-l-4 border-[#607A66] rounded-r-lg p-5 mb-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-4xl mx-auto">
          <div className="p-2 bg-[#607A66]/20 rounded-full text-[#607A66] shrink-0">
            {/* Clock Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h4 className="font-serif font-semibold text-lg text-[#2C3531]">Important Order Notice</h4>
            <p className="text-sm text-[#2C3531]/90 mt-1">
              Because we bake everything fresh to order, we require a minimum of <strong className="text-[#C87A53]">48 hours notice</strong> for all picnic hampers and gift boxes. Thank you for helping us keep our food fresh and reduce kitchen waste!
            </p>
          </div>
        </div>

        {/* Product Catalog Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-20">
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col border border-[#607A66]/10 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-64 sm:h-80 relative overflow-hidden">
                <img
                  src={product.image_path}
                  alt={product.name}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#C87A53] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                  {product.category}
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <h3 className="text-2xl font-serif text-[#2C3531] font-bold leading-tight">
                      {product.name}
                    </h3>
                    <span className="text-xl font-bold text-[#C87A53] shrink-0">
                      £{product.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-[#2C3531]/80 text-sm sm:text-base mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="mb-8">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#607A66] mb-3">
                      What&apos;s Inside:
                    </h4>
                    <ul className="space-y-2">
                      {product.features?.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm text-[#2C3531]/90">
                          <span className="text-[#607A66] mr-2 text-base leading-none">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <div className="flex items-center border border-[#607A66]/30 rounded-lg overflow-hidden bg-[#FAF6F0]">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(product.id, (selectedItems[product.id] || 0) - 1)}
                      className="px-3 py-2 text-lg hover:bg-[#607A66]/10 text-[#607A66] font-bold transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-mono font-medium text-[#2C3531]">
                      {selectedItems[product.id] || 0}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(product.id, (selectedItems[product.id] || 0) + 1)}
                      className="px-3 py-2 text-lg hover:bg-[#607A66]/10 text-[#607A66] font-bold transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => selectProductAndScroll(product.id)}
                    className="flex-1 bg-[#607A66] hover:bg-[#2C3531] text-white font-semibold py-3 px-6 rounded-lg text-sm sm:text-base transition-colors duration-200 text-center shadow-sm"
                  >
                    Pre-Order {product.id === 'prod-picnic-hamper' ? 'Hamper' : 'Gift Box'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Wizard Form */}
        <div id="pre-order-form" className="scroll-mt-24 max-w-4xl mx-auto">
          {orderId ? (
            /* Pre-Order Success Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl border border-[#607A66]/20 p-8 sm:p-12 text-center"
            >
              <div className="w-16 h-16 bg-[#607A66]/10 text-[#607A66] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-3xl font-serif font-bold text-[#2C3531] mb-2">
                We&apos;ve received your pre-order!
              </h2>
              <p className="text-[#C87A53] font-mono font-semibold tracking-wide text-lg mb-8">
                Your order ID is: {orderId}
              </p>

              <div className="max-w-lg mx-auto text-left bg-[#FAF6F0] rounded-xl p-6 mb-8 space-y-4 text-sm sm:text-base border border-[#607A66]/10">
                <h4 className="font-serif font-semibold text-[#2C3531] text-base border-b border-[#607A66]/20 pb-2">
                  What happens next?
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <span className="font-mono text-[#C87A53] font-bold">01.</span>
                    <p className="text-[#2C3531]/80">
                      <strong>Email Receipt:</strong> We have sent a copy of your order details to <span className="font-medium text-[#2C3531]">{successEmail}</span>.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-mono text-[#C87A53] font-bold">02.</span>
                    <p className="text-[#2C3531]/80">
                      <strong>Payment &amp; Confirmation:</strong> Alex will review your order details. We will send a confirmation email (or call you if you selected delivery) to confirm your time slot and coordinate payment.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-mono text-[#C87A53] font-bold">03.</span>
                    <p className="text-[#2C3531]/80">
                      <strong>Pickup Location:</strong> If you chose pickup, please come to our counter at <strong>1 Pandy Lane, Bedwas</strong> on your selected day and time.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOrderId(null)}
                className="inline-block bg-[#C87A53] hover:bg-[#2C3531] text-white font-semibold py-3.5 px-8 rounded-lg transition-colors"
              >
                Place Another Pre-Order
              </button>
            </motion.div>
          ) : (
            /* Interactive Pre-Order Scheduler & Checkout Form */
            <form onSubmit={handlePlaceOrder} className="bg-white rounded-2xl shadow-xl border border-[#607A66]/15 overflow-hidden">
              <div className="bg-[#607A66] text-white p-6 sm:p-8 text-center sm:text-left">
                <h2 className="text-3xl font-serif font-bold">Complete your pre-order</h2>
                <p className="text-white/80 mt-1 text-sm sm:text-base">
                  Just tell us when you need your fresh treats, and we&apos;ll have them ready.
                </p>
              </div>

              <div className="p-6 sm:p-10 space-y-10">
                {/* Step 1: Select Your Items & Quantity */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 bg-[#C87A53] text-white text-xs font-mono font-bold rounded-full flex items-center justify-center">
                      1
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#2C3531]">
                      Select Your Items &amp; Quantity
                    </h3>
                  </div>

                  <div className="space-y-4 bg-[#FAF6F0] p-4 rounded-xl border border-[#607A66]/10">
                    {products.map((product) => (
                      <div key={product.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-gray-200 last:border-b-0">
                        <div>
                          <p className="font-semibold text-base text-[#2C3531]">{product.name}</p>
                          <p className="text-sm text-[#C87A53] font-medium">£{product.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <label htmlFor={`qty-${product.id}`} className="text-xs uppercase tracking-wider text-[#2C3531]/60">Qty:</label>
                          <select
                            id={`qty-${product.id}`}
                            value={selectedItems[product.id] || 0}
                            onChange={(e) => handleQtyChange(product.id, parseInt(e.target.value, 10))}
                            className="bg-white border border-gray-300 rounded px-2 py-1.5 font-mono text-sm text-[#2C3531] focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                          >
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                              <option key={n} value={n}>{n}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2: Choose Fulfillment Method */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 bg-[#C87A53] text-white text-xs font-mono font-bold rounded-full flex items-center justify-center">
                      2
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#2C3531]">
                      Fulfillment Method
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <label className={`cursor-pointer rounded-xl p-4 border-2 flex items-start gap-3 transition-all ${fulfillmentType === 'Pickup' ? 'bg-[#607A66]/5 border-[#607A66]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillmentType === 'Pickup'}
                        onChange={() => setFulfillmentType('Pickup')}
                        className="mt-1 text-[#607A66] focus:ring-[#607A66]"
                      />
                      <div>
                        <span className="font-semibold text-sm sm:text-base text-[#2C3531] block">Local Pickup</span>
                        <span className="text-xs text-[#2C3531]/70 block mt-1">Free from 1 Pandy Lane, Bedwas</span>
                      </div>
                    </label>

                    <label className={`cursor-pointer rounded-xl p-4 border-2 flex items-start gap-3 transition-all ${fulfillmentType === 'Delivery' ? 'bg-[#607A66]/5 border-[#607A66]' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                      <input
                        type="radio"
                        name="fulfillment"
                        checked={fulfillmentType === 'Delivery'}
                        onChange={() => setFulfillmentType('Delivery')}
                        className="mt-1 text-[#607A66] focus:ring-[#607A66]"
                      />
                      <div>
                        <span className="font-semibold text-sm sm:text-base text-[#2C3531] block">Local Delivery</span>
                        <span className="text-xs text-[#2C3531]/70 block mt-1">£3.50 delivery fee, available within 5 miles of Bedwas only</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Step 3: Date & Time Selector */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 bg-[#C87A53] text-white text-xs font-mono font-bold rounded-full flex items-center justify-center">
                      3
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#2C3531]">
                      Select Date &amp; Time Slot
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#2C3531] mb-2">
                        When would you like your order?
                      </label>
                      <select
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                      >
                        {availableDates.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-[#2C3531]/60 block mt-1.5">
                        Please select a date at least 48 hours from today. Weekends are closed.
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#2C3531] mb-2">
                        Preferred pickup/delivery time
                      </label>
                      <select
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                      >
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-[#2C3531]/60 block mt-1.5">
                        Operating hours: Mon-Fri, 9:00 AM to 3:30 PM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Step 4: Your Details */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-7 h-7 bg-[#C87A53] text-white text-xs font-mono font-bold rounded-full flex items-center justify-center">
                      4
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#2C3531]">
                      Your Contact &amp; Delivery Details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="full-name" className="block text-sm font-semibold text-[#2C3531] mb-1">
                        Your Full Name *
                      </label>
                      <input
                        id="full-name"
                        type="text"
                        required
                        placeholder="e.g. Sarah Jenkins"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-[#2C3531] mb-1">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        placeholder="e.g. sarah@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                      />
                      <span className="text-xs text-[#2C3531]/60 block mt-1">
                        We will send your order confirmation here
                      </span>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="phone" className="block text-sm font-semibold text-[#2C3531] mb-1">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        required
                        placeholder="e.g. 07123 456789"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                      />
                      <span className="text-xs text-[#2C3531]/60 block mt-1">
                        We will only call if there is a question about your order
                      </span>
                    </div>

                    {fulfillmentType === 'Delivery' && (
                      <div className="sm:col-span-2">
                        <label htmlFor="delivery-address" className="block text-sm font-semibold text-[#2C3531] mb-1">
                          Delivery Address *
                        </label>
                        <textarea
                          id="delivery-address"
                          rows={3}
                          required
                          placeholder="Please enter your full delivery address in Bedwas/Caerphilly area"
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                        />
                        <span className="text-xs text-[#C87A53] font-medium block mt-1">
                          Note: We only deliver within 5 miles of Bedwas.
                        </span>
                      </div>
                    )}

                    {/* Conditional Message for Gift Box */}
                    {(selectedItems['prod-gift-box'] > 0 || selectedItems['The Bedwas Bakers Gift Box'] > 0) && (
                      <div className="sm:col-span-2">
                        <label htmlFor="card-message" className="block text-sm font-semibold text-[#2C3531] mb-1">
                          Handwritten Card Message (Optional)
                        </label>
                        <textarea
                          id="card-message"
                          rows={2}
                          placeholder='e.g., "Happy Birthday Mum! Love from Sarah and the family. Hope you enjoy these delicious scones!"'
                          value={cardMessage}
                          onChange={(e) => setCardMessage(e.target.value)}
                          className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                        />
                      </div>
                    )}

                    <div className="sm:col-span-2">
                      <label htmlFor="special-instructions" className="block text-sm font-semibold text-[#2C3531] mb-1">
                        Dietary Requirements or Special Instructions
                      </label>
                      <textarea
                        id="special-instructions"
                        rows={2}
                        placeholder='e.g., "Please make the sandwiches vegetarian" or "Egg free scones if possible"'
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="w-full bg-white border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#607A66] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 5: Review & Submit */}
                <div className="border-t border-gray-200 pt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-7 h-7 bg-[#C87A53] text-white text-xs font-mono font-bold rounded-full flex items-center justify-center">
                      5
                    </span>
                    <h3 className="font-serif font-bold text-xl text-[#2C3531]">
                      Order Summary
                    </h3>
                  </div>

                  <div className="bg-[#FAF6F0] rounded-xl p-6 border border-[#607A66]/20">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-[#607A66] mb-4">
                      Your Order Breakdown
                    </h4>

                    {calculatedItems.length === 0 ? (
                      <p className="text-sm text-[#2C3531]/60 italic">No items selected yet. Adjust the quantities above to start building your order.</p>
                    ) : (
                      <div className="space-y-3">
                        {calculatedItems.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm sm:text-base">
                            <span className="text-[#2C3531]">
                              {item.qty}x {item.name}
                            </span>
                            <span className="font-mono text-[#2C3531] font-medium">
                              £{item.subtotal.toFixed(2)}
                            </span>
                          </div>
                        ))}

                        <div className="border-t border-gray-300 pt-3 flex justify-between text-sm">
                          <span className="text-[#2C3531]/70">Fulfillment ({fulfillmentType})</span>
                          <span className="font-mono text-[#2C3531]">
                            {fulfillmentType === 'Delivery' ? `£${deliveryFee.toFixed(2)}` : 'Free'}
                          </span>
                        </div>

                        {selectedDate && (
                          <p className="text-xs text-[#607A66] italic mt-1">
                            Scheduled for: {availableDates.find(d => d.value === selectedDate)?.label} during {selectedTimeSlot}
                          </p>
                        )}

                        <div className="border-t-2 border-dashed border-gray-300 pt-3 flex justify-between text-base sm:text-lg font-bold text-[#2C3531]">
                          <span>Total Amount</span>
                          <span className="font-mono text-[#C87A53]">
                            £{grandTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-[#C87A53]/5 border border-[#C87A53]/20 rounded-lg text-xs sm:text-sm text-[#2C3531]/90">
                    <strong>Payment Notice:</strong> No payment is taken online today. We accept cash or card payment at the cafe during pickup, or we will coordinate payment via phone for deliveries.
                  </div>

                  {errorMessage && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
                      {errorMessage}
                    </div>
                  )}

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting || itemsTotal === 0}
                      className={`w-full bg-[#C87A53] hover:bg-[#2C3531] text-white font-serif font-bold text-lg py-4 px-8 rounded-lg transition-colors shadow-md flex items-center justify-center gap-3 ${
                        (isSubmitting || itemsTotal === 0) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Processing Order...</span>
                        </>
                      ) : (
                        <span>Place My Pre-Order</span>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}