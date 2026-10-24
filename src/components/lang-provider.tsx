'use client'

import { useState, createContext, useContext, ReactNode } from 'react'

type Lang = 'en' | 'hi'

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (en: string, hi: string) => string }>({
  lang: 'en',
  setLang: () => {},
  t: (en) => en,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')
  const t = (en: string, hi: string) => lang === 'hi' ? hi : en
  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

export function LangToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
      className="text-xs font-medium px-3 py-1.5 rounded-full border border-border hover:bg-cream-dark transition-colors"
      aria-label="Toggle language"
    >
      {lang === 'en' ? 'हिंदी' : 'English'}
    </button>
  )
}
