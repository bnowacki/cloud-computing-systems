import { SupabaseClient } from '@supabase/supabase-js'

import { SupabaseQueryParams } from '@/types/supabase'
import { AnyObject } from '@/types/utils'

export const supabaseQuery = <T extends AnyObject>(
  supabase: SupabaseClient,
  {
    fields,
    from,
    descending,
    order,
    match,
    limit,
    page,
    abortSignal,
    filter,
    finalize,
  }: SupabaseQueryParams<T>
) => {
  let query = supabase.from(from).select<string, T>(fields, { count: 'exact' })

  if (order?.length) {
    Array.isArray(order)
      ? order.forEach(o => (query = query.order(o, { ascending: !descending })))
      : (query = query.order(order, { ascending: !descending }))
  }

  if (limit) {
    query = query.limit(limit)
    if (page) {
      const offset = limit * page
      query = query.range(offset, offset + limit - 1) // Both start and end indices are inclusive
    }
  }

  if (match) query = query.match(match)
  if (filter) query = filter(query)
  if (finalize) query = finalize(query)
  if (abortSignal) query = query.abortSignal(abortSignal)

  return query
}
