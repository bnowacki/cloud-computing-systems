'use client'

import React from 'react'

import { IconDownload, IconFileTypePdf, IconTrash } from '@tabler/icons-react'

import { BUCKET } from '@/constants'
import useLoadingState from '@/hooks/use-loading-state'
import { createClient } from '@/utils/supabase/client'

import { Button } from '../ui/button'
import styles from './FileGridItem.module.scss'
import ProgressBar from './ProgressBar'
import { FileItemProps } from './types'

export default function FileGridItem({ item, onDelete, index, disabled = false }: FileItemProps) {
  const [isDisabled, setIsDisabled] = React.useState(disabled)

  const [handleDelete, deleting] = useLoadingState(
    React.useCallback(async () => {
      if (!('path' in item)) {
        return
      }

      const { error } = await createClient().storage.from(BUCKET).remove([item.path])
      if (error) throw error

      setIsDisabled(true)
      await onDelete?.(item.path, index)
    }, [item, onDelete, index]),
    {
      onErrorToast: 'Failed to delete file',
    }
  )

  const [handleDownload, downloading] = useLoadingState(
    React.useCallback(async () => {
      if (!('path' in item)) {
        return
      }

      const { data, error } = await createClient()
        .storage.from(BUCKET)
        .createSignedUrl(item.path, 60, { download: item.name })
      if (error) throw error

      const link = document.createElement('a')
      link.href = data.signedUrl
      // link.setAttribute('target', '_blank')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, [item]),
    {
      onErrorToast: 'Failed to download file',
    }
  )

  return (
    <div
      className={styles.GridItem}
      style={isDisabled ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
    >
      <div className={styles.Image}>
        {!item.name.includes('.pdf') && item.url ? (
          // can't use next Image, because it doesn't support blob urls
          // eslint-disable-next-line @next/next/no-img-element
          <img alt={item.name || 'uploaded-file'} src={item.url} className={styles.FilePreview} />
        ) : (
          <IconFileTypePdf size={60} />
        )}
      </div>
      {item.uploading ? (
        <div className={styles.UploadProgress}>
          <p>Uploading file...</p>
          <div>
            <ProgressBar />
          </div>
        </div>
      ) : (
        <div className={styles.Overlay} onClick={e => e.stopPropagation()}>
          <div className={styles.Buttons}>
            <Button
              variant="link"
              iconLeft={<IconDownload />}
              disabled={isDisabled}
              onClick={handleDownload}
              loading={downloading}
            />
            {onDelete && (
              <Button
                variant="link"
                iconLeft={<IconTrash />}
                onClick={handleDelete}
                disabled={isDisabled}
                loading={deleting}
              />
            )}
          </div>
        </div>
      )}
      <div>{item.name}</div>
    </div>
  )
}
