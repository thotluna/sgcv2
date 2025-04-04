'use client'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'

export default function ThemeSwitch() {
  const { systemTheme, setTheme } = useTheme()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (systemTheme === 'dark') {
      setChecked(true)
    }
  }, [])

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={checked}
        onCheckedChange={isChecked => {
          if (isChecked) {
            setTheme('dark')
            setChecked(true)
          } else {
            setTheme('light')
            setChecked(false)
          }
        }}
      />
    </div>
  )
}
