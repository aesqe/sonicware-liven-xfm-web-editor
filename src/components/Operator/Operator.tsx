import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { ActionIcon, Divider, Flex, InputLabel, Stack, Switch, Text } from '@mantine/core'
import { clamp, useViewportSize } from '@mantine/hooks'
import { IconDice5, IconCopy, IconReload, IconClipboardText } from '@tabler/icons-react'

import {
  ADSRValues,
  KnobRefType,
  OperatorProps,
  SetInternalValueRef,
  UpdatedProperty,
  OperatorRef
} from '../../types'
import { Knob } from '../Knob/Knob'
import { backgrounds } from './constants'
import { isFreeRatio } from './services/is-free-ratio/is-free-ratio'
import { ADSREnvelope } from '../ADSREnvelope/ADSREnvelope'
import { ratioFormatter } from './services/ratio-formatter/ratio-formatter'
import { getOperatorValues } from './services/get-operator-values/get-operator-values'
import { OperatorScaleControls } from './components/OperatorScaleControls/OperatorScaleControls'
import { getInitialOperatorValues } from './services/get-initial-operator-values/get-initial-operator-values'
import { getUpdatedEnvelopeValues } from './services/get-updated-envelope-values/get-updated-envelope-values'
import { getRandomizedOperatorValues } from './services/get-randomized-operator-values/get-randomized-operator-values'
import { operatorClipboardAtom, patchAtom, randomizationOptionsAtom } from '../../store/atoms'

type Props = {
  id: 1 | 2 | 3 | 4
  updateValues: (props: UpdatedProperty[]) => void
  ref?: RefObject<OperatorRef | undefined>
}

export const Operator = ({ id: numId, updateValues, ref }: Props) => {
  const patch = useAtomValue(patchAtom)
  const randomizationOptions = useAtomValue(randomizationOptionsAtom)

  const opId = `OP${numId}` as 'OP1' | 'OP2' | 'OP3' | 'OP4'
  const values = patch[opId]

  const [freeRatio, setFreeRatio] = useState(isFreeRatio(values.Ratio))
  const [fixed, setFixed] = useState(values.Fixed === 1)
  const [scaleControlsOpen, setScaleControlsOpen] = useState(false)
  const [ADSRControlsOpen, setADSRControlsOpen] = useState(true)
  const [adsrEnvelopeWidth, setADSREnvelopeWidth] = useState(600)
  const [containerWidth, setContainerWidth] = useState(0)
  const levelRef = useRef<KnobRefType>(null)
  const outputRef = useRef<KnobRefType>(null)
  const velSensRef = useRef<KnobRefType>(null)
  const ratioRef = useRef<KnobRefType>(null)
  const freqRef = useRef<KnobRefType>(null)
  const detuneRef = useRef<KnobRefType>(null)
  const feedbackRef = useRef<KnobRefType>(null)
  const op1InRef = useRef<KnobRefType>(null)
  const op2InRef = useRef<KnobRefType>(null)
  const op3InRef = useRef<KnobRefType>(null)
  const op4InRef = useRef<KnobRefType>(null)
  const pitchEnvRef = useRef<HTMLInputElement | null>(null)
  const ratioSwitchRef = useRef<HTMLInputElement | null>(null)
  const fixedSwitchRef = useRef<HTMLInputElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const adsrRef = useRef<SetInternalValueRef<ADSRValues>>(undefined)
  const scaleControlsRef = useRef<SetInternalValueRef<OperatorProps>>(undefined)
  const [operatorClipboard, setOperatorClipboard] = useAtom(operatorClipboardAtom)
  const viewport = useViewportSize()

  const opInRefs = [
    { id: 1, ref: op1InRef },
    { id: 2, ref: op2InRef },
    { id: 3, ref: op3InRef },
    { id: 4, ref: op4InRef }
  ].filter(({ id }) => id !== numId)

  const setValues = useCallback(
    (values: OperatorProps) => {
      levelRef.current?.setInternalValue(values.Level)
      outputRef.current?.setInternalValue(values.Output)
      velSensRef.current?.setInternalValue(values.VelSens)
      ratioRef.current?.setInternalValue(values.Ratio)
      freqRef.current?.setInternalValue(values.Freq)
      detuneRef.current?.setInternalValue(values.Detune)
      feedbackRef.current?.setInternalValue(values.Feedback)

      scaleControlsRef.current?.setInternalValue(values)
      pitchEnvRef.current!.checked = values.PitchEnv === 1
      ratioSwitchRef.current!.checked = values.Fixed === 0
      fixedSwitchRef.current!.checked = values.Fixed === 1

      adsrRef.current?.setInternalValue(values)

      opInRefs.forEach(({ id, ref }) => {
        const prop = `OP${id}In` as keyof OperatorProps
        const value = values[prop] as number
        ref.current?.setInternalValue(value)
      })

      setFreeRatio(isFreeRatio(values.Ratio))
      setFixed(values.Fixed === 1)
    },
    [opInRefs]
  )

  const updateEnvelope = (values: ADSRValues) => {
    updateValues(getUpdatedEnvelopeValues(numId, values))
  }

  const initializeOperator = () => {
    const init = getInitialOperatorValues(opId)
    setValues(init.values)

    const envelopeValues = getUpdatedEnvelopeValues(numId, init.values)
    updateValues([...init.updatedValues, ...envelopeValues])
  }

  const randomizeOperator = (adsr = false) => {
    const random = getRandomizedOperatorValues(numId, adsr, randomizationOptions, values)
    setValues({ ...values, ...random.values, ...(adsr ? random.adsrValues : {}) })

    const envelopeValues = adsr ? getUpdatedEnvelopeValues(numId, random.adsrValues) : []
    updateValues([...random.updatedValues, ...envelopeValues])
  }

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue: setValues,
        setScaleControlsOpen,
        setADSRControlsOpen
      }
    }
  }, [ref, setValues])

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth
        const minWidth = 385
        const maxWidth = clientWidth > 800 ? 450 : 385
        const width = clamp(clientWidth, minWidth, maxWidth)

        setContainerWidth(clientWidth)
        setADSREnvelopeWidth(width)
      }
    }

    window.addEventListener('resize', handleResize)

    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <Flex gap={0} align='start' w='100%'>
      <Flex h='100%' w={62}>
        <Stack
          align='center'
          justify='start'
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
            <IconReload size={48} color='#00000044' />
          </ActionIcon>
          <Stack
            align='center'
            gap={15}
            bg='#F5F5F5'
            w='100%'
            pt={10}
            pb={5}
            style={{
              borderTop: '1px solid #DADADA',
              borderBottom: '1px solid #DADADA'
            }}
          >
            <Switch
              onChange={(e) => {
                updateValues([
                  {
                    value: e.target.checked ? 1 : 0,
                    propertyPath: `${opId}.PitchEnv`
                  }
                ])
              }}
              checked={values.PitchEnv === 1}
              ref={pitchEnvRef}
            />
            <InputLabel fw='normal' mt={-10} fz='xs'>
              Pitch EG
            </InputLabel>
          </Stack>
          <ActionIcon
            mt={24}
            title='Copy'
            size={32}
            variant='transparent'
            onClick={() => {
              setOperatorClipboard(values)
            }}
          >
            <IconCopy size={48} color='#00000044' />
          </ActionIcon>
          <ActionIcon
            title='Paste'
            size={32}
            variant='transparent'
            onClick={() => {
              if (operatorClipboard) {
                const fromClipboard = getOperatorValues(opId, operatorClipboard)
                setValues(fromClipboard.values)
                updateValues(fromClipboard.updatedValues)
              }
            }}
          >
            <IconClipboardText size={48} color='#00000044' />
          </ActionIcon>
          <ActionIcon
            title='Randomize'
            size={32}
            variant='transparent'
            onClick={() => randomizeOperator(false)}
          >
            <IconDice5 size={48} color='#00000044' />
          </ActionIcon>
        </Stack>
        <Divider orientation='vertical' />
      </Flex>
      <Flex
        w='auto'
        ref={containerRef}
        style={{ flexFlow: viewport.width > 960 ? 'row wrap' : 'column wrap' }}
      >
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
                formatterFn={(val) => ratioFormatter(val, freeRatio)}
                valueRawDisplayFn={(val) => `${ratioFormatter(val, freeRatio) / 100}`}
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
              stepFn={() => 10}
              stepLargerFn={() => 100}
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
            width={adsrEnvelopeWidth}
            containerWidth={containerWidth}
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
