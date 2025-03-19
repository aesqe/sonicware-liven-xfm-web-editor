import { mapFrom01Linear } from '@dsp-ts/math'
import { Box } from '@mantine/core'

type KnobBaseThumbProps = {
  value01: number
}

export const KnobBaseThumb = ({ value01 }: KnobBaseThumbProps) => {
  const angleMin = -145
  const angleMax = 145
  const angle = mapFrom01Linear(value01, angleMin, angleMax)

  return (
    <Box
      pos='absolute'
      h='100%'
      w='100%'
      bg='#d6d3d1'
      style={{
        borderRadius: '9999px'
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
          bg='#0c0a09'
          style={{
            transform: 'translateX(-50%)',
            borderRadius: '0.125rem'
          }}
        />
      </Box>
    </Box>
  )
}
