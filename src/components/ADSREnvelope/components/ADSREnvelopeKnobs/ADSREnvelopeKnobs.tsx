import { CSSProperties, RefObject, useEffect, useRef } from 'react'
import { Flex, InputLabel, Stack } from '@mantine/core'

import { Knob } from '../../../Knob/Knob'
import { NormalisableRange } from '../../../../services/normalisable-range/normalisable-range'
import { ADSRValues, KnobRefType, UpdatedProperty, ADSREnvelopeRef } from '../../../../types'

type Props = {
  values: ADSRValues
  range: NormalisableRange
  pitchEnv?: boolean
  knobSize?: CSSProperties['width']
  onChange: (values: UpdatedProperty[]) => void
  ref: RefObject<ADSREnvelopeRef | undefined>
  pathBase: string
}

export const ADSREnvelopeKnobs = ({
  ref,
  values,
  range,
  knobSize = '2rem',
  pitchEnv = false,
  pathBase,
  onChange
}: Props) => {
  const aTimeRef = useRef<KnobRefType>(null)
  const aLevelRef = useRef<KnobRefType>(null)
  const dTimeRef = useRef<KnobRefType>(null)
  const dLevelRef = useRef<KnobRefType>(null)
  const sTimeRef = useRef<KnobRefType>(null)
  const sLevelRef = useRef<KnobRefType>(null)
  const rTimeRef = useRef<KnobRefType>(null)
  const rLevelRef = useRef<KnobRefType>(null)
  const upCurveRef = useRef<KnobRefType>(null)
  const dnCurveRef = useRef<KnobRefType>(null)

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue: (vals: ADSRValues) => {
          aTimeRef.current?.setInternalValue(vals.ATime)
          aLevelRef.current?.setInternalValue(vals.ALevel)
          dTimeRef.current?.setInternalValue(vals.DTime)
          dLevelRef.current?.setInternalValue(vals.DLevel)
          sTimeRef.current?.setInternalValue(vals.STime)
          sLevelRef.current?.setInternalValue(vals.SLevel)
          rTimeRef.current?.setInternalValue(vals.RTime)
          rLevelRef.current?.setInternalValue(vals.RLevel)

          if (vals.UpCurve !== undefined && vals.DnCurve !== undefined) {
            upCurveRef.current?.setInternalValue(vals.UpCurve)
            dnCurveRef.current?.setInternalValue(vals.DnCurve)
          }
        },
        refs: {
          aTimeRef,
          aLevelRef,
          dTimeRef,
          dLevelRef,
          sTimeRef,
          sLevelRef,
          rTimeRef,
          rLevelRef,
          upCurveRef,
          dnCurveRef
        }
      }
    }
  }, [ref])

  return (
    <Flex w='100%' gap={10} my={0}>
      <Flex mt={-10}>
        <Stack gap={0} align='center'>
          <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
            Attack
          </InputLabel>
          <Flex gap={10} p={4}>
            <Knob
              label='Time'
              valueDefault={values.ATime}
              propertyPath={`${pathBase}ATime`}
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              valueMin={0}
              valueMax={127}
              onChange={onChange}
              ref={aTimeRef}
              size={knobSize}
              refName='aTimeRef'
            />
            <Knob
              label='Level'
              valueDefault={values.ALevel}
              propertyPath={`${pathBase}ALevel`}
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              valueMin={range.min}
              valueMax={range.max}
              center={range.center}
              onChange={onChange}
              ref={aLevelRef}
              size={knobSize}
              refName='aLevelRef'
            />
          </Flex>
        </Stack>
        <Stack gap={0} align='center'>
          <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
            Decay
          </InputLabel>
          <Flex gap={10} p={4}>
            <Knob
              label='Time'
              valueDefault={values.DTime}
              propertyPath={`${pathBase}DTime`}
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              valueMin={0}
              valueMax={127}
              onChange={onChange}
              ref={dTimeRef}
              size={knobSize}
              refName='dTimeRef'
            />
            <Knob
              label='Level'
              valueDefault={values.DLevel}
              propertyPath={`${pathBase}DLevel`}
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              valueMin={range.min}
              valueMax={range.max}
              center={range.center}
              onChange={onChange}
              ref={dLevelRef}
              size={knobSize}
              refName='dLevelRef'
            />
          </Flex>
        </Stack>
        <Stack gap={0} align='center'>
          <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
            Sustain
          </InputLabel>
          <Flex gap={10} p={4}>
            <Knob
              label='Time'
              valueDefault={values.STime}
              propertyPath={`${pathBase}STime`}
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              valueMin={0}
              valueMax={127}
              onChange={onChange}
              ref={sTimeRef}
              size={knobSize}
              refName='sTimeRef'
            />
            <Knob
              label='Level'
              valueDefault={values.SLevel}
              propertyPath={`${pathBase}SLevel`}
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              valueMin={range.min}
              valueMax={range.max}
              center={range.center}
              onChange={onChange}
              ref={sLevelRef}
              size={knobSize}
              refName='sLevelRef'
            />
          </Flex>
        </Stack>
        <Stack gap={0} align='center'>
          <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
            Release
          </InputLabel>
          <Flex gap={10} p={4}>
            <Knob
              label='Time'
              valueDefault={values.RTime}
              propertyPath={`${pathBase}RTime`}
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              valueMin={0}
              valueMax={127}
              onChange={onChange}
              ref={rTimeRef}
              size={knobSize}
              refName='rTimeRef'
            />
            <Knob
              label='Level'
              valueDefault={values.RLevel}
              propertyPath={`${pathBase}RLevel`}
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              valueMin={range.min}
              valueMax={range.max}
              center={range.center}
              onChange={onChange}
              ref={rLevelRef}
              size={knobSize}
              refName='rLevelRef'
            />
          </Flex>
        </Stack>
        {!pitchEnv && (
          <Stack gap={0} align='center'>
            <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
              Curve
            </InputLabel>
            <Flex gap={10} p={4}>
              <Knob
                label='Up'
                valueDefault={values.UpCurve ?? 0}
                propertyPath={`${pathBase}UpCurve`}
                valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
                onChange={onChange}
                formatterFn={Math.round}
                valueMin={-18}
                valueMax={18}
                size={knobSize}
                ref={upCurveRef}
                refName='upCurveRef'
              />
              <Knob
                label='Down'
                valueDefault={values.DnCurve ?? 0}
                propertyPath={`${pathBase}DnCurve`}
                valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
                onChange={onChange}
                formatterFn={Math.round}
                valueMin={-18}
                valueMax={18}
                size={knobSize}
                ref={dnCurveRef}
                refName='dnCurveRef'
              />
            </Flex>
          </Stack>
        )}
      </Flex>
    </Flex>
  )
}
