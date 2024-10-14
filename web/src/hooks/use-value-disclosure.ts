import React from 'react'

const useValueDisclosure = <T>(initState?: T) => {
  const [value, setValue] = React.useState<T | null>(initState ?? null)
  const onClose = React.useCallback(() => setValue(null), [])
  const onOpen = React.useCallback((value: T) => setValue(value), [])

  return { value, onOpen, onClose }
}

export default useValueDisclosure
