'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Calendar, DollarSign, Users, Eye, TrendingUp, Sparkles, CheckCircle2,
  Clock, Plus, Copy, ExternalLink, Share2, Phone, Settings,
  LogOut, ArrowUpRight, ChevronRight, MessageSquare
} from 'lucide-react'
import { InstagramIcon } from '@/components/icons'
import { LangProvider, useLang, LangToggle } from '@/components/lang-provider'
import { formatPrice } from '@/lib/utils'

import { AutoFollowUpModal } from '@/components/follow-up-modal'
import { OnboardingTourModal } from '@/components/onboarding-tour'

export default function DashboardPage() {
  return (
    <LangProvider>
      <DashboardContent />
    </LangProvider>
  )
}

function DashboardContent() {
  const { t } = useLang()
  const router = useRouter()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'crm' | 'services' | 'earnings' | 'settings'>('overview')
  const [copied, setCopied] = useState(false)
  const [followUpClient, setFollowUpClient] = useState<any>(null)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    // Check if first-time user hasn't seen tutorial
    const hasSeen = localStorage.getItem('bmg_tutorial_seen')
    if (!hasSeen) {
      setShowTutorial(true)
      localStorage.setItem('bmg_tutorial_seen', 'true')
    }
  }, [])

  // Service form state
  const [newServiceName, setNewServiceName] = useState('')
  const [newServicePrice, setNewServicePrice] = useState('')
  const [newServiceDuration, setNewServiceDuration] = useState('120')
  const [newServiceCategory, setNewServiceCategory] = useState('bridal')

  // Client CRM form state
  const [crmName, setCrmName] = useState('')
  const [crmPhone, setCrmPhone] = useState('')
  const [crmDate, setCrmDate] = useState('')
  const [crmSkin, setCrmSkin] = useState('')
  const [crmNotes, setCrmNotes] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard')
      if (res.status === 401) {
        router.push('/login')
        return
      }
      const json = await res.json()
      setData(json)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyLink = () => {
    if (!data?.artist?.slug) return
    const url = `${window.location.origin}/${data.artist.slug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newServiceName || !newServicePrice) return
    await fetch('/api/dashboard/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_service',
        name: newServiceName,
        price: parseInt(newServicePrice),
        duration: parseInt(newServiceDuration),
        category: newServiceCategory,
        priceType: 'fixed'
      })
    })
    setNewServiceName('')
    setNewServicePrice('')
    fetchDashboard()
  }

  const handleStatusUpdate = async (bookingId: string, status: string) => {
    await fetch('/api/dashboard/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_booking_status',
        id: bookingId,
        status
      })
    })
    fetchDashboard()
  }

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!crmName) return
    await fetch('/api/dashboard/actions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_client',
        name: crmName,
        phone: crmPhone,
        weddingDate: crmDate || null,
        skinType: crmSkin,
        notes: crmNotes
      })
    })
    setCrmName('')
    setCrmPhone('')
    setCrmDate('')
    setCrmSkin('')
    setCrmNotes('')
    fetchDashboard()
  }

  const handleLogout = async () => {
    await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' })
    })
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const { artist, stats } = data || {}
  const bookingPageUrl = typeof window !== 'undefined' && artist ? `${window.location.origin}/${artist.slug}` : `/${artist?.slug}`

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row text-ink">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-border p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-8">
            <span className="font-display font-bold text-xl tracking-tight text-ink flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-gold" /> BookMyGlow
            </span>
            <LangToggle />
          </div>

          <div className="mb-6 p-3 bg-cream rounded-xl border border-border">
            <p className="text-xs text-ink-muted">{t('Logged in as', 'लॉग इन किया')}</p>
            <p className="text-sm font-semibold truncate mt-0.5">{artist?.businessName || artist?.name}</p>
            <a
              href={`/${artist?.slug}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-xs text-gold flex items-center gap-1 hover:underline"
            >
              {t('View live page', 'लाइव पेज देखें')} <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', labelHi: 'डैशबोर्ड', icon: TrendingUp },
              { id: 'bookings', label: 'Bookings', labelHi: 'बुकिंग्स', icon: Calendar, badge: stats?.pendingBookings },
              { id: 'crm', label: 'Client CRM', labelHi: 'क्लाइंट्स', icon: Users },
              { id: 'services', label: 'Services & Pricing', labelHi: 'सेवाएं और रेट्स', icon: DollarSign },
              { id: 'earnings', label: 'Earnings Tracker', labelHi: 'कमाई', icon: DollarSign },
              { id: 'settings', label: 'Profile Settings', labelHi: 'सेटिंग्स', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    active ? 'bg-ink text-cream' : 'text-ink-muted hover:text-ink hover:bg-cream'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{t(tab.label, tab.labelHi)}</span>
                  </div>
                  {tab.badge ? (
                    <span className="bg-gold text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              )
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-ink-muted hover:text-danger mt-8 px-3 py-2"
        >
          <LogOut className="w-4 h-4" /> {t('Sign Out', 'लॉग आउट')}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto">
        {/* Banner with Direct Instagram Bio Link */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setShowTutorial(true)}
            className="text-xs text-gold hover:underline flex items-center gap-1 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" /> {t('How it works (Tutorial)', 'ट्यूटोरियल देखें')}
          </button>
        </div>
        <div className="mb-8 p-5 bg-gradient-to-r from-ink to-ink-light rounded-2xl text-cream flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold font-semibold">{t('Your Instagram Bio Link', 'आपका इंस्टाग्राम बायो लिंक')}</p>
            <p className="text-lg font-mono font-medium mt-1 select-all">{bookingPageUrl}</p>
            <p className="text-xs text-cream/70 mt-1">
              {t('Put this in your Instagram bio to let brides book you with zero DM friction.', 'इसे अपने बायो में लगाएं और ब्राइड्स को बिना झंझट सीधे बुक करने दें।')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="bg-gold hover:bg-gold-light text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all shadow-sm"
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? t('Copied!', 'कॉपी हो गया!') : t('Copy Link', 'लिंक कॉपी करें')}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out my bridal makeup services and book here: ${bookingPageUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-white/20 text-cream px-3 py-2 rounded-xl text-sm flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* TAB: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-up">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('This Month', 'इस महीने')}</span>
                <p className="text-2xl font-bold font-display mt-2">{formatPrice(stats?.thisMonthEarnings || 0)}</p>
                <p className="text-xs text-success flex items-center gap-1 mt-1 font-medium">
                  <TrendingUp className="w-3 h-3" /> {t('Active Revenue', 'एक्टिव कमाई')}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('Page Views', 'पेज व्यूज')}</span>
                <p className="text-2xl font-bold font-display mt-2">{stats?.totalPageViews || 0}</p>
                <p className="text-xs text-ink-muted mt-1">{stats?.conversionRate || 0}% {t('Conversion', 'कन्वर्जन')}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('Pending Bookings', 'पेंडिंग बुकिंग्स')}</span>
                <p className="text-2xl font-bold font-display mt-2 text-warning">{stats?.pendingBookings || 0}</p>
                <p className="text-xs text-ink-muted mt-1">{t('Need confirmation', 'कन्फर्मेशन बाकी')}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-border">
                <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{t('Total Clients', 'कुल क्लाइंट्स')}</span>
                <p className="text-2xl font-bold font-display mt-2">{stats?.totalClients || 0}</p>
                <p className="text-xs text-gold flex items-center gap-1 mt-1 font-medium">
                  ★ {stats?.avgRating?.toFixed(1) || '5.0'} {t('Rating', 'रेटिंग')}
                </p>
              </div>
            </div>

            {/* Recent Bookings Queue */}
            <div className="bg-white rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg">{t('Recent Bridal Inquiries', 'ताज़ा ब्राइडल इंक्वायरीज')}</h3>
                <button onClick={() => setActiveTab('bookings')} className="text-xs text-gold font-medium hover:underline">
                  {t('View all', 'सभी देखें')} →
                </button>
              </div>

              {artist?.bookings?.length === 0 ? (
                <p className="text-sm text-ink-muted py-6 text-center">{t('No bookings yet. Share your link on Instagram to get booked!', 'अभी तक कोई बुकिंग नहीं आई। इंस्टाग्राम पर लिंक शेयर करें!')}</p>
              ) : (
                <div className="space-y-3">
                  {artist?.bookings?.slice(0, 4).map((b: any) => (
                    <div key={b.id} className="p-4 rounded-xl border border-border-light bg-cream/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{b.clientName}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                            b.status === 'confirmed' ? 'badge-confirmed' : b.status === 'completed' ? 'badge-completed' : 'badge-pending'
                          }`}>
                            {b.status}
                          </span>
                        </div>
                        <p className="text-xs text-ink-muted mt-1">
                          {new Date(b.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {b.eventType || 'Bridal'} {b.eventLocation ? `• ${b.eventLocation}` : ''}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFollowUpClient(b)}
                          className="bg-cream border border-border hover:border-gold text-ink text-xs px-2.5 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-gold" /> {t('Follow-up Nudge', 'फॉलो-अप')}
                        </button>
                        <a
                          href={`https://wa.me/91${b.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${b.clientName}! This is ${artist.name}. Regarding your makeup booking on ${new Date(b.eventDate).toLocaleDateString()}...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#25D366] text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" /> WhatsApp
                        </a>
                        {b.status === 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                            className="bg-ink text-cream text-xs px-3 py-1.5 rounded-lg"
                          >
                            {t('Accept', 'स्वीकारें')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Instagram Profile Health Mini Card */}
            <div className="bg-white p-6 rounded-2xl border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-display font-bold text-base flex items-center gap-2">
                  <InstagramIcon className="w-5 h-5 text-rose" /> {t('Instagram Conversion Audit', 'इंस्टाग्राम प्रोफाइल ऑडिट')}
                </h4>
                <p className="text-xs text-ink-muted mt-1 max-w-md">
                  {t('Get a complete diagnosis of your Instagram bio, reel frequency, and hashtag setup to multiply your booking rate.', 'अपनी बायो, रील्स और हैशटैग्स को सुधारें ताकि ज़्यादा ब्राइड्स बुक करें।')}
                </p>
              </div>
              <a
                href="/audit"
                className="bg-cream border border-border hover:border-gold px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                {t('Run Free Audit', 'फ्री ऑडिट करें')} <ArrowUpRight className="w-4 h-4 text-gold" />
              </a>
            </div>
          </div>
        )}

        {/* TAB: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fade-up">
            <h3 className="font-display font-bold text-xl">{t('All Bookings & Inquiries', 'सभी बुकिंग्स')}</h3>
            <div className="space-y-3">
              {artist?.bookings?.map((b: any) => (
                <div key={b.id} className="bg-white p-5 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-base">{b.clientName}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        b.status === 'confirmed' ? 'badge-confirmed' : b.status === 'completed' ? 'badge-completed' : 'badge-pending'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted mt-1">
                      📅 {new Date(b.eventDate).toDateString()} | 📞 +91 {b.clientPhone} {b.eventLocation ? `| 📍 ${b.eventLocation}` : ''}
                    </p>
                    {b.notes && <p className="text-xs bg-cream p-2 rounded-lg mt-2 text-ink-light">"{b.notes}"</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setFollowUpClient(b)}
                      className="bg-cream border border-border hover:border-gold text-ink text-xs px-2.5 py-2 rounded-xl flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-gold" /> {t('Send 24h Nudge', '24h फॉलो-अप')}
                    </button>
                    <a
                      href={`https://wa.me/91${b.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${b.clientName}! This is ${artist.name} regarding your booking...`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-[#25D366] text-white text-xs px-3 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
                    </a>
                    {b.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                        className="bg-ink text-cream text-xs px-3 py-2 rounded-xl"
                      >
                        {t('Confirm', 'कन्फर्म करें')}
                      </button>
                    )}
                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(b.id, 'completed')}
                        className="bg-success text-white text-xs px-3 py-2 rounded-xl"
                      >
                        {t('Mark Done & Paid', 'पूरा हुआ और भुगतान मिला')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: CLIENT CRM */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl">{t('Bride & Client CRM', 'क्लाइंट और ब्राइड CRM')}</h3>
                <p className="text-xs text-ink-muted">{t('Save bride notes, skin allergies, and look preferences forever.', 'स्किन टाइप, एलर्जी और लुक प्रेफरेंसेस हमेशा के लिए सेव रखें।')}</p>
              </div>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddClient} className="bg-white p-5 rounded-2xl border border-border space-y-3">
              <h4 className="text-sm font-semibold">{t('Add Bride Profile', 'नई ब्राइड प्रोफाइल जोड़ें')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={t('Bride Name', 'दुल्हन का नाम')}
                  value={crmName}
                  onChange={e => setCrmName(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                  required
                />
                <input
                  type="tel"
                  placeholder={t('Phone Number', 'फ़ोन नंबर')}
                  value={crmPhone}
                  onChange={e => setCrmPhone(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                />
                <input
                  type="date"
                  placeholder={t('Wedding Date', 'शादी की तारीख')}
                  value={crmDate}
                  onChange={e => setCrmDate(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t('Skin Type & Allergies (e.g. Dry skin, avoid latex)', 'स्किन टाइप और एलर्जी (जैसे: ड्राय स्किन)')}
                  value={crmSkin}
                  onChange={e => setCrmSkin(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                />
                <input
                  type="text"
                  placeholder={t('Preferences / Inspo notes', 'पसंद और नोट्स')}
                  value={crmNotes}
                  onChange={e => setCrmNotes(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                />
              </div>
              <button type="submit" className="bg-ink text-cream text-xs px-4 py-2 rounded-xl font-medium">
                + {t('Save Client', 'क्लाइंट सेव करें')}
              </button>
            </form>

            {/* Client List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {artist?.clients?.map((c: any) => (
                <div key={c.id} className="bg-white p-5 rounded-2xl border border-border">
                  <h4 className="font-semibold text-sm">{c.name}</h4>
                  {c.phone && <p className="text-xs text-ink-muted mt-0.5">📞 +91 {c.phone}</p>}
                  {c.weddingDate && (
                    <p className="text-xs text-gold font-medium mt-1">
                      💍 {t('Big Day:', 'बड़ा दिन:')} {new Date(c.weddingDate).toLocaleDateString()}
                    </p>
                  )}
                  {c.skinType && (
                    <div className="mt-3 p-2 bg-cream rounded-lg text-xs">
                      <span className="font-semibold">{t('Skin & Allergies:', 'स्किन व एलर्जी:')}</span> {c.skinType}
                    </div>
                  )}
                  {c.notes && (
                    <p className="text-xs text-ink-light mt-2 italic">"{c.notes}"</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fade-up">
            <h3 className="font-display font-bold text-xl">{t('Services & Pricing Menu', 'सेवाएं और रेट्स')}</h3>
            
            {/* Create Service Form */}
            <form onSubmit={handleAddService} className="bg-white p-5 rounded-2xl border border-border space-y-3">
              <h4 className="text-sm font-semibold">{t('Add New Service', 'नई सेवा जोड़ें')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder={t('Service Title (e.g. Engagement Glam)', 'सेवा का नाम')}
                  value={newServiceName}
                  onChange={e => setNewServiceName(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                  required
                />
                <input
                  type="number"
                  placeholder={t('Price in ₹', 'कीमत (₹)')}
                  value={newServicePrice}
                  onChange={e => setNewServicePrice(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                  required
                />
                <input
                  type="number"
                  placeholder={t('Duration in mins', 'समय (मिनट)')}
                  value={newServiceDuration}
                  onChange={e => setNewServiceDuration(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                />
                <select
                  value={newServiceCategory}
                  onChange={e => setNewServiceCategory(e.target.value)}
                  className="bg-cream border border-border px-3 py-2 rounded-xl text-xs focus:outline-none focus:border-gold"
                >
                  <option value="bridal">{t('Bridal', 'ब्राइडल')}</option>
                  <option value="party">{t('Party', 'पार्टी')}</option>
                  <option value="engagement">{t('Engagement', 'सगाई')}</option>
                  <option value="editorial">{t('Editorial', 'एडिटोरियल')}</option>
                </select>
              </div>
              <button type="submit" className="bg-ink text-cream text-xs px-4 py-2 rounded-xl font-medium">
                + {t('Add Service', 'सेवा जोड़ें')}
              </button>
            </form>

            <div className="space-y-3">
              {artist?.services?.map((s: any) => (
                <div key={s.id} className="bg-white p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-sm">{s.name}</h5>
                    <p className="text-xs text-ink-muted">{s.duration} mins • {s.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm">{formatPrice(s.price || 0)}</span>
                    <button
                      onClick={async () => {
                        await fetch('/api/dashboard/actions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ action: 'delete_service', id: s.id })
                        })
                        fetchDashboard()
                      }}
                      className="text-xs text-danger hover:underline"
                    >
                      {t('Delete', 'हटाएं')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: EARNINGS */}
        {activeTab === 'earnings' && (
          <div className="space-y-6 animate-fade-up">
            <h3 className="font-display font-bold text-xl">{t('Wedding Season Earnings', 'कमाई का हिसाब')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-border">
                <span className="text-xs text-ink-muted uppercase font-semibold">{t('This Month Revenue', 'इस महीने की कुल आय')}</span>
                <p className="text-3xl font-display font-bold mt-2">{formatPrice(stats?.thisMonthEarnings || 0)}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-border">
                <span className="text-xs text-ink-muted uppercase font-semibold">{t('Last Month Revenue', 'पिछले महीने की कुल आय')}</span>
                <p className="text-3xl font-display font-bold mt-2">{formatPrice(stats?.lastMonthEarnings || 0)}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border">
              <h4 className="font-semibold text-sm mb-4">{t('Recent Transactions', 'हालिया भुगतान')}</h4>
              {artist?.earnings?.length === 0 ? (
                <p className="text-xs text-ink-muted">{t('No revenue logged yet. When you mark a booking as completed, it gets automatically added here.', 'कोई भुगतान नहीं मिला। जब आप बुकिंग पूरी मार्क करेंगे तो यहां दिखेगा।')}</p>
              ) : (
                <div className="space-y-2">
                  {artist?.earnings?.map((e: any) => (
                    <div key={e.id} className="flex items-center justify-between py-2 border-b border-border-light text-xs">
                      <div>
                        <p className="font-medium text-ink">{e.description || 'Service Payment'}</p>
                        <p className="text-ink-muted">{new Date(e.date).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-success text-sm">+{formatPrice(e.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-up">
            <h3 className="font-display font-bold text-xl">{t('Profile & Contact Settings', 'प्रोफाइल सेटिंग्स')}</h3>
            <div className="bg-white p-6 rounded-2xl border border-border space-y-4">
              <div>
                <label className="text-xs text-ink-muted uppercase font-semibold">{t('Studio / Brand Name', 'स्टूडियो / ब्रांड नाम')}</label>
                <input
                  type="text"
                  defaultValue={artist?.businessName || artist?.name}
                  id="settingName"
                  className="w-full mt-1 bg-cream border border-border px-3 py-2 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted uppercase font-semibold">{t('WhatsApp Number', 'व्हाट्सएप नंबर')}</label>
                <input
                  type="tel"
                  defaultValue={artist?.whatsappNumber || artist?.phone}
                  id="settingPhone"
                  className="w-full mt-1 bg-cream border border-border px-3 py-2 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted uppercase font-semibold">{t('Instagram Username', 'इंस्टाग्राम यूजरनेम')}</label>
                <input
                  type="text"
                  defaultValue={artist?.instagramHandle || ''}
                  id="settingIg"
                  className="w-full mt-1 bg-cream border border-border px-3 py-2 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted uppercase font-semibold">{t('Locality in Delhi NCR', 'दिल्ली NCR का इलाका')}</label>
                <input
                  type="text"
                  defaultValue={artist?.locality || 'South Delhi'}
                  id="settingLocality"
                  className="w-full mt-1 bg-cream border border-border px-3 py-2 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-ink-muted uppercase font-semibold">{t('Bio / About Me', 'बायो / मेरे बारे में')}</label>
                <textarea
                  defaultValue={artist?.bio || ''}
                  id="settingBio"
                  rows={3}
                  className="w-full mt-1 bg-cream border border-border px-3 py-2 rounded-xl text-sm"
                />
              </div>
              <button
                onClick={async () => {
                  const bName = (document.getElementById('settingName') as HTMLInputElement).value
                  const phone = (document.getElementById('settingPhone') as HTMLInputElement).value
                  const ig = (document.getElementById('settingIg') as HTMLInputElement).value
                  const loc = (document.getElementById('settingLocality') as HTMLInputElement).value
                  const bio = (document.getElementById('settingBio') as HTMLTextAreaElement).value

                  await fetch('/api/dashboard', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      businessName: bName,
                      whatsappNumber: phone,
                      instagramHandle: ig,
                      locality: loc,
                      bio
                    })
                  })
                  alert(t('Profile updated!', 'प्रोफाइल अपडेट हो गई!'))
                  fetchDashboard()
                }}
                className="bg-ink text-cream px-6 py-2.5 rounded-xl text-xs font-semibold"
              >
                {t('Save Changes', 'बदलाव सेव करें')}
              </button>
            </div>
          </div>
        )}
      </main>

      {followUpClient && (
        <AutoFollowUpModal
          client={{
            name: followUpClient.clientName,
            phone: followUpClient.clientPhone,
            eventDate: followUpClient.eventDate,
            eventType: followUpClient.eventType
          }}
          artistName={artist?.businessName || artist?.name || 'MUA'}
          onClose={() => setFollowUpClient(null)}
        />
      )}

      {showTutorial && artist && (
        <OnboardingTourModal
          artist={{
            name: artist.name,
            slug: artist.slug,
            phone: artist.phone
          }}
          onClose={() => setShowTutorial(false)}
        />
      )}
    </div>
  )
}
