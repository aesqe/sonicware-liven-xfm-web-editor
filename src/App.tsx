import { useEffect } from 'react'
import { Box, Divider, Flex, Stack } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'

import { Operator } from './components/Operator/Operator'
import { AppHeader } from './components/AppHeader/AppHeader'
import { FileUpload } from './components/FileUpload/FileUpload'
import { useWebMidi } from './services/use-web-midi/use-web-midi'
import { useUpdatePatch } from './services/use-update-patch/use-update-patch'
import { useMonitorPatchAtom } from './services/use-monitor-patch-atom/use-monitor-patch-atom'
import { useHandlePatchChange } from './services/use-handle-patch-change/use-handle-patch-change'
import { useLoadMidiMappingsFromLocalStorage } from './services/use-load-midi-mappings-from-local-storage/use-load-midi-mappings-from-local-storage'

export const App = () => {
  const viewport = useViewportSize()
  const updatePatch = useUpdatePatch()
  const handlePatchChange = useHandlePatchChange()
  const loadMidiMappings = useLoadMidiMappingsFromLocalStorage()

  useMonitorPatchAtom()
  useWebMidi(handlePatchChange)

  useEffect(() => {
    loadMidiMappings()
  }, [loadMidiMappings])

  return (
    <Stack
      align='center'
      justify='center'
      w='auto'
      mx='auto'
      gap={0}
      maw={viewport.width > 1900 ? 1900 : 970}
    >
      <FileUpload handlePatchChange={handlePatchChange} />

      <AppHeader onChange={updatePatch} handlePatchChange={handlePatchChange} />

      <Divider w='100%' mt={10} />

      <Flex w='auto' mx='auto' wrap='wrap' mt={10} maw={viewport.width > 1900 ? 1868 : 970} gap={5}>
        <Box mx='auto' bd='1px solid #e6e3e1'>
          <Operator id={1} onChange={updatePatch} />
        </Box>
        <Box mx='auto' bd='1px solid #e6e3e1'>
          <Operator id={2} onChange={updatePatch} />
        </Box>
        <Box mx='auto' bd='1px solid #e6e3e1'>
          <Operator id={3} onChange={updatePatch} />
        </Box>
        <Box mx='auto' bd='1px solid #e6e3e1'>
          <Operator id={4} onChange={updatePatch} />
        </Box>
      </Flex>
    </Stack>
  )
}
