'use client'
import { DateTime } from '@/components/ui/date-time'
import { SingInForm } from '@/components/ui/singin-form'
import { SingUpForm } from '@/app/_auth/singup-form'
import ThemeSwitch from '@/components/ui/theme-switch'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function FormSing() {
  const isSingUp = useSearchParams().get('singUp') === 'true'
  return isSingUp ? <SingUpForm /> : <SingInForm />
}

export default function Home() {
  return (
    <section className="w-screen h-screen grid grid-cols-2">
      <div className="bg-[url(/images/bg.avif)] bg-cover bg-center bg-no-repeat flex flex-col items-center justify-center h-full text-emerald-50 font-funnel">
        <h1 className="text-5xl ">SGCV2</h1>
        <p className="text-2xl ">Sistema de gestión y control</p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4 p-8 h-full">
        <header className="w-full flex items-center justify-between flex-shrink-0">
          <DateTime />
          <ThemeSwitch />
        </header>
        <Suspense>
          <FormSing />
        </Suspense>
      </div>
    </section>
  )
}
