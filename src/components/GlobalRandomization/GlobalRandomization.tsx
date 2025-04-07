import { useAtom, useAtomValue } from 'jotai'
import { Button, Divider, Fieldset, Flex, Stack, Switch } from '@mantine/core'
import { useThrottledCallback } from '@mantine/hooks'

import { Knob } from '../Knob/Knob'
import { XFMPatch } from '../../types'
import { getRandomPatch } from '../../services/get-random-patch/get-random-patch'
import { patchAtom, randomizationOptionsAtom, sysexSendThrottleTimeAtom } from '../../store/atoms'
import { useCallback } from 'react'

const buttonStyle = {
  '--button-bd': '1px solid #BABABA'
}

type Props = {
  handlePatchChange: (patch: XFMPatch) => void
}

export const GlobalRandomization = ({ handlePatchChange }: Props) => {
  const patch = useAtomValue(patchAtom)
  const sysexSendThrottleTime = useAtomValue(sysexSendThrottleTimeAtom)
  const [randomizationOptions, setRandOptions] = useAtom(randomizationOptionsAtom)

  const setRandomizationOptions = useThrottledCallback(setRandOptions, sysexSendThrottleTime)

  const handleBasicRandom = useCallback(() => {
    const randomPatch = getRandomPatch({
      basic: true,
      sourcePatch: patch,
      randomizationOptions
    })

    handlePatchChange({
      ...patch,
      ...randomPatch
    })
  }, [patch, handlePatchChange, randomizationOptions])

  const handleBasicADSRRandom = useCallback(() => {
    const randomPatch = getRandomPatch({
      basic: false,
      randomizationOptions
    })

    handlePatchChange({
      ...patch,
      ...randomPatch
    })
  }, [patch, handlePatchChange, randomizationOptions])

  return (
    <Fieldset legend='Randomize (work in progress)' w='100%' px={5} py={8}>
      <Button.Group w='100%'>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          flex={1}
          style={buttonStyle}
          onClick={handleBasicRandom}
        >
          Basic values
        </Button>
        <Button
          color='#e6e3e1'
          size='xs'
          c='dark'
          flex={1}
          style={buttonStyle}
          onClick={handleBasicADSRRandom}
        >
          Basic + ADSR
        </Button>
      </Button.Group>
      <Flex align='center' gap={10} mt={8} px={10}>
        <Stack gap={10} align='start'>
          <Switch
            label='Free ratio'
            checked={randomizationOptions.freeRatio}
            onChange={(e) =>
              setRandomizationOptions({
                ...randomizationOptions,
                freeRatio: e.target.checked
              })
            }
          />
          <Switch
            label='Low OP1 In levels'
            description='Less noise and distortion'
            checked={randomizationOptions.lowOP1In}
            onChange={(e) =>
              setRandomizationOptions({
                ...randomizationOptions,
                lowOP1In: e.target.checked
              })
            }
          />
          <Switch
            label='Use current values as origin'
            description='Smaller changes around original values'
            checked={randomizationOptions.useStartValues}
            onChange={(e) =>
              setRandomizationOptions({
                ...randomizationOptions,
                useStartValues: e.target.checked
              })
            }
          />
        </Stack>
        <Divider orientation='vertical' ml={4} />
        <Knob
          mx='auto'
          size='3.2rem'
          label='Amount'
          propertyPath='Randomize.Amount'
          valueMin={0}
          valueMax={100}
          valueDefault={randomizationOptions.amount}
          valueRawDisplayFn={(value) => Math.round(value).toString()}
          valueRawRoundFn={(value) => Math.round(value)}
          formatterFn={(value) => Math.round(value)}
          onChange={([{ value }]) =>
            setRandomizationOptions({ ...randomizationOptions, amount: value })
          }
        />
      </Flex>
    </Fieldset>
  )
}
