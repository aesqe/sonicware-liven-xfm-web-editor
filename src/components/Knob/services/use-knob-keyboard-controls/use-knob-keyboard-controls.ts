import { KeyboardEvent, KeyboardEventHandler } from 'react'
import { clamp } from '@dsp-ts/math'

type Props = {
  /**
   * Same as `valueRaw` prop of `KnobHeadless`.
   */
  readonly valueRaw: number
  /**
   * Same as `valueMin` prop of `KnobHeadless`.
   */
  readonly valueMin: number
  /**
   * Same as `valueMax` prop of `KnobHeadless`.
   */
  readonly valueMax: number
  /**
   * Step value. Typically it's 1% of the range.
   */
  readonly step: number
  /**
   * Larger step value. Typically it's 10% of the range.
   */
  readonly stepLarger: number
  /**
   * Same callback as `KnobHeadless` has, with "event" in 2nd argument.
   */
  readonly onValueRawChange: (newValueRaw: number, event: KeyboardEvent) => void
  /**
   * To prevent scrolling, "event.preventDefault()" is called when the value changes,
   * but for most cases you don't need to change this behaviour.
   * However, if your application needs some more customized one, you can set this prop to true and handle scroll prevention on your own.
   */
  readonly noDefaultPrevention?: boolean
}

export const useKnobKeyboardControls = ({
  valueRaw,
  valueMin,
  valueMax,
  step,
  stepLarger,
  onValueRawChange,
  noDefaultPrevention = false
}: Props) => {
  const onKeyDown: KeyboardEventHandler = (event) => {
    const { code, shiftKey } = event

    const smallStepPlus = clamp(valueRaw + step, valueMin, valueMax)
    const smallStepMinus = clamp(valueRaw - step, valueMin, valueMax)
    const largeStepPlus = clamp(valueRaw + stepLarger, valueMin, valueMax)
    const largeStepMinus = clamp(valueRaw - stepLarger, valueMin, valueMax)

    const handleKey = (value: number, event: KeyboardEvent) => {
      if (!noDefaultPrevention) {
        event.preventDefault()
      }

      onValueRawChange(value, event)
    }

    switch (code) {
      case 'ArrowUp':
      case 'ArrowRight':
        handleKey(shiftKey ? largeStepPlus : smallStepPlus, event)
        break
      case 'ArrowDown':
      case 'ArrowLeft':
        handleKey(shiftKey ? largeStepMinus : smallStepMinus, event)
        break
      case 'PageUp':
        handleKey(largeStepPlus, event)
        break
      case 'PageDown':
        handleKey(largeStepMinus, event)
        break
      case 'Home':
        handleKey(valueMin, event)
        break
      case 'End':
        handleKey(valueMax, event)
        break
      /* v8 ignore start */
      default:
        break
      /* v8 ignore stop */
    }
  }

  return {
    onKeyDown
  }
}
