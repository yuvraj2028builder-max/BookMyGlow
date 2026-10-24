'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, ArrowLeft } from 'lucide-react'
import { InstagramIcon } from '@/components/icons'
import { LangProvider, LangToggle, useLang } from '@/components/lang-provider'
import AuditWidget from '@/components/audit-widget'

export default function AuditPage() {
  return (
    <LangProvider>
      <AuditPageContent />
    </LangProvider>
  )
}

function AuditPageContent() {
  const { t } = useLang()
  const [handle, setHandle] = useState('')
  const [isLiveAudit, setIsLiveAudit] = useState(false)
  const [showQuestions, setShowQuestions] = useState(false)

  const handleStartHandleAudit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!handle) return
    setIsLiveAudit(true)
    setShowQuestions(true)
  }

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col">
      <header className="border-b border-border bg-white/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-1.5 font-display font-bold text-lg text-ink">
            <ArrowLeft className="w-4 h-4 mr-1 text-ink-muted" /> BookMyGlow
          </Link>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/login" className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-ink text-cream">
              {t('Artist Login', 'लॉग इन')}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl mx-auto px-4 py-12 w-full">
        {!showQuestions ? (
          <div className="text-center animate-fade-up space-y-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose to-gold text-white flex items-center justify-center mx-auto shadow-md">
              <InstagramIcon className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-gold font-bold">100% Free Tool</span>
              <h1 className="mt-2 text-3xl sm:text-4xl font-display font-bold text-ink">
                {t('Instagram Profile Audit for Makeup Artists', 'मेकअप आर्टिस्ट्स के लिए इंस्टाग्राम प्रोफाइल ऑडिट')}
              </h1>
              <p className="mt-3 text-sm text-ink-muted leading-relaxed">
                {t(
                  'Find out why brides visit your profile but don\'t DM or book you. Get a brutal, actionable score and 3 simple fixes in plain Hindi or English.',
                  'जानिए क्यों ब्राइड्स आपकी प्रोफाइल देखकर भी बुक नहीं करतीं। अपनी प्रोफाइल का लाइव स्कोर और 3 ज़रूरी सुधार तुरंत पाएं।'
                )}
              </p>
            </div>

            {/* Handle Input Form */}
            <form onSubmit={handleStartHandleAudit} className="bg-white p-5 rounded-2xl border border-border shadow-sm space-y-3">
              <div className="flex items-center bg-cream rounded-xl border border-border px-3 overflow-hidden focus-within:border-gold">
                <span className="text-sm font-semibold text-ink-muted">@</span>
                <input
                  type="text"
                  placeholder="your_instagram_handle"
                  value={handle}
                  onChange={e => setHandle(e.target.value)}
                  className="w-full bg-transparent px-2 py-3 text-sm focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-ink text-cream py-3 rounded-xl font-medium text-sm hover:bg-ink-light transition-all"
              >
                {t('Analyze My Profile', 'मेरी प्रोफाइल का विश्लेषण करें')}
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => setShowQuestions(true)}
                className="text-xs text-ink-muted hover:text-ink underline"
              >
                {t('Or answer 10 quick diagnostic questions instead →', 'या 10 सवालों के जवाब देकर चेक करें →')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-display font-bold">
                {t('Instagram Conversion Diagnosis', 'इंस्टाग्राम कन्वर्जन डायग्नोसिस')}
              </h2>
              {handle && <p className="text-xs text-gold font-semibold mt-1">@{handle.replace(/^@/, '')}</p>}
            </div>
            <AuditWidget />
          </div>
        )}
      </main>
    </div>
  )
}
