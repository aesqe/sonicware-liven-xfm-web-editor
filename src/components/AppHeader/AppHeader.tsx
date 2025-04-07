import { useRef, useEffect, useState, useCallback } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { Stack, Flex, Paper, ActionIcon, Anchor, Divider, Image, Title } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { IconTerminal2 } from '@tabler/icons-react'

import githubMark from '../../assets/github-mark.svg'
import { ADSREnvelope } from '../ADSREnvelope/ADSREnvelope'
import { PatchNameEditor } from '../PatchNameEditor/PatchNameEditor'
import { DownloadPatchButton } from '../DownloadPatchButton/DownloadPatchButton'
import { GlobalRandomization } from '../GlobalRandomization/GlobalRandomization'
import { MidiDevicesSelection } from '../MidiDevicesSelection/MidiDevicesSelection'
import { logSysExAtom, patchAtom } from '../../store/atoms'
import { AppHeaderToggleControls } from './components/AppHeaderToggleControls/AppHeaderToggleControls'
import { AppHeaderInitializeControls } from './components/AppHeaderInitializeControls/AppHeaderInitializeControls'
import { ADSRValues, UpdatedProperty, XFMPatch } from '../../types'

type Props = {
  updateValues: (props: UpdatedProperty[]) => void
  handlePatchChange: (patch: XFMPatch) => void
}

export const AppHeader = ({ updateValues, handlePatchChange }: Props) => {
  const viewport = useViewportSize()
  const patch = useAtomValue(patchAtom)
  const [logSysEx, setLogSysEx] = useAtom(logSysExAtom)
  const [adsrEnvelopeWidth, setADSREnvelopeWidth] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)

  const updatePitchEnvelope = useCallback(
    (data: ADSRValues) => {
      updateValues([
        { propertyPath: 'Pitch.ALevel', value: data.ALevel },
        { propertyPath: 'Pitch.ATime', value: data.ATime },
        { propertyPath: 'Pitch.DLevel', value: data.DLevel },
        { propertyPath: 'Pitch.DTime', value: data.DTime },
        { propertyPath: 'Pitch.SLevel', value: data.SLevel },
        { propertyPath: 'Pitch.STime', value: data.STime },
        { propertyPath: 'Pitch.RLevel', value: data.RLevel },
        { propertyPath: 'Pitch.RTime', value: data.RTime }
      ])
    },
    [updateValues]
  )

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const minWidth = 434
        const width = containerRef.current.clientWidth - 400

        setADSREnvelopeWidth(Math.max(width, minWidth))
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Paper p={0} px={10} mx='auto' w={viewport.width > 970 ? '100%' : '460px'}>
      <Flex w='100%' mx='auto' wrap='wrap' ref={containerRef}>
        <Stack gap={0} mr={10} w={viewport.width > 970 ? 250 : '100%'} pt={5}>
          <Anchor
            title='View the repository on GitHub'
            href='https://github.com/aesqe/sonicware-liven-xfm-web-editor'
            c='grey'
            fz={12}
            py={3}
          >
            <Image
              src={githubMark}
              alt='View the repository on GitHub'
              w={12}
              h={12}
              mr={5}
              display='inline'
              mb={-2}
            />
            View the repository on GitHub
          </Anchor>
          <Flex justify='space-between' align='center' w='100%'>
            <Title order={2} style={{ cursor: 'default' }}>
              XFM Web Editor
            </Title>
            <ActionIcon
              mt={4}
              color={logSysEx ? 'green' : '#e6e3e1'}
              c={logSysEx ? 'white' : 'dark'}
              onClick={() => setLogSysEx(!logSysEx)}
              title='Toggle logging of SysEx messages to the browser console'
            >
              <IconTerminal2 />
            </ActionIcon>
          </Flex>

          <MidiDevicesSelection />

          <Flex align='end' justify='space-between' gap={5}>
            <PatchNameEditor />
            <DownloadPatchButton />
          </Flex>
        </Stack>

        {viewport.width > 970 && <Divider orientation='vertical' mr={15} ml={10} />}

        <Stack
          gap={8}
          mb={10}
          mt={8}
          mr={viewport.width > 970 ? 20 : 0}
          w={viewport.width > 970 ? 280 : '100%'}
        >
          <AppHeaderInitializeControls
            handlePatchChange={handlePatchChange}
            viewportWidth={viewport.width}
          />
          <Stack align='start' gap={4} w='100%'>
            <AppHeaderToggleControls />
          </Stack>
        </Stack>

        {viewport.width > 1880 && <Divider orientation='vertical' mr={15} />}

        <Stack
          align='start'
          gap={4}
          mt={8}
          mr={viewport.width > 970 ? 20 : 0}
          w={viewport.width >= 1920 ? 380 : viewport.width >= 970 ? 280 : '100%'}
        >
          <GlobalRandomization handlePatchChange={handlePatchChange} />
        </Stack>

        {viewport.width > 1900 && <Divider orientation='vertical' mr={20} />}

        <ADSREnvelope
          width={viewport.width >= 970 ? 850 : adsrEnvelopeWidth}
          height={100}
          onChange={updatePitchEnvelope}
          pitchEnv
          initialState={patch.Pitch}
          mb={-8}
          mx={-8}
        />
      </Flex>
    </Paper>
  )
}
