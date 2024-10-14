import { format } from 'date-fns'

export const dateFormat = 'dd/MM/yyyy'
export const formatDate = (value: Date | string) => format(new Date(value), dateFormat)

export const timestampFormat = dateFormat + ' HH:mm'
export const formatTimestamp = (value: Date | string) => format(new Date(value), timestampFormat)
