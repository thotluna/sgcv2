'use client'

import { useStoreState } from '../store/store'

export default function Auth() {
  const user = useStoreState(state => state.user)
  return <h1>Dashboard {user.email}</h1>
}
