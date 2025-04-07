'use client'

import { useEffect, useState } from 'react'

export function DateTime() {
  const [time, setTime] = useState('cargando...')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const formattedDateTime = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'long',
        timeStyle: 'long',
        hour12: true,
      })
        .format(now)
        .split('GMT')[0]
      setTime(formattedDateTime)
    }

    updateDateTime()

    const interval = setInterval(updateDateTime, 1000)

    return () => clearInterval(interval)
  }, [])
  return <p className="text-xs">{time}</p>
}
