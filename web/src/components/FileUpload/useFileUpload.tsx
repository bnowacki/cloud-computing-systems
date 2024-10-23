import React from 'react'

import { v4 as uuidv4 } from 'uuid'

import { BUCKET, MB } from '@/constants'
import { DropzoneOnDrop, UploadResult } from '@/types/upload'
import { uploadFile } from '@/utils/upload'

import { useAuth } from '../providers/user'
import toast from '../toast'
import { FileItem } from './types'

export type UseFileUploadParams = {
  value?: FileItem[]
  onUpload?: (v: UploadResult) => void | Promise<void>
  onDelete?: (path: string, index: number) => void | Promise<void>
  onChange?: (v: UploadResult[]) => void | Promise<void>
  maxSize?: number
  maxFiles?: number
  prependUploads?: boolean
}

export default function useFileUpload({
  value = [],
  maxFiles,
  prependUploads,
  maxSize,
  onUpload,
  onChange,
  onDelete,
}: UseFileUploadParams) {
  const { profile } = useAuth()
  const [uploadingFiles, setUploadingFiles] = React.useState<FileItem[]>([])

  const files: FileItem[] = React.useMemo(
    () => (prependUploads ? [...uploadingFiles, ...value] : [...value, ...uploadingFiles]),
    [uploadingFiles, value, prependUploads]
  )

  const handleDrop = React.useCallback<DropzoneOnDrop>(
    async (accepted, rejected) => {
      if (!profile?.id) {
        toast({ title: 'Not authenticated', type: 'error' })
        return
      }

      if (rejected.length) {
        toast({
          title: 'Files do not meet requirements',
          type: 'error',
          description:
            rejected
              .map(r =>
                [
                  r.file.name,
                  ...r.errors.map(e => {
                    switch (e.code) {
                      case 'file-too-large':
                        return `The file is too large; \nmax ${Math.round(((maxSize || 0) / MB) * 100) / 100}MB`
                      case 'file-invalid-type':
                        return 'Invalid file format'
                      case 'too-many-files':
                        return 'Too many files'
                    }
                  }),
                ].join('\n')
              )
              .join('\n\n') || undefined,
        })
        return
      }
      if (maxFiles && accepted.length + files.length > maxFiles) {
        toast({ title: 'Too many files', type: 'error' })
        return
      }

      try {
        if (!accepted.length) return

        const uploads = await Promise.all(
          accepted.map(async file => {
            const path = uuidv4()

            try {
              if (!file || !profile.id) return null

              const newFile = {
                path,
                name: file.name,
                uploading: true,
                url: '',
              }
              if (file.type.startsWith('image/')) {
                await new Promise<void>((res, rej) => {
                  const reader = new FileReader()
                  reader.onload = function (e) {
                    if (typeof e.target?.result !== 'string') return
                    newFile.url = e.target?.result
                    res()
                  }
                  reader.onerror = function (e) {
                    rej(new Error('Unable to load image.'))
                  }
                  reader.readAsDataURL(file)
                })
              }

              setUploadingFiles(p => (prependUploads ? [newFile, ...p] : [...p, newFile]))

              const upload = await uploadFile(file, BUCKET, profile?.id)

              onUpload && (await onUpload(upload))
              setUploadingFiles(p => p.filter(f => f.path !== path))
              return upload
            } catch (e) {
              console.error(e)
              // remove if failed
              setUploadingFiles(p => p.filter(f => f.path !== path))
              toast({ title: 'Failed to upload the file', type: 'error' })
            }
          })
        )

        onChange && (await onChange([...value, ...(uploads.filter(Boolean) as UploadResult[])]))
      } catch (e) {
        setUploadingFiles([])
        console.error(e)
      }
    },
    [maxFiles, files.length, maxSize, onChange, value, profile?.id, onUpload, prependUploads]
  )

  const handleDelete = React.useCallback(
    async (name: string, index: number) => {
      onDelete && (await onDelete(name, index))
      onChange && (await onChange(value.filter(v => v.name !== name)))
    },
    [value, onDelete, onChange]
  )

  return { files, uploadingFiles, handleDrop, handleDelete }
}
