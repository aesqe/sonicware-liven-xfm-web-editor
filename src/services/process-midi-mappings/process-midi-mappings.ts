import { NormalisableRange } from '../normalisable-range/normalisable-range'
import { ADSRValues, GlobalRefs, KnobRefType, MIDIMapping, OperatorRef } from '../../types'

export const processMidiMappings = (
  mappings: MIDIMapping[],
  value: number,
  globalRefs: GlobalRefs
) => {
  for (const item of mappings) {
    const { refName, propertyPath, min, max, center } = item
    const pathParts = propertyPath.split('.')

    if (pathParts.length < 2) {
      continue
    }

    const range = new NormalisableRange(min, max, center)
    const mappedValue = range.mapFrom01(value as number)

    try {
      // Operator properties
      if (pathParts[0].startsWith('OP')) {
        const opNumId = pathParts[0].slice(-1)
        const opRefKey = `op${opNumId}Ref` as keyof typeof globalRefs

        const opRef = globalRefs[opRefKey]?.current as OperatorRef | undefined
        const opRefs = opRef?.refs
        const knobRefKey = refName as keyof NonNullable<typeof opRefs>
        const knobRef = opRefs?.[knobRefKey]?.current as KnobRefType | undefined

        knobRef?.setInternalValue(mappedValue, true)
      }
      // Pitch ADSR
      else if (pathParts[0] === 'Pitch') {
        const pitchAdsrRef = globalRefs.pitchAdsrRef?.current

        if (pitchAdsrRef && 'setInternalValue' in pitchAdsrRef) {
          const updateObj = { [pathParts[1]]: mappedValue }
          pitchAdsrRef.setInternalValue(updateObj as ADSRValues, false)
        }
      } else {
        console.log('Unknown property path:', item.propertyPath)
      }
    } catch (error) {
      console.error(`Error setting value for ${item.propertyPath}`, error)
    }
  }
}
