'use client'

import { SingUpFormSchema } from '../auth.schemas'
import { SingUpDTO } from '../types'
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
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export function SingUpForm({
  onSubmit,
}: {
  onSubmit: (dataform: SingUpDTO) => Promise<void>
}) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false)

  const form = useForm<z.infer<typeof SingUpFormSchema>>({
    resolver: zodResolver(SingUpFormSchema),
    reValidateMode: 'onBlur',
    defaultValues: {
      clientCode: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="max-w-sm w-full  flex flex-col gap-1">
        <h1 className="font-funnel text-4xl text-primary font-bold mb-8">
          Registro
        </h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full"
          >
            <FormField
              control={form.control}
              name="clientCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo de cliente</FormLabel>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="escribe aqui tu nombre de usuario"
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
                  <FormLabel htmlFor="password">Password</FormLabel>
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
                    Confirma la Contraseña
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
                Submit
              </Button>
              <Button
                variant="outline"
                type="reset"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </Form>
        <div>
          <p className="text-sm opacity-80 mt-8 text-center">
            Si ya tienes cuenta, ingresa{' '}
            <Link href="/" className="text-primary">
              aquí
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
