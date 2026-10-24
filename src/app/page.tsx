import Link from 'next/link'
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, HeartHandshake, PhoneCall, Calendar } from 'lucide-react'
import { InstagramIcon } from '@/components/icons'
import { LangProvider, LangToggle } from '@/components/lang-provider'

export default function HomePage() {
  return (
    <LangProvider>
      <div className="min-h-screen bg-cream text-ink flex flex-col selection:bg-gold selection:text-white">
        {/* Navigation */}
        <header className="border-b border-border bg-white/70 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-ink text-gold flex items-center justify-center font-serif text-lg font-bold shadow-sm">
                ✦
              </span>
              <span className="font-display font-bold text-xl tracking-tight text-ink">
                BookMyGlow
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/discover"
                className="text-xs uppercase tracking-wider font-semibold text-ink-muted hover:text-ink transition-colors hidden sm:inline"
              >
                Find Artists in Delhi NCR
              </Link>
              <Link
                href="/audit"
                className="text-xs uppercase tracking-wider font-semibold text-rose hover:text-ink transition-colors"
              >
                Free IG Audit
              </Link>
              <LangToggle />
              <Link
                href="/login"
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-ink text-cream hover:bg-ink-light transition-all"
              >
                Artist Portal
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-20 pb-28 px-6 overflow-hidden">
          <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cream-dark border border-border text-xs font-semibold text-ink-muted mb-6">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Built Exclusively for Delhi NCR Makeup Artists
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold tracking-tight text-ink leading-[1.1]">
              The #1 Link in Bio for <br />
              <span className="italic font-normal text-gold">Elite Bridal Artists</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-ink-muted max-w-2xl mx-auto leading-relaxed">
              Stop losing brides in chaotic Instagram DMs. Get a breathtaking, editorial booking page with instant WhatsApp routing, transparent pricing, and zero commissions.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-ink text-cream font-semibold text-sm hover:bg-ink-light transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Claim Your Free Page <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
              <Link
                href="/priyasharma"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-border text-ink font-semibold text-sm hover:border-gold transition-all flex items-center justify-center gap-2"
              >
                See Live Demo (Priya Sharma)
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-xs text-ink-muted">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> 100% Free Forever
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> Setup in 2 Minutes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" /> WhatsApp-Direct
              </span>
            </div>
          </div>
        </section>

        {/* The Problem & Solution Grid */}
        <section className="py-20 bg-white border-y border-border px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-display font-bold">Why Top Delhi MUAs Are Switching</h2>
              <p className="mt-2 text-sm text-ink-muted">
                Indian brides don't book like Western clients. Here is how BookMyGlow transforms your conversion.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-cream border border-border space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display">Instant WhatsApp Pre-Fill</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Instead of generic "Hi are you available", brides pick their exact wedding date and package on your page. The WhatsApp chat opens with complete date, venue, and package details pre-filled.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-cream border border-border space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-rose/10 text-rose flex items-center justify-center">
                  <InstagramIcon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display">Instagram Profile Audit</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Included free: diagnose your follower engagement, reels vs static ratio, and bio CTA mistakes. Discover the exact 3 fixes that make brides trust you over competitors.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-cream border border-border space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-success/10 text-success flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display">Bride CRM & Notes</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Never ask a bride twice for her skin type, allergies, or lehenga undertone. Keep lifetime client history, wedding season earnings, and automated WhatsApp follow-ups in one place.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Discovery Preview */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-lg space-y-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">Delhi NCR Network</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold">
                Get Discovered by Brides in South Delhi, Gurgaon, & Noida
              </h2>
              <p className="text-sm text-ink-muted leading-relaxed">
                When brides look for wedding artists by locality and budget, your BookMyGlow verified profile appears directly in their search. Boost your offline referral engine with search discovery.
              </p>
              <div className="pt-2">
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-gold transition-colors"
                >
                  Explore the Artist Directory →
                </Link>
              </div>
            </div>

            <div className="w-full max-w-md bg-white p-6 rounded-3xl border border-border shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Priya Sharma"
                  className="w-14 h-14 rounded-full object-cover border-2 border-gold"
                />
                <div>
                  <h4 className="font-display font-bold text-base">Priya Sharma Bridal Studio</h4>
                  <p className="text-xs text-ink-muted">South Delhi • 6 yrs exp • ★ 5.0 (2 reviews)</p>
                </div>
              </div>
              <p className="text-xs text-ink-light italic">"Specializing in royal North Indian bridal looks and HD airbrush finishes..."</p>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-ink">Starting at ₹14,000</span>
                <Link
                  href="/priyasharma"
                  className="text-xs font-semibold bg-ink text-cream px-3 py-1.5 rounded-lg"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-border bg-white py-10 px-6 text-center text-xs text-ink-muted">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-display font-bold text-sm text-ink">BookMyGlow ✦ Delhi NCR</span>
            <div className="flex items-center gap-6">
              <Link href="/audit" className="hover:text-ink">Instagram Audit</Link>
              <Link href="/discover" className="hover:text-ink">Delhi NCR Directory</Link>
              <Link href="/signup" className="hover:text-ink">For Makeup Artists</Link>
              <Link href="/login" className="hover:text-ink">Sign In</Link>
            </div>
            <span>© 2024 BookMyGlow. All rights reserved.</span>
          </div>
        </footer>
      </div>
    </LangProvider>
  )
}
