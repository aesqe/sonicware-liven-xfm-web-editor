import { useCallback } from 'react'
import { useAtomValue } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import { useThrottledCallback } from '@mantine/hooks'

import { useSendPatchToXFM } from '../use-send-patch-to-xfm/use-send-patch-to-xfm'
import { patchAtom, sysexSendThrottleTimeAtom, usePatchAtomListener } from '../../store/atoms'

export const useMonitorPatchAtom = () => {
  const sendPatchToXFM = useSendPatchToXFM()
  const sysexSendThrottleTime = useAtomValue(sysexSendThrottleTimeAtom)

  const throttledSendPatch = useThrottledCallback(
    useAtomCallback(
      useCallback(
        (get) => {
          const patch = get(patchAtom)

          sendPatchToXFM(patch)
        },
        [sendPatchToXFM]
      )
    ),
    sysexSendThrottleTime
  )

  usePatchAtomListener(throttledSendPatch)
}
