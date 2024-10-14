import React from 'react'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import useLoadingState from '@/hooks/use-loading-state'
import { createClient } from '@/utils/supabase/client'

import { Button } from './ui/button'

type Props = {
  open?: boolean
  onClose: () => void
  onComplete?: () => Promise<void>
  table?: string
  id?: string | number
  onDelete?: () => Promise<void>
  headerText?: string
  name?: string
  onFailTitle?: string
  onSuccessTitle?: string
}

const DeleteResourceDialog = ({
  onClose,
  open,
  table,
  id,
  onComplete,
  onDelete,
  headerText,
  name,
  onFailTitle,
  onSuccessTitle,
}: Props) => {
  const [handleSubmit, loading] = useLoadingState(
    React.useCallback(async () => {
      if (onDelete) {
        await onDelete()
      } else if (!!id && !!table) {
        const supabase = createClient()
        const { error, count } = await supabase.from(table).delete({ count: 'exact' }).match({ id })
        if (error) throw error
        if (!count) throw new Error('No rows deleted')
      } else {
        throw new Error('Missing item details')
      }

      onComplete?.()
      onClose()
    }, [id, onClose, onComplete, onDelete, table]),
    {
      onErrorToast: onFailTitle || 'Failed to delete resource',
      onSuccessToast: onSuccessTitle || 'Resource deleted',
    }
  )

  return (
    <AlertDialog open={open} onOpenChange={v => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{headerText || 'Are you sure?'}</AlertDialogTitle>
          <AlertDialogDescription>
            Do you want to delete {name ? <strong>{name}</strong> : 'resource'}? Changes are
            permament.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button variant="destructive" loading={loading} onClick={handleSubmit}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteResourceDialog
