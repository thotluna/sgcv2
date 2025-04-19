'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function ErrorUrl() {
  const router = useRouter()
  const searchParams = useSearchParams() // Para acceder a los query params normales

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))
    const message = params.get('error_description')
    if (message) {
      toast.error(`Error: se requiere codigo de cliente`)
    }
  }, [router, searchParams])

  return <div></div>
}
