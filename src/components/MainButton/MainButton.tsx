import { Button, ButtonProps } from '@mantine/core'

type Props = ButtonProps & {
  onClick: () => void
}

const buttonStyle = {
  '--button-bd': '1px solid #BABABA'
}

export const MainButton = ({ onClick, children, ...props }: Props) => (
  <Button
    flex={1}
    size='xs'
    onClick={onClick}
    color='#e6e3e1'
    c='dark'
    style={buttonStyle}
    {...props}
  >
    {children}
  </Button>
)
