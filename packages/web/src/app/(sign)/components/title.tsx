'use client'

import { useTranslations } from 'next-intl'

export default function Title() {
  const t = useTranslations('HomePage')
  return (
    <hgroup className="text-center py-6 md:py-0">
      <h1 className="text-5xl md:text-7xl">SGCV2</h1>
      <p className="text-2xl md:text-4xl text-emerald-300">{t('title')}</p>
    </hgroup>
  )
}
