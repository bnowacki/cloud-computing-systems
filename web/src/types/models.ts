import { Database } from './database-generated.types'

export type User = Database['public']['Tables']['users']['Row']
export type UserRole = Database['public']['Enums']['user_role']
export type UserProfile = Database['public']['Views']['user_profile']['Row']
