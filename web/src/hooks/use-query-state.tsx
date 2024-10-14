import * as React from 'react'

import { FilterBuilderFn, SupabaseQueryParams } from '@/types/supabase'
import { AnyObject } from '@/types/utils'

export type QueryStateFields<T extends AnyObject> = Omit<
  SupabaseQueryParams<T>,
  'from' | 'fields'
> & {
  page?: number
  limit?: number // 10 by default, 0 means no limit
}

export type QueryState<T extends AnyObject> = QueryStateFields<T> & {
  setPage: (v: number) => void
  setLimit: (v: number) => void
  setOrder: (v: Extract<keyof T, string> | Extract<keyof T, string>[]) => void
  setDescending: (v: boolean) => void
  setMatch: (v: Partial<T>) => void

  goToPreviousPage: () => void
  goToNextPage: () => void

  previousCount: number
  setPreviousCount: (v: number) => void

  setFilter: (v?: FilterBuilderFn<T>) => void
}

const useQueryState = <T extends AnyObject>(initial?: QueryStateFields<T>): QueryState<T> => {
  const [page, setPage] = React.useState(initial?.page || 0)
  const [limit, setLimit] = React.useState(
    !initial?.limit ? (initial?.limit === 0 ? undefined : 10) : initial?.limit
  )
  const [order, setOrder] = React.useState(initial?.order || [])
  const [descending, setDescending] = React.useState(initial?.descending || false)
  const [previousCount, setPreviousCount] = React.useState(0)
  const [match, setMatch] = React.useState(initial?.match)
  const [filter, _setFilter] = React.useState(() => initial?.filter)

  const setFilter = React.useCallback(
    (newFilter?: FilterBuilderFn<T>) => _setFilter(newFilter && (() => newFilter)),
    []
  )

  const goToPreviousPage = React.useCallback(() => setPage(prev => prev - 1), [])
  const goToNextPage = React.useCallback(() => setPage(prev => prev + 1), [])

  return {
    descending,
    setDescending,
    match,
    setMatch,
    page,
    setPage,
    limit,
    setLimit,
    filter,
    setFilter,
    finalize: initial?.finalize,
    previousCount,
    setPreviousCount,
    order,
    setOrder,
    goToNextPage,
    goToPreviousPage,
  }
}

export default useQueryState
