import { ReactNode } from 'react'

import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Form } from './ui/form'

export type EditorDialogProps = {
  open: boolean
  onClose: () => void
  onComplete?: () => Promise<void>
}

type Props<T extends FieldValues = FieldValues> = EditorDialogProps & {
  children: React.ReactNode
  loading?: boolean
  disabled?: boolean
  title?: ReactNode
  form: UseFormReturn<T>
  onSubmit: SubmitHandler<T>
}

export function EditorDialog<T extends FieldValues = FieldValues>({
  open,
  onClose,
  title,
  loading,
  disabled,
  children,
  form,
  onSubmit,
}: Props<T>) {
  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, e => console.log(e))}>
            <DialogHeader>{title && <DialogTitle>{title}</DialogTitle>}</DialogHeader>
            <div className="py-4 space-y-4 mb-6">{children}</div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={disabled || loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={loading} disabled={disabled}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
