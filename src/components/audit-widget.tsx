'use client'

import { useState } from 'react'
import { useLang, LangToggle } from './lang-provider'

interface AuditQuestion {
  id: string
  question: string
  questionHi: string
  type: 'number' | 'boolean' | 'select'
  options?: { value: string; label: string; labelHi: string }[]
}

const QUESTIONS: AuditQuestion[] = [
  {
    id: 'followers',
    question: 'How many followers do you have?',
    questionHi: 'आपके कितने followers हैं?',
    type: 'number',
  },
  {
    id: 'following',
    question: 'How many accounts do you follow?',
    questionHi: 'आप कितने accounts follow करती हैं?',
    type: 'number',
  },
  {
    id: 'isBusinessAccount',
    question: 'Do you have a Business/Creator account?',
    questionHi: 'क्या आपके पास Business/Creator account है?',
    type: 'boolean',
  },
  {
    id: 'hasBioLink',
    question: 'Do you have a booking link in your bio?',
    questionHi: 'क्या आपके bio में booking link है?',
    type: 'boolean',
  },
  {
    id: 'hasLocation',
    question: 'Does your bio mention your city (Delhi/NCR)?',
    questionHi: 'क्या आपके bio में आपका शहर (Delhi/NCR) है?',
    type: 'boolean',
  },
  {
    id: 'postsPerWeek',
    question: 'How many times do you post per week?',
    questionHi: 'हफ्ते में कितनी बार post करती हैं?',
    type: 'number',
  },
  {
    id: 'postsReels',
    question: 'Do you post Reels regularly?',
    questionHi: 'क्या आप Reels नियमित रूप से डालती हैं?',
    type: 'boolean',
  },
  {
    id: 'avgLikes',
    question: 'Average likes per post?',
    questionHi: 'हर post पर average कितने likes आते हैं?',
    type: 'number',
  },
  {
    id: 'avgComments',
    question: 'Average comments per post?',
    questionHi: 'हर post पर average कितने comments आते हैं?',
    type: 'number',
  },
  {
    id: 'captionLength',
    question: 'How long are your captions usually?',
    questionHi: 'आपके captions कितने लंबे होते हैं?',
    type: 'select',
    options: [
      { value: 'short', label: 'Short (just emojis or a line)', labelHi: 'छोटे (बस इमोजी या एक लाइन)' },
      { value: 'medium', label: 'Medium (2-3 sentences)', labelHi: 'मध्यम (2-3 वाक्य)' },
      { value: 'long', label: 'Long (story-like with hashtags)', labelHi: 'लंबे (कहानी जैसे, hashtags के साथ)' },
    ],
  },
  {
    id: 'usesCTA',
    question: 'Do your captions include "Book now" or "DM for price"?',
    questionHi: 'क्या आपके captions में "Book now" या "DM for price" होता है?',
    type: 'boolean',
  },
  {
    id: 'hasProfilePic',
    question: 'Is your profile photo a clear photo of YOU (not a logo)?',
    questionHi: 'क्या आपकी profile photo आपकी साफ़ photo है (logo नहीं)?',
    type: 'boolean',
  },
]

interface AuditSection {
  name: string
  nameHi: string
  score: number
  maxScore: number
  status: 'good' | 'warning' | 'critical'
  finding: string
  findingHi: string
  fix: string
  fixHi: string
  impact: 'high' | 'medium' | 'low'
}

interface AuditResult {
  overallScore: number
  sections: AuditSection[]
  topPriority: string
}

export default function AuditWidget({ onComplete }: { onComplete?: (result: AuditResult) => void }) {
  const { t } = useLang()
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>({})
  const [result, setResult] = useState<AuditResult | null>(null)
  const [loading, setLoading] = useState(false)

  const progress = ((currentQ) / QUESTIONS.length) * 100

  const handleAnswer = (value: string | number | boolean) => {
    const q = QUESTIONS[currentQ]
    const newAnswers = { ...answers, [q.id]: value }
    setAnswers(newAnswers)

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      submitAudit(newAnswers)
    }
  }

  const submitAudit = async (ans: Record<string, string | number | boolean>) => {
    setLoading(true)
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ans),
      })
      const data = await res.json()
      setResult(data)
      onComplete?.(data)
    } catch {
      // Fallback
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-ink-muted">
          {t('Analyzing your profile...', 'आपकी profile analyze हो रही है...')}
        </p>
      </div>
    )
  }

  if (result) {
    return <AuditResults result={result} />
  }

  const q = QUESTIONS[currentQ]

  return (
    <div className="max-w-md mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-ink-muted">
            {currentQ + 1} / {QUESTIONS.length}
          </span>
          <span className="text-xs text-ink-muted">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="animate-fade-up" key={currentQ}>
        <h3 className="text-lg font-display font-bold text-ink mb-6">
          {t(q.question, q.questionHi)}
        </h3>

        {q.type === 'number' && (
          <div className="space-y-3">
            <input
              type="number"
              placeholder="0"
              className="w-full bg-white border border-border rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:border-gold text-center"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAnswer(parseInt((e.target as HTMLInputElement).value) || 0)
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = (e.target as HTMLElement).parentElement?.querySelector('input')
                handleAnswer(parseInt(input?.value || '0') || 0)
              }}
              className="w-full bg-ink text-cream py-3 rounded-xl font-medium text-sm"
            >
              {t('Next', 'आगे')} →
            </button>
          </div>
        )}

        {q.type === 'boolean' && (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleAnswer(true)}
              className="bg-white border-2 border-border rounded-xl py-4 text-sm font-medium hover:border-gold hover:bg-gold/5 transition-all"
            >
              {t('Yes', 'हाँ')} ✓
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className="bg-white border-2 border-border rounded-xl py-4 text-sm font-medium hover:border-danger hover:bg-danger/5 transition-all"
            >
              {t('No', 'नहीं')} ✗
            </button>
          </div>
        )}

        {q.type === 'select' && q.options && (
          <div className="space-y-2">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="w-full text-left bg-white border-2 border-border rounded-xl px-4 py-3.5 text-sm font-medium hover:border-gold hover:bg-gold/5 transition-all"
              >
                {t(opt.label, opt.labelHi)}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Back */}
      {currentQ > 0 && (
        <button
          onClick={() => setCurrentQ(currentQ - 1)}
          className="mt-4 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          ← {t('Back', 'पीछे')}
        </button>
      )}
    </div>
  )
}

function AuditResults({ result }: { result: AuditResult }) {
  const { t } = useLang()

  const getStatusColor = (status: string) => {
    if (status === 'good') return 'text-success'
    if (status === 'warning') return 'text-warning'
    return 'text-danger'
  }

  const getStatusBg = (status: string) => {
    if (status === 'good') return 'bg-success/10'
    if (status === 'warning') return 'bg-warning/10'
    return 'bg-danger/10'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return { en: 'Excellent', hi: 'बहुत बढ़िया' }
    if (score >= 60) return { en: 'Good', hi: 'अच्छा' }
    if (score >= 40) return { en: 'Needs Work', hi: 'सुधार ज़रूरी' }
    return { en: 'Critical', hi: 'तुरंत ठीक करें' }
  }

  const label = getScoreLabel(result.overallScore)
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (result.overallScore / 100) * circumference

  return (
    <div className="max-w-md mx-auto animate-fade-up">
      {/* Score Circle */}
      <div className="text-center mb-8">
        <div className="relative w-32 h-32 mx-auto">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" className="text-border" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              strokeWidth="3"
              strokeLinecap="round"
              className={`score-ring ${result.overallScore >= 60 ? 'text-success' : result.overallScore >= 40 ? 'text-warning' : 'text-danger'}`}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-display font-bold text-ink">{result.overallScore}</span>
            <span className="text-xs text-ink-muted">/100</span>
          </div>
        </div>
        <h3 className="mt-3 text-lg font-display font-bold text-ink">
          {t(label.en, label.hi)}
        </h3>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {result.sections.map((section, i) => (
          <details key={i} className="bg-white rounded-2xl border border-border-light overflow-hidden group" open={section.status === 'critical'}>
            <summary className="p-4 cursor-pointer list-none flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${getStatusBg(section.status)} ${getStatusColor(section.status)}`}>
                  {section.score}
                </div>
                <span className="text-sm font-medium text-ink">
                  {t(section.name, section.nameHi)}
                </span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBg(section.status)} ${getStatusColor(section.status)}`}>
                {section.impact === 'high' ? '🔥' : section.impact === 'medium' ? '⚡' : '💡'}
                {section.status === 'good' ? t(' Good', ' अच्छा') : section.status === 'warning' ? t(' Fix', ' ठीक करें') : t(' Urgent', ' तुरंत')}
              </span>
            </summary>
            <div className="px-4 pb-4 border-t border-border-light pt-3 space-y-3 animate-fade-in">
              <div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">
                  {t('What we found', 'हमने क्या पाया')}
                </p>
                <p className="text-sm text-ink-light leading-relaxed">
                  {t(section.finding, section.findingHi)}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${getStatusBg(section.status)}`}>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-1">
                  {t('How to fix it', 'कैसे ठीक करें')}
                </p>
                <p className="text-sm text-ink leading-relaxed font-medium">
                  {t(section.fix, section.fixHi)}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Top Priority */}
      <div className="mt-6 p-4 bg-gold/10 rounded-2xl border border-gold/20">
        <p className="text-xs font-bold text-gold uppercase tracking-wide mb-1">
          {t('🎯 #1 Priority — Do This TODAY', '🎯 #1 Priority — आज ही करें')}
        </p>
        <p className="text-sm text-ink leading-relaxed font-medium">{result.topPriority}</p>
      </div>
    </div>
  )
}
