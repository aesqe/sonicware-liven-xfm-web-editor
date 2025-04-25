import { useCallback } from 'react'
import { useAtom } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import {
  Button,
  Divider,
  Fieldset,
  Flex,
  Stack,
  Switch,
  useMantineColorScheme
} from '@mantine/core'

import { Knob } from '../Knob/Knob'
import { MainButton } from '../MainButton/MainButton'
import { getRandomPatch } from '../../services/get-random-patch/get-random-patch'
import { UpdatedProperty, XFMPatch } from '../../types'
import { patchAtom, randomizationOptionsAtom } from '../../store/atoms'

type Props = {
  handlePatchChange: (patch: XFMPatch) => void
}

export const GlobalRandomization = ({ handlePatchChange }: Props) => {
  const { colorScheme } = useMantineColorScheme()
  const [randomizationOptions, setRandOptions] = useAtom(randomizationOptionsAtom)

  const handleBasicRandom = useAtomCallback(
    useCallback(
      (get) => {
        const randomizationOptions = get(randomizationOptionsAtom)
        const randomPatch = getRandomPatch({
          basic: true,
          sourcePatch: get(patchAtom),
          randomizationOptions
        })

        handlePatchChange(randomPatch)
      },
      [handlePatchChange]
    )
  )

  const handleBasicADSRRandom = useAtomCallback(
    useCallback(
      (get) => {
        const randomizationOptions = get(randomizationOptionsAtom)
        const randomPatch = getRandomPatch({
          basic: false,
          randomizationOptions
        })

        handlePatchChange(randomPatch)
      },
      [handlePatchChange]
    )
  )

  const handleAmountChange = useAtomCallback(
    useCallback(
      (get, set, [{ value }]: UpdatedProperty[]) =>
        set(randomizationOptionsAtom, { ...get(randomizationOptionsAtom), amount: value }),
      []
    )
  )

  return (
    <Fieldset legend='Randomize (work in progress)' w='100%' px={5} py={6} mb={10}>
      <Button.Group w='100%'>
        <MainButton onClick={handleBasicRandom}>Basic values</MainButton>
        <MainButton onClick={handleBasicADSRRandom}>Basic + ADSR</MainButton>
      </Button.Group>
      <Flex align='center' gap={10} mt={8} px={10}>
        <Stack gap={10} align='start'>
          <Switch
            label='Free ratio'
            checked={randomizationOptions.freeRatio}
            onChange={(e) =>
              setRandOptions({
                ...randomizationOptions,
                freeRatio: e.target.checked
              })
            }
            color={colorScheme === 'light' ? 'blue' : '#868e96'}
            styles={{
              thumb: {
                backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#d9d9d9',
                borderColor: colorScheme === 'light' ? '#EEEEEE' : '#d9d9d9'
              }
            }}
          />
          <Switch
            label='Low OP1 In levels'
            description='Less noise and distortion'
            checked={randomizationOptions.lowOP1In}
            onChange={(e) =>
              setRandOptions({
                ...randomizationOptions,
                lowOP1In: e.target.checked
              })
            }
            color={colorScheme === 'light' ? 'blue' : '#868e96'}
            styles={{
              thumb: {
                backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#d9d9d9',
                borderColor: colorScheme === 'light' ? '#EEEEEE' : '#d9d9d9'
              }
            }}
          />
          <Switch
            label='Use current values as origin'
            description='Smaller changes around original values'
            checked={randomizationOptions.useStartValues}
            onChange={(e) =>
              setRandOptions({
                ...randomizationOptions,
                useStartValues: e.target.checked
              })
            }
            color={colorScheme === 'light' ? 'blue' : '#868e96'}
            styles={{
              thumb: {
                backgroundColor: colorScheme === 'light' ? '#FFFFFF' : '#d9d9d9',
                borderColor: colorScheme === 'light' ? '#EEEEEE' : '#d9d9d9'
              }
            }}
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
          formatterFn={(value) => Math.round(value)}
          onChange={handleAmountChange}
          refName='globalRandomization.amountRef'
        />
      </Flex>
    </Fieldset>
  )
}
