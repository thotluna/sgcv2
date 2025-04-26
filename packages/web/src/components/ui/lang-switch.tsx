'use client'

import { Switch } from '@/components/ui/switch'
import { Locale } from '@/i18n/config'
import { setUserLocale } from '@/i18n/locale.service'
import { useLocale } from 'next-intl'

export default function LangSwitch() {
  const locale = useLocale() as Locale

  return (
    <div
      className="w-min-[200px]
      flex items-center gap-2"
    >
      <span>{locale === 'es' ? 'ES' : 'EN'}</span>
      <Switch
        aria-label="toggle language"
        aria-live="polite"
        checked={locale === 'es'}
        onCheckedChange={checked => setUserLocale(checked ? 'es' : 'en')}
      />
    </div>
  )
}
