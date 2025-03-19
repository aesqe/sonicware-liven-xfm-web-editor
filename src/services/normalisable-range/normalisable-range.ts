// Original source: https://github.com/satelllte/react-knob-headless/blob/1a0fe63acec2780ab2a78995cc1428a7321584a9/apps/docs/src/utils/math/NormalisableRange.ts
import { clamp01 } from '@dsp-ts/math'

/**
 * Partial implementation of the "NormalisableRange" class from JUCE Framework.
 * In particular, the only part taken from JUCE is "skew" calculation by given "center" point of the range.
 * ---
 * Useful for making logarithmic interpolations for things like frequency inputs, ADR inputs, etc.
 * ---
 * References:
 * - https://docs.juce.com/master/classNormalisableRange.html
 * - https://github.com/juce-framework/JUCE/blob/master/modules/juce_core/maths/juce_NormalisableRange.h
 */
export class NormalisableRange {
  min: number
  max: number
  center: number
  private readonly _skew: number

  constructor(min: number, max: number, center: number) {
    this.min = min
    this.max = max
    this.center = center
    this._skew = Math.log(0.5) / Math.log((center - min) / (max - min))
  }

  public mapTo01(x: number): number {
    const proportion = clamp01((x - this.min) / (this.max - this.min))

    if (this._skew === 1) {
      return proportion
    }

    return proportion ** this._skew
  }

  public mapFrom01(proportion: number): number {
    proportion = clamp01(proportion)

    if (this._skew !== 1 && proportion > 0) {
      proportion = Math.exp(Math.log(proportion) / this._skew)
    }

    return this.min + (this.max - this.min) * proportion
  }
}
