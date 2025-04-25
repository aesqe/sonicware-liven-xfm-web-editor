import { useAtomCallback } from 'jotai/utils'
import { IconDownload } from '@tabler/icons-react'
import { ActionIcon, Tooltip, useMantineColorScheme } from '@mantine/core'

import { patchAtom } from '../../store/atoms'
import { downloadJSON } from '../../services/download-json/download-json'

export const DownloadPatchButton = () => {
  const { colorScheme } = useMantineColorScheme()

  const handleDownload = useAtomCallback((get) => {
    const patch = get(patchAtom)
    downloadJSON(patch, patch.Name)
  })

  return (
    <Tooltip label='Download Patch' withArrow color='#F0F0F0' c='#000000'>
      <ActionIcon
        h={40}
        w={40}
        color={colorScheme === 'light' ? '#e6e3e1' : '#6f6a68'}
        c={colorScheme === 'light' ? 'dark' : '#c9c9c9'}
        onClick={handleDownload}
        autoContrast
      >
        <IconDownload />
      </ActionIcon>
    </Tooltip>
  )
}
