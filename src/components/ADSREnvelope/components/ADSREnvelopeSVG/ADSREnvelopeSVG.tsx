import { RefObject, useCallback, useEffect, useState } from 'react'
import { Box, useMantineColorScheme } from '@mantine/core'

import {
  lineColorLight,
  lineColorDark,
  strokeColorLight,
  strokeColorDark,
  attackPointColorLight,
  attackPointColorDark,
  decayPointColorLight,
  decayPointColorDark,
  sustainPointColorLight,
  sustainPointColorDark,
  releasePointColorLight,
  releasePointColorDark,
  keyOffPointColor
} from '../../../../theme'
import { getTimePosition } from '../../services/get-time-position/get-time-position'
import { createCurvedPath } from '../../services/create-curved-path/create-curved-path'
import { ADSRValues, DragPoint } from '../../../../types'

type Props = {
  ref: RefObject<SVGSVGElement | null>
  width: number
  height: number
  padding: number
  pitchEnv: boolean
  values: ADSRValues
  onChange: (values: ADSRValues) => void
}

export const ADSREnvelopeSVG = ({
  ref,
  width,
  height,
  values,
  padding = 10,
  pitchEnv = false,
  onChange
}: Props) => {
  const { colorScheme } = useMantineColorScheme()
  const [dragging, setDragging] = useState<DragPoint>(null)
  // Calculate the effective drawing dimensions with padding
  const drawingWidth = width - padding * 2
  const drawingHeight = height - padding * 2
  const segmentWidth = drawingWidth / 5

  const startPoint = {
    x: padding,
    y: pitchEnv ? height / 2 : height - padding
  }

  const attackOffset = Math.min(segmentWidth, segmentWidth * values.ATime)
  const attackPoint = {
    x: padding + attackOffset,
    y: height - padding - values.ALevel * drawingHeight
  }

  const decayOffset = Math.min(segmentWidth, segmentWidth * values.DTime)
  const decayPoint = {
    x: attackPoint.x + decayOffset,
    y: height - padding - values.DLevel * drawingHeight
  }

  const sustainOffset = Math.min(segmentWidth, segmentWidth * values.STime)
  const sustainPoint = {
    x: decayPoint.x + sustainOffset,
    y: height - padding - values.SLevel * drawingHeight
  }

  const keyOffPoint = {
    x: padding + drawingWidth * 0.8, // FIXED at 80% position
    y: height - padding - values.SLevel * drawingHeight
  }

  const releaseOffset = Math.min(segmentWidth, segmentWidth * values.RTime)
  const releasePoint = {
    x: keyOffPoint.x + releaseOffset,
    y: height - padding - values.RLevel * drawingHeight
  }

  const attackSegment = createCurvedPath(startPoint, attackPoint, values)
  const decaySegment = createCurvedPath(attackPoint, decayPoint, values)
  const sustainSegment = createCurvedPath(decayPoint, sustainPoint, values)
  const dashLineSegment = `M ${sustainPoint.x},${sustainPoint.y} L ${keyOffPoint.x},${keyOffPoint.y}`
  const releaseSegment = createCurvedPath(keyOffPoint, releasePoint, values)

  const handleMouseDown = (point: DragPoint) => () => {
    setDragging(point)
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging || !ref.current) {
        return
      }

      if ('touches' in e && e.cancelable) {
        e.preventDefault()
      }

      const svgRect = ref.current.getBoundingClientRect()
      const cx = 'clientX' in e ? e.clientX : e.touches[0].clientX
      const cy = 'clientY' in e ? e.clientY : e.touches[0].clientY
      const xPos = Math.max(padding, Math.min(width - padding, cx - svgRect.left))
      const yPos = Math.max(padding, Math.min(height - padding, cy - svgRect.top))
      const level = Math.max(0, Math.min(1, 1 - (yPos - padding) / drawingHeight))

      const newValues = { ...values }

      switch (dragging) {
        case 'attack': {
          newValues.ATime = getTimePosition(xPos, padding, segmentWidth)
          newValues.ALevel = level
          break
        }

        case 'decay': {
          newValues.DTime = getTimePosition(xPos, attackPoint.x, segmentWidth)
          newValues.DLevel = level
          break
        }

        case 'sustain': {
          newValues.STime = getTimePosition(xPos, decayPoint.x, segmentWidth)
          newValues.SLevel = level
          break
        }

        case 'release': {
          newValues.RTime = getTimePosition(xPos, keyOffPoint.x, segmentWidth)
          newValues.RLevel = level
          break
        }
      }

      onChange?.(newValues)
    },
    [
      segmentWidth,
      attackPoint.x,
      decayPoint.x,
      dragging,
      drawingHeight,
      height,
      keyOffPoint.x,
      onChange,
      padding,
      ref,
      values,
      width
    ]
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleMouseMove, { passive: false })
    window.addEventListener('touchend', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleMouseMove)
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [handleMouseMove])

  const lineColor = colorScheme === 'light' ? lineColorLight : lineColorDark
  const strokeColor = colorScheme === 'light' ? strokeColorLight : strokeColorDark
  const attackPointColor = colorScheme === 'light' ? attackPointColorLight : attackPointColorDark
  const decayPointColor = colorScheme === 'light' ? decayPointColorLight : decayPointColorDark
  const sustainPointColor = colorScheme === 'light' ? sustainPointColorLight : sustainPointColorDark
  const releasePointColor = colorScheme === 'light' ? releasePointColorLight : releasePointColorDark

  return (
    <Box w={width} h={height} bd={`1px solid ${colorScheme === 'light' ? '#DEDEDE' : '#777777'}`}>
      <svg
        ref={ref}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ userSelect: 'none' }}
      >
        <g>
          {/* Solid line segments */}
          <path d={attackSegment} stroke={lineColor} strokeWidth={2} fill='none' />
          <path d={decaySegment} stroke={lineColor} strokeWidth={2} fill='none' />
          <path d={sustainSegment} stroke={lineColor} strokeWidth={2} fill='none' />

          {/* Dashed segment from sustain to key off point */}
          <path
            d={dashLineSegment}
            stroke={lineColor}
            strokeWidth={2}
            strokeDasharray='5,5'
            fill='none'
          />

          <path d={releaseSegment} stroke={lineColor} strokeWidth={2} fill='none' />

          {/* Attack control point */}
          <circle
            cx={attackPoint.x}
            cy={attackPoint.y}
            r={8}
            fill={attackPointColor}
            stroke={strokeColor}
            strokeWidth={1.5}
            style={{ cursor: 'move' }}
            onMouseDown={handleMouseDown('attack')}
            onTouchStart={handleMouseDown('attack')}
          />

          {/* Decay control point */}
          <circle
            cx={decayPoint.x}
            cy={decayPoint.y}
            r={8}
            fill={decayPointColor}
            stroke={strokeColor}
            strokeWidth={1.5}
            style={{ cursor: 'move' }}
            onMouseDown={handleMouseDown('decay')}
            onTouchStart={handleMouseDown('decay')}
          />

          {/* Sustain control point */}
          <circle
            cx={sustainPoint.x}
            cy={sustainPoint.y}
            r={8}
            fill={sustainPointColor}
            stroke={strokeColor}
            strokeWidth={1.5}
            style={{ cursor: 'move' }}
            onMouseDown={handleMouseDown('sustain')}
            onTouchStart={handleMouseDown('sustain')}
          />

          {/* Key Off point */}
          <rect
            x={keyOffPoint.x - 8}
            y={keyOffPoint.y - 8}
            width={16}
            height={16}
            fill={keyOffPointColor}
            stroke={strokeColor}
            strokeWidth={2}
          />

          {/* Release control point */}
          <circle
            cx={releasePoint.x}
            cy={releasePoint.y}
            r={8}
            fill={releasePointColor}
            stroke={strokeColor}
            strokeWidth={1.5}
            style={{ cursor: 'move' }}
            onMouseDown={handleMouseDown('release')}
            onTouchStart={handleMouseDown('release')}
          />
        </g>
      </svg>
    </Box>
  )
}
