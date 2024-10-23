import React, { ReactNode, Suspense } from 'react'

import { IconUpload } from '@tabler/icons-react'
import clsx from 'clsx'
import { Accept, useDropzone } from 'react-dropzone'

import { Button } from '@/components/ui/button'
import { DropzoneOnDrop } from '@/types/upload'

import styles from './styles.module.scss'

export type DropzoneProps = {
  disabled?: boolean
  loading?: boolean
  multiple?: boolean
  accept?: Accept
  onDrop?: DropzoneOnDrop
  title?: string
  subtitle?: string
  acceptedText?: string
  maxSize?: number
  children?: ReactNode
}

const FileDropzone = ({
  disabled,
  loading,
  multiple,
  title,
  subtitle,
  acceptedText,
  onDrop,
  accept,
  maxSize,
  children,
}: DropzoneProps) => {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept,
    disabled: disabled || loading,
    multiple,
    onDrop,
    maxSize,
  })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        className={clsx(
          styles.Base,
          ...(disabled || loading
            ? [styles.Disabled]
            : [
                isFocused ? styles.Focused : null,
                isDragAccept ? styles.Accept : null,
                isDragReject ? styles.Reject : null,
              ]),
          !children && styles.MorePaddingBottom
        )}
      >
        <Suspense fallback={<span>Loading...</span>}>
          <IconUpload />
          {isDragAccept || isDragReject ? (
            <>
              <p className={styles.Text}>{isDragAccept ? 'Drop files here' : 'Invalid file'}</p>
              <div className={styles.Dropzone} />
            </>
          ) : (
            <>
              {(title || subtitle) && (
                <div className={styles.Text}>
                  {title && <p className={styles.Title}>{title}</p>}
                  {subtitle && <p className={styles.Subtitle}>{subtitle}</p>}
                </div>
              )}
              <Button disabled={disabled || loading} className="rounded-full">
                Select from disk
              </Button>
              {acceptedText && <p className={styles.AcceptedText}>{acceptedText}</p>}
            </>
          )}

          {children}
        </Suspense>
      </div>
    </div>
  )
}

export default FileDropzone
