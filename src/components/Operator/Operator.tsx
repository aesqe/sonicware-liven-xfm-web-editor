import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSetAtom } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import {
  ActionIcon,
  Divider,
  Flex,
  InputLabel,
  Stack,
  Switch,
  Text,
  Radio,
  useMantineColorScheme,
  Box
} from '@mantine/core'
import { clamp, useDebouncedCallback, useViewportSize } from '@mantine/hooks'
import { IconDice5, IconCopy, IconReload, IconClipboardText } from '@tabler/icons-react'

import {
  RatioRef,
  RatioMode,
  ADSRValues,
  OperatorRef,
  KnobRefType,
  OperatorValues,
  ADSREnvelopeRef,
  UpdatedProperty,
  ScaleControlsRef
} from '../../types'
import {
  patchAtom,
  globalRefsAtom,
  operatorClipboardAtom,
  randomizationOptionsAtom
} from '../../store/atoms'
import { Knob } from '../Knob/Knob'
import { RatioKnob } from '../Knob/RatioKnob'
import { isFreeRatio } from './services/is-free-ratio/is-free-ratio'
import { ADSREnvelope } from '../ADSREnvelope/ADSREnvelope'
import { getOperatorValues } from './services/get-operator-values/get-operator-values'
import { OperatorScaleControls } from './components/OperatorScaleControls/OperatorScaleControls'
import { getInitialOperatorValues } from './services/get-initial-operator-values/get-initial-operator-values'
import { getUpdatedEnvelopeValues } from './services/get-updated-envelope-values/get-updated-envelope-values'
import { getRandomizedOperatorValues } from './services/get-randomized-operator-values/get-randomized-operator-values'
import { backgroundsLight, backgroundsDark, iconsLight, iconsDark } from './constants'

type Props = {
  id: 1 | 2 | 3 | 4
  onChange: (props: UpdatedProperty[]) => void
}

export const Operator = ({ id: numId, onChange }: Props) => {
  const viewport = useViewportSize()

  const setGlobalRefs = useSetAtom(globalRefsAtom)

  const [scaleControlsOpen, setScaleControlsOpen] = useState(false)
  const [ADSRControlsOpen, setADSRControlsOpen] = useState(true)
  const [adsrEnvelopeWidth, setADSREnvelopeWidth] = useState(600)
  const [ratioMode, setRatioMode] = useState<RatioMode>('default')
  const [pitchEnvChecked, setPitchEnvChecked] = useState(false)
  const [fixed, setFixed] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const levelRef = useRef<KnobRefType>(null)
  const outputRef = useRef<KnobRefType>(null)
  const velSensRef = useRef<KnobRefType>(null)
  const ratioRef = useRef<RatioRef>(null)
  const freqRef = useRef<KnobRefType>(null)
  const detuneRef = useRef<KnobRefType>(null)
  const feedbackRef = useRef<KnobRefType>(null)
  const op1InRef = useRef<KnobRefType>(null)
  const op2InRef = useRef<KnobRefType>(null)
  const op3InRef = useRef<KnobRefType>(null)
  const op4InRef = useRef<KnobRefType>(null)
  const pitchEnvRef = useRef<HTMLInputElement | null>(null)
  const fixedSwitchRef = useRef<HTMLInputElement | null>(null)
  const scaleControlsRef = useRef<ScaleControlsRef>(undefined)
  const adsrRef = useRef<ADSREnvelopeRef>(undefined)

  const opRef = useRef<OperatorRef>(undefined)
  const initialOperatorValues = useMemo(() => getInitialOperatorValues(numId), [numId])

  const { colorScheme } = useMantineColorScheme()

  const refName = `op${numId}Ref`
  const opId = `OP${numId}` as const

  const backgrounds = useMemo(
    () => (colorScheme === 'light' ? backgroundsLight : backgroundsDark),
    [colorScheme]
  )

  const opInRefs = [
    { id: 1, ref: op1InRef },
    { id: 2, ref: op2InRef },
    { id: 3, ref: op3InRef },
    { id: 4, ref: op4InRef }
  ].filter(({ id }) => id !== numId)

  const setValues = useCallback(
    (data: OperatorValues) => {
      ratioRef.current?.resetPrevRatioMode()
      levelRef.current?.setInternalValue(data.Level)
      outputRef.current?.setInternalValue(data.Output)
      velSensRef.current?.setInternalValue(data.VelSens)
      ratioRef.current?.setInternalValue(data.Ratio)
      freqRef.current?.setInternalValue(data.Freq)
      detuneRef.current?.setInternalValue(data.Detune)
      feedbackRef.current?.setInternalValue(data.Feedback)
      scaleControlsRef.current?.setInternalValue(data)
      fixedSwitchRef.current!.checked = data.Fixed === 1
      adsrRef.current?.setInternalValue(data, true)

      if (pitchEnvRef.current) {
        pitchEnvRef.current.checked = data.PitchEnv === 1
      }

      opInRefs.forEach(({ id, ref }) => {
        const prop = `OP${id}In` as keyof OperatorValues
        const value = data[prop] as number
        ref.current?.setInternalValue(value)
      })

      setFixed(data.Fixed === 1)
      setRatioMode(isFreeRatio(data.Ratio) ? 'free' : 'default')
    },
    [opInRefs]
  )

  const updateEnvelope = (data: ADSRValues) => {
    onChange(getUpdatedEnvelopeValues(opId, data))
  }

  const initializeOperator = () => {
    const { values, updatedValues } = initialOperatorValues
    const envelopeValues = getUpdatedEnvelopeValues(opId, values)

    setValues(values)
    setRatioMode('default')
    onChange([...updatedValues, ...envelopeValues])
  }

  const randomizeOperator = useAtomCallback(
    useCallback(
      (get, _set, randomAdsr = false) => {
        const patch = get(patchAtom)
        const randomizationOptions = get(randomizationOptionsAtom)

        const operatorValues = patch[opId]
        const { values, adsrValues, updatedValues } = getRandomizedOperatorValues(
          numId,
          randomAdsr,
          randomizationOptions,
          operatorValues
        )
        const envelopeValues = randomAdsr ? getUpdatedEnvelopeValues(opId, adsrValues) : []

        setValues({
          ...operatorValues,
          ...values,
          ...(randomAdsr ? adsrValues : {})
        })

        onChange([...updatedValues, ...envelopeValues])
      },
      [numId, onChange, opId, setValues]
    )
  )

  const handleCopy = useAtomCallback(
    useCallback(
      (get, set) => {
        const patch = get(patchAtom)
        const operatorValues = patch[opId]

        set(operatorClipboardAtom, {
          ...operatorValues,
          [`${opId}In`]: 0
        })
      },
      [opId]
    )
  )

  const handlePaste = useAtomCallback(
    useCallback(
      (get) => {
        const operatorClipboard = get(operatorClipboardAtom)

        if (operatorClipboard) {
          const fromClipboard = getOperatorValues(numId, operatorClipboard)
          setValues(operatorClipboard)
          onChange(fromClipboard)
        }
      },
      [numId, onChange, setValues]
    )
  )

  const handlePitchEnvChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange([
        {
          value: e.target.checked ? 1 : 0,
          propertyPath: `${opId}.PitchEnv`
        }
      ])
      setPitchEnvChecked(e.target.checked)
    },
    [onChange, opId]
  )

  useEffect(() => {
    opRef.current = {
      setScaleControlsOpen,
      setADSRControlsOpen,
      setInternalValue: setValues,
      refs: {
        levelRef,
        outputRef,
        velSensRef,
        ratioRef,
        freqRef,
        detuneRef,
        feedbackRef,
        op1InRef,
        op2InRef,
        op3InRef,
        op4InRef,
        pitchEnvRef,
        fixedSwitchRef,
        ...adsrRef.current!.refs,
        ...scaleControlsRef.current!.refs
      }
    }
  }, [setValues])

  useEffect(() => {
    setGlobalRefs((prev) => ({
      ...prev,
      [refName]: opRef
    }))
  }, [setGlobalRefs, refName])

  const handleResize = useDebouncedCallback(() => {
    if (containerRef.current) {
      const minWidth = 385
      const maxWidth = viewport.width >= 970 ? 450 : minWidth
      const width = clamp(containerRef.current.clientWidth, minWidth, maxWidth)

      setADSREnvelopeWidth(width)
    }
  }, 250)

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [handleResize])

  const iconsColor = colorScheme === 'light' ? iconsLight : iconsDark
  const operatorBorderColor = colorScheme === 'light' ? '#e6e3e1' : '#6f6a68'

  return (
    <Box mx='auto' bd={`1px solid ${operatorBorderColor}`} style={{ borderRadius: 2 }}>
      <Flex>
        <Flex gap={0} align='start' w='100%'>
          <Flex h='100%' w={60}>
            <Stack
              align='center'
              justify='start'
              h='100%'
              gap={10}
              pb={10}
              bg={backgrounds[numId - 1]}
              w={58}
            >
              <Text
                size='xl'
                fw='bold'
                p={10}
                mb={-10}
                ta='center'
                component='div'
                style={{ cursor: 'default' }}
              >
                OP{numId}
              </Text>
              <ActionIcon
                title='Initialize'
                size={32}
                variant='transparent'
                onClick={initializeOperator}
              >
                <IconReload size={48} color={iconsColor} opacity={0.4} />
              </ActionIcon>
              <Stack
                align='center'
                gap={15}
                bg={colorScheme === 'light' ? '#F5F5F5' : '#696969'}
                w='100%'
                pt={10}
                pb={5}
                style={{
                  borderTop: `1px solid ${colorScheme === 'light' ? '#DADADA' : '#2f2a28'}`,
                  borderBottom: `1px solid ${colorScheme === 'light' ? '#DADADA' : '#2f2a28'}`
                }}
              >
                <Switch
                  onChange={handlePitchEnvChange}
                  checked={pitchEnvChecked}
                  ref={pitchEnvRef}
                  color={colorScheme === 'light' ? 'blue' : '#868e96'}
                  styles={{
                    thumb: {
                      backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#d9d9d9',
                      borderColor: colorScheme === 'light' ? '#EEEEEE' : '#d9d9d9'
                    }
                  }}
                />
                <InputLabel fw='normal' mt={-10} fz='xs'>
                  Pitch EG
                </InputLabel>
              </Stack>
              <ActionIcon mt={24} title='Copy' size={32} variant='transparent' onClick={handleCopy}>
                <IconCopy size={48} color={iconsColor} opacity={0.4} />
              </ActionIcon>
              <ActionIcon title='Paste' size={32} variant='transparent' onClick={handlePaste}>
                <IconClipboardText size={48} color={iconsColor} opacity={0.4} />
              </ActionIcon>
              <ActionIcon
                title='Randomize'
                size={32}
                variant='transparent'
                onClick={() => randomizeOperator(false)}
              >
                <IconDice5 size={48} color={iconsColor} opacity={0.4} />
              </ActionIcon>
            </Stack>
            <Divider orientation='vertical' />
          </Flex>
          <Flex
            w='auto'
            ref={containerRef}
            style={{ flexFlow: viewport.width > 960 ? 'row wrap' : 'column wrap' }}
          >
            <Stack
              gap={10}
              p={10}
              w={400}
              h='100%'
              bg={colorScheme === 'light' ? '#F5F5F5' : '#474540'}
            >
              <Flex align='start' justify='start' gap={12}>
                <Knob
                  label='Level'
                  propertyPath={`${opId}.Level`}
                  onChange={onChange}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={initialOperatorValues.values.Level}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={levelRef}
                  refName='levelRef'
                />
                <Knob
                  label='Output'
                  propertyPath={`${opId}.Output`}
                  onChange={onChange}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={initialOperatorValues.values.Output}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={outputRef}
                  refName='outputRef'
                />
                <Knob
                  label='Velocity Sensitivity'
                  propertyPath={`${opId}.VelSens`}
                  onChange={onChange}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={initialOperatorValues.values.VelSens}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={velSensRef}
                  refName='velSensRef'
                />
                <RatioKnob
                  propertyPath={`${opId}.Ratio`}
                  fixed={fixed}
                  ratioRef={ratioRef}
                  ratioMode={ratioMode}
                  value={initialOperatorValues.values.Ratio}
                  onChange={onChange}
                />
                <Stack align='center' gap={10}>
                  <Knob
                    label='Frequency'
                    propertyPath={`${opId}.Freq`}
                    onChange={onChange}
                    valueMin={1}
                    valueMax={97550}
                    valueDefault={initialOperatorValues.values.Freq}
                    formatterFn={Math.round}
                    valueRawDisplayFn={(val) => `${(Math.round(val) / 10).toFixed(1)}`}
                    disabled={!fixed}
                    ref={freqRef}
                    refName='freqRef'
                  />
                  <Switch
                    onChange={(e) => {
                      setFixed(e.target.checked)
                      onChange([{ value: e.target.checked ? 1 : 0, propertyPath: `${opId}.Fixed` }])
                    }}
                    checked={fixed}
                    ref={fixedSwitchRef}
                    color={colorScheme === 'light' ? 'blue' : '#868e96'}
                    styles={{
                      thumb: {
                        backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#d9d9d9',
                        borderColor: colorScheme === 'light' ? '#EEEEEE' : '#d9d9d9'
                      }
                    }}
                  />
                  <InputLabel fw='normal' mt={-10} fz='xs'>
                    Fixed
                  </InputLabel>
                </Stack>
                <Knob
                  label='Detune'
                  propertyPath={`${opId}.Detune`}
                  onChange={onChange}
                  valueMin={-63}
                  valueMax={63}
                  valueDefault={initialOperatorValues.values.Detune}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={detuneRef}
                  refName='detuneRef'
                />
              </Flex>
              <Flex mt={-10}>
                <Radio.Group
                  value={ratioMode}
                  defaultValue='default'
                  defaultChecked
                  onChange={(val) => {
                    setRatioMode(val as RatioMode)
                  }}
                >
                  <Flex gap={10} align='center'>
                    <InputLabel fw='bold' fz='xs'>
                      Ratio mode:
                    </InputLabel>
                    <Radio
                      styles={{ label: { paddingInlineStart: 5 } }}
                      size='xs'
                      value='default'
                      label='Default'
                      checked={ratioMode === 'default'}
                    />
                    <Radio
                      size='xs'
                      styles={{ label: { paddingInlineStart: 5 } }}
                      value='free'
                      label='Free '
                      checked={ratioMode === 'free'}
                    />
                    <Radio
                      size='xs'
                      styles={{ label: { paddingInlineStart: 5 } }}
                      value='scale'
                      label='Scale '
                      checked={ratioMode === 'scale'}
                    />
                  </Flex>
                </Radio.Group>
              </Flex>
              <Divider />
              <Flex align='start' justify='start' gap={12}>
                <Knob
                  label='Feedback'
                  propertyPath={`${opId}.Feedback`}
                  onChange={onChange}
                  valueMin={-640}
                  valueMax={640}
                  stepFn={() => 1}
                  stepLargerFn={() => 10}
                  valueDefault={initialOperatorValues.values.Feedback}
                  center={0}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${(Math.round(val) / 10).toFixed(1)}`}
                  ref={feedbackRef}
                  refName='feedbackRef'
                />
                {opInRefs.map(({ id, ref }) => (
                  <Knob
                    key={`${opId}.OP${id}In`}
                    label={`OP${id} In`}
                    propertyPath={`${opId}.OP${id}In`}
                    onChange={onChange}
                    valueMin={0}
                    valueMax={127}
                    valueDefault={0}
                    formatterFn={Math.round}
                    valueRawDisplayFn={(val) => `${Math.round(val)}`}
                    ref={ref}
                    refName={`op${id}InRef`}
                  />
                ))}
              </Flex>

              <OperatorScaleControls
                numId={numId}
                onChange={onChange}
                values={initialOperatorValues.values}
                ref={scaleControlsRef}
                open={scaleControlsOpen}
                toggleScaleControls={() => setScaleControlsOpen(!scaleControlsOpen)}
              />
            </Stack>

            <Divider orientation='vertical' />

            {ADSRControlsOpen && (
              <ADSREnvelope
                initialState={initialOperatorValues.values}
                width={adsrEnvelopeWidth}
                height={165}
                onChange={updateEnvelope}
                ref={adsrRef}
                knobSize={viewport.width >= 970 ? '2.2rem' : '1.8rem'}
                pathBase={`${opId}.`}
              />
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
