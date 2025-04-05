'use client'

import { useEffect, useState } from 'react'

export function DateTime() {
  const [time, setTime] = useState(new Date())

  const dateTime = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'long',
    hour12: true,
  })
    .format(time)
    .split('GMT')[0]

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return <p className="text-xs">{dateTime}</p>
}
