'use client'

import { useState } from 'react'
import { Copy, Check, MessageSquare, Sparkles } from 'lucide-react'
import { useLang } from '@/components/lang-provider'
import { formatPrice } from '@/lib/utils'

interface FollowUpModalProps {
  client: {
    name: string
    phone: string
    eventDate?: string
    eventType?: string
  }
  artistName: string
  onClose: () => void
}

export function AutoFollowUpModal({ client, artistName, onClose }: FollowUpModalProps) {
  const { t } = useLang()
  const [template, setTemplate] = useState<'24h_nudge' | 'slot_urgency' | 'custom'>('24h_nudge')
  const [copied, setCopied] = useState(false)

  const dateFormatted = client.eventDate
    ? new Date(client.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : 'your event date'

  const templates = {
    '24h_nudge': {
      title: t('24h Soft Nudge', '24 घंटे बाद विनम्र फॉलो-अप'),
      text: `Hi ${client.name}! ✨ This is ${artistName}. I noticed you were exploring bridal dates for ${dateFormatted}. We currently have a tentative hold on your date. Would you like me to reserve it for you or schedule a quick 5-min look consultation? 💄`
    },
    'slot_urgency': {
      title: t('High Demand Warning (Wedding Season)', 'तारीख बुक होने का अलर्ट'),
      text: `Hi ${client.name}! Just a quick heads-up from ${artistName} studio — another bride just enquired for ${dateFormatted}. Since you requested first, please let me know by tonight if you would like to confirm your booking and lock the slot! 💕`
    },
    'custom': {
      title: t('Look Inspiration & Moodboard', 'इंस्पिरेशन व मूडबोर्ड शेयरिंग'),
      text: `Hi ${client.name}! Sharing a few recent bridal looks matching your wedding vibe from ${artistName}. Let me know if you would like to discuss skin prep or hair styling options! 💍`
    }
  }

  const selectedText = templates[template].text

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenWhatsApp = () => {
    const cleanPhone = client.phone.replace(/\D/g, '')
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`
    window.open(`https://wa.me/${fullPhone}?text=${encodeURIComponent(selectedText)}`, '_blank')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-border space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border-light">
          <div>
            <h3 className="font-display font-bold text-lg text-ink flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold" /> {t('Smart WhatsApp Follow-Up', 'स्मार्ट व्हाट्सएप फॉलो-अप')}
            </h3>
            <p className="text-xs text-ink-muted mt-0.5">
              {t(`Recover unconverted inquiry from ${client.name}`, `${client.name} को फॉलो-अप भेजें`)}
            </p>
          </div>
          <button onClick={onClose} className="text-sm text-ink-muted hover:text-ink font-bold">✕</button>
        </div>

        {/* Template Selector */}
        <div className="flex gap-2">
          {(Object.keys(templates) as Array<keyof typeof templates>).map(key => (
            <button
              key={key}
              onClick={() => setTemplate(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                template === key
                  ? 'bg-ink text-cream'
                  : 'bg-cream text-ink-muted hover:text-ink'
              }`}
            >
              {templates[key].title}
            </button>
          ))}
        </div>

        {/* Message Preview */}
        <div className="p-4 bg-cream rounded-2xl border border-border-light text-xs leading-relaxed font-sans text-ink whitespace-pre-line">
          {selectedText}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-cream flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t('Copied!', 'कॉपी हुआ!') : t('Copy Text', 'टेक्स्ट कॉपी करें')}
          </button>
          <button
            onClick={handleOpenWhatsApp}
            className="px-5 py-2 rounded-xl bg-[#25D366] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#20bd5a] transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {t('Send via WhatsApp', 'WhatsApp पर भेजें')}
          </button>
        </div>
      </div>
    </div>
  )
}
