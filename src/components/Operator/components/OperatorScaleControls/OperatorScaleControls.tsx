import { RefObject, useEffect, useRef } from 'react'
import { Flex, InputLabel, Stack } from '@mantine/core'
import { Accordion } from '@mantine/core'

import {
  KnobRefType,
  ScaleControlsValues,
  ScaleControlsRef,
  UpdatedProperty
} from '../../../../types'
import { Knob } from '../../../Knob/Knob'

type Props = {
  numId: number
  onChange: (props: UpdatedProperty[]) => void
  values: ScaleControlsValues
  ref?: RefObject<ScaleControlsRef | undefined>
  open?: boolean
  toggleScaleControls: () => void
}

export const OperatorScaleControls = ({
  numId,
  onChange,
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
        setInternalValue: (data: ScaleControlsValues) => {
          timeRef.current?.setInternalValue(data.Time)
          scaleRef.current?.setInternalValue(data.Scale)
          lGainRef.current?.setInternalValue(data.LGain)
          rGainRef.current?.setInternalValue(data.RGain)
          lCurveRef.current?.setInternalValue(data.LCurve)
          rCurveRef.current?.setInternalValue(data.RCurve)
        },
        refs: {
          timeRef,
          scaleRef,
          lGainRef,
          rGainRef,
          lCurveRef,
          rCurveRef
        }
      }
    }
  }, [ref])

  return (
    <Accordion p={0} m={-10} mt={-10} value={open ? 'scale' : ''}>
      <Accordion.Item value='scale' p={0} bd='none'>
        <Accordion.Control
          p={0}
          px={10}
          fz='sm'
          bg='#eaeaea'
          onClick={toggleScaleControls}
          styles={{ label: { padding: '5px' } }}
        >
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
                  onChange={onChange}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={values.Time}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={timeRef}
                  refName='timeRef'
                />
                <Knob
                  label='Position'
                  propertyPath={`OP${numId}.Scale`}
                  onChange={onChange}
                  valueMin={0}
                  valueMax={6}
                  valueDefault={values.Scale}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `C${Math.round(val + 1)}`}
                  ref={scaleRef}
                  refName='scaleRef'
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
                  onChange={onChange}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={values.LGain}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={lGainRef}
                  refName='lGainRef'
                />
                <Knob
                  label='Curve'
                  propertyPath={`OP${numId}.LCurve`}
                  onChange={onChange}
                  valueMin={-18}
                  valueMax={18}
                  valueDefault={values.LCurve}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={lCurveRef}
                  refName='lCurveRef'
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
                  onChange={onChange}
                  valueMin={0}
                  valueMax={127}
                  valueDefault={values.RGain}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={rGainRef}
                  refName='rGainRef'
                />
                <Knob
                  label='Curve'
                  propertyPath={`OP${numId}.RCurve`}
                  onChange={onChange}
                  valueMin={-18}
                  valueMax={18}
                  valueDefault={values.RCurve}
                  formatterFn={Math.round}
                  valueRawDisplayFn={(val) => `${Math.round(val)}`}
                  ref={rCurveRef}
                  refName='rCurveRef'
                />
              </Flex>
            </Stack>
          </Flex>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  )
}
