'use client'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

export default function ThemeSwitch() {
  const { systemTheme, setTheme } = useTheme()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    if (systemTheme && !storedTheme) {
      setChecked(systemTheme === 'dark')
    }
    if (storedTheme) {
      if (storedTheme === 'system') {
        setChecked(systemTheme === 'dark')
      } else {
        setChecked(storedTheme === 'dark')
      }
    }
  }, [systemTheme])

  return (
    <div className="flex items-center space-x-2">
      <Sun className="w-4 h-4" />
      <Switch
        aria-label="toggle theme"
        aria-live="polite"
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
      <Moon className="w-4 h-4" />
    </div>
  )
}
