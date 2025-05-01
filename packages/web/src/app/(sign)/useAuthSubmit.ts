import { sendSing } from './signSubmitServerAction'

interface Props {
  url: string
  onError: (message: string) => void
}

export function useAuthSubmit<TData>({
  url,
  onError,
}: Props): (data: TData) => Promise<void> {
  const handler = async (data: TData) => {
    const res = await sendSing(data, url)

    if (res.status === 'error') onError(res.message)
  }

  return handler
}
