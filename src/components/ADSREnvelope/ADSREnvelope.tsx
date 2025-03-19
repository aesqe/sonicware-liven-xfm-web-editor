import { useState, useEffect, useRef, useCallback, RefObject, CSSProperties } from 'react'
import { useAtom } from 'jotai'
import { Box, Button, Flex, Stack, Title } from '@mantine/core'

import {
  defaultADSRCurve,
  spreadADSRCurve01,
  defaultADSRCurve01,
  defaultPitchADSRCurve,
  defaultPitchADSRCurve01
} from './constants'
import { convertInput } from './services/convert-input/convert-input'
import { convertOutput } from './services/convert-output/convert-output'
import { createCurvedPath } from './services/create-curved-path/create-curved-path'
import { ADSREnvelopeKnobs } from './components/ADSREnvelopeKnobs/ADSREnvelopeKnobs'
import { getRandomValues01 } from './services/get-random-values-01/get-random-values-01'
import { envelopeClipboardAtom } from '../../store/atoms'
import { range0127, range_1818, range_4848 } from './constants'
import { ADSRValues, UpdatedProperty, SetInternalValueRef } from '../../types'

type Props = {
  initialState?: ADSRValues
  onChange?: (values: ADSRValues) => void
  width?: number
  height?: number
  pitchEnv?: boolean
  ref?: RefObject<SetInternalValueRef<ADSRValues> | undefined>
  knobSize?: CSSProperties['width']
  containerWidth?: number
  padding?: number
}

type DragPoint = 'attack' | 'decay' | 'sustain' | 'release' | null

export const ADSREnvelope = ({
  ref,
  width = 320,
  containerWidth = width,
  height = 160,
  padding = 10,
  knobSize = '2rem',
  pitchEnv = false,
  initialState = pitchEnv ? defaultPitchADSRCurve : defaultADSRCurve,
  onChange
}: Props) => {
  // pitch env has a different range for levels
  const range = pitchEnv ? range_4848 : range0127
  // values are in 0..1 range
  const [values, setValues] = useState<ADSRValues>(convertInput(initialState, range))
  const [dragging, setDragging] = useState<DragPoint>(null)
  const [envelopeClipboard, setEnvelopeClipboard] = useAtom(envelopeClipboardAtom)
  const svgRef = useRef<SVGSVGElement>(null)
  const knobsRef = useRef<SetInternalValueRef<ADSRValues>>(undefined)

  // Calculate the effective drawing dimensions with padding
  const drawingWidth = width - padding * 2
  const drawingHeight = height - padding * 2

  const SEGMENT_WIDTH = drawingWidth / 5

  const startPoint = {
    x: padding,
    y: pitchEnv ? height / 2 : height - padding
  }

  const attackOffset = Math.min(SEGMENT_WIDTH, SEGMENT_WIDTH * values.ATime)
  const attackPoint = {
    x: padding + attackOffset,
    y: height - padding - values.ALevel * drawingHeight
  }

  const decayOffset = Math.min(SEGMENT_WIDTH, SEGMENT_WIDTH * values.DTime)
  const decayPoint = {
    x: attackPoint.x + decayOffset,
    y: height - padding - values.DLevel * drawingHeight
  }

  const sustainOffset = Math.min(SEGMENT_WIDTH, SEGMENT_WIDTH * values.STime)
  const sustainPoint = {
    x: decayPoint.x + sustainOffset,
    y: height - padding - values.SLevel * drawingHeight
  }

  const keyOffPoint = {
    x: padding + drawingWidth * 0.8, // FIXED at 80% position
    y: height - padding - values.SLevel * drawingHeight
  }

  const releaseOffset = Math.min(SEGMENT_WIDTH, SEGMENT_WIDTH * values.RTime)
  const releasePoint = {
    x: keyOffPoint.x + releaseOffset,
    y: height - padding - values.RLevel * drawingHeight
  }

  const setEnvelopeValues = useCallback(
    (values: ADSRValues) => {
      const output = convertOutput(values, range)
      setValues(values)
      knobsRef.current?.setInternalValue(output)
      onChange?.(output)
    },
    [onChange, range, knobsRef]
  )

  const resetEnvelope = () => {
    setEnvelopeValues(pitchEnv ? defaultPitchADSRCurve01 : defaultADSRCurve01)
  }

  const spreadEnvelope = () => {
    setEnvelopeValues(spreadADSRCurve01)
  }

  const copyEnvelope = () => {
    setEnvelopeClipboard(values)
  }

  const pasteEnvelope = () => {
    if (envelopeClipboard) {
      setEnvelopeValues(envelopeClipboard)
    }
  }

  const randomizeEnvelope = () => {
    setEnvelopeValues(getRandomValues01())
  }

  useEffect(() => {
    if (ref) {
      ref.current = {
        setInternalValue: (values: ADSRValues) => {
          setEnvelopeValues(convertInput(values, range))
        }
      }
    }
  }, [range, ref, setEnvelopeValues])

  const handleMouseDown = useCallback(
    (point: DragPoint) => () => {
      setDragging(point)
    },
    []
  )

  const handleMouseUp = () => {
    setDragging(null)
  }

  const getTimePosition = useCallback(
    (xpos: number, segmentStartPos: number) => {
      if (xpos > segmentStartPos) {
        const segmentPos = xpos - segmentStartPos
        const segmentRatio = Math.min(1, segmentPos / SEGMENT_WIDTH)
        return Math.max(0, segmentRatio)
      }

      return 0
    },
    [SEGMENT_WIDTH]
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!dragging || !svgRef.current) {
        return
      }

      if ('touches' in e && e.cancelable) {
        e.preventDefault()
      }

      const cx = 'clientX' in e ? e.clientX : e.touches[0].clientX
      const cy = 'clientY' in e ? e.clientY : e.touches[0].clientY

      const svgRect = svgRef.current.getBoundingClientRect()
      const x = cx - svgRect.left
      const y = cy - svgRect.top

      const xPos = Math.max(padding, Math.min(width - padding, x))
      const yPos = Math.max(padding, Math.min(height - padding, y))

      const level = Math.max(0, Math.min(1, 1 - (yPos - padding) / drawingHeight))

      const newValues = { ...values }

      switch (dragging) {
        case 'attack': {
          newValues.ATime = getTimePosition(xPos, padding)
          newValues.ALevel = level
          break
        }

        case 'decay': {
          newValues.DTime = getTimePosition(xPos, attackPoint.x)
          newValues.DLevel = level
          break
        }

        case 'sustain': {
          newValues.STime = getTimePosition(xPos, decayPoint.x)
          newValues.SLevel = level
          break
        }

        case 'release': {
          newValues.RTime = getTimePosition(xPos, keyOffPoint.x)
          newValues.RLevel = level
          break
        }
      }

      setValues(newValues)
      knobsRef.current?.setInternalValue(convertOutput(newValues, range))
      onChange?.(convertOutput(newValues, range))
    },
    [
      attackPoint.x,
      decayPoint.x,
      dragging,
      drawingHeight,
      getTimePosition,
      height,
      keyOffPoint.x,
      onChange,
      padding,
      range,
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

  const attackSegment = createCurvedPath(startPoint, attackPoint, values)
  const decaySegment = createCurvedPath(attackPoint, decayPoint, values)
  const sustainSegment = createCurvedPath(decayPoint, sustainPoint, values)
  const dashLineSegment = `M ${sustainPoint.x},${sustainPoint.y} L ${keyOffPoint.x},${keyOffPoint.y}`
  const releaseSegment = createCurvedPath(keyOffPoint, releasePoint, values)

  const handleKnobChange = ([data]: UpdatedProperty[]) => {
    let updatedValue = 0

    if (data.propertyPath.endsWith('Level')) {
      updatedValue = range.mapTo01(data.value)
    } else if (data.propertyPath.endsWith('Time')) {
      updatedValue = data.value / 127
    } else {
      updatedValue = range_1818.mapTo01(data.value)
    }

    const updatedValues = {
      ...values,
      [data.propertyPath]: updatedValue
    }

    setValues(updatedValues)
    onChange?.(convertOutput(updatedValues, range))
  }

  return (
    <Box px={8} py={10} style={{ overflow: 'hidden' }}>
      <Stack gap={0} w={width}>
        {pitchEnv && (
          <Title order={4} ta='left' mb={10} mt={0}>
            Pitch Envelope
          </Title>
        )}
        <Button.Group>
          <Button
            flex={1}
            size='xs'
            color='#e6e3e1'
            c='dark'
            onClick={resetEnvelope}
            style={{ '--button-bd': '1px solid #BABABA' }}
          >
            Init
          </Button>
          {!pitchEnv && (
            <>
              <Button
                flex={1}
                size='xs'
                color='#e6e3e1'
                c='dark'
                onClick={copyEnvelope}
                style={{ '--button-bd': '1px solid #BABABA' }}
              >
                Copy
              </Button>
              <Button
                flex={1}
                size='xs'
                color='#e6e3e1'
                c='dark'
                onClick={pasteEnvelope}
                style={{ '--button-bd': '1px solid #BABABA' }}
              >
                Paste
              </Button>
              <Button
                flex={1}
                size='xs'
                color='#e6e3e1'
                c='dark'
                onClick={spreadEnvelope}
                style={{ '--button-bd': '1px solid #BABABA' }}
              >
                Spread
              </Button>
            </>
          )}
          <Button
            flex={1}
            size='xs'
            color='#e6e3e1'
            c='dark'
            onClick={randomizeEnvelope}
            style={{ '--button-bd': '1px solid #BABABA' }}
          >
            Random
          </Button>
        </Button.Group>
        <Flex my={10}>
          <Box w={width} h={height} bd='1px solid #DEDEDE'>
            <svg
              ref={svgRef}
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              style={{ userSelect: 'none' }}
            >
              <g>
                {/* Solid line segments */}
                <path d={attackSegment} stroke='#000000' strokeWidth={2} fill='none' />
                <path d={decaySegment} stroke='#000000' strokeWidth={2} fill='none' />
                <path d={sustainSegment} stroke='#000000' strokeWidth={2} fill='none' />

                {/* Dashed segment from sustain to key off point */}
                <path
                  d={dashLineSegment}
                  stroke='#000000'
                  strokeWidth={2}
                  strokeDasharray='5,5'
                  fill='none'
                />

                <path d={releaseSegment} stroke='#000000' strokeWidth={2} fill='none' />

                {/* Attack control point */}
                <circle
                  cx={attackPoint.x}
                  cy={attackPoint.y}
                  r={8}
                  fill='#48a5f4'
                  stroke='#FFFFFF'
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
                  fill='#25c370'
                  stroke='#FFFFFF'
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
                  fill='#ffa381'
                  stroke='#FFFFFF'
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
                  fill='#888888'
                  stroke='#FFFFFF'
                  strokeWidth={2}
                />

                {/* Release control point */}
                <circle
                  cx={releasePoint.x}
                  cy={releasePoint.y}
                  r={8}
                  fill='#edd314'
                  stroke='#FFFFFF'
                  strokeWidth={1.5}
                  style={{ cursor: 'move' }}
                  onMouseDown={handleMouseDown('release')}
                  onTouchStart={handleMouseDown('release')}
                />
              </g>
            </svg>
          </Box>
        </Flex>

        <ADSREnvelopeKnobs
          values={convertOutput(values, range)}
          range={range}
          handleKnobChange={handleKnobChange}
          knobSize={containerWidth < 800 ? '1.5rem' : knobSize}
          pitchEnv={pitchEnv}
          ref={knobsRef}
        />
      </Stack>
    </Box>
  )
}
