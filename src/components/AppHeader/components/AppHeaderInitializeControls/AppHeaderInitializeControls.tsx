import { useCallback } from 'react'
import { useAtomCallback } from 'jotai/utils'
import { Button } from '@mantine/core'
import { Fieldset } from '@mantine/core'

import initPatch from '../../../../assets/presets/initpatch.json'
import { XFMPatch } from '../../../../types'
import { patchAtom } from '../../../../store/atoms'
import { MainButton } from '../../../MainButton/MainButton'
import { defaultADSR } from '../../../../constants'

type Props = {
  handlePatchChange: (patch: XFMPatch) => void
  viewportWidth: number
}

export const AppHeaderInitializeControls = ({ handlePatchChange, viewportWidth }: Props) => {
  const buttonMarginTop = viewportWidth > 970 ? 2 : 20

  const handleInitializePatch = useCallback(() => {
    handlePatchChange(initPatch)
  }, [handlePatchChange])

  const handleInitializeADSR = useAtomCallback(
    useCallback(
      (get) => {
        const patch = get(patchAtom)
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
      },
      [handlePatchChange]
    )
  )

  const handleInitializeOperators = useAtomCallback(
    useCallback(
      (get) => {
        const patch = get(patchAtom)
        const { Mixer, Pitch, Name } = patch

        handlePatchChange({
          ...initPatch,
          Mixer,
          Pitch,
          Name
        })
      },
      [handlePatchChange]
    )
  )

  return (
    <Fieldset legend='Initialize' w='100%' px={5} py={6}>
      <Button.Group w='100%'>
        <MainButton mt={buttonMarginTop} onClick={handleInitializePatch}>
          Patch
        </MainButton>
        <MainButton mt={buttonMarginTop} onClick={handleInitializeOperators}>
          Operators
        </MainButton>
        <MainButton mt={buttonMarginTop} onClick={handleInitializeADSR}>
          ADSR
        </MainButton>
      </Button.Group>
    </Fieldset>
  )
}
