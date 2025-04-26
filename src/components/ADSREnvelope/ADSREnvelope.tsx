import { useState, useEffect, useRef, useCallback, RefObject, CSSProperties } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { Box, Button, Flex, Stack, Title, BoxProps } from '@mantine/core'

import {
  defaultADSRCurve,
  spreadADSRCurve01,
  defaultADSRCurve01,
  defaultPitchADSRCurve,
  defaultPitchADSRCurve01
} from './constants'
import { MainButton } from '../MainButton/MainButton'
import { convertInput } from './services/convert-input/convert-input'
import { convertOutput } from './services/convert-output/convert-output'
import { ADSREnvelopeSVG } from './components/ADSREnvelopeSVG/ADSREnvelopeSVG'
import { ADSREnvelopeKnobs } from './components/ADSREnvelopeKnobs/ADSREnvelopeKnobs'
import { getRandomValues01 } from './services/get-random-values-01/get-random-values-01'
import { objectsAreJSONEqual } from '../../services/compare-objects/compare-objects'
import { range0127, range_1818, range_4848 } from './constants'
import { envelopeClipboardAtom, globalRefsAtom } from '../../store/atoms'
import { ADSRValues, UpdatedProperty, ADSREnvelopeRef } from '../../types'

type Props = {
  initialState?: ADSRValues
  onChange?: (values: ADSRValues) => void
  width?: number
  height?: number
  pitchEnv?: boolean
  ref?: RefObject<ADSREnvelopeRef | undefined>
  knobSize?: CSSProperties['width']
  padding?: number
  pathBase: string
} & Partial<BoxProps>

export const ADSREnvelope = ({
  ref,
  onChange,
  pathBase,
  width = 320,
  height = 160,
  padding = 10,
  knobSize = '2rem',
  pitchEnv = false,
  initialState = pitchEnv ? defaultPitchADSRCurve : defaultADSRCurve,
  ...boxProps
}: Props) => {
  // pitch env has a different range for levels
  const range = pitchEnv ? range_4848 : range0127

  // values are in 0..1 range
  const [values, setValues] = useState<ADSRValues>(convertInput(initialState, range))
  const [envelopeClipboard, setEnvelopeClipboard] = useAtom(envelopeClipboardAtom)
  const svgRef = useRef<SVGSVGElement>(null)
  const knobsRef = useRef<ADSREnvelopeRef>(undefined)
  const pitchAdsrRef = useRef<ADSREnvelopeRef>(undefined)
  const setGlobalRef = useSetAtom(globalRefsAtom)

  const setEnvelopeValues = useCallback(
    (updatedValues: ADSRValues, skipChange = false) => {
      if (objectsAreJSONEqual(values, updatedValues)) {
        return
      }

      const output = convertOutput(updatedValues, range)

      setValues(updatedValues)
      knobsRef.current?.setInternalValue(output)

      if (!skipChange) {
        onChange?.(output)
      }
    },
    [onChange, range, knobsRef, values]
  )

  const setInternalValue = useCallback(
    (data: ADSRValues, skipChange = false) => {
      const currentValues = convertOutput(values, range)
      const vals = convertInput({ ...currentValues, ...data }, range)

      setEnvelopeValues(vals, skipChange)
    },
    [range, setEnvelopeValues, values]
  )

  useEffect(() => {
    const obj = {
      setInternalValue,
      refs: knobsRef.current!.refs
    }

    pitchAdsrRef.current = obj

    if (ref) {
      ref.current = obj
    }
  }, [ref, setInternalValue])

  useEffect(() => {
    if (pitchEnv) {
      setGlobalRef((prev) => ({
        ...prev,
        pitchAdsrRef
      }))
    }
  }, [pitchEnv, setGlobalRef])

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
    setEnvelopeValues(getRandomValues01(pitchEnv))
  }

  const handleKnobChange = ([data]: UpdatedProperty[]) => {
    let updatedValue = 0
    const propKey = data.propertyPath.replace(/OP\d\./, '').replace(/Pitch\./, '')

    if (data.propertyPath.endsWith('Level')) {
      updatedValue = range.mapTo01(data.value)
    } else if (data.propertyPath.endsWith('Time')) {
      updatedValue = range0127.mapTo01(data.value)
    } else {
      updatedValue = range_1818.mapTo01(data.value)
    }

    setValues((prev) => {
      const updatedValues = { ...prev, [propKey]: updatedValue }
      onChange?.(convertOutput(updatedValues, range))
      return updatedValues
    })
  }

  const handleAdsrChange = (updatedValues: ADSRValues) => {
    const output = convertOutput(updatedValues, range)

    setValues(updatedValues)
    knobsRef.current?.setInternalValue(output)
    onChange?.(output)
  }

  return (
    <Box px={5} py={5} style={{ overflow: 'hidden' }} {...boxProps}>
      <Stack gap={0} w={pitchEnv ? 'auto' : width}>
        <Flex>
          {pitchEnv && (
            <Title order={6} ta='left' mr={20} style={{ cursor: 'default' }} lh={2}>
              Pitch Envelope
            </Title>
          )}

          <Button.Group w={pitchEnv ? 190 : width}>
            <MainButton onClick={resetEnvelope}>Init</MainButton>
            {!pitchEnv && (
              <>
                <MainButton onClick={copyEnvelope}>Copy</MainButton>
                <MainButton onClick={pasteEnvelope}>Paste</MainButton>
                <MainButton onClick={spreadEnvelope}>Spread</MainButton>
              </>
            )}
            <MainButton onClick={randomizeEnvelope}>Random</MainButton>
          </Button.Group>
        </Flex>
        <Flex my={10}>
          <ADSREnvelopeSVG
            ref={svgRef}
            width={width}
            height={height}
            padding={padding}
            pitchEnv={pitchEnv}
            values={values}
            onChange={handleAdsrChange}
          />
        </Flex>

        <ADSREnvelopeKnobs
          values={convertOutput(values, range)}
          range={range}
          onChange={handleKnobChange}
          knobSize={knobSize}
          pitchEnv={pitchEnv}
          ref={knobsRef}
          pathBase={pathBase}
        />
      </Stack>
    </Box>
  )
}
