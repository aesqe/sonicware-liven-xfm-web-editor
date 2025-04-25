import { Button, ButtonProps, useMantineColorScheme } from '@mantine/core'

import { activeLight, darkBorder, activeDark, lightGrey, darkGrey, lightBorder } from '../../theme'

type Props = ButtonProps & {
  onClick: () => void
  active?: boolean
}

export const MainButton = ({ onClick, active = false, children, ...props }: Props) => {
  const { colorScheme } = useMantineColorScheme()

  const color = colorScheme === 'light' ? lightGrey : darkGrey
  const c = colorScheme === 'dark' ? lightGrey : darkGrey
  const borderColor = colorScheme === 'light' ? lightBorder : darkBorder
  const activeColor = active ? (colorScheme === 'light' ? activeLight : activeDark) : color

  return (
    <Button
      flex={1}
      size='xs'
      onClick={onClick}
      color={activeColor}
      c={c}
      style={{
        '--button-bd': `1px solid ${borderColor}`
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
