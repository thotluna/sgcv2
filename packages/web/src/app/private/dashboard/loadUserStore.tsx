'use client'

import { User, useStoreState } from '@/app/store/store'
import { useEffect } from 'react'

export function LoadUserStore({ user }: { user: User | undefined }) {
  const setUser = useStoreState(state => state.setUser)

  useEffect(() => {
    if (user) {
      setUser(user as User)
    }
  }, [setUser, user])
  return <h1>Dashboard {user?.email}</h1>
}
