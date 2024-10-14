import { PostgrestFilterBuilder } from '@supabase/postgrest-js'
import { PostgrestResponse } from '@supabase/supabase-js'

import { Database } from './database-generated.types'
import { AnyObject } from './utils'

export type FilterBuilderFn<T extends AnyObject> = (
  builder: PostgrestFilterBuilder<Database['public'], T, T[]>
) => PostgrestFilterBuilder<Database['public'], T, T[]>

export type SupabaseQueryParams<T extends AnyObject> = {
  from: keyof Database['public']['Tables'] | keyof Database['public']['Views']
  fields?: string // all fields '*' by default
  order?: Extract<keyof T, string> | Extract<keyof T, string>[]
  descending?: boolean
  match?: Partial<T> // equality filter shorthand
  limit?: number
  page?: number
  abortSignal?: AbortSignal
  filter?: FilterBuilderFn<T>
  finalize?: FilterBuilderFn<T> //constant filter
}

export type UpsertResponse = {
  error?: string
  id?: string
}

export type QueryResult<T extends AnyObject> = Pick<PostgrestResponse<T>, 'data' | 'count'>
