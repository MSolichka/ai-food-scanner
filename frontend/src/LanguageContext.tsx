import { createContext, useContext, useState, type ReactNode } from 'react'
import { translations, type Lang, type T } from './translations'

interface LanguageContextValue {
  lang: Lang
  t: T
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('uk')
  const toggle = () => setLang((l) => (l === 'en' ? 'uk' : 'en'))

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
