import { sendSing } from './signSubmitServerAction'

interface Props {
  url: string
  onError: (message: string) => void
  onSuccess?: () => void
}
export function useAuthSubmit<TData>({
  url,
  onError,
  onSuccess
}: Props): (data: TData) => Promise<void> {
  const handler = async (data: TData) => {
    const res = await sendSing(data, url)

    if (res.code) onError(res.code)

    if (onSuccess) onSuccess()
  }
  return handler
}
