'use client'

import { useState } from 'react'
import { Sparkles, Copy, Check, ArrowRight, Phone, MessageSquare, Settings } from 'lucide-react'
import { InstagramIcon } from '@/components/icons'
import { useLang } from '@/components/lang-provider'

interface OnboardingModalProps {
  artist: {
    name: string
    slug: string
    phone?: string
  }
  onClose: () => void
}

export function OnboardingTourModal({ artist, onClose }: OnboardingModalProps) {
  const { t } = useLang()
  const [step, setStep] = useState(1)
  const [copied, setCopied] = useState(false)

  const bioUrl = typeof window !== 'undefined' ? `${window.location.origin}/${artist.slug}` : `/${artist.slug}`

  const handleCopy = () => {
    navigator.clipboard.writeText(bioUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-border space-y-5 animate-scale-in">
        {/* Step Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border-light">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gold text-white font-bold text-xs flex items-center justify-center">
              {step}
            </span>
            <span className="text-xs uppercase tracking-wider font-semibold text-ink-muted">
              {t(`Step ${step} of 3`, `कदम ${step} / 3`)}
            </span>
          </div>
          <button onClick={onClose} className="text-xs font-semibold text-ink-muted hover:text-ink">
            {t('Skip Tutorial', 'छोड़ें')} ✕
          </button>
        </div>

        {/* STEP 1: Put Link in Bio */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-up">
            <div className="w-12 h-12 rounded-2xl bg-gold/10 text-gold flex items-center justify-center">
              <InstagramIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-ink">
                {t('Put Your Link in Instagram Bio', 'अपना लिंक इंस्टाग्राम बायो में लगाएं')}
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                {t(
                  'This is your unique link. When brides visit your profile, they tap this link to view your bridal rates, look portfolio, and book you directly.',
                  'यह आपका पर्सनल लिंक है। ब्राइड्स इस लिंक पर क्लिक करके आपके रेट्स, काम और तारीख चेक कर सकेंगी।'
                )}
              </p>
            </div>

            <div className="p-3 bg-cream rounded-xl border border-border flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-medium truncate select-all">{bioUrl}</span>
              <button
                onClick={handleCopy}
                className="bg-gold text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t('Copied!', 'कॉपी हुआ!') : t('Copy', 'कॉपी')}
              </button>
            </div>

            <div className="p-3 bg-gold/10 rounded-xl text-xs text-ink-light">
              💡 <strong>Pro Tip:</strong> Write in bio: <em>"✨ Bridal MUA \| Delhi NCR \| Book date 👇"</em>
            </div>
          </div>
        )}

        {/* STEP 2: WhatsApp Pre-Filled Flow */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-ink">
                {t('How Brides Book You (Zero DM Stress)', 'ब्राइड्स कैसे बुक करेंगी')}
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                {t(
                  'No more endless "DM for price" messages. A bride picks her wedding date and package on your page, and lands on your WhatsApp with everything pre-filled.',
                  'बार-बार "DM for price" का झंझट खत्म। ब्राइड तारीख और पैकेज चुनकर सीधे आपके व्हाट्सएप पर पहुंचेगी।'
                )}
              </p>
            </div>

            <div className="p-3 bg-cream rounded-xl border border-border-light space-y-1.5 text-xs">
              <p className="font-semibold text-ink">📱 {t('Incoming WhatsApp message example:', 'व्हाट्सएप मैसेज कैसा दिखेगा:')}</p>
              <p className="italic text-ink-muted">
                "Hi {artist.name}! I would like to book 'Royal Heritage HD Bridal' for 24th Nov at Leela Palace..."
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: Customize Rates & CRM */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-up">
            <div className="w-12 h-12 rounded-2xl bg-ink/10 text-ink flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-display font-bold text-ink">
                {t('Manage Rates & Client CRM', 'रेट्स और क्लाइंट CRM संभालें')}
              </h3>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                {t(
                  'You can add or change your packages anytime in the "Services" tab. In the "CRM" tab, save bride skin allergies, lehenga notes, and send 1-click WhatsApp follow-up nudges.',
                  'आप जब चाहें रेट्स बदल सकती हैं और ब्राइड्स की स्किन एलर्जी व नोट्स हमेशा सुरक्षित रख सकती हैं।'
                )}
              </p>
            </div>

            <div className="p-3 bg-cream rounded-xl border border-border text-xs text-ink-light space-y-1">
              <p>✓ {t('Default packages already loaded for you', 'शुरुआती पैकेज पहले से लोड कर दिए गए हैं')}</p>
              <p>✓ {t('Earnings automatically logged upon completion', 'बुकिंग पूरी होने पर कमाई अपने आप दर्ज होगी')}</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-2 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-xs font-semibold text-ink-muted hover:text-ink px-3 py-2"
            >
              ← {t('Back', 'पीछे')}
            </button>
          ) : <div />}

          <button
            onClick={() => {
              if (step < 3) {
                setStep(step + 1)
              } else {
                onClose()
              }
            }}
            className="bg-ink text-cream px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-ink-light transition-all"
          >
            {step === 3 ? t('Got It — Take Me to Dashboard! ✨', 'समझ आ गया — डैशबोर्ड खोलें! ✨') : (
              <>{t('Next', 'आगे')} <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
