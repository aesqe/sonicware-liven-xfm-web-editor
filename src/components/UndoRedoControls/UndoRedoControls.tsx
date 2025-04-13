import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/utils'

import { Button, Fieldset, Flex } from '@mantine/core'
import { IconArrowBackUp, IconArrowForwardUp } from '@tabler/icons-react'

import { XFMPatch } from '../../types'
import { patchAtom } from '../../store/atoms'
import { redoStackAtom, undoStackAtom, useHistory } from '../../store/undo-redo'

type Props = {
  handlePatchChange: (patch: XFMPatch | null | undefined, pushToUndo?: boolean) => void
}

const buttonStyle = {
  '--button-bd': '1px solid #BABABA'
}

export const UndoRedoControls = ({ handlePatchChange }: Props) => {
  const { undo, redo } = useHistory()
  const undoStack = useAtomValue(undoStackAtom)
  const redoStack = useAtomValue(redoStackAtom)

  const handleUndo = useAtomCallback(
    useCallback(
      (get) => {
        const patchToRestore = undo(get(patchAtom))
        if (patchToRestore) {
          handlePatchChange(patchToRestore, false)
        }
      },
      [handlePatchChange, undo]
    )
  )

  const handleRedo = useAtomCallback(
    useCallback(
      (get) => {
        const patchToRestore = redo(get(patchAtom))
        if (patchToRestore) {
          handlePatchChange(patchToRestore, false)
        }
      },
      [handlePatchChange, redo]
    )
  )

  return (
    <Fieldset legend='Undo/Redo (work in progress)' w='100%' px={5} py={6}>
      <Flex gap='xs'>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          flex={1}
          leftSection={<IconArrowBackUp size={12} />}
          onClick={handleUndo}
          disabled={undoStack.length === 0}
          style={buttonStyle}
        >
          Undo
        </Button>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          flex={1}
          leftSection={<IconArrowForwardUp size={12} />}
          onClick={handleRedo}
          disabled={redoStack.length === 0}
          style={buttonStyle}
        >
          Redo
        </Button>
      </Flex>
    </Fieldset>
  )
}
