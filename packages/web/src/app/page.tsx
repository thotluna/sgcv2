import { ErrorUrl } from './_auth/components/error-url'
import { FormSing } from '@/app/_auth/components/form-sign'
import { DateTime } from '@/components/ui/date-time'
import LangSwitch from '@/components/ui/lang-switch'
import ThemeSwitch from '@/components/ui/theme-switch'
import { useTranslations } from 'next-intl'
import { Suspense } from 'react'

export default function Home() {
  const t = useTranslations('HomePage')
  return (
    <section className="w-screen h-screen grid grid-cols-2">
      <div className="bg-[url(/images/bg.avif)] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center h-full text-emerald-50 font-funnel">
        <h1 className="text-5xl ">SGCV2</h1>
        <p className="text-2xl ">{t('title')}</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 p-8 h-full">
        <header className="w-full flex items-center justify-between flex-shrink-0">
          <DateTime />
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <LangSwitch />
          </div>
        </header>
        <Suspense>
          <FormSing />
          <ErrorUrl />
        </Suspense>
      </div>
    </section>
  )
}
