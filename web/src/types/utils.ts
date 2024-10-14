export type AnyObject = Record<string, unknown>

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type SelectOption<T = string> = {
  label: string
  value: T
}
