import { useEffect, useRef, useState, useCallback } from 'react'
import { useSetAtom, Setter } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import { TextInput, Tooltip } from '@mantine/core'
import { useDebouncedCallback } from '@mantine/hooks'
import { IconInfoCircle } from '@tabler/icons-react'

import { SetInternalValueRef } from '../../types'
import { globalRefsAtom, patchAtom } from '../../store/atoms'
import { tooltipText, validationRegex } from './constants'

export const PatchNameEditor = () => {
  const setGlobalRef = useSetAtom(globalRefsAtom)
  const [valid, setValid] = useState(true)
  const [patchName, setPatchName] = useState('INIT')
  const patchNameRef = useRef<SetInternalValueRef<string>>(undefined)

  useEffect(() => {
    patchNameRef.current = {
      setInternalValue: setPatchName
    }
  }, [setPatchName])

  useEffect(() => {
    setGlobalRef((prev) => ({
      ...prev,
      patchNameRef
    }))
  }, [setGlobalRef])

  const handleDebouncedChange = useAtomCallback(
    useDebouncedCallback(
      useCallback(
        (_get, set: Setter, value: string) => {
          if (valid) {
            set(patchAtom, (prev) => ({
              ...prev,
              Name: value.padEnd(4, ' ')
            }))
          }
        },
        [valid]
      ),
      1000
    )
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.toUpperCase()
      const isValid = value.length > 0 && value.length < 8 && validationRegex.test(value)

      setValid(isValid)
      setPatchName(value)
      handleDebouncedChange(value)
    },
    [handleDebouncedChange]
  )

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
