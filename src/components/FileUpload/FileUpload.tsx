import { Group } from '@mantine/core'
import { DropzoneFullScreenProps, Dropzone } from '@mantine/dropzone'
import { IconUpload, IconX, IconFile } from '@tabler/icons-react'

type Props = Partial<DropzoneFullScreenProps> & { onDrop: (files: File[]) => void }

export const FileUpload = (props: Props) => (
  <Dropzone.FullScreen
    onReject={(files) => console.log('rejected files', files)}
    maxSize={50 * 1024}
    active
    {...props}
  >
    <Group
      justify='center'
      gap='xl'
      mih={220}
      style={{ zIndex: 1000, top: 0, left: 0 }}
      w='100%'
      h='100%'
      pos='absolute'
      bg='rgba(255, 255, 255, 0.9)'
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
)
