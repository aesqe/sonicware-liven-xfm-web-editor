import { roundToNearestStep } from '../../../../services/round-to-nearest-step/round-to-nearest-step'

export const ratioFormatter = (val: number, freeRatio: boolean) =>
  freeRatio ? Math.round(val) : roundToNearestStep(val, val < 75 ? 50 : 100)
