import { RefObject, useEffect, useState } from 'react'
import { useAtomValue } from 'jotai'
import { TextInput, Tooltip } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'

import { patchAtom } from '../../store/atoms'
import { SetInternalValueRef } from '../../types'
import { tooltipText, validationRegex } from './constants'

type Props = {
  onChange: (patchName: string) => void
  ref: RefObject<SetInternalValueRef<string> | undefined>
}

export const PatchNameEditor = ({ onChange, ref }: Props) => {
  const patch = useAtomValue(patchAtom)
  const [patchName, setPatchName] = useState(patch.Name)
  const [valid, setValid] = useState(true)

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue: setPatchName
      }
    }
  }, [ref])

  const validate = (value: string) => {
    const isValid = value.length > 0 && value.length < 8 && validationRegex.test(value)

    setValid(isValid)

    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    const isValid = validate(value)

    setPatchName(value)

    if (isValid && value !== patch.Name) {
      onChange(value)
    }
  }

  return (
    <TextInput
      flex={1}
      label='Patch Name'
      value={patchName}
      onChange={handleChange}
      error={!valid}
      maxLength={7}
      pt={10}
      styles={{
        input: {
          fontWeight: 700,
          fontSize: 28,
          padding: 6,
          height: 40
        }
      }}
      rightSection={
        <Tooltip
          withArrow
          maw={300}
          multiline
          color='#F0F0F0'
          c='#000000'
          events={{ hover: true, focus: true, touch: true }}
          label={tooltipText}
        >
          <IconInfoCircle />
        </Tooltip>
      }
    />
  )
}
