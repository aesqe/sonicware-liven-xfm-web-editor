import { ReactNode, useCallback, useState } from 'react'
import { useAtomValue } from 'jotai'
import { Fieldset, Flex } from '@mantine/core'

import { MainButton } from '../../../MainButton/MainButton'
import { globalRefsAtom } from '../../../../store/atoms'

type Props = {
  children?: ReactNode
}

export const AppHeaderToggleControls = ({ children }: Props) => {
  const refs = useAtomValue(globalRefsAtom)
  const [ADSRControlsOpen, setADSRControlsOpen] = useState(true)
  const [scaleControlsOpen, setScaleControlsOpen] = useState(false)

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
          color={scaleControlsOpen ? '#ffeb3b' : '#e6e3e1'}
          onClick={toggleScaleControls}
          w='calc(50% - 2.5px)'
        >
          Scale controls
        </MainButton>
        <MainButton
          flex=''
          color={ADSRControlsOpen ? '#ffeb3b' : '#e6e3e1'}
          onClick={toggleADSRControls}
          w='calc(50% - 2.5px)'
        >
          ADSR controls
        </MainButton>
        {children}
      </Flex>
    </Fieldset>
  )
}
