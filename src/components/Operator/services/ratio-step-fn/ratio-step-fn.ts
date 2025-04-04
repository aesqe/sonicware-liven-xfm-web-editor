import { RatioMode } from '../../../../types'

export const ratioStepFn = (val: number, ratioMode: RatioMode, largerStep: boolean) => {
  if (ratioMode === 'default') {
    return largerStep ? 1000 : val < 75 ? 50 : 100
  }

  if (ratioMode === 'scale') {
    return largerStep ? 12 : 1
  }

  return largerStep ? 10 : 1
}
