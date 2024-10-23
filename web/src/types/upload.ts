import { DropEvent, FileRejection } from 'react-dropzone'

export type UploadResult = {
  name: string
  path: string
  url: string
}

export type DropzoneOnDrop = <T extends File>(
  acceptedFiles: T[],
  fileRejections: FileRejection[],
  event: DropEvent
) => void
