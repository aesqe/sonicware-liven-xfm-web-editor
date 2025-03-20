import { atom } from 'jotai'
import { Input, Output } from 'webmidi'

import initPatch from '../assets/presets/initpatch.json'
import { XFMPatch, ADSRValues, OperatorProps } from '../types'

export const webMidiEnabledAtom = atom<boolean>(false)
export const midiInputAtom = atom<Input | null>(null)
export const midiOutputAtom = atom<Output | null>(null)

export const midiInputListAtom = atom<Input[]>([])
export const midiOutputListAtom = atom<Output[]>([])

export const patchAtom = atom<XFMPatch>(initPatch)

export const messagesDelayAtom = atom<number>(16.7)
export const sysexSendThrottleTimeAtom = atom<number>(200)

export const patchClipboardAtom = atom<XFMPatch | null>(null)
export const envelopeClipboardAtom = atom<ADSRValues | null>(null)
export const operatorClipboardAtom = atom<OperatorProps | null>(null)

export const logSysExAtom = atom<boolean>(false)
