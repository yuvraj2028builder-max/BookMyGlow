'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, MapPin, Star, Filter, ArrowLeft, ArrowUpRight } from 'lucide-react'
import { LangProvider, LangToggle, useLang } from '@/components/lang-provider'
import { LOCALITIES, formatPrice } from '@/lib/utils'

export default function DiscoverPage() {
  return (
    <LangProvider>
      <DiscoverContent />
    </LangProvider>
  )
}

function DiscoverContent() {
  const { t } = useLang()
  const [artists, setArtists] = useState<any[]>([])
  const [locality, setLocality] = useState('all')
  const [maxBudget, setMaxBudget] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtists()
  }, [locality, maxBudget])

  const fetchArtists = async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (locality && locality !== 'all') query.set('locality', locality)
      if (maxBudget) query.set('maxBudget', maxBudget)
      const res = await fetch(`/api/discover?${query.toString()}`)
      const data = await res.json()
      setArtists(data.artists || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      <header className="border-b border-border bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 font-display font-bold text-lg text-ink">
            <ArrowLeft className="w-4 h-4 mr-1 text-ink-muted" /> BookMyGlow
          </Link>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/signup" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-ink text-cream">
              {t('Are You an MUA? Join Free', 'क्या आप MUA हैं? जुड़ें')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
        <div className="max-w-2xl mb-8">
          <span className="text-xs uppercase tracking-widest text-gold font-bold">{t('Verified Delhi NCR Network', 'दिल्ली NCR वेरिफ़ाइड डायरेक्टरी')}</span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-display font-bold">
            {t('Discover Top Bridal Makeup Artists in Delhi NCR', 'दिल्ली NCR की टॉप ब्राइडल मेकअप आर्टिस्ट्स')}
          </h1>
          <p className="mt-2 text-sm text-ink-muted">
            {t('Explore portfolios, view verified pricing, and book directly without middleman markups.', 'पोर्टफोलियो देखें, असली रेट्स चेक करें और सीधे बुक करें।')}
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-border mb-8 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
          <div className="flex-1 w-full flex items-center gap-2 bg-cream px-3 py-2 rounded-xl border border-border">
            <MapPin className="w-4 h-4 text-gold" />
            <select
              value={locality}
              onChange={e => setLocality(e.target.value)}
              className="bg-transparent text-xs font-medium w-full focus:outline-none"
            >
              <option value="all">{t('All Delhi NCR Areas', 'सभी इलाके')}</option>
              {LOCALITIES.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div className="w-full sm:w-48 flex items-center gap-2 bg-cream px-3 py-2 rounded-xl border border-border">
            <span className="text-xs font-bold text-ink-muted">₹</span>
            <input
              type="number"
              placeholder={t('Max budget (e.g. 25000)', 'अधिकतम बजट')}
              value={maxBudget}
              onChange={e => setMaxBudget(e.target.value)}
              className="bg-transparent text-xs w-full focus:outline-none"
            />
          </div>

          {(locality !== 'all' || maxBudget) && (
            <button
              onClick={() => { setLocality('all'); setMaxBudget('') }}
              className="text-xs text-ink-muted hover:text-ink px-2"
            >
              {t('Clear Filters', 'फ़िल्टर हटाएं')}
            </button>
          )}
        </div>

        {/* Artist Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : artists.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-border">
            <p className="text-sm text-ink-muted">{t('No artists found matching your criteria.', 'इस फ़िल्टर से कोई आर्टिस्ट नहीं मिला।')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-white rounded-3xl border border-border overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
                <div>
                  {/* Photo Preview Strip */}
                  <div className="h-44 bg-cream-dark relative overflow-hidden flex">
                    {artist.portfolioPreview?.length > 0 ? (
                      artist.portfolioPreview.slice(0, 2).map((img: string, i: number) => (
                        <img key={i} src={img} alt="" className="w-1/2 h-full object-cover" />
                      ))
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-ink to-ink-light opacity-80" />
                    )}
                    <span className="absolute top-3 right-3 text-[10px] uppercase font-bold bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-ink shadow-sm">
                      {artist.locality || artist.city}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-3">
                      <img
                        src={artist.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={artist.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gold -mt-8 relative z-10 shadow-sm"
                      />
                      <div>
                        <h3 className="font-display font-bold text-base text-ink line-clamp-1">
                          {artist.businessName || artist.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gold">
                          <Star className="w-3 h-3 fill-gold" />
                          <span>{artist.avgRating?.toFixed(1) || '5.0'}</span>
                          <span className="text-ink-muted">({artist.totalReviews || 0})</span>
                        </div>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      {artist.tagline || 'Specializing in bespoke bridal looks and glass-skin finishes.'}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-border-light mt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-ink-muted uppercase font-semibold">{t('Starting from', 'न्यूनतम दर')}</span>
                    <p className="text-sm font-bold text-ink">
                      {artist.startingPrice ? formatPrice(artist.startingPrice) : t('On Request', 'पूछें')}
                    </p>
                  </div>

                  <Link
                    href={`/${artist.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-ink text-cream hover:bg-ink-light transition-all"
                  >
                    {t('View & Book', 'देखें व बुक करें')} <ArrowUpRight className="w-3.5 h-3.5 text-gold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
