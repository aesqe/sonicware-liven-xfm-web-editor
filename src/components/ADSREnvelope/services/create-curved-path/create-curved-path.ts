import { ADSRValues } from '../../../../types'
import { range_1818 } from '../../constants'

export const createCurvedPath = (
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number },
  values: ADSRValues
) => {
  const isRising = startPoint.y < endPoint.y
  const curveValue = !isRising
    ? 'UpCurve' in values
      ? range_1818.mapFrom01(values.UpCurve ?? 0)
      : 0
    : 'DnCurve' in values
      ? range_1818.mapFrom01(values.DnCurve ?? 0)
      : 0

  const dx = endPoint.x - startPoint.x
  const dy = endPoint.y - startPoint.y
  const segmentLength = Math.sqrt(dx * dx + dy * dy)

  if (curveValue === 0 || segmentLength < 0.05 || (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001)) {
    return `M ${startPoint.x},${startPoint.y} L ${endPoint.x},${endPoint.y}`
  }

  const exponent = Math.pow(1.5, curveValue / 1.8)
  const tValue = -curveValue < 0 ? 0.9 : 0.1
  const controlX = startPoint.x + dx * tValue
  const normalizedY = Math.pow(tValue, exponent / 1.05)
  const controlY = startPoint.y + dy * normalizedY * 1.05

  return `M ${startPoint.x},${startPoint.y} Q ${controlX},${controlY} ${endPoint.x},${endPoint.y}`
}
