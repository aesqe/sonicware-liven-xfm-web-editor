import { mapFrom01Linear } from '@dsp-ts/math'
import { Box, CSSProperties, useMantineColorScheme } from '@mantine/core'

import { knobLight, knobDark, knobMidiMultipleLight, knobMidiMultipleDark } from '../../../../theme'

type KnobBaseThumbProps = {
  value01: number
  style?: CSSProperties
  midiControlled?: boolean
  isMultipleMapped?: boolean
}

export const KnobBaseThumb = ({
  value01,
  midiControlled = false,
  isMultipleMapped = false,
  style = {}
}: KnobBaseThumbProps) => {
  const { colorScheme } = useMantineColorScheme()

  const angleMin = -145
  const angleMax = 145
  const angle = mapFrom01Linear(value01, angleMin, angleMax)

  const colorLight = midiControlled
    ? isMultipleMapped
      ? knobMidiMultipleLight
      : knobLight
    : knobLight
  const colorDark = midiControlled ? (isMultipleMapped ? knobMidiMultipleDark : knobDark) : knobDark

  return (
    <Box
      pos='absolute'
      h='100%'
      w='100%'
      bg={colorScheme === 'light' ? colorLight : colorDark}
      style={{
        borderRadius: '9999px',
        ...style
      }}
    >
      <Box
        pos='absolute'
        h='100%'
        w='100%'
        style={{
          rotate: `${angle}deg`
        }}
      >
        <Box
          pos='absolute'
          left='50%'
          top={0}
          h='50%'
          w='2px'
          bg={colorScheme === 'light' ? 'dark' : 'white'}
          style={{
            transform: 'translateX(-50%)',
            borderRadius: '0.125rem'
          }}
        />
      </Box>
    </Box>
  )
}
