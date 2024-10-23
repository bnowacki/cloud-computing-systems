import { UploadResult } from '@/types/upload'

import { createClient } from './supabase/client'

export const uploadFile = async (
  file: File,
  bucket: string,
  scope?: string
): Promise<UploadResult> => {
  const filepath = scope ? `/${scope}/${file.name}` : `/${file.name}`

  const supabase = createClient()

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
