import { useState } from 'react'
import { Button, Flex, Group, Modal, Stack, Text, Title } from '@mantine/core'
import { DropzoneFullScreenProps, Dropzone } from '@mantine/dropzone'
import { IconUpload, IconX, IconFile } from '@tabler/icons-react'

import { Banks, XFMPatch } from '../../types'
import { extractPatchesFromSyxBank } from '../../extract-patches-from-syx-bank/extract-patches-from-syx-bank'

type Props = Partial<DropzoneFullScreenProps> & {
  handlePatchChange: (data: XFMPatch) => void
}

export const FileUpload = ({ handlePatchChange, ...props }: Props) => {
  const [modalOpened, setModalOpened] = useState(false)
  const [bankData, setBankData] = useState<Banks>({})

  const handleDrop = (files: File[]) => {
    const file = files[0]
    const reader = new FileReader()

    if (file.type === 'application/json') {
      reader.onload = (event) => {
        handlePatchChange(JSON.parse(event.target?.result as string))
      }

      reader.readAsText(file)
    } else if (file.name.endsWith('.syx')) {
      reader.onload = (event) => {
        const res = event.target?.result as ArrayBuffer

        if (res.byteLength > 230) {
          const data = extractPatchesFromSyxBank(res)

          if (Object.keys(data).length === 1 && data.default?.length === 1) {
            handlePatchChange(data.default[0])
          } else {
            setBankData(data)
            setModalOpened(true)
          }
        }
      }

      reader.readAsArrayBuffer(file)
    }
  }

  return (
    <>
      <Dropzone.FullScreen
        onReject={(files) => console.log('rejected files', files)}
        maxSize={32 * 1024 * 1024}
        active
        onDrop={handleDrop}
        {...props}
      >
        <Group
          justify='center'
          gap='xl'
          mih={220}
          pos='fixed'
          top={0}
          left={0}
          w='100%'
          h='100%'
          bg='#FFFFFFDD'
        >
          <Dropzone.Accept>
            <IconUpload size={52} color='var(--mantine-color-blue-6)' stroke={1.5} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX size={52} color='var(--mantine-color-red-6)' stroke={1.5} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconFile size={52} color='var(--mantine-color-dimmed)' stroke={1.5} />
          </Dropzone.Idle>
        </Group>
      </Dropzone.FullScreen>

      <Modal
        opened={modalOpened}
        size='lg'
        onClose={() => setModalOpened(false)}
        title={`The file contains ${Object.keys(bankData).length} banks with ${Object.values(bankData).reduce((acc, bank) => acc + bank.length, 0)} patches total`}
      >
        <Stack>
          {Object.keys(bankData).map((bankName) => {
            const patches = bankData[bankName]

            return (
              <Stack key={bankName} justify='space-between' align='start' w='100%' gap={0}>
                <Title order={3}>{bankName}</Title>

                {patches.map((patch) => (
                  <Flex
                    px={10}
                    py={4}
                    key={patch.Name}
                    justify='space-between'
                    align='center'
                    w='100%'
                    style={{ borderBottom: '1px solid #e6e3e1' }}
                  >
                    <Text>{patch.Name}</Text>
                    <Button size='xs' onClick={() => handlePatchChange(patch)}>
                      Load
                    </Button>
                  </Flex>
                ))}
              </Stack>
            )
          })}
        </Stack>
      </Modal>
    </>
  )
}
