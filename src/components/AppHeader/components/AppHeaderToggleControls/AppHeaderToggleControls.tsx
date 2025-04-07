import { useCallback, useState } from 'react'
import { useAtomValue } from 'jotai'
import { Button, Fieldset } from '@mantine/core'

import { globalRefsAtom } from '../../../../store/atoms'

const buttonStyle = {
  '--button-bd': '1px solid #BABABA'
}

export const AppHeaderToggleControls = () => {
  const refs = useAtomValue(globalRefsAtom)
  const [ADSRControlsOpen, setADSRControlsOpen] = useState(false)
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
    <Fieldset legend='Toggle' w='100%' px={5} py={8}>
      <Button.Group w='100%'>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          flex={1}
          style={buttonStyle}
          onClick={toggleScaleControls}
        >
          Scale controls
        </Button>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          flex={1}
          style={buttonStyle}
          onClick={toggleADSRControls}
        >
          ADSR controls
        </Button>
      </Button.Group>
    </Fieldset>
  )
}
