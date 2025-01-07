import { UploadResult } from '@/types/upload'

import { createClient } from './supabase/client'

const isFileValid = (): boolean => {
  return Math.random() < 0.5
}

export const uploadFile = async (
  file: File,
  bucket: string,
  scope?: string
): Promise<UploadResult> => {
  const filepath = scope ? `/${scope}/${file.name}` : `/${file.name}`

  const supabase = createClient()

  if (!isFileValid()) {
    throw new Error(`File "${file.name}" failed validation.`)
  }

  // Check if the file is a ZIP file (by MIME type or file extension)
  if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
    // Insert a new record into the 'processing_files' table to indicate processing status
    const { data: insertData, error: insertError } = await supabase
      .from('processing_files')
      .insert([{ name: file.name, status: 'processing', created_at: new Date() }])
      .select('*')

    // Add type assertion here to let TypeScript know insertData is an array of objects
    if (insertError) {
      console.error('Error inserting record into processing_files table:', insertError.message)
      throw new Error(`Error inserting processing file: ${insertError.message}`)
    }

    // Ensure that insertData is properly typed as an array of records
    if (!insertData || insertData.length === 0) {
      throw new Error('Failed to insert file record in processing_files table')
    }

    // Log the inserted data
    console.log('File inserted successfully:', insertData[0])

    // We simulate processing the file asynchronously by calling 'processZipFile'
    // Pass the file and the id of the inserted record
    processZipFile(file, insertData[0].id)

    // Immediately return the response so the client does not have to wait
    return { name: file.name, path: filepath, url: '' }
  } else {
    // For non-ZIP files, continue the normal upload process
    const { error } = await supabase.storage.from(bucket).upload(filepath.substr(1), file)
    if (error) {
      throw error
    }
    const { data, error: signedURLError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filepath.substr(1), 300)
    if (signedURLError) {
      throw signedURLError
    }
    if (!data || !data.signedUrl) {
      throw new Error('Empty signed url response')
    }

    return { name: file.name, path: filepath, url: data.signedUrl }
  }
}

const processZipFile = async (file: File, recordId: number) => {
  const supabase = createClient()

  console.log('Simulating processing for file:', file.name)

  // Step 2: After 3 seconds, set status to "opening" for 3 seconds
  setTimeout(async () => {
    console.log('Status: opening for file:', file.name)
    const { error: openingError } = await supabase
      .from('processing_files')
      .update({ status: 'opening' })
      .eq('id', recordId)

    if (openingError) {
      console.error('Error updating file status to "opening":', openingError.message)
      return
    }

    // Step 3: After 3 seconds, set status to "checking" for 4 seconds
    setTimeout(async () => {
      console.log('Status: checking for file:', file.name)
      const { error: checkingError } = await supabase
        .from('processing_files')
        .update({ status: 'checking' })
        .eq('id', recordId)

      if (checkingError) {
        console.error('Error updating file status to "checking":', checkingError.message)
        return
      }

      // Step 4: After 4 seconds, set status to "processed"
      setTimeout(async () => {
        console.log('Status: processed for file:', file.name)
        const { error: processedError } = await supabase
          .from('processing_files')
          .update({ status: 'processed', processed_at: new Date() })
          .eq('id', recordId)

        if (processedError) {
          console.error('Error updating file status to "processed":', processedError.message)
        } else {
          console.log('File processed successfully:', file.name)
        }
      }, 5000) // 4 seconds for "checking"
    }, 4000) // 3 seconds for "opening"
  }, 4000) // 3 seconds for "processing"
}
