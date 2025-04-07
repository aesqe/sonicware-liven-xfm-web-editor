import { Box, Divider, Flex, Stack } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'

import { Operator } from './components/Operator/Operator'
import { AppHeader } from './components/AppHeader/AppHeader'
import { FileUpload } from './components/FileUpload/FileUpload'
import { useWebMidi } from './services/use-web-midi/use-web-midi'
import { useUpdateValues } from './services/use-update-values/use-update-values'
import { useHandlePatchChange } from './services/use-handle-patch-change/use-handle-patch-change'

export const App = () => {
  const viewport = useViewportSize()
  const updateValues = useUpdateValues()
  const handlePatchChange = useHandlePatchChange()

  useWebMidi(handlePatchChange)

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

      <AppHeader updateValues={updateValues} handlePatchChange={handlePatchChange} />

      <Divider w='100%' />

      <Flex w='auto' mx='auto' wrap='wrap' mt={10} maw={viewport.width > 1900 ? 1900 : 970}>
        <Box mx='auto' mb={10} bd='1px solid #e6e3e1'>
          <Operator id={1} updateValues={updateValues} />
        </Box>
        <Box mx='auto' mb={10} bd='1px solid #e6e3e1'>
          <Operator id={2} updateValues={updateValues} />
        </Box>
        <Box mx='auto' mb={10} bd='1px solid #e6e3e1'>
          <Operator id={3} updateValues={updateValues} />
        </Box>
        <Box mx='auto' mb={10} bd='1px solid #e6e3e1'>
          <Operator id={4} updateValues={updateValues} />
        </Box>
      </Flex>
    </Stack>
  )
}
