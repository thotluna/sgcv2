'use client'

import { GoogleIcon } from '../../../components/ui/google-icon'
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
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email('El email no es valido'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(50, 'La contraseña no puede tener más de 50 caracteres'),
})

export function SingInForm({
  onSubmit,
}: {
  onSubmit: (dataform: SingInDTO) => Promise<void>
}) {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const form = useForm<SingInDTO>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className="max-w-sm w-full  flex flex-col gap-1">
        <h1 className="font-funnel text-4xl text-primary font-bold mb-8">
          Ingresa
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="username"
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
                        autoComplete="current-password"
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="xxxxxxxx"
                        {...field}
                      />
                      <Button
                        aria-label="toggle password visibility"
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
        <div className="flex flex-col gap-4">
          <div className="h-[1px] border-b-2 border-primary opacity-20 mt-6"></div>
          <p className="text-sm">Tambien puedes ingresar con:</p>
          <div className="flex justify-center gap-4">
            <Button onClick={signInWithLinkedin} variant="outline" size="sm">
              <Linkedin />
              Linkedin
            </Button>
            <Button onClick={signInWithGoogle} variant="outline" size="sm">
              <GoogleIcon /> Google
            </Button>
          </div>
        </div>
        <div>
          <p className="text-sm opacity-80 mt-8 text-center">
            Si aún no tienes una cuenta, registrate{' '}
            <Link href="/?singUp=true" className="text-primary">
              aquí
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
