import { useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { TextInput, Tooltip } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

import { patchAtom } from '../../store/atoms'

const regex = /^[A-Z 0-9]((\.){0,1}[A-Z 0-9]){0,2}(\.){0,1}[A-Z 0-9]?$/

const padPatchName = (patchName: string) => {
  if (patchName.length > 7) {
    return patchName.slice(0, 7)
  }

  if (patchName.length < 7 && patchName.length > 4) {
    return patchName.padEnd(7, ' ')
  }

  return patchName.padEnd(4, ' ')
}

export const PatchNameEditor = ({ onChange }: { onChange: (patchName: string) => void }) => {
  const patch = useAtomValue(patchAtom)
  const [patchName, setPatchName] = useState(patch.Name)
  const [valid, setValid] = useState(false)

  useEffect(() => {
    if (patchName.length === 0 || !regex.test(patchName)) {
      setValid(false)
      return
    }

    setValid(true)

    const paddedPatchName = padPatchName(patchName)

    if (paddedPatchName !== patch.Name) {
      onChange(paddedPatchName)
    }
  }, [onChange, patch, patchName, valid])

  return (
    <>
      <TextInput
        label='Patch Name'
        value={patchName}
        onChange={(e) => setPatchName(e.target.value.toUpperCase())}
        error={!valid}
        maxLength={7}
        rightSection={
          <Tooltip
            withArrow
            maw={300}
            multiline
            color='#F0F0F0'
            c='#000000'
            label='Patch name must be 1-4 characters long and contain only uppercase letters, numbers or spaces. Optionally, you can add a period between any two characters. The name cannot contain 2 or more periods in a row. The name cannot start with a period. The name can end with a period only if there are 4 or less characters in front of it.'
          >
            <IconInfoCircle />
          </Tooltip>
        }
        pt={10}
        styles={{
          input: {
            fontWeight: 700,
            fontSize: 40,
            padding: 10,
            height: 50
          }
        }}
      />
    </>
  )
}
