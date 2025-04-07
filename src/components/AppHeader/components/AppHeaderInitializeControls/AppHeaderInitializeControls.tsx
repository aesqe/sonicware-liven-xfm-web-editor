import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { Button } from '@mantine/core'
import { Fieldset } from '@mantine/core'

import initPatch from '../../../../assets/presets/initpatch.json'
import { XFMPatch } from '../../../../types'
import { patchAtom } from '../../../../store/atoms'
import { defaultADSR } from '../../../../constants'

type Props = {
  handlePatchChange: (patch: XFMPatch) => void
  viewportWidth: number
}

const buttonStyle = {
  '--button-bd': '1px solid #BABABA'
}

export const AppHeaderInitializeControls = ({ handlePatchChange, viewportWidth }: Props) => {
  const patch = useAtomValue(patchAtom)

  const buttonMarginTop = viewportWidth > 970 ? 2 : 20

  const handleInitializePatch = useCallback(() => {
    handlePatchChange(initPatch)
  }, [handlePatchChange])

  const handleInitializeADSR = useCallback(() => {
    const OP1 = { ...patch.OP1, ...defaultADSR }
    const OP2 = { ...patch.OP2, ...defaultADSR }
    const OP3 = { ...patch.OP3, ...defaultADSR }
    const OP4 = { ...patch.OP4, ...defaultADSR }

    handlePatchChange({
      ...patch,
      OP1,
      OP2,
      OP3,
      OP4
    })
  }, [patch, handlePatchChange])

  const handleInitializeOperators = useCallback(() => {
    const { Mixer, Pitch, Name } = patch

    handlePatchChange({
      ...initPatch,
      Mixer,
      Pitch,
      Name
    })
  }, [patch, handlePatchChange])

  return (
    <Fieldset legend='Initialize' w='100%' px={5} py={8}>
      <Button.Group w='100%'>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          mt={buttonMarginTop}
          flex={1}
          style={buttonStyle}
          onClick={handleInitializePatch}
        >
          Patch
        </Button>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          flex={1}
          mt={buttonMarginTop}
          style={buttonStyle}
          onClick={handleInitializeOperators}
        >
          Operators
        </Button>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          flex={1}
          mt={buttonMarginTop}
          style={buttonStyle}
          onClick={handleInitializeADSR}
        >
          ADSR
        </Button>
      </Button.Group>
    </Fieldset>
  )
}
