import { useEffect, useRef, useState } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { TextInput, Tooltip } from '@mantine/core'
import { useThrottledCallback } from '@mantine/hooks'
import { IconInfoCircle } from '@tabler/icons-react'

import { useSendPatchToXFM } from '../../services/use-send-patch-to-xfm/use-send-patch-to-xfm'
import { SetInternalValueRef } from '../../types'
import { tooltipText, validationRegex } from './constants'
import { globalRefsAtom, patchAtom, sysexSendThrottleTimeAtom } from '../../store/atoms'

export const PatchNameEditor = () => {
  const [valid, setValid] = useState(true)
  const sendPatchToXFM = useSendPatchToXFM()
  const [patch, setPatch] = useAtom(patchAtom)
  const [patchName, setPatchName] = useState(patch.Name)
  const sysexSendThrottleTime = useAtomValue(sysexSendThrottleTimeAtom)
  const setGlobalRef = useSetAtom(globalRefsAtom)
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

  const updatePatchName = useThrottledCallback((patchName: string) => {
    const updatedPatch = { ...patch, Name: patchName.padEnd(4, ' ') }

    setPatch(updatedPatch)
    sendPatchToXFM(updatedPatch)
  }, sysexSendThrottleTime * 10)

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
      updatePatchName(value)
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
