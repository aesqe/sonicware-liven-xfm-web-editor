import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useAtomValue } from 'jotai'
import { ActionIcon, Divider, Flex, InputLabel, Stack, Switch, Text } from '@mantine/core'
import { IconDice5, IconReload } from '@tabler/icons-react'

import { Knob } from '../Knob/Knob'
import { patchAtom } from '../../store/atoms'
import { ADSREnvelope } from '../ADSREnvelope/ADSREnvelope'
import { randomizeOperator } from './services/randomize-operator/randomize-operator'
import { roundToNearestStep } from '../../services/round-to-nearest-step/round-to-nearest-step'
import { OperatorScaleControls } from './components/OperatorScaleControls/OperatorScaleControls'
import { ADSRValues, KnobRefType, OperatorProps, PitchAdsrRef, UpdatedProperty } from '../../types'
import initpatch from '../../assets/presets/initpatch.json'

type Props = {
  id: number
  updateValues: (props: UpdatedProperty[]) => void
  ref?: RefObject<{
    setInternalValue: (values: OperatorProps) => void
    setScaleControlsOpen: (open: boolean) => void
    setADSRControlsOpen: (open: boolean) => void
  } | null>
}

const isFreeRatio = (ratio: number) => ratio % 100 > 0 && ratio !== 50

const backgrounds = ['#f5ecec', '#ecf2f5', '#f4f0e3', '#ecf5ee']

export const Operator = ({ id: numId, updateValues, ref }: Props) => {
  const patch = useAtomValue(patchAtom)

  const opId = `OP${numId}` as 'OP1' | 'OP2' | 'OP3' | 'OP4'
  const values = patch[opId]

  const [freeRatio, setFreeRatio] = useState(isFreeRatio(values.Ratio))
  const [fixed, setFixed] = useState(values.Fixed === 1)
  const [scaleControlsOpen, setScaleControlsOpen] = useState(false)
  const [ADSRControlsOpen, setADSRControlsOpen] = useState(true)
  const levelRef = useRef<KnobRefType>(null)
  const outputRef = useRef<KnobRefType>(null)
  const velSensRef = useRef<KnobRefType>(null)
  const ratioRef = useRef<KnobRefType>(null)
  const freqRef = useRef<KnobRefType>(null)
  const detuneRef = useRef<KnobRefType>(null)
  const feedbackRef = useRef<KnobRefType>(null)

  const scaleControlsRef = useRef<{ setInternalValue: (vals: OperatorProps) => void } | null>(null)
  const op1InRef = useRef<KnobRefType>(null)
  const op2InRef = useRef<KnobRefType>(null)
  const op3InRef = useRef<KnobRefType>(null)
  const op4InRef = useRef<KnobRefType>(null)
  const pitchEnvRef = useRef<HTMLInputElement | null>(null)
  const ratioSwitchRef = useRef<HTMLInputElement | null>(null)
  const fixedSwitchRef = useRef<HTMLInputElement | null>(null)
  const adsrRef = useRef<PitchAdsrRef>(null)

  const opInRefs = [
    { id: 1, ref: op1InRef },
    { id: 2, ref: op2InRef },
    { id: 3, ref: op3InRef },
    { id: 4, ref: op4InRef }
  ].filter(({ id }) => id !== numId)

  const setValues = useCallback(
    (values: OperatorProps) => {
      levelRef.current?.setValueRaw(values.Level)
      outputRef.current?.setValueRaw(values.Output)
      velSensRef.current?.setValueRaw(values.VelSens)
      ratioRef.current?.setValueRaw(values.Ratio)
      freqRef.current?.setValueRaw(values.Freq)
      detuneRef.current?.setValueRaw(values.Detune)
      feedbackRef.current?.setValueRaw(values.Feedback)

      scaleControlsRef.current?.setInternalValue(values)
      pitchEnvRef.current!.checked = values.PitchEnv === 1
      ratioSwitchRef.current!.checked = values.Fixed === 0
      fixedSwitchRef.current!.checked = values.Fixed === 1

      adsrRef.current?.setInternalValue(values)

      opInRefs.forEach(({ id, ref }) => {
        const prop = `OP${id}In` as keyof OperatorProps
        const value = values[prop] as number
        ref.current?.setValueRaw(value)
      })

      setFreeRatio(isFreeRatio(values.Ratio))
      setFixed(values.Fixed === 1)
    },
    [opInRefs]
  )

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue: setValues,
        setScaleControlsOpen,
        setADSRControlsOpen
      }
    }
  }, [ref, setValues])

  const ratioFormatter = (val: number) =>
    freeRatio ? Math.round(val) : roundToNearestStep(val, val < 75 ? 50 : 100)

  const updateEnvelope = (values: ADSRValues) => {
    const update = [
      { value: values.ATime, propertyPath: `${opId}.ATime` },
      { value: values.ALevel, propertyPath: `${opId}.ALevel` },
      { value: values.DTime, propertyPath: `${opId}.DTime` },
      { value: values.DLevel, propertyPath: `${opId}.DLevel` },
      { value: values.STime, propertyPath: `${opId}.STime` },
      { value: values.SLevel, propertyPath: `${opId}.SLevel` },
      { value: values.RTime, propertyPath: `${opId}.RTime` },
      { value: values.RLevel, propertyPath: `${opId}.RLevel` }
    ]

    if (values.UpCurve !== undefined && values.DnCurve !== undefined) {
      update.push({ value: values.UpCurve, propertyPath: `${opId}.UpCurve` })
      update.push({ value: values.DnCurve, propertyPath: `${opId}.DnCurve` })
    }

    updateValues(update)
  }

  return (
    <Flex gap={0} align='start' w='100%'>
      <Flex h='100%' w={60}>
        <Stack
          align='center'
          justify='center'
          h='100%'
          gap={10}
          pb={10}
          bg={backgrounds[numId - 1]}
          w={60}
        >
          <Text
            size='xl'
            fw='bold'
            p={10}
            ta='center'
            component='div'
            style={{ whiteSpace: 'nowrap' }}
          >
            OP{numId}
          </Text>
          <Switch
            onChange={(e) => {
              updateValues([{ value: e.target.checked ? 1 : 0, propertyPath: `${opId}.PitchEnv` }])
            }}
            checked={values.PitchEnv === 1}
            ref={pitchEnvRef}
          />
          <InputLabel fw='normal' mt={-10} fz='xs'>
            Pitch EG
          </InputLabel>
          <ActionIcon
            mt='auto'
            size='xl'
            title='Initialize'
            variant='transparent'
            onClick={() => {
              setValues(initpatch[opId] as OperatorProps)
            }}
          >
            <IconReload size={48} color='#999' />
          </ActionIcon>
          <ActionIcon
            size='xl'
            title='Randomize'
            variant='transparent'
            onClick={() => {
              const random = randomizeOperator(opId)
              setValues({ ...values, ...(random.values as OperatorProps) })
              updateValues(random.updatedValues)
            }}
          >
            <IconDice5 size={48} color='#999' />
          </ActionIcon>
        </Stack>
        <Divider orientation='vertical' color='#FFFFFF' w={5} />
      </Flex>
      <Flex w='100%' wrap='wrap'>
        <Stack gap={10} p={10} bg='#F5F5F5' w={400} h='100%'>
          <Flex align='start' justify='start' gap={12}>
            <Knob
              label='Level'
              propertyPath={`${opId}.Level`}
              onChange={updateValues}
              valueMin={0}
              valueMax={127}
              valueDefault={values.Level}
              formatterFn={Math.round}
              valueRawDisplayFn={(val) => `${Math.round(val)}`}
              ref={levelRef}
            />
            <Knob
              label='Output'
              propertyPath={`${opId}.Output`}
              onChange={updateValues}
              valueMin={0}
              valueMax={127}
              valueDefault={values.Output}
              formatterFn={Math.round}
              valueRawDisplayFn={(val) => `${Math.round(val)}`}
              ref={outputRef}
            />
            <Flex>
              <Knob
                label='Velocity Sensitivity'
                propertyPath={`${opId}.VelSens`}
                onChange={updateValues}
                valueMin={0}
                valueMax={127}
                valueDefault={values.VelSens}
                formatterFn={Math.round}
                valueRawDisplayFn={(val) => `${Math.round(val)}`}
                ref={velSensRef}
              />
            </Flex>
            <Stack align='center' gap={10}>
              <Knob
                label='Ratio'
                propertyPath={`${opId}.Ratio`}
                onChange={updateValues}
                valueMin={50}
                valueMax={3200}
                valueDefault={values.Ratio}
                center={1600}
                formatterFn={ratioFormatter}
                valueRawDisplayFn={(val) => `${ratioFormatter(val) / 100}`}
                disabled={fixed}
                ref={ratioRef}
              />
              <Switch
                ref={ratioSwitchRef}
                checked={freeRatio}
                onChange={(e) => setFreeRatio(e.target.checked)}
                disabled={fixed}
              />
              <InputLabel fw='normal' mt={-10} fz='xs'>
                Free
              </InputLabel>
            </Stack>
            <Stack align='center' gap={10}>
              <Knob
                label='Frequency'
                propertyPath={`${opId}.Freq`}
                onChange={updateValues}
                valueMin={1}
                valueMax={97550}
                valueDefault={values.Freq}
                formatterFn={Math.round}
                valueRawDisplayFn={(val) => `${Math.round(val / 10)}`}
                disabled={!fixed}
                ref={freqRef}
              />
              <Switch
                onChange={(e) => {
                  setFixed(e.target.checked)
                  updateValues([{ value: e.target.checked ? 1 : 0, propertyPath: `${opId}.Fixed` }])
                }}
                checked={fixed}
                ref={fixedSwitchRef}
              />
              <InputLabel fw='normal' mt={-10} fz='xs'>
                Fixed
              </InputLabel>
            </Stack>
            <Knob
              label='Detune'
              propertyPath={`${opId}.Detune`}
              onChange={updateValues}
              valueMin={-63}
              valueMax={63}
              valueDefault={values.Detune}
              formatterFn={Math.round}
              valueRawDisplayFn={(val) => `${Math.round(val)}`}
              ref={detuneRef}
            />
          </Flex>
          <Divider />
          <Flex align='start' justify='start' gap={12}>
            <Knob
              label='Feedback'
              propertyPath={`${opId}.Feedback`}
              onChange={updateValues}
              valueMin={-630}
              valueMax={640}
              valueDefault={values.Feedback}
              center={0}
              formatterFn={Math.round}
              valueRawDisplayFn={(val) => `${Math.round(val / 10)}`}
              ref={feedbackRef}
            />
            {opInRefs.map(({ id, ref }) => (
              <Knob
                key={`${opId}.OP${id}In`}
                label={`OP${id} In`}
                propertyPath={`${opId}.OP${id}In`}
                onChange={updateValues}
                valueMin={0}
                valueMax={127}
                valueDefault={0}
                formatterFn={Math.round}
                valueRawDisplayFn={(val) => `${Math.round(val)}`}
                ref={ref}
              />
            ))}
          </Flex>
          <Divider />
          <OperatorScaleControls
            opId={numId}
            updateValues={updateValues}
            values={values}
            ref={scaleControlsRef}
            open={scaleControlsOpen}
            toggleScaleControls={() => setScaleControlsOpen(!scaleControlsOpen)}
          />
        </Stack>

        <Divider orientation='vertical' />

        {ADSRControlsOpen && (
          <ADSREnvelope
            initialState={values}
            width={450}
            height={140}
            onChange={updateEnvelope}
            ref={adsrRef}
            knobSize='2rem'
          />
        )}
      </Flex>
    </Flex>
  )
}
