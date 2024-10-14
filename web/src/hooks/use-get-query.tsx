import React from 'react'

import { SupabaseQueryParams } from '@/types/supabase'
import { AnyObject } from '@/types/utils'
import { createClient } from '@/utils/supabase/client'
import { supabaseQuery } from '@/utils/supabase/query'

import useLoadingState from './use-loading-state'

type Props<T extends AnyObject> = Omit<SupabaseQueryParams<T>, 'limit' | 'page' | 'abortSignal'> & {
  skip?: boolean
  errSnackbarTitle?: string
  parsingFunction?: (item: unknown) => T
}

const useGetQuery = <T extends AnyObject>({
  errSnackbarTitle,
  parsingFunction,
  skip,
  ...params
}: Props<T>): [T | null, boolean, () => Promise<void>, Error | null] => {
  const [data, setData] = React.useState<T | null>(null)

  const [fetch, loading, error] = useLoadingState(
    React.useCallback(async () => {
      const { data, error } = await supabaseQuery(createClient(), params).limit(1).maybeSingle()
      if (error) throw error

      setData(parsingFunction && data ? parsingFunction(data) : data)
    }, [params, parsingFunction]),
    { onErrorToast: errSnackbarTitle || 'Nie udało się wczytać zasobu' }
  )

  React.useEffect(() => {
    !skip && fetch()
  }, [skip, params.descending, params.fields, params.filter, params.match, params.order]) // eslint-disable-line

  return [data, loading, fetch, error]
}

export default useGetQuery
