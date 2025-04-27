'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export function ErrorUrl() {
  const router = useRouter()
  const searchParams = useSearchParams() // Para acceder a los query params normales

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))
    const message = params.get('error_description')
    if (message) {
      toast.error(message)
    }

    if (searchParams.get('error_description')) {
      toast.error(`Error: ${searchParams.get('error_description')}`)
    }
  }, [router, searchParams])

  return <div></div>
}
