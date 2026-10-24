'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { LangProvider, LangToggle, useLang } from '@/components/lang-provider'
import { getSupabaseClient } from '@/lib/supabase-client'

const supabase = getSupabaseClient()

export default function SignupPage() {
  return (
    <LangProvider>
      <SignupContent />
    </LangProvider>
  )
}

function SignupContent() {
  const { t } = useLang()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailInput, setEmailInput] = useState('')
  const [nameInput, setNameInput] = useState('')

  // Handle Supabase OAuth redirect back to this page
  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const hash = window.location.hash
      if (hash && hash.includes('access_token')) {
        setLoading(true)
        const params = new URLSearchParams(hash.replace('#', ''))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        if (accessToken) {
          const { data: sessionData } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })
          if (sessionData?.user) {
            await registerAndRedirect(sessionData.user)
            return
          }
        }
        setLoading(false)
        setError('Google sign-up failed. Please try again.')
        return
      }

      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      if (code) {
        setLoading(true)
        const { data: sessionData } = await supabase.auth.exchangeCodeForSession(code)
        if (sessionData?.user) {
          await registerAndRedirect(sessionData.user)
          return
        }
        setLoading(false)
        setError('Google sign-up failed. Please try again.')
      }
    }

    handleOAuthRedirect()
  }, [])

  const registerAndRedirect = async (user: any) => {
    try {
      const email = user.email
      const name = user.user_metadata?.full_name || user.user_metadata?.name || email?.split('@')[0]
      const picture = user.user_metadata?.avatar_url || user.user_metadata?.picture || null

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInfo: { email, name, picture } })
      })
      if (res.ok) {
        router.push('/dashboard')
      } else {
        setError('Account setup failed. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  const handleGoogleSignup = async (customEmail?: string, customName?: string) => {
    setLoading(true)
    setError('')

    // Demo/test mode with custom email
    if (customEmail) {
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInfo: {
              email: customEmail,
              name: customName || customEmail.split('@')[0],
              picture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
            }
          })
        })
        const data = await res.json()
        if (res.ok) {
          router.push('/dashboard')
        } else {
          setError(data.error || 'Google signup failed')
        }
      } catch {
        setError('An error occurred during sign-up.')
      } finally {
        setLoading(false)
      }
      return
    }

    // Real Google OAuth — redirect back to this same /signup page
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/signup`
        }
      })
      if (oauthError) {
        setError(oauthError.message)
        setLoading(false)
      }
    } catch {
      setError('Google sign-up failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 font-display font-bold text-2xl text-ink">
            <Sparkles className="w-5 h-5 text-gold" /> BookMyGlow
          </Link>
          <h2 className="mt-3 text-xl font-display font-semibold text-ink">
            {t('Claim your booking page with Google', 'Google के साथ अपना बुकिंग पेज बनाएं')}
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            {t('1-Click setup. No password to remember. Free forever.', '1 क्लिक में सेटअप। कोई पासवर्ड याद नहीं रखना।')}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm space-y-6">
          {error && <div className="p-3 bg-danger/10 text-danger text-xs rounded-xl font-medium">{error}</div>}

          {/* Value Props */}
          <div className="space-y-2 text-xs text-ink-muted bg-cream p-4 rounded-2xl border border-border-light">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>{t('Instant unique Instagram bio link', 'तुरंत अपना इंस्टाग्राम बायो लिंक पाएं')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>{t('Direct WhatsApp routing with zero DM back-and-forth', 'सीधे व्हाट्सएप बुकिंग, बिना किसी झंझट')}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>{t('Free bride CRM & Instagram conversion audit', 'फ्री क्लाइंट CRM और इंस्टाग्राम ऑडिट')}</span>
            </div>
          </div>

          {/* Primary Google One-Tap Button */}
          <button
            onClick={() => handleGoogleSignup()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-cream border border-border py-4 px-4 rounded-2xl shadow-sm hover:shadow transition-all group cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm font-semibold text-ink group-hover:text-ink-light">
              {loading ? t('Creating account...', 'अकाउंट बन रहा है...') : t('Sign Up with Google', 'Google से साइन अप करें')}
            </span>
          </button>

          {/* Quick Custom Google Email Test */}
          <div className="pt-2 border-t border-border-light space-y-2">
            <p className="text-[11px] text-ink-muted uppercase font-semibold text-center">
              {t('Test with Your Own Google Email', 'अपने ईमेल से टेस्ट करें')}
            </p>
            <div className="space-y-2">
              <input
                type="text"
                placeholder={t('Brand / Artist Name (e.g. Pooja Makeup)', 'नाम या स्टूडियो का नाम')}
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full bg-cream border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold"
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="flex-1 bg-cream border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold"
                />
                <button
                  onClick={() => emailInput && handleGoogleSignup(emailInput, nameInput)}
                  className="bg-ink text-cream text-xs px-4 py-2 rounded-xl font-medium"
                >
                  {t('Continue', 'आगे बढ़ें')}
                </button>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-ink-muted">
              {t('Already created a page?', 'पहले से पेज बना लिया?')}{' '}
              <Link href="/login" className="font-semibold text-ink hover:underline">
                {t('Sign in with Google', 'Google से साइन इन करें')}
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <LangToggle />
        </div>
      </div>
    </div>
  )
}
