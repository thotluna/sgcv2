'use server';

import { ActionState } from '@/lib/types';
import { loginSchema } from '@sgcv2/shared';
import { authService } from '@/lib/api/auth.service';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: 'Error de validación',
      errors: validated.error.flatten().fieldErrors,
    };
  }

  try {
    const { username, password } = validated.data;
    const response = await authService.login(username, password);

    if (!response.success || !response.data?.token) {
      return {
        success: false,
        message: response.error?.message || 'Credenciales inválidas',
      };
    }

    // Set cookie on server side
    const cookieStore = await cookies();
    cookieStore.set('auth-token', response.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // 7 days
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Error al iniciar sesión',
    };
  }

  redirect('/dashboard');
}
