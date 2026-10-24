'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ShieldCheck } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { LangProvider, LangToggle, useLang } from '@/components/lang-provider'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function LoginPage() {
  return (
    <LangProvider>
      <LoginContent />
    </LangProvider>
  )
}

function LoginContent() {
  const { t } = useLang()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [demoEmail, setDemoEmail] = useState('')

  const handleGoogleSignIn = async (userEmail?: string, userName?: string) => {
    setLoading(true)
    setError('')

    // If a custom email is typed (demo/test mode), use old API route
    if (userEmail) {
      try {
        const res = await fetch('/api/auth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInfo: {
              email: userEmail,
              name: userName || userEmail.split('@')[0],
              picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
            }
          })
        })
        const data = await res.json()
        if (res.ok) {
          router.push('/dashboard')
        } else {
          setError(data.error || 'Sign-in failed')
        }
      } catch {
        setError('An error occurred during sign-in.')
      } finally {
        setLoading(false)
      }
      return
    }

    // Real Google OAuth via Supabase
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/auth/callback`
        }
      })
      if (oauthError) {
        setError(oauthError.message)
        setLoading(false)
      }
      // On success Supabase redirects the browser — no need to do anything
    } catch {
      setError('Google sign-in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-1.5 font-display font-bold text-2xl text-ink">
            <Sparkles className="w-5 h-5 text-gold" /> BookMyGlow
          </Link>
          <h2 className="mt-3 text-lg font-display font-semibold text-ink">
            {t('Sign In with Google', 'Google से साइन इन करें')}
          </h2>
          <p className="text-xs text-ink-muted mt-1">
            {t('One click to manage your booking page & client CRM', 'एक क्लिक में अपना बुकिंग पेज और CRM एक्सेस करें')}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-border shadow-sm space-y-6 text-center">
          {error && <div className="p-3 bg-danger/10 text-danger text-xs rounded-xl font-medium">{error}</div>}

          {/* Official Google Sign In Button */}
          <button
            onClick={() => handleGoogleSignIn()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-cream border border-border py-3.5 px-4 rounded-2xl shadow-sm hover:shadow transition-all group cursor-pointer"
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
              {loading ? t('Signing in...', 'साइन इन हो रहा है...') : t('Continue with Google', 'Google के साथ आगे बढ़ें')}
            </span>
          </button>

          {/* Quick Demo Instant-Login */}
          <div className="pt-2 border-t border-border-light text-left space-y-2">
            <p className="text-[11px] text-ink-muted uppercase font-semibold text-center">
              {t('Or Test with Any Google Email', 'या किसी भी ईमेल से टेस्ट करें')}
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@gmail.com"
                value={demoEmail}
                onChange={e => setDemoEmail(e.target.value)}
                className="flex-1 bg-cream border border-border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-gold"
              />
              <button
                onClick={() => demoEmail && handleGoogleSignIn(demoEmail)}
                className="bg-ink text-cream text-xs px-3 py-2 rounded-xl font-medium"
              >
                Go
              </button>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-ink-muted flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            {t('Zero passwords. 100% secure with Google.', 'पासवर्ड की ज़रूरत नहीं। Google से पूरी तरह सुरक्षित।')}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <LangToggle />
        </div>
      </div>
    </div>
  )
}
