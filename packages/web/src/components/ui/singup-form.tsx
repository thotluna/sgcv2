'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
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
import { z } from 'zod'
import Link from 'next/link'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

async function validateClientCode(clientCode: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_API}/v1/auth/code/validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientCode,
      }),
    },
  )
  const data = await response.json()
  return data
}

const formSchema = z
  .object({
    clientCode: z
      .string()
      .regex(
        /^[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}-[a-zA-z0-9!@#&*]{8}$/,
        { message: 'Formato invalido' },
      ),
    email: z.string().email('El email no es valido'),
    password: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(50, 'La contraseña no puede tener más de 50 caracteres'),
    confirmPassword: z
      .string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .max(50, 'La contraseña no puede tener más de 50 caracteres'),
  })
  .superRefine(async ({ clientCode }, ctx) => {
    try {
      const data = await validateClientCode(clientCode)
      if (data.status !== 'ok') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: data.message,
          path: ['clientCode'],
        })
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Error al validar el codigo de cliente',
        path: ['clientCode'],
      })
    }
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      })
    }
  })

export function SingUpForm() {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientCode: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
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
                  <FormLabel>Confirma el password</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        autoComplete="off"
                        type={passwordConfirmVisible ? 'text' : 'password'}
                        placeholder="xxxxxxxx"
                        {...field}
                      />
                      <Button
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
              <Button type="submit">Submit</Button>
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
