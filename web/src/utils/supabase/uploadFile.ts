import { SupabaseClient } from '@supabase/supabase-js'

export const uploadFile = async (
  supabase: SupabaseClient,
  file: File,
  bucket: string,
  scope?: string
) => {
  const filepath = scope ? `/${scope}/${file.name}` : `/${file.name}`
  if (isFileValid()) {
    const { error } = await supabase.storage.from(bucket).upload(filepath, file, { upsert: true })
    if (error) throw error
  }

  return filepath
}

const isFileValid = (): boolean => {
  return Math.random() < 0.5
}
