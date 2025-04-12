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
import { convertInput } from './services/convert-input/convert-input'
import { convertOutput } from './services/convert-output/convert-output'
import { ADSREnvelopeSVG } from './components/ADSREnvelopeSVG/ADSREnvelopeSVG'
import { ADSREnvelopeKnobs } from './components/ADSREnvelopeKnobs/ADSREnvelopeKnobs'
import { getRandomValues01 } from './services/get-random-values-01/get-random-values-01'
import { objectsAreJSONEqual } from '../../services/compare-objects/compare-objects'
import { range0127, range_1818, range_4848 } from './constants'
import { envelopeClipboardAtom, globalRefsAtom } from '../../store/atoms'
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
} & Partial<BoxProps>

export const ADSREnvelope = ({
  ref,
  width = 320,
  containerWidth = width,
  height = 160,
  padding = 10,
  knobSize = '2rem',
  pitchEnv = false,
  initialState = pitchEnv ? defaultPitchADSRCurve : defaultADSRCurve,
  onChange,
  ...boxProps
}: Props) => {
  // pitch env has a different range for levels
  const range = pitchEnv ? range_4848 : range0127

  // values are in 0..1 range
  const [values, setValues] = useState<ADSRValues>(convertInput(initialState, range))
  const [envelopeClipboard, setEnvelopeClipboard] = useAtom(envelopeClipboardAtom)
  const svgRef = useRef<SVGSVGElement>(null)
  const knobsRef = useRef<SetInternalValueRef<ADSRValues>>(undefined)
  const pitchAdsrRef = useRef<SetInternalValueRef<ADSRValues>>(undefined)
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

  useEffect(() => {
    const obj = {
      setInternalValue: (values: ADSRValues, skipUpdate = false) => {
        setEnvelopeValues(convertInput(values, range), skipUpdate)
      }
    }

    pitchAdsrRef.current = obj

    if (ref) {
      ref.current = obj
    }
  }, [range, ref, setEnvelopeValues])

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

    if (data.propertyPath.endsWith('Level')) {
      updatedValue = range.mapTo01(data.value)
    } else if (data.propertyPath.endsWith('Time')) {
      updatedValue = range0127.mapTo01(data.value)
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

  const handleAdsrChange = (updatedValues: ADSRValues) => {
    const output = convertOutput(updatedValues, range)

    setValues(updatedValues)
    knobsRef.current?.setInternalValue(output)
    onChange?.(output)
  }

  return (
    <Box px={8} py={10} style={{ overflow: 'hidden' }} {...boxProps}>
      <Stack gap={0} w={pitchEnv ? 'auto' : width}>
        <Flex>
          {pitchEnv && (
            <Title order={6} ta='left' mr={20} style={{ cursor: 'default' }} lh={2}>
              Pitch Envelope
            </Title>
          )}

          <Button.Group w={pitchEnv ? 190 : width}>
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
        </Flex>
        <Flex my={10}>
          <Box w={width} h={height} bd='1px solid #DEDEDE'>
            <ADSREnvelopeSVG
              ref={svgRef}
              width={width}
              height={height}
              padding={padding}
              pitchEnv={pitchEnv}
              values={values}
              onChange={handleAdsrChange}
            />
          </Box>
        </Flex>

        <ADSREnvelopeKnobs
          values={convertOutput(values, range)}
          range={range}
          onChange={handleKnobChange}
          knobSize={containerWidth < 800 ? '1.5rem' : knobSize}
          pitchEnv={pitchEnv}
          ref={knobsRef}
        />
      </Stack>
    </Box>
  )
}
