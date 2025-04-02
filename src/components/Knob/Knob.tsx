import { ComponentProps, CSSProperties, RefObject, useId, useState, useEffect, useRef } from 'react'
import { KnobHeadless, KnobHeadlessLabel, KnobHeadlessOutput } from 'react-knob-headless'
import { Stack, StackProps } from '@mantine/core'

import { KnobBaseThumb } from './components/KnobBaseThumb/KnobBaseThumb'
import { NormalisableRange } from '../../services/normalisable-range/normalisable-range'
import { useKnobKeyboardControls } from './services/use-knob-keyboard-controls/use-knob-keyboard-controls'
import { UpdatedProperty, SetInternalValueRef } from '../../types'

type KnobHeadlessProps = Pick<
  ComponentProps<typeof KnobHeadless>,
  'valueMin' | 'valueMax' | 'orientation' | 'mapTo01' | 'mapFrom01' | 'includeIntoTabOrder'
>

type KnobBaseProps = Pick<
  ComponentProps<typeof KnobHeadless>,
  'valueRawRoundFn' | 'valueRawDisplayFn'
>

type Props = KnobHeadlessProps &
  Partial<KnobBaseProps> & {
    label: string
    center?: number
    disabled?: boolean
    valueDefault: number
    propertyPath: string
    stepFn?: (valueRaw: number, direction: 'up' | 'down' | undefined) => number
    stepLargerFn?: (valueRaw: number, direction: 'up' | 'down' | undefined) => number
    onChange: (props: UpdatedProperty[]) => void
    formatterFn?: (x: number) => number
    size?: CSSProperties['width']
    ref?: RefObject<SetInternalValueRef<number> | null>
  } & Partial<Omit<StackProps, 'onChange'>>

export const Knob = ({
  ref,
  label,
  propertyPath,
  valueMin,
  valueMax,
  valueDefault,
  center = (valueMin + valueMax) / 2,
  disabled = false,
  orientation = 'vertical',
  includeIntoTabOrder = true,
  size = '3.25rem',
  valueRawDisplayFn = (val: number): string => `${val}`,
  valueRawRoundFn = (x: number): number => x,
  stepFn = (): number => 1,
  stepLargerFn = (): number => 10,
  formatterFn = (x: number): number => x,
  onChange,
  ...stackProps
}: Props) => {
  const knobId = useId()
  const labelId = useId()
  const [valueRaw, setValueRaw] = useState<number>(valueDefault)
  const valueSetFromOutside = useRef(false)
  const direction = useRef<'up' | 'down' | undefined>(undefined)

  const range = new NormalisableRange(valueMin, valueMax, center)
  const mapTo01 = (x: number) => range.mapTo01(x)
  const mapFrom01 = (x: number) => range.mapFrom01(x)

  const dragSensitivity = 0.006
  const value01 = mapTo01(valueRaw)
  const step = stepFn(valueRaw, direction.current)
  const stepLarger = stepLargerFn(valueRaw, direction.current)

  const handleOnChange = (value: number, dir?: 'up' | 'down') => {
    direction.current = dir

    if (valueSetFromOutside.current) {
      valueSetFromOutside.current = false
      return
    }

    setValueRaw(value)
    onChange([{ value, propertyPath, formatterFn }])
  }

  const keyboardControlHandlers = useKnobKeyboardControls({
    valueRaw,
    valueMin,
    valueMax,
    step,
    stepLarger,
    onValueRawChange: handleOnChange
  })

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue: (value: number) => {
          valueSetFromOutside.current = true
          setValueRaw(value)
        }
      }
    }
  }, [ref, setValueRaw])

  const handleOnDoubleClick = () => {
    handleOnChange(center, valueRaw < center ? 'up' : 'down')
  }

  return (
    <Stack
      gap='0'
      w={size}
      align='center'
      justify='center'
      fz={14}
      lh={1.2}
      ta='center'
      opacity={disabled ? 0.5 : 1}
      style={{
        userSelect: 'none',
        outline: 'none',
        pointerEvents: disabled ? 'none' : 'auto'
      }}
      {...stackProps}
    >
      <KnobHeadlessOutput htmlFor={knobId}>{valueRawDisplayFn(valueRaw)}</KnobHeadlessOutput>
      <KnobHeadless
        id={knobId}
        aria-labelledby={labelId}
        valueMin={valueMin}
        valueMax={valueMax}
        valueRaw={valueRaw}
        includeIntoTabOrder={includeIntoTabOrder}
        valueRawRoundFn={valueRawRoundFn}
        valueRawDisplayFn={valueRawDisplayFn}
        dragSensitivity={dragSensitivity}
        orientation={orientation}
        mapTo01={mapTo01}
        mapFrom01={mapFrom01}
        onValueRawChange={handleOnChange}
        onDoubleClick={handleOnDoubleClick}
        {...keyboardControlHandlers}
        style={{
          position: 'relative',
          marginTop: 2,
          marginBottom: 2,
          width: size,
          height: size
        }}
      >
        <KnobBaseThumb value01={value01} />
      </KnobHeadless>
      <KnobHeadlessLabel id={labelId}>{label}</KnobHeadlessLabel>
    </Stack>
  )
}
