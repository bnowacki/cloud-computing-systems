import { SupabaseClient } from '@supabase/supabase-js'

export const uploadFile = async (
  supabase: SupabaseClient,
  file: File,
  bucket: string,
  scope?: string
) => {
  const filepath = scope ? `/${scope}/${file.name}` : `/${file.name}`

  const { error } = await supabase.storage.from(bucket).upload(filepath, file, { upsert: true })
  if (error) throw error

  return filepath
}
