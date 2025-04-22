import { type Database } from './database.types'

export type ClientCodeEntity =
  Database['public']['Tables']['client-code']['Row']

export type ClientCodeType = `${string}-${string}-${string}-${string}`
