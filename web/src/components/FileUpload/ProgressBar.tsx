import React from 'react'

import styles from './ProgressBar.module.scss'

// TODO: keep actual progress of the upload, instead of a looping animation
export default function ProgressBar() {
  return (
    <div className={styles.Bar}>
      <div className={styles.Progress} />
    </div>
  )
}
