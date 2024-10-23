import React from 'react'

import { IconCloudUpload } from '@tabler/icons-react'

export default function Logo() {
  return (
    <div className="font-bold text-xl flex items-center gap-2">
      <IconCloudUpload color="#ffc107" />
      <div>Cloudrive</div>
    </div>
  )
}
