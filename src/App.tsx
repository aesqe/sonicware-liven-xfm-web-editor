import { useCallback, useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { MessageEvent } from 'webmidi'
import { ActionIcon, Box, Button, Divider, Flex, Paper, Stack, Title } from '@mantine/core'
import { useThrottledCallback } from '@mantine/hooks'
import { IconTerminal2 } from '@tabler/icons-react'

import { Operator } from './components/Operator/Operator'
import { convert78 } from './services/convert78/convert78'
import { decode8bit } from './services/decode8bit/decode8bit'
import { FileUpload } from './components/FileUpload/FileUpload'
import { useWebMidi } from './services/use-web-midi/use-web-midi'
import { ADSREnvelope } from './components/ADSREnvelope/ADSREnvelope'
import { PatchNameEditor } from './components/PatchNameEditor/PatchNameEditor'
import { useSendPatchToXFM } from './services/use-send-patch-to-xfm/use-send-patch-to-xfm'
import { DownloadPatchButton } from './components/DownloadPatchButton/DownloadPatchButton'
import { MidiDevicesSelection } from './components/MidiDevicesSelection/MidiDevicesSelection'
import { updateObjectValueByPath } from './services/update-object-value-by-path/update-object-value-by-path'
import { midiInputAtom, patchAtom, sysexSendThrottleTimeAtom, logSysExAtom } from './store/atoms'
import { OperatorRef, UpdatedProperty, XFMPatch, ADSRValues, SetInternalValueRef } from './types'

export const App = () => {
  useWebMidi()

  const sendPatchToXFM = useSendPatchToXFM()
  const [patch, setPatch] = useAtom(patchAtom)
  const midiInput = useAtomValue(midiInputAtom)
  const sysexSendThrottleTime = useAtomValue(sysexSendThrottleTimeAtom)
  const [scaleControlsOpen, setScaleControlsOpen] = useState(false)
  const [ADSRControlsOpen, setADSRControlsOpen] = useState(true)
  const [adsrEnvelopeWidth, setADSREnvelopeWidth] = useState(600)
  const [logSysEx, setLogSysEx] = useAtom(logSysExAtom)
  const op1Ref = useRef<OperatorRef>(undefined)
  const op2Ref = useRef<OperatorRef>(undefined)
  const op3Ref = useRef<OperatorRef>(undefined)
  const op4Ref = useRef<OperatorRef>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const pitchAdsrRef = useRef<SetInternalValueRef<ADSRValues>>(undefined)
  const patchNameRef = useRef<SetInternalValueRef<string>>(undefined)

  const updateValues = useThrottledCallback((props: UpdatedProperty[]) => {
    const updatedPatch = props.reduce(
      (acc, { propertyPath, formatterFn, value }) =>
        updateObjectValueByPath(acc, propertyPath, formatterFn ? formatterFn(value) : value),
      patch
    )

    setPatch(updatedPatch)
    sendPatchToXFM(updatedPatch)
  }, sysexSendThrottleTime)

  const updatePatchName = useThrottledCallback((patchName: string) => {
    const updatedPatch = { ...patch, Name: patchName.padEnd(4, ' ') }

    setPatch(updatedPatch)
    sendPatchToXFM(updatedPatch)
  }, sysexSendThrottleTime * 10)

  const updatePitchEnvelope = useCallback(
    (envelope: ADSRValues) => {
      updateValues([
        { propertyPath: 'Pitch.ALevel', value: envelope.ALevel },
        { propertyPath: 'Pitch.ATime', value: envelope.ATime },
        { propertyPath: 'Pitch.DLevel', value: envelope.DLevel },
        { propertyPath: 'Pitch.DTime', value: envelope.DTime },
        { propertyPath: 'Pitch.SLevel', value: envelope.SLevel },
        { propertyPath: 'Pitch.STime', value: envelope.STime },
        { propertyPath: 'Pitch.RLevel', value: envelope.RLevel },
        { propertyPath: 'Pitch.RTime', value: envelope.RTime }
      ])
    },
    [updateValues]
  )

  const throttledRefUpdates = useThrottledCallback((data: XFMPatch) => {
    op1Ref.current?.setInternalValue(data.OP1)
    op2Ref.current?.setInternalValue(data.OP2)
    op3Ref.current?.setInternalValue(data.OP3)
    op4Ref.current?.setInternalValue(data.OP4)
    pitchAdsrRef.current?.setInternalValue(data.Pitch)
    patchNameRef.current?.setInternalValue(data.Name)
  }, sysexSendThrottleTime)

  const handlePatchChange = useCallback(
    (data: XFMPatch) => {
      setPatch(data)
      setTimeout(() => {
        throttledRefUpdates(data)
      }, 50)
    },
    [setPatch, throttledRefUpdates]
  )

  const handleDrop = (files: File[]) => {
    const file = files[0]

    if (file.type === 'application/json') {
      const reader = new FileReader()

      reader.onload = (event) => {
        handlePatchChange(JSON.parse(event.target?.result as string))
      }

      reader.readAsText(file)
    }
  }

  useEffect(() => {
    midiInput?.addListener('sysex', (e: MessageEvent) => {
      if (e.message.data.length > 20) {
        const decodedPatch = decode8bit(convert78(e.message.data))

        if (logSysEx) {
          console.log('Raw SysEx:', e.message.data)
          console.log('Decoded SysEx:', decodedPatch)
        }

        handlePatchChange(decodedPatch)
      }
    })

    return () => {
      midiInput?.removeListener('sysex')
    }
  }, [handlePatchChange, logSysEx, midiInput, setPatch])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const minWidth = 434
        const width = containerRef.current.clientWidth - 300

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
    <Stack align='center' w='auto' mx='auto' gap={0}>
      <FileUpload onDrop={handleDrop} />
      <Paper p={0} px={10} w='100%' mx='auto' maw={1900}>
        <Flex justify='space-between' w='100%' mx='auto' wrap='wrap' ref={containerRef}>
          <Stack gap={0} mr={10} w={250} pt={5}>
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
            <Button
              color='#e6e3e1'
              c='dark'
              mt={10}
              onClick={() => {
                op1Ref.current?.setScaleControlsOpen(!scaleControlsOpen)
                op2Ref.current?.setScaleControlsOpen(!scaleControlsOpen)
                op3Ref.current?.setScaleControlsOpen(!scaleControlsOpen)
                op4Ref.current?.setScaleControlsOpen(!scaleControlsOpen)
                setScaleControlsOpen(!scaleControlsOpen)
              }}
            >
              Toggle all scale controls
            </Button>
            <Button
              color='#e6e3e1'
              c='dark'
              mt={10}
              onClick={() => {
                op1Ref.current?.setADSRControlsOpen(!ADSRControlsOpen)
                op2Ref.current?.setADSRControlsOpen(!ADSRControlsOpen)
                op3Ref.current?.setADSRControlsOpen(!ADSRControlsOpen)
                op4Ref.current?.setADSRControlsOpen(!ADSRControlsOpen)
                setADSRControlsOpen(!ADSRControlsOpen)
              }}
            >
              Toggle all ADSR controls
            </Button>
            <Flex align='end' justify='space-between' gap={10}>
              <PatchNameEditor onChange={updatePatchName} ref={patchNameRef} />
              <DownloadPatchButton />
            </Flex>
          </Stack>

          <ADSREnvelope
            width={adsrEnvelopeWidth}
            height={150}
            onChange={updatePitchEnvelope}
            pitchEnv
            initialState={patch.Pitch}
            ref={pitchAdsrRef}
          />
        </Flex>
      </Paper>
      <Divider w='100%' />
      <Flex w='auto' mx='auto' wrap='wrap' maw={1914} mt={18}>
        <Box mx='auto' mb={15}>
          <Divider />
          <Flex>
            <Divider orientation='vertical' />
            <Operator id={1} updateValues={updateValues} ref={op1Ref} />
            <Divider orientation='vertical' />
          </Flex>
          <Divider />
        </Box>
        <Box mx='auto' mb={15}>
          <Divider />
          <Flex>
            <Divider orientation='vertical' />
            <Operator id={2} updateValues={updateValues} ref={op2Ref} />
            <Divider orientation='vertical' />
          </Flex>
          <Divider />
        </Box>
        <Box mx='auto' mb={15}>
          <Divider />
          <Flex>
            <Divider orientation='vertical' />
            <Operator id={3} updateValues={updateValues} ref={op3Ref} />
            <Divider orientation='vertical' />
          </Flex>
          <Divider />
        </Box>
        <Box mx='auto' mb={15}>
          <Divider />
          <Flex>
            <Divider orientation='vertical' />
            <Operator id={4} updateValues={updateValues} ref={op4Ref} />
            <Divider orientation='vertical' />
          </Flex>
          <Divider />
        </Box>
      </Flex>
    </Stack>
  )
}
