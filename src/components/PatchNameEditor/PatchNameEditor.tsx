import { RefObject, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { TextInput, Tooltip } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

import { patchAtom } from '../../store/atoms'
import { SetInternalValueRef } from '../../types'

const regex = /^[A-Z 0-9]((\.){0,1}[A-Z 0-9]){0,2}(\.){0,1}[A-Z 0-9]?$/

type Props = {
  onChange: (patchName: string) => void
  ref: RefObject<SetInternalValueRef<string> | undefined>
}

export const PatchNameEditor = ({ onChange, ref }: Props) => {
  const patch = useAtomValue(patchAtom)
  const [patchName, setPatchName] = useState(patch.Name)
  const [valid, setValid] = useState(true)

  const validate = (value: string) => {
    const isValid = value.length > 0 && value.length < 8 && regex.test(value)

    setValid(isValid)

    return isValid
  }

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue: setPatchName
      }
    }
  }, [ref])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    const isValid = validate(value)

    if (isValid && value !== patch.Name) {
      onChange(value)
      setPatchName(value)
    }
  }

  return (
    <>
      <TextInput
        label='Patch Name'
        value={patchName}
        onChange={handleChange}
        error={!valid}
        maxLength={7}
        rightSection={
          <Tooltip
            withArrow
            maw={300}
            multiline
            color='#F0F0F0'
            c='#000000'
            events={{ hover: true, focus: true, touch: true }}
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
