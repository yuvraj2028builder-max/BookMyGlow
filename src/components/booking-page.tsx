'use client'

import { useState } from 'react'
import { Star, MapPin, Clock, ChevronDown, ChevronUp, Check, Calendar, Phone, MessageCircle, Sparkles, Award, Heart } from 'lucide-react'
import { InstagramIcon } from '@/components/icons'
import { LangProvider, LangToggle, useLang } from '@/components/lang-provider'
import type { ArtistPublic, ServicePublic, BookingRequest } from '@/lib/types'
import { formatPriceDisplay, getWhatsAppUrl, getInstagramUrl, getInitials } from '@/lib/utils'

interface BookingPageProps {
  artist: ArtistPublic
}

export default function BookingPage({ artist }: BookingPageProps) {
  return (
    <LangProvider>
      <BookingPageInner artist={artist} />
    </LangProvider>
  )
}

function BookingPageInner({ artist }: BookingPageProps) {
  const { t } = useLang()
  const [activeSection, setActiveSection] = useState<'portfolio' | 'services' | 'reviews'>('portfolio')
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedService, setSelectedService] = useState<ServicePublic | null>(null)

  const handleBookService = (service: ServicePublic) => {
    setSelectedService(service)
    setShowBookingForm(true)
  }

  const handleWhatsApp = (service?: ServicePublic) => {
    const message = service
      ? `Hi ${artist.name}! I saw your BookMyGlow page and I'm interested in "${service.name}". Can we discuss details?`
      : `Hi ${artist.name}! I found you on BookMyGlow and I'd love to discuss booking your makeup services.`
    window.open(getWhatsAppUrl(artist.whatsappNumber || '', message), '_blank')
  }

  return (
    <div className="min-h-dvh bg-cream">
      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border p-3 flex gap-2 md:hidden">
        {artist.showWhatsapp && artist.whatsappNumber && (
          <button
            onClick={() => handleWhatsApp()}
            className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-xl font-medium text-sm"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </button>
        )}
        {artist.showBookingForm && (
          <button
            onClick={() => { setSelectedService(null); setShowBookingForm(true) }}
            className="flex-1 flex items-center justify-center gap-2 bg-ink text-cream py-3 rounded-xl font-medium text-sm"
          >
            <Calendar className="w-4 h-4" />
            {t('Book Now', 'अभी बुक करें')}
          </button>
        )}
      </div>

      {/* Hero Section */}
      <section className="relative">
        {/* Cover */}
        <div className="h-48 sm:h-64 bg-gradient-to-br from-ink via-ink-light to-ink relative overflow-hidden">
          {artist.coverUrl ? (
            <img src={artist.coverUrl} alt="" className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(196,162,101,0.3),transparent_60%)]" />
          )}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <LangToggle />
            {artist.instagramHandle && (
              <a
                href={getInstagramUrl(artist.instagramHandle)}
                target="_blank"
                rel="noopener"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="max-w-xl mx-auto px-4 -mt-16 relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full border-4 border-cream bg-gold flex items-center justify-center overflow-hidden shadow-lg">
              {artist.avatarUrl ? (
                <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-display font-bold text-white">{getInitials(artist.name)}</span>
              )}
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-display font-bold text-ink tracking-tight">
              {artist.businessName || artist.name}
            </h1>

            {artist.tagline && (
              <p className="mt-1 text-ink-muted text-sm italic">{artist.tagline}</p>
            )}

            {/* Trust Bar */}
            <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {artist.locality ? `${artist.locality}, ${artist.city}` : artist.city}
              </span>
              {artist.yearsOfExp > 0 && (
                <span className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {artist.yearsOfExp}+ {t('years', 'साल')}
                </span>
              )}
              {artist.isVerified && (
                <span className="flex items-center gap-1 text-gold">
                  <Check className="w-3 h-3" />
                  {t('Verified', 'वेरिफ़ाइड')}
                </span>
              )}
            </div>

            {/* Rating */}
            {artist.totalReviews > 0 && (
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(artist.avgRating) ? 'text-gold fill-gold' : 'text-border'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-ink-muted">
                  {artist.avgRating.toFixed(1)} ({artist.totalReviews} {t('reviews', 'समीक्षाएं')})
                </span>
              </div>
            )}

            {/* Bio */}
            {artist.bio && (
              <p className="mt-3 text-sm text-ink-light leading-relaxed max-w-md">{artist.bio}</p>
            )}

            {/* Desktop CTA */}
            <div className="hidden md:flex mt-4 gap-3">
              {artist.showWhatsapp && artist.whatsappNumber && (
                <button
                  onClick={() => handleWhatsApp()}
                  className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-[#20BD5A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
              )}
              {artist.showBookingForm && (
                <button
                  onClick={() => { setSelectedService(null); setShowBookingForm(true) }}
                  className="flex items-center gap-2 bg-ink text-cream px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-ink-light transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  {t('Book Now', 'अभी बुक करें')}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <nav className="max-w-xl mx-auto mt-6 px-4">
        <div className="flex border-b border-border">
          {(['portfolio', 'services', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`flex-1 py-3 text-sm font-medium text-center border-b-2 transition-colors ${
                activeSection === tab
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink-light'
              }`}
            >
              {tab === 'portfolio' ? t('Portfolio', 'पोर्टफोलियो') :
               tab === 'services' ? t('Services', 'सेवाएं') :
               t('Reviews', 'समीक्षाएं')}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-xl mx-auto px-4 py-6 pb-28 md:pb-6">
        {activeSection === 'portfolio' && (
          <PortfolioSection items={artist.portfolio} />
        )}
        {activeSection === 'services' && (
          <ServicesSection
            services={artist.services}
            onBook={handleBookService}
            onWhatsApp={(s) => handleWhatsApp(s)}
            showBookingForm={artist.showBookingForm}
            showWhatsapp={artist.showWhatsapp}
          />
        )}
        {activeSection === 'reviews' && (
          <ReviewsSection reviews={artist.reviews} />
        )}
      </main>

      {/* Booking Modal */}
      {showBookingForm && (
        <BookingModal
          artist={artist}
          service={selectedService}
          onClose={() => setShowBookingForm(false)}
          onWhatsApp={handleWhatsApp}
        />
      )}

      {/* Powered By */}
      <footer className="text-center py-4 text-xs text-ink-muted">
        <a href="/" className="hover:text-gold transition-colors">
          ✨ Powered by <span className="font-medium">BookMyGlow</span>
        </a>
      </footer>
    </div>
  )
}

function PortfolioSection({ items }: { items: ArtistPublic['portfolio'] }) {
  const { t } = useLang()
  const featured = items.filter(i => i.isFeatured)
  const rest = items.filter(i => !i.isFeatured)

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-ink-muted text-sm">
        <Sparkles className="w-8 h-8 mx-auto mb-2 text-gold" />
        {t('Portfolio coming soon', 'पोर्टफोलियो जल्द आ रहा है')}
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-fade-up">
      {/* Featured - large */}
      {featured.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {featured.map((item) => (
            <div key={item.id} className="portfolio-item rounded-2xl overflow-hidden aspect-[4/5] relative">
              <img src={item.imageUrl} alt={item.caption || 'Portfolio'} className="w-full h-full object-cover" />
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-white text-xs">{item.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {rest.map((item) => (
          <div key={item.id} className="portfolio-item rounded-xl overflow-hidden aspect-square relative">
            <img src={item.imageUrl} alt={item.caption || 'Portfolio'} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ServicesSection({
  services, onBook, onWhatsApp, showBookingForm, showWhatsapp
}: {
  services: ServicePublic[]
  onBook: (s: ServicePublic) => void
  onWhatsApp: (s: ServicePublic) => void
  showBookingForm: boolean
  showWhatsapp: boolean
}) {
  const { t } = useLang()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categories = [...new Set(services.map(s => s.category))]

  return (
    <div className="space-y-6 animate-fade-up">
      {categories.map((cat) => (
        <div key={cat}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
            {cat === 'bridal' ? t('Bridal', 'ब्राइडल') :
             cat === 'party' ? t('Party & Events', 'पार्टी और इवेंट्स') :
             cat === 'engagement' ? t('Engagement', 'सगाई') :
             cat === 'editorial' ? t('Editorial', 'एडिटोरियल') :
             t('Other Services', 'अन्य सेवाएं')}
          </h3>
          <div className="space-y-2">
            {services.filter(s => s.category === cat).map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-border-light p-4 transition-shadow hover:shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-ink text-sm">{service.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm font-semibold text-ink">
                        {formatPriceDisplay(service.priceType, service.price, service.priceMin, service.priceMax)}
                      </span>
                      <span className="text-xs text-ink-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {service.duration} {t('min', 'मिनट')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {showBookingForm && (
                      <button
                        onClick={() => onBook(service)}
                        className="text-xs font-medium bg-ink text-cream px-4 py-2 rounded-lg hover:bg-ink-light transition-colors"
                      >
                        {t('Book', 'बुक')}
                      </button>
                    )}
                    {showWhatsapp && !showBookingForm && (
                      <button
                        onClick={() => onWhatsApp(service)}
                        className="text-xs font-medium bg-[#25D366] text-white px-4 py-2 rounded-lg"
                      >
                        {t('Enquire', 'पूछें')}
                      </button>
                    )}
                  </div>
                </div>
                {service.description && (
                  <button
                    onClick={() => setExpandedId(expandedId === service.id ? null : service.id)}
                    className="mt-2 text-xs text-ink-muted flex items-center gap-1 hover:text-ink-light"
                  >
                    {expandedId === service.id ? (
                      <><ChevronUp className="w-3 h-3" /> {t('Less', 'कम')}</>
                    ) : (
                      <><ChevronDown className="w-3 h-3" /> {t('Details', 'विवरण')}</>
                    )}
                  </button>
                )}
                {expandedId === service.id && service.description && (
                  <p className="mt-2 text-xs text-ink-light leading-relaxed animate-fade-in">
                    {service.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ReviewsSection({ reviews }: { reviews: ArtistPublic['reviews'] }) {
  const { t } = useLang()

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-ink-muted text-sm">
        <Heart className="w-8 h-8 mx-auto mb-2 text-rose" />
        {t('No reviews yet', 'अभी तक कोई समीक्षा नहीं')}
      </div>
    )
  }

  return (
    <div className="space-y-3 animate-fade-up">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-2xl border border-border-light p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-ink">{review.clientName}</p>
              {review.eventType && (
                <p className="text-xs text-ink-muted">{review.eventType}</p>
              )}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < review.rating ? 'text-gold fill-gold' : 'text-border'}`}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-ink-light leading-relaxed">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}

function BookingModal({
  artist, service, onClose, onWhatsApp
}: {
  artist: ArtistPublic
  service: ServicePublic | null
  onClose: () => void
  onWhatsApp: (s?: ServicePublic) => void
}) {
  const { t } = useLang()
  const [step, setStep] = useState<'details' | 'confirm'>('details')
  const [form, setForm] = useState<BookingRequest>({
    serviceId: service?.id || '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    eventDate: '',
    eventType: '',
    eventLocation: '',
    notes: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/booking/${artist.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setSubmitted(true)
      }
    } catch {
      // fallback to WhatsApp
      onWhatsApp(service || undefined)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-cream rounded-t-3xl sm:rounded-3xl w-full max-w-md p-8 text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-display font-bold text-ink">
            {t("You're booked! ✨", 'बुकिंग हो गई! ✨')}
          </h3>
          <p className="text-sm text-ink-muted mt-2">
            {t(
              `${artist.name} will confirm your booking shortly via WhatsApp.`,
              `${artist.name} जल्द ही WhatsApp पर आपकी बुकिंग कन्फर्म करेंगी।`
            )}
          </p>
          <div className="mt-6 p-4 bg-white rounded-xl text-left text-sm space-y-2">
            <p className="font-medium">{t('What happens next:', 'अब क्या होगा:')}</p>
            <p className="text-ink-muted flex items-start gap-2">
              <span className="text-gold mt-0.5">1.</span>
              {t('Artist reviews your request', 'आर्टिस्ट आपकी request देखेंगी')}
            </p>
            <p className="text-ink-muted flex items-start gap-2">
              <span className="text-gold mt-0.5">2.</span>
              {t('You\'ll get a WhatsApp message to confirm', 'WhatsApp पर confirm करने का message आएगा')}
            </p>
            <p className="text-ink-muted flex items-start gap-2">
              <span className="text-gold mt-0.5">3.</span>
              {t('Pay advance to lock your date', 'Date lock करने के लिए advance pay करें')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full bg-ink text-cream py-3 rounded-xl font-medium text-sm"
          >
            {t('Done', 'ठीक है')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-cream rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90dvh] overflow-y-auto animate-scale-in">
        <div className="sticky top-0 bg-cream rounded-t-3xl px-6 pt-6 pb-3 border-b border-border-light z-10">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4 sm:hidden" />
          <h3 className="text-lg font-display font-bold text-ink">
            {t("Let's create your dream look", 'अपना ड्रीम लुक बनाएं')} ✨
          </h3>
          <p className="text-xs text-ink-muted mt-1">
            {service ? service.name : t('Choose your service below', 'नीचे सेवा चुनें')}
          </p>
        </div>

        <div className="p-6 space-y-4">
          {/* Service Selection */}
          {!service && (
            <div>
              <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
                {t('What look are you going for?', 'कौन सा look चाहिए?')}
              </label>
              <select
                value={form.serviceId}
                onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
                className="mt-1.5 w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
              >
                <option value="">{t('Select a service', 'सेवा चुनें')}</option>
                {artist.services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {formatPriceDisplay(s.priceType, s.price, s.priceMin, s.priceMax)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              {t("When's the big day?", 'बड़ा दिन कब है?')} 💍
            </label>
            <input
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1.5 w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Event Type */}
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              {t('Event type', 'इवेंट का प्रकार')}
            </label>
            <select
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
              className="mt-1.5 w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
            >
              <option value="">{t('Select', 'चुनें')}</option>
              <option value="wedding">{t('Wedding', 'शादी')}</option>
              <option value="engagement">{t('Engagement', 'सगाई')}</option>
              <option value="sangeet">{t('Sangeet / Mehendi', 'संगीत / मेहंदी')}</option>
              <option value="reception">{t('Reception', 'रिसेप्शन')}</option>
              <option value="party">{t('Party / Event', 'पार्टी / इवेंट')}</option>
              <option value="shoot">{t('Photo / Video Shoot', 'फ़ोटो / वीडियो शूट')}</option>
            </select>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              {t('Your name', 'आपका नाम')}
            </label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              placeholder={t('Enter your name', 'नाम लिखें')}
              className="mt-1.5 w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              {t('WhatsApp / Phone', 'व्हाट्सएप / फ़ोन')}
            </label>
            <div className="mt-1.5 flex items-center bg-white border border-border rounded-xl overflow-hidden">
              <span className="text-sm text-ink-muted pl-4">+91</span>
              <input
                type="tel"
                value={form.clientPhone}
                onChange={(e) => setForm({ ...form, clientPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                placeholder="98765 43210"
                className="flex-1 px-3 py-3 text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              {t('Venue / Location', 'वेन्यू / लोकेशन')}
            </label>
            <input
              type="text"
              value={form.eventLocation}
              onChange={(e) => setForm({ ...form, eventLocation: e.target.value })}
              placeholder={t('e.g., The Leela Palace, Delhi', 'जैसे, द लीला पैलेस, दिल्ली')}
              className="mt-1.5 w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-medium text-ink-muted uppercase tracking-wide">
              {t('Anything else?', 'कुछ और बताना है?')}
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder={t('Skin type, allergies, inspo looks...', 'स्किन टाइप, एलर्जी, इंस्पो लुक...')}
              rows={3}
              className="mt-1.5 w-full bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold resize-none"
            />
          </div>

          {/* CTA */}
          <button
            onClick={handleSubmit}
            disabled={!form.clientName || !form.clientPhone || !form.eventDate || submitting}
            className="w-full bg-ink text-cream py-3.5 rounded-xl font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink-light transition-colors"
          >
            {submitting ? t('Sending...', 'भेज रहे हैं...') : t('Send Booking Request', 'बुकिंग रिक्वेस्ट भेजें')}
          </button>

          {/* WhatsApp fallback */}
          {artist.showWhatsapp && artist.whatsappNumber && (
            <button
              onClick={() => onWhatsApp(service || undefined)}
              className="w-full flex items-center justify-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors py-2"
            >
              <MessageCircle className="w-4 h-4" />
              {t('Prefer WhatsApp?', 'WhatsApp पसंद है?')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
