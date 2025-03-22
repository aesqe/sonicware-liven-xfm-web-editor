import { useAtomValue } from 'jotai'
import { IconDownload } from '@tabler/icons-react'
import { ActionIcon, Tooltip } from '@mantine/core'

import { patchAtom } from '../../store/atoms'

export const DownloadPatchButton = () => {
  const patch = useAtomValue(patchAtom)

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(patch, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${patch.Name}.json`
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  }

  return (
    <Tooltip label='Download Patch' withArrow color='#F0F0F0' c='#000000'>
      <ActionIcon h={40} w={40} color='#e6e3e1' c='dark' onClick={handleDownload}>
        <IconDownload />
      </ActionIcon>
    </Tooltip>
  )
}
