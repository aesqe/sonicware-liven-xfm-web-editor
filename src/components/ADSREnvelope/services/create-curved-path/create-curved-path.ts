import { range_1818 } from '../../constants'
import { ADSRValues } from '../../../../types'

export const createCurvedPath = (
  startPoint: { x: number; y: number },
  endPoint: { x: number; y: number },
  values: ADSRValues
) => {
  const isRising = startPoint.y < endPoint.y
  // Select the appropriate curve value based on direction
  // Important: isRising parameter might not match actual Y direction due to coordinate calculations
  const curveValue = isRising
    ? 'UpCurve' in values
      ? range_1818.mapFrom01(values.UpCurve ?? 0)
      : 0
    : 'DnCurve' in values
      ? range_1818.mapFrom01(values.DnCurve ?? 0)
      : 0

  // Calculate the distance
  const dx = endPoint.x - startPoint.x
  const dy = endPoint.y - startPoint.y

  // Only use a straight line if exactly zero curve or truly zero-length segment
  if (curveValue === 0 || (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001)) {
    return `M ${startPoint.x},${startPoint.y} L ${endPoint.x},${endPoint.y}`
  }

  try {
    // Calculate the length of the line segment
    const segmentLength = Math.sqrt(dx * dx + dy * dy)

    // For nearly horizontal segments (very small height difference), draw a straight line
    // This prevents weird curves when points are at virtually the same level
    const heightRatio = Math.abs(dy) / Math.abs(dx)
    if (heightRatio < 0.05) {
      // If height difference is less than 5% of width
      return `M ${startPoint.x},${startPoint.y} L ${endPoint.x},${endPoint.y}`
    }

    // Scale factor - this controls how dramatic the curve appears
    const CURVE_AMPLIFICATION = 0.25

    // Horizontal positioning based on curve sign (timing effect)
    let controlX
    if (curveValue < 0) {
      // Negative: Faster effect - control point closer to start point
      controlX = startPoint.x + dx * 0.33
    } else {
      // Positive: Slower effect - control point closer to end point
      controlX = startPoint.x + dx * 0.67
    }

    // Ensure controlX is strictly between startX and endX
    controlX = Math.min(
      Math.max(controlX, Math.min(startPoint.x, endPoint.x)),
      Math.max(startPoint.x, endPoint.x)
    )

    // SIMPLIFIED APPROACH:
    // 1. First get the actual direction of the segment (in screen coordinates)
    // 2. Create perpendicular vectors based on this actual direction
    // 3. Apply the curve offset in a consistent way

    // Determine actual direction (in screen coordinates Y increases downward)
    // Use a threshold to determine rising/falling to avoid flips with tiny differences
    const DIRECTION_THRESHOLD = 1.0 // 1 pixel threshold
    const actuallyRising = startPoint.y - endPoint.y > DIRECTION_THRESHOLD
    const actuallyFalling = endPoint.y - startPoint.y > DIRECTION_THRESHOLD

    // If neither clearly rising nor falling, use a straight line
    if (!actuallyRising && !actuallyFalling) {
      return `M ${startPoint.x},${startPoint.y} L ${endPoint.x},${endPoint.y}`
    }

    // Calculate the straight-line Y value at controlX position
    let midY
    if (Math.abs(dx) < 0.001) {
      midY = (startPoint.y + endPoint.y) / 2
    } else {
      midY = startPoint.y + (dy * (controlX - startPoint.x)) / dx
    }

    // Calculate perpendicular offset
    // Scale based on segment length and curve value
    const perpScale = Math.abs(curveValue / 18) * CURVE_AMPLIFICATION * segmentLength

    // Simple direct approach:
    // 1. For rising segments (going up on screen, i.e., endY < startY):
    //    - Positive curve bends left (concave)
    //    - Negative curve bends right (convex)
    // 2. For falling segments (going down on screen, i.e., endY > startY):
    //    - Positive curve bends right (concave)
    //    - Negative curve bends left (convex)
    let perpDirection

    if (actuallyRising) {
      // For rising segments
      perpDirection = curveValue > 0 ? -1 : 1
    } else {
      // For falling segments (this will only be reached if actuallyFalling is true due to check above)
      perpDirection = curveValue > 0 ? 1 : -1
    }

    // Apply offset to get control point Y
    const controlY = midY + perpScale * perpDirection

    // Create quadratic Bezier curve
    return `M ${startPoint.x},${startPoint.y} Q ${controlX},${controlY} ${endPoint.x},${endPoint.y}`
  } catch (e) {
    // Fallback to straight line if any calculation error
    console.error('Error creating curve:', e)
    return `M ${startPoint.x},${startPoint.y} L ${endPoint.x},${endPoint.y}`
  }
}
