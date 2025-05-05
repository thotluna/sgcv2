import { ErrorUrl } from './components/error-url'
import Title from './components/title'
import { DateTime } from '@/components/ui/date-time'
import LangSwitch from '@/components/ui/lang-switch'
import ThemeSwitch from '@/components/ui/theme-switch'
import { ReactNode, Suspense } from 'react'

export default async function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <section className="relative w-screen h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="bg-[url(/images/bg.avif)] p-8 bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center h-full text-emerald-50 font-funnel">
        <header className="absolute top-2 w-full flex items-center justify-between md:hidden px-8">
          <DateTime />
          <div className="flex items-center justify-end gap-2 flex-wrap">
            <ThemeSwitch />
            <LangSwitch />
          </div>
        </header>
        <Title />
      </div>
      <div className="flex flex-col items-center justify-center gap-4 p-8 h-full">
        <header className="w-full hidden md:flex items-center justify-between ">
          <DateTime />
          <div className="flex items-center justify-end gap-2 flex-wrap">
            <ThemeSwitch />
            <LangSwitch />
          </div>
        </header>
        <Suspense>
          {children}
          <ErrorUrl />
        </Suspense>
      </div>
    </section>
  )
}
