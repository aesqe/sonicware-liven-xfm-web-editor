import { XFMPatch } from '../../types'
import { createOperatorDefaults } from '../create-operator-defaults/create-operator-defaults'

export const createBlankPatch = (): XFMPatch => ({
  Name: '',
  Mixer: {
    Level: 0
  },
  Pitch: {
    ALevel: 0,
    ATime: 0,
    DLevel: 0,
    DTime: 0,
    SLevel: 0,
    STime: 0,
    RLevel: 0,
    RTime: 0
  },
  OP1: createOperatorDefaults() as XFMPatch['OP1'],
  OP2: createOperatorDefaults() as XFMPatch['OP2'],
  OP3: createOperatorDefaults() as XFMPatch['OP3'],
  OP4: createOperatorDefaults() as XFMPatch['OP4']
})
