import { ReactNode, useCallback, useState } from 'react'
import { useAtomValue } from 'jotai'
import { Fieldset, Flex, useMantineColorScheme } from '@mantine/core'

import { MainButton } from '../../../MainButton/MainButton'
import { globalRefsAtom } from '../../../../store/atoms'
import { IconSun } from '@tabler/icons-react'
import { IconMoon } from '@tabler/icons-react'

type Props = {
  children?: ReactNode
}

export const AppHeaderToggleControls = ({ children }: Props) => {
  const refs = useAtomValue(globalRefsAtom)
  const [ADSRControlsOpen, setADSRControlsOpen] = useState(true)
  const [scaleControlsOpen, setScaleControlsOpen] = useState(false)
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  const toggleADSRControls = useCallback(() => {
    refs.op1Ref?.current?.setADSRControlsOpen(!ADSRControlsOpen)
    refs.op2Ref?.current?.setADSRControlsOpen(!ADSRControlsOpen)
    refs.op3Ref?.current?.setADSRControlsOpen(!ADSRControlsOpen)
    refs.op4Ref?.current?.setADSRControlsOpen(!ADSRControlsOpen)
    setADSRControlsOpen(!ADSRControlsOpen)
  }, [ADSRControlsOpen, refs])

  const toggleScaleControls = useCallback(() => {
    refs.op1Ref?.current?.setScaleControlsOpen(!scaleControlsOpen)
    refs.op2Ref?.current?.setScaleControlsOpen(!scaleControlsOpen)
    refs.op3Ref?.current?.setScaleControlsOpen(!scaleControlsOpen)
    refs.op4Ref?.current?.setScaleControlsOpen(!scaleControlsOpen)
    setScaleControlsOpen(!scaleControlsOpen)
  }, [scaleControlsOpen, refs])

  return (
    <Fieldset legend='Toggle' w='100%' px={5} py={6}>
      <Flex gap={5} wrap='wrap'>
        <MainButton
          flex=''
          active={scaleControlsOpen}
          onClick={toggleScaleControls}
          w='calc(50% - 2.5px)'
        >
          Scale controls
        </MainButton>
        <MainButton
          flex=''
          active={ADSRControlsOpen}
          onClick={toggleADSRControls}
          w='calc(50% - 2.5px)'
        >
          ADSR controls
        </MainButton>
        <MainButton flex='' onClick={toggleColorScheme} w='calc(50% - 2.5px)'>
          {colorScheme === 'dark' ? (
            <>
              <IconSun size={16} />
              &nbsp; Light Mode
            </>
          ) : (
            <>
              <IconMoon size={16} />
              &nbsp; Dark Mode
            </>
          )}
        </MainButton>
        {children}
      </Flex>
    </Fieldset>
  )
}
