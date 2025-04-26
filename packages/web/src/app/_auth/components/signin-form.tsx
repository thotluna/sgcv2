'use client'

import { GoogleIcon } from '../../../components/ui/google-icon'
import { getSignInFormSchema } from '../auth.schemas'
import { signInWithGoogle, signInWithLinkedin } from '../oauth.actions'
import { SingInDTO } from '../types'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Linkedin } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function SingInForm({
  onSubmit,
}: {
  onSubmit: (dataform: SingInDTO) => Promise<void>
}) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const traslateValidation = useTranslations('validation')

  const form = useForm<SingInDTO>({
    resolver: zodResolver(getSignInFormSchema(traslateValidation)),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const traslateSignIn = useTranslations('SignInPage')
  const traslateShared = useTranslations('SignPages')

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="max-w-sm w-full  flex flex-col gap-1">
        <h1 className="font-funnel text-4xl text-primary font-bold mb-8">
          {traslateSignIn('title')}
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{traslateShared('email')}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="username"
                      placeholder={traslateShared('email_placeholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">
                    {traslateShared('password')}
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        id="password"
                        autoComplete="current-password"
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="xxxxxxxx"
                        {...field}
                      />
                      <Button
                        aria-label={traslateShared(
                          'toggle_password_visibility',
                        )}
                        variant="outline"
                        onClick={event => {
                          event.preventDefault()
                          setPasswordVisible(!passwordVisible)
                        }}
                        size="icon"
                      >
                        {passwordVisible ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between flex-row-reverse">
              <Button
                name="submit"
                disabled={form.formState.isLoading}
                type="submit"
              >
                {traslateShared('submit')}
              </Button>
              <Button
                variant="outline"
                type="reset"
                onClick={() => form.reset()}
              >
                {traslateShared('clear')}
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex flex-col gap-4">
          <div className="h-[1px] border-b-2 border-primary opacity-20 mt-6"></div>
          <p className="text-sm">{traslateSignIn('title_social')}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={signInWithLinkedin} variant="outline" size="sm">
              <Linkedin />
              {traslateSignIn('linkedin')}
            </Button>
            <Button onClick={signInWithGoogle} variant="outline" size="sm">
              <GoogleIcon /> {traslateSignIn('google')}
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm opacity-80 mt-8 text-center">
            {traslateSignIn('phase_register')}
            <Link href="/register" className="text-primary">
              {traslateSignIn('phase_link')}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
