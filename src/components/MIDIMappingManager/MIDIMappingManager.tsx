import { CSSProperties, MouseEvent, useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import {
  Box,
  Button,
  Text,
  Title,
  Paper,
  Table,
  Select,
  Flex,
  useMantineColorScheme
} from '@mantine/core'
import { useScrollIntoView } from '@mantine/hooks'

import { MappedCCs } from './components/MappedCCs/MappedCCs'
import { MainButton } from '../MainButton/MainButton'
import { downloadJSON } from '../../services/download-json/download-json'
import { useUploadJSON } from '../../services/use-upload-json/use-upload-json'
import { useRemoveMidiMapItem } from '../../services/use-remove-midi-map-item/use-remove-midi-map-item'
import { useSelectMidiDevices } from '../../services/use-select-midi-devices/use-select-midi-devices'
import { lastCCUsedAtom, midiMapAtom, midiMappingModeAtom } from '../../store/atoms'

const selectStyles: Record<string, CSSProperties> = {
  root: {
    gap: 10,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
}

export const MIDIMappingManager = () => {
  const midiMap = useAtomValue(midiMapAtom)
  const lastCCUsed = useAtomValue(lastCCUsedAtom)
  const [midiMappingMode, setMidiMappingMode] = useAtom(midiMappingModeAtom)
  const { midiInputList, midiControllerInput, saveMidiControllerInput } = useSelectMidiDevices()
  const { colorScheme } = useMantineColorScheme()
  const removeMidiMapItem = useRemoveMidiMapItem()

  const { scrollIntoView, targetRef, scrollableRef } = useScrollIntoView<
    HTMLTableRowElement,
    HTMLDivElement
  >({ duration: 150 })

  useEffect(() => {
    return () =>
      setMidiMappingMode({
        refName: '',
        propertyPath: '',
        active: false,
        controlRange: { min: 0, max: 127, center: 64 }
      })
  }, [setMidiMappingMode])

  useEffect(() => {
    if (midiMappingMode.propertyPath) {
      scrollIntoView()
    }
  }, [midiMappingMode.propertyPath, scrollIntoView])

  const handleToggleMappingMode = () => {
    setMidiMappingMode((prev) => ({
      ...prev,
      refName: '',
      propertyPath: '',
      active: !prev.active,
      controlRange: { min: 0, max: 127, center: 64 }
    }))
  }

  const handleSaveMappingsJSON = () => {
    downloadJSON(midiMap, `midi-map-${new Date().toISOString().slice(0, 10)}`)
  }

  const handleLoadMappingsJSON = useUploadJSON()

  const handleRemoveMapItem = (e: MouseEvent<HTMLButtonElement>) => {
    const { cid, propertyPath } = e.currentTarget.dataset

    if (cid && propertyPath) {
      removeMidiMapItem(Number(cid), propertyPath)
    }
  }

  return (
    <Paper w='100%' mx='auto' px='16' mb={20}>
      <Flex justify='space-between' mb='md' wrap='wrap' align='center'>
        <Flex flex={2} mb={10}>
          <Title order={3} w='170' m={0}>
            MIDI Mapping
          </Title>
          <Select
            data={midiInputList.map((input) => ({
              label: input.name,
              value: input.id
            }))}
            value={midiControllerInput?.id}
            onChange={saveMidiControllerInput}
            size='xs'
            label='MIDI Controller:'
            styles={selectStyles}
            miw={300}
          />
        </Flex>
        <Flex flex={1} align='center' fz='xs' mb={10} miw={60}>
          Last CC:
          <Text span fw={700} fz='xs' ml={5}>
            {lastCCUsed}
          </Text>
        </Flex>
        <Button.Group miw={370} flex={1} mb={10}>
          <MainButton active={midiMappingMode.active} onClick={handleToggleMappingMode}>
            {midiMappingMode.active ? 'Mapping: ON' : 'Mapping: OFF'}
          </MainButton>
          <MainButton onClick={handleSaveMappingsJSON}>Save JSON Map</MainButton>
          <MainButton onClick={handleLoadMappingsJSON}>Load JSON Map</MainButton>
        </Button.Group>
      </Flex>

      {midiMappingMode.active && (
        <Paper p='0' mb='md'>
          <Text size='sm'>
            Click on a control to select it, then move a MIDI controller to map it
          </Text>
        </Paper>
      )}

      <Box mt={0}>
        <Box h={200} ref={scrollableRef} style={{ overflow: 'auto' }}>
          {midiMap.length === 0 ? (
            <Text c='dimmed'>No controllers mapped yet</Text>
          ) : (
            <Table striped highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th w={175}>Parameter</Table.Th>
                  <Table.Th>CCs</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {midiMap.map(({ propertyPath, controllerIds }) => {
                  const itemActive = midiMappingMode.propertyPath === propertyPath

                  return (
                    <Table.Tr
                      key={propertyPath}
                      ref={itemActive ? targetRef : undefined}
                      bg={itemActive ? (colorScheme === 'dark' ? 'blue.9' : 'blue.0') : ''}
                      style={{ cursor: midiMappingMode.active ? 'pointer' : 'default' }}
                      onClick={() => {
                        if (midiMappingMode.active) {
                          setMidiMappingMode({ ...midiMappingMode, propertyPath })
                        }
                      }}
                    >
                      <Table.Td fw={itemActive ? 700 : 400}>{propertyPath}</Table.Td>
                      <Table.Td>
                        <MappedCCs
                          ccs={controllerIds}
                          lastCCUsed={lastCCUsed}
                          propertyPath={propertyPath}
                          handleRemoveMapItem={handleRemoveMapItem}
                          colorScheme={colorScheme}
                          mappingActive={midiMappingMode.active}
                        />
                      </Table.Td>
                    </Table.Tr>
                  )
                })}
              </Table.Tbody>
            </Table>
          )}
        </Box>
      </Box>
    </Paper>
  )
}
