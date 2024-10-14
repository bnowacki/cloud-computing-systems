import React from 'react'

import toast from '@/components/toast'
import { SupabaseQueryParams } from '@/types/supabase'
import { AnyObject } from '@/types/utils'
import { createClient } from '@/utils/supabase/client'
import { supabaseQuery } from '@/utils/supabase/query'

import useQueryState from './use-query-state'

export type useListQueryArgs<T extends AnyObject> = SupabaseQueryParams<T> & {
  page?: number
  limit?: number
  skip?: boolean
  errSnackbarTitle?: string
  parsingFunction?: (item: unknown) => T
}

const useListQuery = <T extends AnyObject>({
  from,
  fields,
  parsingFunction,
  errSnackbarTitle,
  skip,
  ...initialQueryState
}: useListQueryArgs<T>) => {
  const ac = React.useRef<AbortController>()
  const [data, setData] = React.useState<T[]>([])
  const [loading, setLoading] = React.useState(true)
  const [rows, setRows] = React.useState<number>(0)
  const [error, setError] = React.useState<Error | null>(null)

  const queryState = useQueryState(initialQueryState)

  const fetch = React.useCallback(async () => {
    if (loading && ac.current) ac.current.abort()

    setLoading(true)
    ac.current = new AbortController()
    try {
      const { page, limit, order, match, filter, finalize, descending } = queryState

      const { data, count, error } = await supabaseQuery<T>(createClient(), {
        from,
        order,
        match,
        fields,
        limit,
        page,
        filter,
        finalize,
        descending,
        abortSignal: ac.current.signal,
      })
      if (error) throw error

      setData((parsingFunction ? data?.map((item: unknown) => parsingFunction(item)) : data) || [])
      setRows(count ?? 0)
    } catch (e) {
      if ((e as Error).message.includes('aborted')) return
      console.error(e)
      setError(e as Error)
      toast({ title: errSnackbarTitle || 'Nie udało się wczytać zasobów', type: 'error' })
    } finally {
      setLoading(false)
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [
    from,
    fields,
    errSnackbarTitle,
    parsingFunction,
    loading,
    queryState.order,
    queryState.descending,
    queryState.filter,
    queryState.finalize,
    queryState.limit,
    queryState.match,
    queryState.page,
  ])

  React.useEffect(() => {
    !skip && fetch()
  }, [
    skip,
    queryState.order,
    queryState.descending,
    queryState.filter,
    queryState.finalize,
    queryState.limit,
    queryState.match,
    queryState.page,
  ])

  return { data, loading, fetch, rows, queryState, error, setData }
}

export default useListQuery
