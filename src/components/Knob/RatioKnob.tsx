import { RefObject, useEffect, useRef } from 'react'

import { Knob } from './Knob'
import { ratioStepFn } from '../Operator/services/ratio-step-fn/ratio-step-fn'
import { ratioFormatter } from '../Operator/services/ratio-formatter/ratio-formatter'
import { UpdatedProperty, RatioMode, RatioRef } from '../../types'

type Props = {
  propertyPath: string
  ratioRef: RefObject<RatioRef | null>
  ratioMode: RatioMode
  fixed: boolean
  value: number
  onChange: (val: UpdatedProperty[]) => void
}

export const RatioKnob = ({ propertyPath, ratioRef, ratioMode, fixed, value, onChange }: Props) => {
  const prevRatioModeRef = useRef(ratioMode)

  const isScaleMode = ratioMode === 'scale'

  useEffect(() => {
    if (ratioRef.current) {
      ratioRef.current = {
        ...ratioRef.current,
        resetPrevRatioMode: () => {
          prevRatioModeRef.current = 'default'
        }
      }
    }
  }, [ratioMode, ratioRef])

  return (
    <Knob
      label='Ratio'
      propertyPath={propertyPath}
      disabled={fixed}
      ref={ratioRef}
      refName='ratioRef'
      onChange={onChange}
      valueDefault={value}
      valueMin={isScaleMode ? 0 : 50}
      valueMax={isScaleMode ? 60 : 3200}
      center={isScaleMode ? 30 : 1600}
      formatterFn={(val) => ratioFormatter(val, ratioMode, prevRatioModeRef, ratioRef).value}
      valueRawDisplayFn={(val) => ratioFormatter(val, ratioMode, prevRatioModeRef, ratioRef).label}
      stepFn={(val) => ratioStepFn(val, ratioMode, false)}
      stepLargerFn={(val) => ratioStepFn(val, ratioMode, true)}
    />
  )
}
