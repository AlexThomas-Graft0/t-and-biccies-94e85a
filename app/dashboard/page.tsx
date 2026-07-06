'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { 
  Utensils, 
  ShoppingBag, 
  Calendar, 
  Mail, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  FileText, 
  RefreshCw, 
  ArrowLeft,
  ChevronRight,
  DollarSign,
  AlertCircle
} from 'lucide-react'

// TypeScript Interfaces mapped from DB
interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  dietary_tags: string[]
  is_available: boolean
  created_at?: string
}

interface PreOrderProduct {
  id: string
  name: string
  description: string | null
  price: number
  category: string
  image_path: string | null
  min_lead_hours: number
  is_active: boolean
  created_at?: string
}

interface Reservation {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  reservation_date: string
  time_slot: string
  guest_count: number
  dietary_notes: string | null
  special_requests: string | null
  status: string
  created_at?: string
}

interface PreOrder {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  fulfillment_type: string
  fulfillment_date: string
  fulfillment_time: string
  items: Array<{ name: string; qty: number; price: number }>
  total_price: number
  notes: string | null
  status: string
  created_at?: string
}

interface Enquiry {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  created_at?: string
}

export default function DashboardPage() {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<'reservations' | 'orders' | 'menu' | 'products' | 'enquiries'>('reservations')
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Data States
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [products, setProducts] = useState<PreOrderProduct[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [preOrders, setPreOrders] = useState<PreOrder[]>([])
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])

  // Filter States
  const [resFilter, setResFilter] = useState<string>('All')
  const [orderFilter, setOrderFilter] = useState<string>('All')

  // Form States - Menu Items
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [menuId, setMenuId] = useState<string | null>(null)
  const [menuName, setMenuName] = useState('')
  const [menuDescription, setMenuDescription] = useState('')
  const [menuPrice, setMenuPrice] = useState('')
  const [menuCategory, setMenuCategory] = useState('Afternoon Tea')
  const [menuDietaryTags, setMenuDietaryTags] = useState('')
  const [menuIsAvailable, setMenuIsAvailable] = useState(true)

  // Form States - Pre Order Products
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [productId, setProductId] = useState<string | null>(null)
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')
  const [productPrice, setProductPrice] = useState('')
  const [productCategory, setProductCategory] = useState('Take-Away Picnic Hamper')
  const [productImagePath, setProductImagePath] = useState('')
  const [productMinLeadHours, setProductMinLeadHours] = useState('48')
  const [productIsActive, setProductIsActive] = useState(true)

  // Fetch all data
  const fetchData = async () => {
    setLoading(true)
    try {
      const [resMenuItems, resProducts, resReservations, resOrders, resEnquiries] = await Promise.all([
        supabase.from('menu_items').select('*').order('created_at', { ascending: false }),
        supabase.from('pre_order_products').select('*').order('created_at', { ascending: false }),
        supabase.from('reservations').select('*').order('reservation_date', { ascending: true }),
        supabase.from('pre_orders').select('*').order('fulfillment_date', { ascending: true }),
        supabase.from('enquiries').select('*').order('created_at', { ascending: false })
      ])

      if (resMenuItems.error) throw resMenuItems.error
      if (resProducts.error) throw resProducts.error
      if (resReservations.error) throw resReservations.error
      if (resOrders.error) throw resOrders.error
      if (resEnquiries.error) throw resEnquiries.error

      setMenuItems(resMenuItems.data || [])
      setProducts(resProducts.data || [])
      setReservations(resReservations.data || [])
      setPreOrders(resOrders.data || [])
      setEnquiries(resEnquiries.data || [])
    } catch (err: any) {
      showFeedback(err.message || 'Error loading dashboard data', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const showFeedback = (message: string, type: 'success' | 'error') => {
    setFeedback({ message, type })
    setTimeout(() => setFeedback(null), 5000)
  }

  // --- MENU ITEM ACTIONS ---
  const handleOpenMenuModal = (item?: MenuItem) => {
    if (item) {
      setMenuId(item.id)
      setMenuName(item.name)
      setMenuDescription(item.description || '')
      setMenuPrice(item.price.toString())
      setMenuCategory(item.category)
      setMenuDietaryTags(item.dietary_tags.join(', '))
      setMenuIsAvailable(item.is_available)
    } else {
      setMenuId(null)
      setMenuName('')
      setMenuDescription('')
      setMenuPrice('')
      setMenuCategory('Afternoon Tea')
      setMenuDietaryTags('')
      setMenuIsAvailable(true)
    }
    setIsMenuModalOpen(true)
  }

  const handleSaveMenuItem = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)
    const tags = menuDietaryTags.split(',').map(t => t.trim()).filter(Boolean)

    const payload = {
      name: menuName,
      description: menuDescription || null,
      price: parseFloat(menuPrice) || 0,
      category: menuCategory,
      dietary_tags: tags,
      is_available: menuIsAvailable
    }

    try {
      if (menuId) {
        const { error } = await supabase.from('menu_items').update(payload).eq('id', menuId)
        if (error) throw error
        showFeedback('Menu item updated successfully!', 'success')
      } else {
        const { error } = await supabase.from('menu_items').insert([payload])
        if (error) throw error
        showFeedback('New menu item added successfully!', 'success')
      }
      setIsMenuModalOpen(false)
      fetchData()
    } catch (err: any) {
      showFeedback(err.message || 'Failed to save menu item', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id)
      if (error) throw error
      showFeedback('Menu item deleted.', 'success')
      fetchData()
    } catch (err: any) {
      showFeedback(err.message || 'Failed to delete menu item', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // --- PRE-ORDER PRODUCT ACTIONS ---
  const handleOpenProductModal = (product?: PreOrderProduct) => {
    if (product) {
      setProductId(product.id)
      setProductName(product.name)
      setProductDescription(product.description || '')
      setProductPrice(product.price.toString())
      setProductCategory(product.category)
      setProductImagePath(product.image_path || '')
      setProductMinLeadHours(product.min_lead_hours.toString())
      setProductIsActive(product.is_active)
    } else {
      setProductId(null)
      setProductName('')
      setProductDescription('')
      setProductPrice('')
      setProductCategory('Take-Away Picnic Hamper')
      setProductImagePath('')
      setProductMinLeadHours('48')
      setProductIsActive(true)
    }
    setIsProductModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionLoading(true)

    const payload = {
      name: productName,
      description: productDescription || null,
      price: parseFloat(productPrice) || 0,
      category: productCategory,
      image_path: productImagePath || null,
      min_lead_hours: parseInt(productMinLeadHours) || 24,
      is_active: productIsActive
    }

    try {
      if (productId) {
        const { error } = await supabase.from('pre_order_products').update(payload).eq('id', productId)
        if (error) throw error
        showFeedback('Product updated successfully!', 'success')
      } else {
        const { error } = await supabase.from('pre_order_products').insert([payload])
        if (error) throw error
        showFeedback('New product added successfully!', 'success')
      }
      setIsProductModalOpen(false)
      fetchData()
    } catch (err: any) {
      showFeedback(err.message || 'Failed to save product', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase.from('pre_order_products').delete().eq('id', id)
      if (error) throw error
      showFeedback('Product deleted.', 'success')
      fetchData()
    } catch (err: any) {
      showFeedback(err.message || 'Failed to delete product', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // --- STATUS UPDATES (RESERVATIONS) ---
  const handleUpdateReservationStatus = async (id: string, newStatus: string) => {
    setActionLoading(true)
    try {
      const { error } = await supabase.from('reservations').update({ status: newStatus }).eq('id', id)
      if (error) throw error
      showFeedback(`Reservation updated to "${newStatus}"`, 'success')
      fetchData()
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update reservation status', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // --- STATUS UPDATES (PRE-ORDERS) ---
  const handleUpdateOrderStatus = async (id: string, newStatus: string) => {
    setActionLoading(true)
    try {
      const { error } = await supabase.from('pre_orders').update({ status: newStatus }).eq('id', id)
      if (error) throw error
      showFeedback(`Order updated to "${newStatus}"`, 'success')
      fetchData()
    } catch (err: any) {
      showFeedback(err.message || 'Failed to update order status', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // --- DELETE ENQUIRY ---
  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm('Are you sure you want to dismiss this enquiry?')) return
    setActionLoading(true)
    try {
      const { error } = await supabase.from('enquiries').delete().eq('id', id)
      if (error) throw error
      showFeedback('Enquiry dismissed.', 'success')
      fetchData()
    } catch (err: any) {
      showFeedback(err.message || 'Failed to dismiss enquiry', 'error')
    } finally {
      setActionLoading(false)
    }
  }

  // Filtering Logic
  const filteredReservations = reservations.filter(r => resFilter === 'All' ? true : r.status === resFilter)
  const filteredOrders = preOrders.filter(o => orderFilter === 'All' ? true : o.status === orderFilter)

  // Calculations for Stats
  const totalRevenue = preOrders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + Number(o.total_price), 0)

  const pendingReservationsCount = reservations.filter(r => r.status === 'Pending').length
  const pendingOrdersCount = preOrders.filter(o => o.status === 'Pending' || o.status === 'Needs Preparing').length

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#2C3531] font-sans antialiased">
      {/* Top Brand Banner */}
      <header className="bg-[#607A66] text-[#FAF6F0] shadow-md border-b border-[#4e6453]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#C87A53] rounded-full flex items-center justify-center text-xl font-bold text-[#FAF6F0]">
              t
            </div>
            <div>
              <h1 className="font-serif text-2xl tracking-wide font-bold">t and biccies</h1>
              <p className="text-xs text-[#FAF6F0]/80">Owner Management Portal • Bedwas, Caerphilly</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="/" 
              className="flex items-center space-x-1 text-sm bg-white/10 hover:bg-white/20 text-[#FAF6F0] px-4 py-2 rounded-md transition duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Site</span>
            </a>
            <button 
              onClick={fetchData}
              title="Refresh Data"
              className="p-2 bg-white/10 hover:bg-white/20 text-[#FAF6F0] rounded-md transition duration-200"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Feedback Alert */}
        {feedback && (
          <div className={`mb-6 p-4 rounded-lg flex items-center justify-between border ${
            feedback.type === 'success' 
              ? 'bg-green-50 text-green-800 border-green-200' 
              : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium text-sm">{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Summary Stat Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#607A66]/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Pending Tables</p>
              <h3 className="text-3xl font-serif font-bold text-[#C87A53] mt-1">{pendingReservationsCount}</h3>
              <p className="text-xs text-gray-400 mt-1">Requires confirmation</p>
            </div>
            <div className="p-3 rounded-full bg-[#FAF6F0] text-[#607A66]">
              <Calendar className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#607A66]/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Active Hampers / Gifts</p>
              <h3 className="text-3xl font-serif font-bold text-[#C87A53] mt-1">{pendingOrdersCount}</h3>
              <p className="text-xs text-gray-400 mt-1">Needs preparing</p>
            </div>
            <div className="p-3 rounded-full bg-[#FAF6F0] text-[#607A66]">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#607A66]/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Completed Revenue</p>
              <h3 className="text-3xl font-serif font-bold text-[#607A66] mt-1">£{totalRevenue.toFixed(2)}</h3>
              <p className="text-xs text-gray-400 mt-1">From pre-orders</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#607A66]/10 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Unread Enquiries</p>
              <h3 className="text-3xl font-serif font-bold text-[#2C3531] mt-1">{enquiries.length}</h3>
              <p className="text-xs text-gray-400 mt-1">Customer messages</p>
            </div>
            <div className="p-3 rounded-full bg-[#FAF6F0] text-[#2C3531]">
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg text-sm font-medium transition duration-150 ${
              activeTab === 'reservations' 
                ? 'bg-[#607A66] text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C3531]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Table Reservations ({reservations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg text-sm font-medium transition duration-150 ${
              activeTab === 'orders' 
                ? 'bg-[#607A66] text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C3531]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Hamper & Gift Orders ({preOrders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg text-sm font-medium transition duration-150 ${
              activeTab === 'menu' 
                ? 'bg-[#607A66] text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C3531]'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Menu Items CMS ({menuItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg text-sm font-medium transition duration-150 ${
              activeTab === 'products' 
                ? 'bg-[#607A66] text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C3531]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pre-Order Products CMS ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`flex items-center space-x-2 px-5 py-3 rounded-lg text-sm font-medium transition duration-150 ${
              activeTab === 'enquiries' 
                ? 'bg-[#607A66] text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#2C3531]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Custom Enquiries ({enquiries.length})</span>
          </button>
        </div>

        {/* Loader Overlays */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 flex flex-col items-center justify-center shadow-sm">
            <RefreshCw className="w-10 h-10 animate-spin text-[#C87A53] mb-4" />
            <p className="text-gray-500 font-serif">Loading your cozy kitchen dashboard...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* 1. RESERVATIONS PANEL */}
            {activeTab === 'reservations' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-[#FAF6F0]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#2C3531]">Table Reservations</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage table bookings, dietary notes and party confirmations</p>
                  </div>
                  
                  {/* Filter Badges */}
                  <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-lg">
                    {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setResFilter(status)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                          resFilter === status 
                            ? 'bg-white text-[#2C3531] shadow-xs font-semibold' 
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredReservations.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-serif text-lg font-semibold">No reservations found</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing your filters or check back later.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                          <th className="p-4">Customer</th>
                          <th className="p-4">Date & Time</th>
                          <th className="p-4">Guests</th>
                          <th className="p-4">Dietary & Requests</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredReservations.map((res) => (
                          <tr key={res.id} className="hover:bg-gray-50/50 transition">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{res.customer_name}</div>
                              <div className="text-xs text-gray-500">{res.customer_email}</div>
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <Phone className="w-3 h-3 mr-1 text-gray-400" /> {res.customer_phone}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-gray-900">
                                {new Date(res.reservation_date).toLocaleDateString('en-GB', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-[#C87A53] font-semibold flex items-center mt-0.5">
                                <Clock className="w-3 h-3 mr-1" /> {res.time_slot.substring(0, 5)}
                              </div>
                            </td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FAF6F0] text-[#607A66] border border-[#607A66]/20">
                                {res.guest_count} {res.guest_count === 1 ? 'Guest' : 'Guests'}
                              </span>
                            </td>
                            <td className="p-4 max-w-xs">
                              {res.dietary_notes && (
                                <div className="text-xs bg-amber-50 text-amber-800 px-2 py-1 rounded mb-1 border border-amber-100">
                                  <strong>Dietary:</strong> {res.dietary_notes}
                                </div>
                              )}
                              {res.special_requests && (
                                <div className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                  <strong>Notes:</strong> "{res.special_requests}"
                                </div>
                              )}
                              {!res.dietary_notes && !res.special_requests && (
                                <span className="text-xs text-gray-400 italic">None</span>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                res.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                                res.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                                res.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {res.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              {res.status === 'Pending' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'Confirmed')}
                                  className="p-1 px-2.5 text-xs bg-[#607A66] text-white rounded hover:bg-[#4e6453] transition"
                                  title="Confirm booking"
                                >
                                  Confirm
                                </button>
                              )}
                              {res.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'Completed')}
                                  className="p-1 px-2.5 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                                  title="Mark Completed"
                                >
                                  Complete
                                </button>
                              )}
                              {res.status !== 'Cancelled' && res.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateReservationStatus(res.id, 'Cancelled')}
                                  className="p-1 px-2.5 text-xs bg-transparent text-red-600 border border-red-200 hover:bg-red-50 rounded transition"
                                  title="Cancel booking"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 2. PRE-ORDERS PANEL */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-[#FAF6F0]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#2C3531]">Take-Away Picnic Hampers & Gift Boxes</h2>
                    <p className="text-xs text-gray-500 mt-1">Track customer orders, fulfillment dates, and preparation status</p>
                  </div>
                  
                  {/* Filter Badges */}
                  <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-lg">
                    {['All', 'Pending', 'Needs Preparing', 'Ready for Pickup', 'Completed', 'Cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderFilter(status)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                          orderFilter === status 
                            ? 'bg-white text-[#2C3531] shadow-xs font-semibold' 
                            : 'text-gray-500 hover:text-gray-800'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-serif text-lg font-semibold">No pre-orders found</p>
                    <p className="text-xs text-gray-400 mt-1">Try changing your filters or check back later.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                          <th className="p-4">Customer</th>
                          <th className="p-4">Fulfillment Details</th>
                          <th className="p-4">Items Ordered</th>
                          <th className="p-4">Total & Notes</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition">
                            <td className="p-4">
                              <div className="font-medium text-gray-900">{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_email}</div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center">
                                <Phone className="w-3 h-3 mr-1 text-gray-400" /> {order.customer_phone}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-medium text-[#C87A53] capitalize">
                                {order.fulfillment_type}
                              </div>
                              <div className="text-xs text-gray-900 font-semibold">
                                {new Date(order.fulfillment_date).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-gray-500">
                                {order.fulfillment_time.substring(0, 5)}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="space-y-1">
                                {Array.isArray(order.items) ? (
                                  order.items.map((item, idx) => (
                                    <div key={idx} className="text-xs text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block mr-1">
                                      <span className="font-semibold text-[#607A66]">{item.qty}x</span> {item.name}
                                    </div>
                                  ))
                                ) : (
                                  <span className="text-xs text-gray-400 italic">No items details</span>
                                )}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-bold text-gray-900">£{Number(order.total_price).toFixed(2)}</div>
                              {order.notes && (
                                <p className="text-xs text-gray-500 italic max-w-xs mt-1">
                                  "{order.notes}"
                                </p>
                              )}
                            </td>
                            <td className="p-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                order.status === 'Ready for Pickup' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'Needs Preparing' ? 'bg-amber-100 text-amber-800' :
                                order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-1 whitespace-nowrap">
                              {order.status === 'Pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Needs Preparing')}
                                  className="p-1 px-2 text-xs bg-[#C87A53] text-white rounded hover:bg-[#b06a46] transition"
                                >
                                  Prepare
                                </button>
                              )}
                              {order.status === 'Needs Preparing' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Ready for Pickup')}
                                  className="p-1 px-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                  Ready
                                </button>
                              )}
                              {order.status === 'Ready for Pickup' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Completed')}
                                  className="p-1 px-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition"
                                >
                                  Complete
                                </button>
                              )}
                              {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                  className="p-1 px-2 text-xs text-red-600 border border-red-200 hover:bg-red-50 rounded transition"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. MENU ITEMS CMS */}
            {activeTab === 'menu' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-[#FAF6F0]/40 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#2C3531]">Menu Items Content Manager</h2>
                    <p className="text-xs text-gray-500 mt-1">Adjust pricing, descriptions, dietary tags, and cafe availability</p>
                  </div>
                  <button
                    onClick={() => handleOpenMenuModal()}
                    className="flex items-center space-x-1 bg-[#607A66] hover:bg-[#4e6453] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Menu Item</span>
                  </button>
                </div>

                {menuItems.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <Utensils className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-serif text-lg font-semibold">No menu items configured</p>
                    <button
                      onClick={() => handleOpenMenuModal()}
                      className="mt-4 bg-[#FAF6F0] text-[#607A66] border border-[#607A66]/30 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#607A66] hover:text-white transition"
                    >
                      Add Your First Item
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {menuItems.map((item) => (
                      <div 
                        key={item.id} 
                        className={`border rounded-xl p-5 flex flex-col justify-between transition ${
                          item.is_available ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50/70 opacity-75'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between">
                            <span className="text-xs font-bold tracking-wide uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                            <span className="font-serif font-bold text-lg text-[#607A66]">
                              £{Number(item.price).toFixed(2)}
                            </span>
                          </div>
                          
                          <h3 className="font-serif font-bold text-base text-[#2C3531] mt-2 flex items-center gap-2">
                            {item.name}
                            {!item.is_available && (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-red-100 text-red-800 rounded">
                                Out of Stock
                              </span>
                            )}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1.5 line-clamp-3">
                            {item.description || 'No description provided.'}
                          </p>

                          {item.dietary_tags && item.dietary_tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.dietary_tags.map((tag, idx) => (
                                <span key={idx} className="text-[10px] font-bold bg-[#FAF6F0] text-[#C87A53] px-2 py-0.5 rounded border border-[#C87A53]/20">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Added {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleOpenMenuModal(item)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit item"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. PRE-ORDER PRODUCTS CMS */}
            {activeTab === 'products' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-[#FAF6F0]/40 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#2C3531]">Pre-Order Products Manager</h2>
                    <p className="text-xs text-gray-500 mt-1">Manage takeout picnic hampers, gift boxes, lead times, and active catalog status</p>
                  </div>
                  <button
                    onClick={() => handleOpenProductModal()}
                    className="flex items-center space-x-1 bg-[#607A66] hover:bg-[#4e6453] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-serif text-lg font-semibold">No pre-order products configured</p>
                    <button
                      onClick={() => handleOpenProductModal()}
                      className="mt-4 bg-[#FAF6F0] text-[#607A66] border border-[#607A66]/30 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#607A66] hover:text-white transition"
                    >
                      Add Your First Product
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {products.map((prod) => (
                      <div 
                        key={prod.id} 
                        className={`border rounded-xl p-5 flex flex-col justify-between transition ${
                          prod.is_active ? 'border-gray-200 bg-white' : 'border-dashed border-gray-300 bg-gray-50/70 opacity-75'
                        }`}
                      >
                        <div>
                          {prod.image_path && (
                            <div className="w-full h-36 bg-gray-100 rounded-lg overflow-hidden mb-3">
                              <img 
                                src={prod.image_path} 
                                alt={prod.name} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'
                                }}
                              />
                            </div>
                          )}

                          <div className="flex items-start justify-between">
                            <span className="text-[10px] font-bold tracking-wide uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                              {prod.category}
                            </span>
                            <span className="font-serif font-bold text-lg text-[#C87A53]">
                              £{Number(prod.price).toFixed(2)}
                            </span>
                          </div>
                          
                          <h3 className="font-serif font-bold text-base text-[#2C3531] mt-2 flex items-center gap-2">
                            {prod.name}
                            {!prod.is_active && (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded">
                                Inactive
                              </span>
                            )}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1.5 line-clamp-3">
                            {prod.description || 'No description.'}
                          </p>

                          <div className="mt-3 flex items-center text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded inline-flex">
                            <Clock className="w-3.5 h-3.5 mr-1" />
                            <span>Requires {prod.min_lead_hours} hrs lead time</span>
                          </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-400">
                            Added {prod.created_at ? new Date(prod.created_at).toLocaleDateString() : 'N/A'}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleOpenProductModal(prod)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. ENQUIRIES PANEL */}
            {activeTab === 'enquiries' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-[#FAF6F0]/40">
                  <h2 className="text-xl font-serif font-bold text-[#2C3531]">Custom Event Enquiries</h2>
                  <p className="text-xs text-gray-500 mt-1">Review contact requests, event queries, and feedback from Bedwas neighbors</p>
                </div>

                {enquiries.length === 0 ? (
                  <div className="p-16 text-center text-gray-500">
                    <Mail className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p className="font-serif text-lg font-semibold">No enquiries found</p>
                    <p className="text-xs text-gray-400 mt-1">When users fill in the contact form, they will appear here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {enquiries.map((enq) => (
                      <div key={enq.id} className="p-6 hover:bg-gray-50/50 transition flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="space-y-2 max-w-3xl">
                          <div className="flex items-center space-x-3">
                            <h3 className="font-serif font-bold text-base text-[#2C3531]">{enq.name}</h3>
                            <span className="text-xs text-gray-400">
                              {enq.created_at ? new Date(enq.created_at).toLocaleString('en-GB') : ''}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Mail className="w-3 h-3 mr-1" /> {enq.email}
                            </span>
                            {enq.phone && (
                              <span className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" /> {enq.phone}
                              </span>
                            )}
                          </div>

                          <div className="bg-[#FAF6F0] p-4 rounded-lg border border-gray-100 text-sm text-gray-700 whitespace-pre-wrap font-sans">
                            {enq.message}
                          </div>
                        </div>

                        <div className="md:self-center">
                          <button
                            onClick={() => handleDeleteEnquiry(enq.id)}
                            className="flex items-center space-x-1 text-xs text-red-600 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Dismiss</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#2C3531] text-gray-400 text-xs py-8 mt-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="text-gray-300">t and biccies • Secure Administrator Dashboard Portal</p>
          <p>© 2024 t and biccies. Hand-baked in Bedwas, Caerphilly. All rights reserved.</p>
        </div>
      </footer>

      {/* --- MENU ITEM MODAL --- */}
      {isMenuModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#607A66] text-[#FAF6F0] p-6 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {menuId ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h3>
              <button onClick={() => setIsMenuModalOpen(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMenuItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="e.g. Traditional Afternoon Tea"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={menuPrice}
                    onChange={(e) => setMenuPrice(e.target.value)}
                    placeholder="18.50"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={menuCategory}
                    onChange={(e) => setMenuCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none bg-white"
                  >
                    <option value="Afternoon Tea">Afternoon Tea</option>
                    <option value="Savoury Tea">Savoury Tea</option>
                    <option value="Childrens Menu">Childrens Menu</option>
                    <option value="Hot Drinks">Hot Drinks</option>
                    <option value="Cold Drinks">Cold Drinks</option>
                    <option value="Sweet Extras">Sweet Extras</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={menuDescription}
                  onChange={(e) => setMenuDescription(e.target.value)}
                  placeholder="Describe scones, bakes, and sandwich selections..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Dietary Tags (comma separated)</label>
                <input
                  type="text"
                  value={menuDietaryTags}
                  onChange={(e) => setMenuDietaryTags(e.target.value)}
                  placeholder="e.g. V, GF, VG, DF"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                />
                <p className="text-[10px] text-gray-400 mt-1">Use tags like V (Vegetarian), VG (Vegan), GF (Gluten-Free), DF (Dairy-Free)</p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="menuIsAvailable"
                  checked={menuIsAvailable}
                  onChange={(e) => setMenuIsAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#607A66] border-gray-300 rounded focus:ring-[#607A66]"
                />
                <label htmlFor="menuIsAvailable" className="text-xs font-semibold text-gray-700 select-none cursor-pointer">
                  Item is currently available for customers to order/view
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsMenuModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-[#607A66] hover:bg-[#4e6453] text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Menu Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PRE-ORDER PRODUCT MODAL --- */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#607A66] text-[#FAF6F0] p-6 flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg">
                {productId ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-white hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. The Welsh Valleys Picnic Hamper"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Price (£)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    placeholder="35.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none bg-white"
                  >
                    <option value="Take-Away Picnic Hamper">Take-Away Picnic Hamper</option>
                    <option value="Afternoon Tea Gift Box">Afternoon Tea Gift Box</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Detail the delicious sandwiches, bakes, sausage rolls and drinks included inside..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Min Lead Hours</label>
                  <input
                    type="number"
                    required
                    value={productMinLeadHours}
                    onChange={(e) => setProductMinLeadHours(e.target.value)}
                    placeholder="48"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Image URL</label>
                  <input
                    type="url"
                    value={productImagePath}
                    onChange={(e) => setProductImagePath(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#607A66] focus:border-[#607A66] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="productIsActive"
                  checked={productIsActive}
                  onChange={(e) => setProductIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#607A66] border-gray-300 rounded focus:ring-[#607A66]"
                />
                <label htmlFor="productIsActive" className="text-xs font-semibold text-gray-700 select-none cursor-pointer">
                  Product is active and listed in order catalog
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="bg-[#607A66] hover:bg-[#4e6453] text-white text-xs font-semibold px-5 py-2 rounded-lg transition shadow-xs disabled:opacity-50"
                >
                  {actionLoading ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}