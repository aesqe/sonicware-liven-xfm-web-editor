import { RefObject, useEffect, useRef } from 'react'
import { Flex, InputLabel, Stack } from '@mantine/core'
import { Accordion } from '@mantine/core'

import {
  KnobRefType,
  OperatorValues,
  SetInternalValueRef,
  UpdatedProperty
} from '../../../../types'
import { Knob } from '../../../Knob/Knob'

type Props = {
  numId: number
  updateValues: (props: UpdatedProperty[]) => void
  values: OperatorValues
  ref?: RefObject<SetInternalValueRef<OperatorValues> | undefined>
  open?: boolean
  toggleScaleControls: () => void
}

export const OperatorScaleControls = ({
  numId,
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

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue: (data: OperatorValues) => {
          timeRef.current?.setInternalValue(data.Time)
          scaleRef.current?.setInternalValue(data.Scale)
          lGainRef.current?.setInternalValue(data.LGain)
          rGainRef.current?.setInternalValue(data.RGain)
          lCurveRef.current?.setInternalValue(data.LCurve)
          rCurveRef.current?.setInternalValue(data.RCurve)
        }
      }
    }
  }, [ref])

  return (
    <Accordion p={0} m={-10} mt={-10} value={open ? 'scale' : ''}>
      <Accordion.Item value='scale' p={0} bd='none'>
        <Accordion.Control p={0} px={10} fz='sm' bg='#eaeaea' onClick={toggleScaleControls}>
          Scale Controls
        </Accordion.Control>
        <Accordion.Panel p={0} pl={6} pb={10} styles={{ content: { padding: 0 } }}>
          <Flex gap={4} align='center' justify='start'>
            <Stack gap={0} align='center'>
              <InputLabel pb={4} w='100%' ta='center' style={{ borderBottom: '1px solid #CCC' }}>
                Scale
              </InputLabel>
              <Flex gap={12} p={4}>
                <Knob
                  label='Time'
                  propertyPath={`OP${numId}.Time`}
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
                  propertyPath={`OP${numId}.Scale`}
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
              <Flex gap={12} p={4}>
                <Knob
                  label='Gain'
                  propertyPath={`OP${numId}.LGain`}
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
                  propertyPath={`OP${numId}.LCurve`}
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
              <Flex gap={12} p={4}>
                <Knob
                  label='Gain'
                  propertyPath={`OP${numId}.RGain`}
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
                  propertyPath={`OP${numId}.RCurve`}
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
