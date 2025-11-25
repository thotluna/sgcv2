'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2 } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      toast.success('Login successful!', {
        description: 'Welcome back!',
      });
      // Redirect to callback URL or dashboard
      router.push(callbackUrl);
    } catch (error: unknown) {
      let errorMessage = 'Invalid credentials. Please try again.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response: { data: { message: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      toast.error('Login failed', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Sistema de Gestión y Control
          </CardTitle>
          <CardDescription className="text-center">
            Introduce tus credenciales para acceder a tu cuenta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="me@domain.com"
                disabled={isLoading}
                {...register('username')}
                className={errors.username ? 'border-red-500' : ''}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="introduce tu contraseña"
                disabled={isLoading}
                {...register('password')}
                className={errors.password ? 'border-red-500' : ''}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
