import React from 'react'

import styles from './FileGrid.module.scss'
import FileGridItem from './FileGridItem'
import { FileItem } from './types'

type Props = {
  files: FileItem[]
  disabled?: boolean
  onDelete: (name: string, index: number) => Promise<void>
}

export default function FileGrid({ files, disabled, onDelete }: Props) {
  return (
    <div className={styles.FileGrid}>
      {files.map((f, i) => (
        <FileGridItem key={f.path} index={i} item={f} onDelete={onDelete} disabled={disabled} />
      ))}
    </div>
  )
}
