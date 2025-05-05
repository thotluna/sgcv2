'use client'

import { getSignUpFormSchema } from '../../_auth/auth.schemas'
import { SingUpDTO } from '../../_auth/types'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export function SingUpForm({
  onSubmit
}: {
  onSubmit: (dataform: SingUpDTO) => Promise<void>
}) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false)
  const traslateValidation = useTranslations('validation')
  const traslateRegisterPage = useTranslations('RegisterPage')
  const traslateShared = useTranslations('SignPages')

  const form = useForm<SingUpDTO>({
    resolver: zodResolver(getSignUpFormSchema(traslateValidation)),
    reValidateMode: 'onBlur',
    defaultValues: {
      code: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="max-w-sm w-full  flex flex-col gap-1">
        <h1 className="font-funnel text-4xl text-primary font-bold mb-8">
          {traslateRegisterPage('title')}
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{traslateRegisterPage('customer_code')}</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="off"
                      placeholder="xxxxxxxx-xxxxxxxxx-xxxxxxxxxx-xxxxxxxxxx"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{traslateShared('email')}</FormLabel>
                  <FormControl>
                    <Input
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
                        autoComplete="off"
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="xxxxxxxx"
                        {...field}
                      />
                      <Button
                        aria-label={traslateShared(
                          'toggle_password_visibility'
                        )}
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="confirmPassword">
                    {traslateRegisterPage('confirm_password')}
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        id="confirmPassword"
                        autoComplete="off"
                        type={passwordConfirmVisible ? 'text' : 'password'}
                        placeholder="xxxxxxxx"
                        {...field}
                      />
                      <Button
                        aria-label={traslateShared(
                          'toggle_password_visibility'
                        )}
                        name="submit"
                        onClick={event => {
                          event.preventDefault()
                          setPasswordConfirmVisible(!passwordConfirmVisible)
                        }}
                        size="icon"
                      >
                        {passwordConfirmVisible ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between flex-row-reverse">
              <Button disabled={form.formState.isLoading} type="submit">
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
        <div>
          <p className="text-sm opacity-80 mt-8 text-center">
            {traslateRegisterPage('phase_sign')}
            <Link href="/" className="text-primary">
              {traslateRegisterPage('phase_link')}
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
