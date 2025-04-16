export const findSequenceIndexes = (data: number[], sequence: 'FMTC' | 'FMBC') => {
  const indexes: number[] = []
  let currentIndex = 0

  const TorB = sequence === 'FMTC' ? 0x54 : 0x42

  while (currentIndex < data.length) {
    let fmtcIndex = -1

    for (let i = currentIndex; i < data.length - 3; i++) {
      if (
        data[i + 0] === 0x46 && // F
        data[i + 1] === 0x4d && // M
        data[i + 2] === TorB && // T or B
        data[i + 3] === 0x43 ///// C
      ) {
        fmtcIndex = i
        break
      }
    }

    if (fmtcIndex === -1) {
      break
    }

    indexes.push(fmtcIndex)
    currentIndex = fmtcIndex + 4
  }

  return indexes
}
