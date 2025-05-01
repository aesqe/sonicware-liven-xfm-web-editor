import { Banks } from '../../types'
import { convert78 } from '../convert78/convert78'
import { decode8bit } from '../decode8bit/decode8bit'
import { getBankPatches } from '../get-bank-patches/get-bank-patches'
import { findSequenceIndexes } from '../find-sequence-indexes/find-sequence-indexes'

const FIRST_BLOCK_SIZE = 20
const BLOCK_SIZE = 250
const LAST_BLOCK_SIZE = 15
const BANKS_OFFSET = 4096
const BANK_DATA_SIZE = 52
const BANK_NAME_OFFSET = 32

export const extractPatchesFromSyxBank = (syx: ArrayBuffer): Banks => {
  const ui8Arr = new Uint8Array(syx.slice(FIRST_BLOCK_SIZE, -LAST_BLOCK_SIZE))
  const numArr: number[] = []

  let identifier = String.fromCharCode(...ui8Arr.slice(10, 14))

  // single patch
  if (identifier === 'FMTC') {
    const patch = decode8bit(convert78(Array.from(ui8Arr)))

    return {
      default: [patch]
    }
  }

  if (identifier !== 'FMBC') {
    identifier = String.fromCharCode(...ui8Arr.slice(0, 20)).replace(/[^PREF$]/g, '')
  }

  // banks data
  for (let i = 0; i < ui8Arr.length; i += BLOCK_SIZE) {
    const block = ui8Arr.slice(i, i + BLOCK_SIZE)
    const data = convert78(Array.from(block))

    numArr.push(...data)
  }

  // whole dump
  if (identifier === 'PREF$') {
    const banksData = numArr.slice(BANKS_OFFSET)
    const bankIndexes = findSequenceIndexes(banksData, 'FMBC')
    const banks: Banks = {}

    for (let i = 0; i < bankIndexes.length; i++) {
      const start = bankIndexes[i]
      const end = bankIndexes[i + 1]

      const bank = banksData.slice(start, end)
      const bankName = String.fromCharCode(...bank.slice(BANK_NAME_OFFSET, BANK_NAME_OFFSET + 20))
        .split('BKDT')[0]
        .replace(/[^A-Z0-9.]/g, '')

      banks[bankName] = getBankPatches(bank)
    }

    return banks
  }

  const patchesData = numArr.slice(BANK_DATA_SIZE)
  const patches = getBankPatches(patchesData)

  return {
    default: patches
  }
}
