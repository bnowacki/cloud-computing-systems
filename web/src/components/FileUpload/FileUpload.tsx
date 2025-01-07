'use client'

import React, { useEffect, useState } from 'react'

import { createClient } from '@supabase/supabase-js'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import FileDropzone, { DropzoneProps } from './Dropzone'
import FileGrid from './FileGrid'
import useFileUpload, { UseFileUploadParams } from './useFileUpload'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

  const [showDialog, setShowDialog] = useState(false)
  const [status, setStatus] = useState({ id: '', status: '', message: '' })

  useEffect(() => console.log('status', status), [status])
  useEffect(() => console.log('files', files), [files])

  // Fetch the newest file from the processing_files table
  const fetchLatestFile = async () => {
    try {
      const { data, error } = await supabase
        .from('processing_files')
        .select('id, status, created_at')
        .order('created_at', { ascending: false }) // Get the newest file
        .limit(1) // Limit to 1 result

      if (error) throw error
      return data[0] // Return the first (and only) result
    } catch (error) {
      console.error('Failed to fetch the latest file:', error)
      return null
    }
  }
  // Fetch status of a file using its ID
  const fetchStatusById = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('processing_files')
        .select('id, status')
        .eq('id', id)
        .single()

      if (error) throw error
      return data // { id, status }
    } catch (error) {
      console.error('Failed to fetch status by ID:', error)
      return null
    }
  }

  const monitorZipUpload = async () => {
    // Fetch the newest file initially
    const latestFile = await fetchLatestFile()
    setShowDialog(true)

    setStatus({
      id: latestFile.id,
      status: latestFile.status,
      message: mapStatusToMessage(latestFile.status),
    })

    // Start polling for status updates
    let intervalId = setInterval(async () => {
      const updatedStatus = await fetchStatusById(latestFile.id)
      if (updatedStatus) {
        setStatus({
          id: updatedStatus.id,
          status: updatedStatus.status,
          message: mapStatusToMessage(updatedStatus.status),
        })

        // Stop polling when status is "processed"
        if (updatedStatus.status === 'processed') {
          clearInterval(intervalId)
          setTimeout(() => setShowDialog(false), 1000) // Hide dialog after 1 second.
        }
      }
    }, 500)
  }

  const mapStatusToMessage = (status: string) => {
    const statusMessageMap: { [key: string]: string } = {
      processing: 'Processing file...',
      opening: 'Opening file...',
      checking: 'Checking file...',
      processed: 'File successfully processed!',
    }
    return statusMessageMap[status] || 'Processing...'
  }

  useEffect(() => {
    // Monitor files if necessary when a zip file is dropped
    const zipFile = files[0].name.endsWith('.zip')
    if (zipFile) {
      monitorZipUpload() // Monitor the upload process
    }
  }, [files])

  return (
    <div className="w-full max-w-screen-xl">
      <div className="flex flex-col w-full gap-8 p-4 m-auto">
        <React.Suspense fallback={<div>Loading...</div>}>
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
        </React.Suspense>
        {!!files.length && (
          <FileGrid files={files} disabled={disabled || loading} onDelete={handleDelete} />
        )}
      </div>

      {/* Dialog for showing progress */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Processing File</DialogTitle>
            <DialogDescription>Please wait while your file is being processed.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 mt-4">
            <h3 className="text-lg font-medium">{status.message || 'Processing...'}</h3>
            <span className="text-sm text-gray-500">Status: {status.status}</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
