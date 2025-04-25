import { useAtom } from 'jotai'
import { ActionIcon, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core'

import { midiMappingModeAtom, midiMapAtom } from '../../store/atoms'
import { KnobBaseThumb } from '../Knob/components/KnobBaseThumb/KnobBaseThumb'
import {
  knobDark,
  knobLight,
  knobMidiDark,
  knobMidiLight,
  knobMidiMultipleDark,
  knobMidiMultipleLight,
  knobMidiUnmappedDark,
  knobMidiUnmappedLight
} from '../../theme'

interface Props {
  propertyPath: string
  label?: string
  min: number
  max: number
  center: number
  refName: string
  value01: number
  disabled: boolean
}

export const ParameterMappingButton = ({
  propertyPath,
  min,
  max,
  center,
  refName,
  value01,
  disabled
}: Props) => {
  const [midiMap] = useAtom(midiMapAtom)
  const [midiMappingMode, setMidiMappingMode] = useAtom(midiMappingModeAtom)
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const CCs = midiMap
    .filter((mapping) => mapping.propertyPath === propertyPath)
    .map((mapping) => mapping.controllerIds)
    .flat()
  const isMapped = CCs.length > 0
  const isMultipleMapped = CCs.length > 1
  const isSelected = midiMappingMode.active && midiMappingMode.propertyPath === propertyPath

  const handleClick = () => {
    if (!midiMappingMode.active) return

    setMidiMappingMode((prev) => ({
      ...prev,
      refName,
      propertyPath,
      controlRange: { min, max, center }
    }))
  }

  if (!midiMappingMode.active) {
    return (
      <KnobBaseThumb
        value01={value01}
        midiControlled={isMapped}
        isMultipleMapped={isMultipleMapped}
        style={{
          pointerEvents: midiMappingMode.active || disabled ? 'none' : 'auto',
          opacity: disabled ? 0.5 : 1
        }}
      />
    )
  }

  const colorLight = isSelected
    ? theme.colors.blue[5]
    : isMapped
      ? isMultipleMapped
        ? knobMidiMultipleLight
        : knobMidiLight
      : knobMidiUnmappedLight

  const colorDark = isSelected
    ? theme.colors.blue[5]
    : isMapped
      ? isMultipleMapped
        ? knobMidiMultipleDark
        : knobMidiDark
      : knobMidiUnmappedDark

  return (
    <ActionIcon
      variant='filled'
      color={colorScheme === 'light' ? colorLight : colorDark}
      c={isSelected ? 'white' : 'auto'}
      onClick={handleClick}
      radius='xl'
      size='100%'
      pos='absolute'
      top={0}
      right={0}
      autoContrast
    >
      <Text lh={0} fw={500} fz={14} style={{ whiteSpace: 'nowrap' }}>
        {isMapped ? (isMultipleMapped ? `x${CCs.length}` : CCs) : '+'}
      </Text>
    </ActionIcon>
  )
}
