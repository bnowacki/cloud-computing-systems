'use client'

import * as React from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SelectOption } from '@/types/utils'
import { cn } from '@/utils/cn'

export type ComboboxProps = {
  value: string
  options: SelectOption[]
  onChange: (v: SelectOption | null) => void
  placeholder?: string
  searchPlaceholder?: string
}

export function Combobox({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
          iconRight={<ChevronsUpDown className="opacity-50" />}
        >
          {value ? options?.find(framework => framework.value === value)?.label : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>No results.</CommandEmpty>
          <CommandList>
            {options?.map(o => (
              <CommandItem
                key={o.value}
                value={o.value}
                onSelect={v => {
                  onChange(v === value ? null : options?.find(o => o.value === v) || null)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn('mr-2 h-4 w-4', value === o.value ? 'opacity-100' : 'opacity-0')}
                />
                {o.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
