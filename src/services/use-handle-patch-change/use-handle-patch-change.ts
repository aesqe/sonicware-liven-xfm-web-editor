import { useCallback } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { useThrottledCallback } from '@mantine/hooks'

import { XFMPatch } from '../../types'
import { globalRefsAtom, patchAtom, sysexSendThrottleTimeAtom } from '../../store/atoms'

export const useHandlePatchChange = () => {
  const setPatch = useSetAtom(patchAtom)
  const sysexSendThrottleTime = useAtomValue(sysexSendThrottleTimeAtom)
  const refs = useAtomValue(globalRefsAtom)

  const throttledRefUpdates = useThrottledCallback((data: XFMPatch) => {
    refs.op1Ref?.current?.setInternalValue(data.OP1)
    refs.op2Ref?.current?.setInternalValue(data.OP2)
    refs.op3Ref?.current?.setInternalValue(data.OP3)
    refs.op4Ref?.current?.setInternalValue(data.OP4)
    refs.pitchAdsrRef?.current?.setInternalValue(data.Pitch)
    refs.patchNameRef?.current?.setInternalValue(data.Name)
  }, sysexSendThrottleTime)

  const handlePatchChange = useCallback(
    (data: XFMPatch) => {
      setPatch(data)
      setTimeout(() => {
        throttledRefUpdates(data)
      }, 50)
    },
    [setPatch, throttledRefUpdates]
  )

  return handlePatchChange
}
