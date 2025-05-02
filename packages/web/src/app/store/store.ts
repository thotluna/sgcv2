import { create } from 'zustand'

export interface User {
  role: string
  email: string
}
export interface BasicState {
  user: User
  setUser: (user: User) => void
  getUser: () => User
}
export const useStoreState = create<BasicState>((set, get) => ({
  user: {
    role: '',
    email: '',
  },
  setUser: user => set({ user }),
  getUser: () => get().user,
}))
