import { useAtom } from 'jotai'
import { ActionIcon, Text } from '@mantine/core'

import { midiMappingModeAtom, midiMapAtom } from '../../store/atoms'
import { KnobBaseThumb } from '../Knob/components/KnobBaseThumb/KnobBaseThumb'

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

  const CCs = midiMap
    .filter((mapping) => mapping.propertyPath === propertyPath)
    .map((mapping) => mapping.controllerId)
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

  return (
    <ActionIcon
      variant='filled'
      color={isSelected ? 'red' : isMapped ? (isMultipleMapped ? 'green' : '#bceb42') : 'yellow'}
      c={isSelected ? 'white' : isMultipleMapped ? 'white' : 'dark'}
      onClick={handleClick}
      radius='xl'
      size={midiMappingMode.active ? '100%' : '16px'}
      style={{
        position: 'absolute',
        top: midiMappingMode.active ? 0 : 'calc(50% - 8px)',
        right: midiMappingMode.active ? 0 : 'calc(50% - 8px)',
        pointerEvents: midiMappingMode.active ? 'auto' : 'none'
      }}
    >
      <Text
        lh={0}
        fw={isMultipleMapped ? 700 : 400}
        size={isMapped ? '12px' : '12px'}
        style={{ whiteSpace: 'nowrap' }}
      >
        {isMapped ? (isMultipleMapped ? `x${CCs.length}` : CCs) : '+'}
      </Text>
    </ActionIcon>
  )
}
