import { CSSProperties, RefObject, useEffect, useRef } from 'react'
import { Flex, InputLabel, Stack } from '@mantine/core'

import { Knob } from '../../../Knob/Knob'
import { NormalisableRange } from '../../../../services/normalisable-range/normalisable-range'
import { ADSRValues, KnobRefType, UpdatedProperty } from '../../../../types'

type Props = {
  values: ADSRValues
  range: NormalisableRange
  pitchEnv?: boolean
  knobSize?: CSSProperties['width']
  handleKnobChange: (values: UpdatedProperty[]) => void
  ref: RefObject<{ setInternalValue: (values: ADSRValues) => void } | null>
}

export const ADSREnvelopeKnobs = ({
  ref,
  values,
  range,
  knobSize = '2rem',
  pitchEnv = false,
  handleKnobChange
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
    if (ref.current) {
      ref.current.setInternalValue = (vals: ADSRValues) => {
        aTimeRef.current?.setValueRaw(vals.ATime)
        aLevelRef.current?.setValueRaw(vals.ALevel)
        dTimeRef.current?.setValueRaw(vals.DTime)
        dLevelRef.current?.setValueRaw(vals.DLevel)
        sTimeRef.current?.setValueRaw(vals.STime)
        sLevelRef.current?.setValueRaw(vals.SLevel)
        rTimeRef.current?.setValueRaw(vals.RTime)
        rLevelRef.current?.setValueRaw(vals.RLevel)

        if (vals.UpCurve !== undefined && vals.DnCurve !== undefined) {
          upCurveRef.current?.setValueRaw(vals.UpCurve)
          dnCurveRef.current?.setValueRaw(vals.DnCurve)
        }
      }
    }
  }, [ref])

  return (
    <Flex w='100%' gap={10}>
      <Stack gap={0} align='center'>
        <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
          Attack
        </InputLabel>
        <Flex gap={10} p={4}>
          <Knob
            label='Time'
            valueDefault={values.ATime}
            propertyPath='ATime'
            valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
            valueMin={0}
            valueMax={127}
            onChange={handleKnobChange}
            ref={aTimeRef}
            size={knobSize}
          />
          <Knob
            label='Level'
            valueDefault={values.ALevel}
            propertyPath='ALevel'
            valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
            valueMin={range.min}
            valueMax={range.max}
            center={range.center}
            onChange={handleKnobChange}
            ref={aLevelRef}
            size={knobSize}
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
            propertyPath='DTime'
            valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
            valueMin={0}
            valueMax={127}
            onChange={handleKnobChange}
            ref={dTimeRef}
            size={knobSize}
          />
          <Knob
            label='Level'
            valueDefault={values.DLevel}
            propertyPath='DLevel'
            valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
            valueMin={range.min}
            valueMax={range.max}
            center={range.center}
            onChange={handleKnobChange}
            ref={dLevelRef}
            size={knobSize}
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
            propertyPath='STime'
            valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
            valueMin={0}
            valueMax={127}
            onChange={handleKnobChange}
            ref={sTimeRef}
            size={knobSize}
          />
          <Knob
            label='Level'
            valueDefault={values.SLevel}
            propertyPath='SLevel'
            valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
            valueMin={range.min}
            valueMax={range.max}
            center={range.center}
            onChange={handleKnobChange}
            ref={sLevelRef}
            size={knobSize}
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
            propertyPath='RTime'
            valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
            valueMin={0}
            valueMax={127}
            onChange={handleKnobChange}
            ref={rTimeRef}
            size={knobSize}
          />
          <Knob
            label='Level'
            valueDefault={values.RLevel}
            propertyPath='RLevel'
            valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
            valueMin={range.min}
            valueMax={range.max}
            center={range.center}
            onChange={handleKnobChange}
            ref={rLevelRef}
            size={knobSize}
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
              propertyPath='UpCurve'
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              onChange={handleKnobChange}
              formatterFn={Math.round}
              valueMin={-18}
              valueMax={18}
              size={knobSize}
              ref={upCurveRef}
            />
            <Knob
              label='Down'
              valueDefault={values.DnCurve ?? 0}
              propertyPath='DnCurve'
              valueRawDisplayFn={(valueRaw) => `${Math.round(valueRaw)}`}
              onChange={handleKnobChange}
              formatterFn={Math.round}
              valueMin={-18}
              valueMax={18}
              size={knobSize}
              ref={dnCurveRef}
            />
          </Flex>
        </Stack>
      )}
    </Flex>
  )
}
