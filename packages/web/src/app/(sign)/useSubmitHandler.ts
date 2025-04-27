import { sendSing } from '../_auth/signSubmitServerAction'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

export function useSubmitHandler<TData>(
  url: string,
): (data: TData) => Promise<void> {
  const handler = async (data: TData) => {
    const res = await sendSing(data, url)
    console.log({ res })

    if (res.status === 'error') {
      toast.error('Error:', {
        description: res.message,
      })
      return
    }

    redirect('/private')
  }

  return handler
}
