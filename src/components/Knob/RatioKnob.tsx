import { RefObject, useEffect, useRef } from 'react'

import { Knob } from './Knob'
import { ratioStepFn } from '../Operator/services/ratio-step-fn/ratio-step-fn'
import { ratioFormatter } from '../Operator/services/ratio-formatter/ratio-formatter'
import { OperatorProps, RatioRef } from '../../types'
import { UpdatedProperty, RatioMode } from '../../types'

type Props = {
  opId: string
  fixed: boolean
  ratioRef: RefObject<RatioRef | null>
  ratioMode: RatioMode
  updateValues: (val: UpdatedProperty[]) => void
  values: OperatorProps
}

export const RatioKnob = ({ opId, fixed, ratioRef, ratioMode, updateValues, values }: Props) => {
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
      propertyPath={`${opId}.Ratio`}
      disabled={fixed}
      ref={ratioRef}
      onChange={updateValues}
      valueDefault={values.Ratio}
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
