export const getTimePosition = (xpos: number, segmentStartPos: number, segmentWidth: number) => {
  if (xpos > segmentStartPos) {
    const segmentPos = xpos - segmentStartPos
    const segmentRatio = Math.min(1, segmentPos / segmentWidth)

    return Math.max(0, segmentRatio)
  }

  return 0
}
