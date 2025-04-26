import { MIDIMapping } from '../../types'

export const saveMidiMappings = (midiMap: MIDIMapping[]) => {
  try {
    localStorage.setItem('xfm-midi-mappings', JSON.stringify(midiMap))
  } catch (error) {
    console.error('Failed to save MIDI mappings', error)
    return false
  }

  return true
}
