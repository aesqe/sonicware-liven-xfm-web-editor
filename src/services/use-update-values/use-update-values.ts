import { useCallback, useEffect, useRef } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { useThrottledCallback } from '@mantine/hooks'

import { compareObjects } from '../compare-objects/compare-objects'
import { useSendPatchToXFM } from '../use-send-patch-to-xfm/use-send-patch-to-xfm'
import { logSysExAtom, patchAtom } from '../../store/atoms'
import { updateObjectValueByPath } from '../update-object-value-by-path/update-object-value-by-path'
import { UpdatedProperty, XFMPatch } from '../../types'
import { sysexSendThrottleTimeAtom } from '../../store/atoms'

export const useUpdateValues = () => {
  const sendPatchToXFM = useSendPatchToXFM()
  const [patch, setPatch] = useAtom(patchAtom)
  const logSysEx = useAtomValue(logSysExAtom)
  const sysexSendThrottleTime = useAtomValue(sysexSendThrottleTimeAtom)
  const prevPatchRef = useRef<XFMPatch>(patch)

  const updateValues = useThrottledCallback(
    useCallback(
      (props: UpdatedProperty[]) => {
        const updatedPatch = props.reduce(
          (acc, { propertyPath, formatterFn, value }) =>
            updateObjectValueByPath(acc, propertyPath, formatterFn ? formatterFn(value) : value),
          patch
        )

        setPatch(updatedPatch)
      },
      [patch, setPatch]
    ),
    sysexSendThrottleTime
  )

  const throttledSendPatch = useThrottledCallback(() => {
    if (!compareObjects(prevPatchRef.current, patch)) {
      prevPatchRef.current = patch

      if (logSysEx) {
        console.log('Sending patch', patch)
      }

      sendPatchToXFM(patch)
    }
  }, sysexSendThrottleTime)

  useEffect(() => {
    throttledSendPatch()
  }, [patch, throttledSendPatch])

  return updateValues
}
