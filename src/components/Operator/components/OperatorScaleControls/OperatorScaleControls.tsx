import { RefObject, useCallback, useEffect, useRef } from 'react'
import { Flex, InputLabel, Stack } from '@mantine/core'
import { Accordion } from '@mantine/core'

import { Knob } from '../../../Knob/Knob'
import { KnobRefType, OperatorProps, SetInternalValueRef, UpdatedProperty } from '../../../../types'

type Props = {
  opId: number
  updateValues: (props: UpdatedProperty[]) => void
  values: OperatorProps
  ref?: RefObject<SetInternalValueRef<OperatorProps> | undefined>
  open?: boolean
  toggleScaleControls: () => void
}

export const OperatorScaleControls = ({
  opId,
  updateValues,
  values,
  ref,
  open = false,
  toggleScaleControls
}: Props) => {
  const timeRef = useRef<KnobRefType>(null)
  const scaleRef = useRef<KnobRefType>(null)
  const lGainRef = useRef<KnobRefType>(null)
  const lCurveRef = useRef<KnobRefType>(null)
  const rGainRef = useRef<KnobRefType>(null)
  const rCurveRef = useRef<KnobRefType>(null)

  const setInternalValue = useCallback((values: OperatorProps) => {
    timeRef.current?.setValueRaw(values.Time)
    scaleRef.current?.setValueRaw(values.Scale)
    lGainRef.current?.setValueRaw(values.LGain)
    lCurveRef.current?.setValueRaw(values.LCurve)
    rGainRef.current?.setValueRaw(values.RGain)
    rCurveRef.current?.setValueRaw(values.RCurve)
  }, [])

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue
      }
    }
  }, [setInternalValue, ref])

  return (
    <Accordion p={0} m={-10} mt={-10} value={open ? 'scale' : ''}>
      <Accordion.Item value='scale' p={0} bd='none'>
        <Accordion.Control p={0} px={10} fz='sm' bg='#eaeaea' onClick={toggleScaleControls}>
          Scale Controls
        </Accordion.Control>
        <Accordion.Panel p={0} pb={10} styles={{ content: { padding: 0 } }}>
          <Flex gap={16} align='start'>
            <Stack gap={0} align='center'>
              <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
                Scale
              </InputLabel>
              <Flex gap={10} p={4}>
                <Knob
                  label='Time'
                  propertyPath={`${opId}.Time`}
                  onChange={updateValues}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={values.Time}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={timeRef}
                />
                <Knob
                  label='Position'
                  propertyPath={`${opId}.Scale`}
                  onChange={updateValues}
                  valueMin={0}
                  valueMax={6}
                  valueDefault={values.Scale}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `C${Math.round(val + 1)}`}
                  ref={scaleRef}
                />
              </Flex>
            </Stack>
            <Stack gap={0} align='center'>
              <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
                Left
              </InputLabel>
              <Flex gap={10} p={4}>
                <Knob
                  label='Gain'
                  propertyPath={`${opId}.LGain`}
                  onChange={updateValues}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={values.LGain}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={lGainRef}
                />
                <Knob
                  label='Curve'
                  propertyPath={`${opId}.LCurve`}
                  onChange={updateValues}
                  valueMin={-18}
                  valueMax={18}
                  valueDefault={values.LCurve}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={lCurveRef}
                />
              </Flex>
            </Stack>
            <Stack gap={0} align='center'>
              <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
                Right
              </InputLabel>
              <Flex gap={10} p={4}>
                <Knob
                  label='Gain'
                  propertyPath={`${opId}.RGain`}
                  onChange={updateValues}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={values.RGain}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={rGainRef}
                />
                <Knob
                  label='Curve'
                  propertyPath={`${opId}.RCurve`}
                  onChange={updateValues}
                  valueMin={-18}
                  valueMax={18}
                  valueDefault={values.RCurve}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={rCurveRef}
                />
              </Flex>
            </Stack>
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
