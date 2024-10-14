'use client'

import { ReactNode } from 'react'

import { ControllerProps, FieldPath, FieldValues } from 'react-hook-form'

import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Combobox, ComboboxProps } from '../ui/combobox'

export type FormComboboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<ControllerProps<TFieldValues, TName>, 'render'> &
  Pick<ComboboxProps, 'placeholder' | 'searchPlaceholder' | 'options'> & {
    label?: string
    description?: ReactNode
  }

export function FormCombobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  label,
  description,
  name,
  rules,
  shouldUnregister,
  defaultValue,
  control,
  disabled,
  ...comboboxProps
}: FormComboboxProps<TFieldValues, TName>) {
  return (
    <FormField
      {...{ name, rules, shouldUnregister, defaultValue, control, disabled }}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label && <FormLabel>{label}</FormLabel>}
          <Combobox
            value={field.value}
            onChange={o => field.onChange(o?.value)}
            {...comboboxProps}
          />
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
