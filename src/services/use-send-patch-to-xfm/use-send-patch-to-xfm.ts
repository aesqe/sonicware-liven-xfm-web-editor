import { useAtomValue } from 'jotai'

import { XFMPatch } from '../../types'
import { encodeBytes } from '../encode-bytes/encode-bytes'
import { logSysExAtom, messagesDelayAtom, midiOutputAtom } from '../../store/atoms'

export const useSendPatchToXFM = () => {
  const logSysEx = useAtomValue(logSysExAtom)
  const midiOutput = useAtomValue(midiOutputAtom)
  const messagesDelay = useAtomValue(messagesDelayAtom)

  return (patch: XFMPatch) => {
    if (!midiOutput) {
      return
    }

    if (logSysEx) {
      console.log('Sending patch', patch)
    }

    try {
      // Create the three separate SysEx messages
      const messages = encodeBytes(patch)

      // Send each message with a short delay between them (50ms)
      messages.forEach((msg, index) => {
        setTimeout(() => {
          // Convert to Uint8Array for WebMIDI
          const msgArray = Uint8Array.from(msg)
          midiOutput.send(msgArray)
        }, index * messagesDelay)
      })
    } catch (error) {
      console.error('Error sending patch:', error)
    }
  }
}
