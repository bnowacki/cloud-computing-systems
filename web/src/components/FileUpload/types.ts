import { UploadResult } from '@/types/upload'

export type FileItem = UploadResult & {
  uploading?: boolean
}

export type FileItemProps = {
  disabled?: boolean
} & (
  | {
      item: FileItem
      index: number
      onDelete: (name: string, index: number) => Promise<void> | void
    }
  | {
      item: Omit<FileItem, 'path'>
      index?: never
      onDelete?: never
    }
)
