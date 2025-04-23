import { useMemoOne as useStableMemo } from 'use-memo-one'
import { useAtomValue } from 'jotai/react'
import { atomEffect } from 'jotai-effect'

type EffectFn = Parameters<typeof atomEffect>[0]

export const useAtomEffect = (effectFn: EffectFn) => {
  useAtomValue(useStableMemo(() => atomEffect(effectFn), [effectFn]))
}
