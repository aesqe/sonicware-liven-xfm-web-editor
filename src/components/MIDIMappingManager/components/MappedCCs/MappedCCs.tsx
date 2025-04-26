import { MouseEvent } from 'react'
import { ActionIcon, Flex, MantineColorScheme, Text } from '@mantine/core'
import { IconSquare, IconX } from '@tabler/icons-react'

type Props = {
  ccs: number[]
  lastCCUsed: number
  propertyPath: string
  mappingActive: boolean
  colorScheme: MantineColorScheme
  handleRemoveMapItem: (e: MouseEvent<HTMLButtonElement>) => void
}

export const MappedCCs = ({
  ccs,
  lastCCUsed,
  propertyPath,
  colorScheme,
  mappingActive,
  handleRemoveMapItem
}: Props) => (
  <Flex display='inline-flex' wrap='wrap' gap={5}>
    {ccs.map((cc) => (
      <Flex
        key={cc}
        gap={5}
        align='center'
        miw={60}
        justify='end'
        px={2}
        bg={cc === lastCCUsed ? (colorScheme === 'light' ? '#f9eec7' : '#6f6a68') : 'transparent'}
        style={{
          border: `1px solid ${colorScheme === 'light' ? '#e6e3e1' : '#6f6a68'}`,
          borderRadius: 5
        }}
      >
        <Text>{cc}</Text>
        <ActionIcon
          size='xs'
          color={mappingActive && colorScheme === 'light' ? 'gray.7' : 'gray.5'}
          autoContrast
          data-cid={cc}
          data-property-path={propertyPath}
          onClick={handleRemoveMapItem}
          opacity={mappingActive ? 1 : 0.5}
          style={{
            pointerEvents: mappingActive ? 'auto' : 'none'
          }}
        >
          {mappingActive ? <IconX size={16} /> : <IconSquare size={16} />}
        </ActionIcon>
      </Flex>
    ))}
  </Flex>
)
