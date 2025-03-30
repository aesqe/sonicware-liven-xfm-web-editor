import { useCallback, useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { MessageEvent } from 'webmidi'
import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Fieldset,
  Flex,
  Modal,
  Paper,
  Stack,
  Switch,
  Text,
  Title
} from '@mantine/core'
import { useThrottledCallback, useViewportSize } from '@mantine/hooks'
import { IconTerminal2 } from '@tabler/icons-react'

import {
  midiInputAtom,
  patchAtom,
  sysexSendThrottleTimeAtom,
  logSysExAtom,
  randomizationOptionsAtom
} from './store/atoms'
import initPatch from './assets/presets/initpatch.json'
import { Knob } from './components/Knob/Knob'
import { Operator } from './components/Operator/Operator'
import { convert78 } from './services/convert78/convert78'
import { decode8bit } from './services/decode8bit/decode8bit'
import { FileUpload } from './components/FileUpload/FileUpload'
import { useWebMidi } from './services/use-web-midi/use-web-midi'
import { defaultADSR } from './constants'
import { ADSREnvelope } from './components/ADSREnvelope/ADSREnvelope'
import { compareObjects } from './services/compare-objects/compare-objects'
import { getRandomPatch } from './services/get-random-patch/get-random-patch'
import { PatchNameEditor } from './components/PatchNameEditor/PatchNameEditor'
import { useSendPatchToXFM } from './services/use-send-patch-to-xfm/use-send-patch-to-xfm'
import { DownloadPatchButton } from './components/DownloadPatchButton/DownloadPatchButton'
import { MidiDevicesSelection } from './components/MidiDevicesSelection/MidiDevicesSelection'
import { updateObjectValueByPath } from './services/update-object-value-by-path/update-object-value-by-path'
import { extractPatchesFromSyxBank } from './extract-patches-from-syx-bank/extract-patches-from-syx-bank'
import {
  OperatorRef,
  UpdatedProperty,
  XFMPatch,
  ADSRValues,
  SetInternalValueRef,
  Banks
} from './types'

export const App = () => {
  useWebMidi()

  const viewport = useViewportSize()
  const sendPatchToXFM = useSendPatchToXFM()
  const [patch, setPatch] = useAtom(patchAtom)
  const midiInput = useAtomValue(midiInputAtom)
  const [randomizationOptions, setRandOptions] = useAtom(randomizationOptionsAtom)
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
  const prevPatchRef = useRef<XFMPatch>(patch)
  const [modalOpened, setModalOpened] = useState(false)
  const [bankData, setBankData] = useState<Banks>({})
  const setRandomizationOptions = useThrottledCallback(setRandOptions, sysexSendThrottleTime)

  const updateValues = useThrottledCallback(
    useCallback(
      (props: UpdatedProperty[]) => {
        const updatedPatch = props.reduce(
          (acc, { propertyPath, formatterFn, value }) =>
            updateObjectValueByPath(acc, propertyPath, formatterFn ? formatterFn(value) : value),
          patch
        )

        setPatch(updatedPatch)
      },
      [patch, setPatch]
    ),
    sysexSendThrottleTime
  )

  const throttledSendPatch = useThrottledCallback(() => {
    if (!compareObjects(prevPatchRef.current, patch)) {
      prevPatchRef.current = patch
      console.log('sending patch', patch)
      sendPatchToXFM(patch)
    }
  }, sysexSendThrottleTime)

  useEffect(() => {
    throttledSendPatch()
  }, [patch, throttledSendPatch])

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
    const reader = new FileReader()

    if (file.type === 'application/json') {
      reader.onload = (event) => {
        handlePatchChange(JSON.parse(event.target?.result as string))
      }

      reader.readAsText(file)
    } else if (file.name.endsWith('.syx')) {
      reader.onload = (event) => {
        const res = event.target?.result as ArrayBuffer

        if (res.byteLength > 230) {
          const data = extractPatchesFromSyxBank(res)

          if (Object.keys(data).length === 1 && data.default?.length === 1) {
            handlePatchChange(data.default[0])
          } else {
            setBankData(data)
            setModalOpened(true)
          }
        }
      }

      reader.readAsArrayBuffer(file)
    }
  }

  useEffect(() => {
    midiInput?.addListener('sysex', (e: MessageEvent) => {
      if (e.message.data.length > 20) {
        const decodedPatch = decode8bit(convert78(e.message.data))

        if (logSysEx) {
          console.log('Raw SysEx:', new Uint8Array(e.message.data))
          console.log('Decoded SysEx:', new Uint8Array(convert78(e.message.data)))
          console.log('Patch:', decodedPatch)
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
    <Stack
      align='center'
      w='auto'
      mx='auto'
      gap={0}
      maw={!ADSRControlsOpen ? 960 : viewport.width > 1900 ? 1900 : 960}
    >
      <FileUpload onDrop={handleDrop} />

      <Paper p={0} px={10} mx='auto' w={viewport.width > 970 ? '100%' : '460px'}>
        <Flex w='100%' mx='auto' wrap='wrap' ref={containerRef}>
          <Stack gap={0} mr={10} w={viewport.width > 960 ? 250 : '100%'} pt={5}>
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

            <Flex align='end' justify='space-between' gap={10}>
              <PatchNameEditor onChange={updatePatchName} ref={patchNameRef} />
              <DownloadPatchButton />
            </Flex>
          </Stack>

          {viewport.width > 960 && <Divider orientation='vertical' mr={15} ml={10} />}

          <Stack
            gap={8}
            mb={10}
            mt={8}
            mr={viewport.width > 960 ? 20 : 0}
            w={viewport.width > 960 ? 280 : '100%'}
          >
            <Fieldset legend='Initialize' w='100%' px={5} py={8}>
              <Button.Group w='100%'>
                <Button
                  color='#e6e3e1'
                  size='xs'
                  c='dark'
                  mt={viewport.width > 960 ? 2 : 20}
                  flex={1}
                  style={{ '--button-bd': '1px solid #BABABA' }}
                  onClick={() => {
                    handlePatchChange(initPatch)
                  }}
                >
                  Patch
                </Button>
                <Button
                  color='#e6e3e1'
                  size='xs'
                  c='dark'
                  mt={viewport.width > 960 ? 2 : 20}
                  flex={1}
                  style={{ '--button-bd': '1px solid #BABABA' }}
                  onClick={() => {
                    const { Mixer, Pitch, Name } = patch

                    handlePatchChange({
                      ...initPatch,
                      Mixer,
                      Pitch,
                      Name
                    })
                  }}
                >
                  Operators
                </Button>
                <Button
                  color='#e6e3e1'
                  size='xs'
                  c='dark'
                  mt={viewport.width > 960 ? 2 : 20}
                  flex={1}
                  style={{ '--button-bd': '1px solid #BABABA' }}
                  onClick={() => {
                    const OP1 = { ...patch.OP1, ...defaultADSR }
                    const OP2 = { ...patch.OP2, ...defaultADSR }
                    const OP3 = { ...patch.OP3, ...defaultADSR }
                    const OP4 = { ...patch.OP4, ...defaultADSR }

                    handlePatchChange({
                      ...patch,
                      OP1,
                      OP2,
                      OP3,
                      OP4
                    })
                  }}
                >
                  ADSR
                </Button>
              </Button.Group>
            </Fieldset>
            <Stack align='start' gap={4} w='100%'>
              <Fieldset legend='Toggle' w='100%' px={5} py={8}>
                <Button.Group w='100%'>
                  <Button
                    color='#e6e3e1'
                    size='xs'
                    c='dark'
                    flex={1}
                    style={{ '--button-bd': '1px solid #BABABA' }}
                    onClick={() => {
                      op1Ref.current?.setScaleControlsOpen(!scaleControlsOpen)
                      op2Ref.current?.setScaleControlsOpen(!scaleControlsOpen)
                      op3Ref.current?.setScaleControlsOpen(!scaleControlsOpen)
                      op4Ref.current?.setScaleControlsOpen(!scaleControlsOpen)
                      setScaleControlsOpen(!scaleControlsOpen)
                    }}
                  >
                    Scale controls
                  </Button>
                  <Button
                    color='#e6e3e1'
                    size='xs'
                    c='dark'
                    flex={1}
                    style={{ '--button-bd': '1px solid #BABABA' }}
                    onClick={() => {
                      op1Ref.current?.setADSRControlsOpen(!ADSRControlsOpen)
                      op2Ref.current?.setADSRControlsOpen(!ADSRControlsOpen)
                      op3Ref.current?.setADSRControlsOpen(!ADSRControlsOpen)
                      op4Ref.current?.setADSRControlsOpen(!ADSRControlsOpen)
                      setADSRControlsOpen(!ADSRControlsOpen)
                    }}
                  >
                    ADSR controls
                  </Button>
                </Button.Group>
              </Fieldset>
            </Stack>
          </Stack>

          {viewport.width > 1880 && <Divider orientation='vertical' mr={15} />}

          <Stack
            align='start'
            gap={4}
            mt={8}
            mr={viewport.width > 960 ? 20 : 0}
            w={viewport.width > 960 ? 280 : '100%'}
          >
            <Fieldset legend='Randomize (work in progress)' w='100%' px={5} py={8}>
              <Button.Group w='100%'>
                <Button
                  color='#e6e3e1'
                  size='xs'
                  c='dark'
                  flex={1}
                  style={{ '--button-bd': '1px solid #BABABA' }}
                  onClick={() => {
                    const randomPatch = getRandomPatch({
                      basic: true,
                      sourcePatch: patch,
                      randomizationOptions
                    })

                    handlePatchChange({
                      ...patch,
                      ...randomPatch
                    })
                  }}
                >
                  Basic values
                </Button>
                <Button
                  color='#e6e3e1'
                  size='xs'
                  c='dark'
                  flex={1}
                  style={{ '--button-bd': '1px solid #BABABA' }}
                  onClick={() => {
                    const randomPatch = getRandomPatch({
                      basic: false,
                      randomizationOptions
                    })

                    handlePatchChange({
                      ...patch,
                      ...randomPatch
                    })
                  }}
                >
                  Basic + ADSR
                </Button>
              </Button.Group>
              <Flex align='center' gap={10} mt={8} px={10}>
                <Stack gap={10} align='start'>
                  <Switch
                    label='Free ratio'
                    checked={randomizationOptions.freeRatio}
                    onChange={(e) =>
                      setRandomizationOptions({
                        ...randomizationOptions,
                        freeRatio: e.target.checked
                      })
                    }
                  />
                  <Switch
                    label='Low OP1 In levels'
                    description='Less noise and distortion'
                    checked={randomizationOptions.lowOP1In}
                    onChange={(e) =>
                      setRandomizationOptions({
                        ...randomizationOptions,
                        lowOP1In: e.target.checked
                      })
                    }
                  />
                  <Switch
                    label='Use current values'
                    description='Smaller changes closer to the original values'
                    checked={randomizationOptions.useStartValues}
                    onChange={(e) =>
                      setRandomizationOptions({
                        ...randomizationOptions,
                        useStartValues: e.target.checked
                      })
                    }
                  />
                </Stack>
                <Divider orientation='vertical' ml={4} />
                <Knob
                  label='Amount'
                  valueMin={0}
                  valueMax={100}
                  valueDefault={randomizationOptions.amount}
                  propertyPath='Randomize.Amount'
                  onChange={([{ value }]) =>
                    setRandomizationOptions({ ...randomizationOptions, amount: value })
                  }
                  valueRawDisplayFn={(value) => Math.round(value).toString()}
                  valueRawRoundFn={(value) => Math.round(value)}
                  formatterFn={(value) => Math.round(value)}
                  size='3.2rem'
                />
              </Flex>
            </Fieldset>
          </Stack>

          {viewport.width > 1880 && <Divider orientation='vertical' mr={20} />}

          <ADSREnvelope
            width={viewport.width > 960 ? 550 : adsrEnvelopeWidth}
            height={110}
            onChange={updatePitchEnvelope}
            pitchEnv
            initialState={patch.Pitch}
            ref={pitchAdsrRef}
            mb={-8}
            mx={-8}
          />
        </Flex>
      </Paper>
      <Divider w='100%' />
      <Flex w='auto' mx='auto' wrap='wrap' mt={10}>
        <Box mx='auto' mb={10}>
          <Divider />
          <Flex>
            <Divider orientation='vertical' />
            <Operator id={1} updateValues={updateValues} ref={op1Ref} />
            <Divider orientation='vertical' />
          </Flex>
          <Divider />
        </Box>
        <Box mx='auto' mb={10}>
          <Divider />
          <Flex>
            <Divider orientation='vertical' />
            <Operator id={2} updateValues={updateValues} ref={op2Ref} />
            <Divider orientation='vertical' />
          </Flex>
          <Divider />
        </Box>
        <Box mx='auto' mb={10}>
          <Divider />
          <Flex>
            <Divider orientation='vertical' />
            <Operator id={3} updateValues={updateValues} ref={op3Ref} />
            <Divider orientation='vertical' />
          </Flex>
          <Divider />
        </Box>
        <Box mx='auto' mb={10}>
          <Divider />
          <Flex>
            <Divider orientation='vertical' />
            <Operator id={4} updateValues={updateValues} ref={op4Ref} />
            <Divider orientation='vertical' />
          </Flex>
          <Divider />
        </Box>
      </Flex>

      <Modal
        opened={modalOpened}
        size='lg'
        onClose={() => setModalOpened(false)}
        title={`The file contains ${Object.keys(bankData).length} banks with ${Object.values(bankData).reduce((acc, bank) => acc + bank.length, 0)} patches total`}
      >
        <Stack>
          <Text></Text>
          {Object.keys(bankData).map((bankName) => {
            const patches = bankData[bankName]

            return (
              <Stack key={bankName} justify='space-between' align='start' w='100%' gap={0}>
                <Title order={3}>{bankName}</Title>

                {patches.map((patch) => (
                  <Flex
                    px={10}
                    py={4}
                    key={patch.Name}
                    justify='space-between'
                    align='center'
                    w='100%'
                    style={{ borderBottom: '1px solid #e6e3e1' }}
                  >
                    <Text>{patch.Name}</Text>
                    <Button size='xs' onClick={() => handlePatchChange(patch)}>
                      Load
                    </Button>
                  </Flex>
                ))}
              </Stack>
            )
          })}
        </Stack>
      </Modal>
    </Stack>
  )
}
