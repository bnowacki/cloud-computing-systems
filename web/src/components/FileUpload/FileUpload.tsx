'use client'

import React, { Suspense } from 'react'

import FileDropzone, { DropzoneProps } from './Dropzone'
import FileGrid from './FileGrid'
import useFileUpload, { UseFileUploadParams } from './useFileUpload'

export type FileUploadProps = Omit<UseFileUploadParams, 'prependUploads'> &
  Omit<DropzoneProps, 'onDrop' | 'multiple'>

export default function FileUpload({
  value = [],
  onChange,
  onUpload,
  onDelete,
  maxFiles,
  disabled,
  loading,
  maxSize,
  ...dropzoneProps
}: FileUploadProps) {
  const { files, handleDrop, handleDelete } = useFileUpload({
    value,
    onChange,
    onUpload,
    onDelete,
    maxFiles,
    maxSize,
    prependUploads: true,
  })

  return (
    <div className="w-full max-w-screen-xl">
      <div className="w-full p-4 m-auto flex flex-col gap-8">
        <Suspense fallback={<div>Loading...</div>}>
          {(!maxFiles || files.length < maxFiles) && (
            <FileDropzone
              multiple={maxFiles !== 1}
              onDrop={handleDrop}
              loading={loading}
              disabled={disabled || (!!maxFiles && files.length >= maxFiles)}
              maxSize={maxSize}
              {...dropzoneProps}
            />
          )}
        </Suspense>
        {!!files.length && (
          <FileGrid files={files} disabled={disabled || loading} onDelete={handleDelete} />
        )}
      </div>
    </div>
  )
}
