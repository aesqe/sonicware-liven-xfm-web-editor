import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/utils'

import { XFMPatch } from '../../types'
import { globalRefsAtom, patchAtom } from '../../store/atoms'

export const useHandlePatchChange = () => {
  const refs = useAtomValue(globalRefsAtom)

  const throttledRefUpdates = useCallback(
    (data: XFMPatch) => {
      refs.op1Ref?.current?.setInternalValue(data.OP1)
      refs.op2Ref?.current?.setInternalValue(data.OP2)
      refs.op3Ref?.current?.setInternalValue(data.OP3)
      refs.op4Ref?.current?.setInternalValue(data.OP4)
      refs.pitchAdsrRef?.current?.setInternalValue(data.Pitch, true)
      refs.patchNameRef?.current?.setInternalValue(data.Name)
    },
    [refs]
  )

  const handlePatchChange = useAtomCallback(
    useCallback(
      (_get, set, data: XFMPatch | null | undefined) => {
        if (!data) {
          return
        }

        set(patchAtom, data)
        throttledRefUpdates(data)
      },
      [throttledRefUpdates]
    )
  )

  return handlePatchChange
}
