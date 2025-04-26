import {
  ComponentProps,
  CSSProperties,
  RefObject,
  useId,
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react'
import { useAtomValue } from 'jotai'
import { KnobHeadless, KnobHeadlessLabel, KnobHeadlessOutput } from 'react-knob-headless'
import { Box, Stack, StackProps } from '@mantine/core'

import { NormalisableRange } from '../../services/normalisable-range/normalisable-range'
import { midiMappingModeAtom } from '../../store/atoms'
import { ParameterMappingButton } from '../MIDIMappingManager/components/ParameterMappingButton/ParameterMappingButton'
import { useKnobKeyboardControls } from './services/use-knob-keyboard-controls/use-knob-keyboard-controls'
import { UpdatedProperty, SetInternalValueRef } from '../../types'

type KnobHeadlessProps = Pick<
  ComponentProps<typeof KnobHeadless>,
  'valueMin' | 'valueMax' | 'mapTo01' | 'mapFrom01'
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
    stepFn?: (valueRaw: number) => number
    stepLargerFn?: (valueRaw: number) => number
    onChange: (props: UpdatedProperty[]) => void
    formatterFn?: (x: number) => number
    size?: CSSProperties['width']
    ref?: RefObject<SetInternalValueRef<number> | null>
    refName: string
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
  size = '3.25rem',
  formatterFn = (x: number) => x,
  valueRawDisplayFn = (val: number) => `${val}`,
  valueRawRoundFn = (x: number) => x,
  stepFn = () => 1,
  stepLargerFn = () => 10,
  onChange,
  refName,
  ...stackProps
}: Props) => {
  const knobId = useId()
  const labelId = useId()
  const [valueRaw, setValueRaw] = useState<number>(valueDefault)
  const valueSetFromOutside = useRef(false)
  const midiMappingMode = useAtomValue(midiMappingModeAtom)

  const range = new NormalisableRange(valueMin, valueMax, center)
  const mapTo01 = (x: number) => range.mapTo01(x)
  const mapFrom01 = (x: number) => range.mapFrom01(x)

  const dragSensitivity = midiMappingMode.active ? 0 : 0.006
  const value01 = mapTo01(valueRaw)
  const step = stepFn(valueRaw)
  const stepLarger = stepLargerFn(valueRaw)

  const handleOnChange = useCallback(
    (value: number) => {
      if (valueSetFromOutside.current) {
        valueSetFromOutside.current = false
        return
      }

      setValueRaw(value)
      onChange([{ value, propertyPath, formatterFn }])
    },
    [onChange, propertyPath, formatterFn]
  )

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
        ...ref.current,
        setInternalValue: (value: number, fromMidi = false) => {
          if (value === valueRaw) {
            return
          }

          if (fromMidi) {
            return handleOnChange(value)
          }

          // prevent patch update when value is set from the outside
          valueSetFromOutside.current = true
          setValueRaw(value)
        }
      }
    }
  }, [ref, setValueRaw, handleOnChange, valueRaw])

  const handleOnDoubleClick = useCallback(() => {
    handleOnChange(center)
  }, [center, handleOnChange])

  return (
    <Stack
      gap='0'
      w={size}
      align='center'
      justify='center'
      fz={14}
      lh={1.2}
      ta='center'
      pos='relative'
      style={{
        userSelect: 'none',
        outline: 'none'
      }}
      {...stackProps}
    >
      <KnobHeadlessOutput htmlFor={knobId} style={{ opacity: disabled ? 0.5 : 1 }}>
        {valueRawDisplayFn(valueRaw)}
      </KnobHeadlessOutput>
      <Box pos='relative' w={size} h={size} mt={2} mb={2}>
        <KnobHeadless
          id={knobId}
          aria-labelledby={labelId}
          includeIntoTabOrder
          dragSensitivity={dragSensitivity}
          valueMin={valueMin}
          valueMax={valueMax}
          valueRaw={valueRaw}
          valueRawRoundFn={valueRawRoundFn}
          valueRawDisplayFn={valueRawDisplayFn}
          mapTo01={mapTo01}
          mapFrom01={mapFrom01}
          onValueRawChange={handleOnChange}
          onDoubleClick={handleOnDoubleClick}
          {...keyboardControlHandlers}
        >
          <ParameterMappingButton
            propertyPath={propertyPath}
            label={label}
            min={valueMin}
            max={valueMax}
            center={center}
            refName={refName}
            value01={value01}
            disabled={disabled}
          />
        </KnobHeadless>
      </Box>
      <KnobHeadlessLabel id={labelId} style={{ opacity: disabled ? 0.5 : 1 }}>
        {label}
      </KnobHeadlessLabel>
    </Stack>
  )
}
